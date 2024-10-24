"use client";
import React, { useState, useEffect } from "react";
import {
  Crown,
  Users,
  Pencil,
  Search,
  Shield,
  Star,
  User as UserIcon,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getProfileImageUrl } from "../_util/helper";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [creators, setCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState(null);
  const [updateRoleModal, setUpdateRoleModal] = useState({
    open: false,
    user: null,
  });

  const router = useRouter();

  const filteredUsers = users.filter((user) => {
    if (
      searchQuery &&
      !user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // API setup with authentication
  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    checkAuthorization();
  }, []);

  // API methods
  const checkAuthorization = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("認証が必要です");
      }
      await fetchUsers();
      await fetchCreators();
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        setError("管理者権限が必要です");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get(
        `/users/search?query=${searchQuery}&adminSearch=true`
      );
      setUsers(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchCreators = async () => {
    try {
      const response = await api.get("/creators");
      setCreators(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true); // Show loading state while updating
      const response = await api.put(
        `/users/${userId}/role?newRole=${newRole}`
      );

      // Check if the response was successful
      if (response.status === 200 || response.status === 204) {
        // Update the local state immediately
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );

        // If the user is/was a creator, update creators list
        const isOrWasCreator =
          creators.some((c) => c.id === userId) || newRole === "CREATOR";
        if (isOrWasCreator) {
          await fetchCreators();
        }

        setUpdateRoleModal({ open: false, user: null });

        // Show success message (optional)
        setError(null);
      }
    } catch (error) {
      console.error("Role update error:", error);
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleApiError = (error) => {
    console.error("API Error:", error);
    if (error.response) {
      console.log("Error response:", error.response);
      if (error.response.status === 401) {
        setError("セッションが切れました。再度ログインしてください。");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else if (error.response.status === 403) {
        setError("この操作を行う権限がありません。");
      } else {
        setError(
          `エラーが発生しました: ${
            error.response.data?.message || error.message
          }`
        );
      }
    } else if (error.request) {
      setError(
        "サーバーに接続できませんでした。ネットワーク接続を確認してください。"
      );
    } else {
      setError("エラーが発生しました。もう一度お試しください。");
    }
  };
  // Loading State Component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xl text-purple-600 font-medium">ロード中...</p>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-red-50 rounded-3xl p-8">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
      <h2 className="text-2xl font-bold text-red-600 mb-2">
        エラーが発生しました
      </h2>
      <p className="text-red-500 text-center mb-4">{error}</p>
      <button
        onClick={checkAuthorization}
        className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg"
      >
        もう一度試す
      </button>
    </div>
  );

  // Role Badge Helper Component
  const getRoleBadge = (role) => {
    const badges = {
      ADMIN: {
        icon: <Shield className="w-4 h-4" />,
        text: "管理者",
        class: "bg-gradient-to-r from-purple-500 to-indigo-500",
      },
      CREATOR: {
        icon: <Star className="w-4 h-4" />,
        text: "クリエイター",
        class: "bg-gradient-to-r from-yellow-400 to-orange-500",
      },
      USER: {
        icon: <UserIcon className="w-4 h-4" />,
        text: "ユーザー",
        class: "bg-gradient-to-r from-green-400 to-teal-500",
      },
    };

    const badge = badges[role];
    return (
      <span
        className={`${badge.class} text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium`}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  // User Stats Component
  const UserStats = ({ users }) => {
    const stats = {
      total: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      creators: users.filter((u) => u.role === "CREATOR").length,
      users: users.filter((u) => u.role === "USER").length,
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            key: "total",
            label: "総ユーザー数",
            icon: <Users className="w-6 h-6" />,
            color: "from-blue-400 to-blue-600",
          },
          {
            key: "admins",
            label: "管理者",
            icon: <Shield className="w-6 h-6" />,
            color: "from-purple-400 to-purple-600",
          },
          {
            key: "creators",
            label: "クリエイター",
            icon: <Star className="w-6 h-6" />,
            color: "from-yellow-400 to-yellow-600",
          },
          {
            key: "users",
            label: "ユーザー",
            icon: <UserIcon className="w-6 h-6" />,
            color: "from-green-400 to-green-600",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div
              className={`bg-gradient-to-r ${item.color} text-white p-3 rounded-xl inline-flex items-center justify-center mb-3`}
            >
              {item.icon}
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{item.label}</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              {stats[item.key]}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // If loading or error, show appropriate state
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;

  // UserCard Component
  const UserCard = ({ user }) => (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-blue-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-shrink-0">
          {/* Static gradient border */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
          <img
            src={getProfileImageUrl(user.imgUrl) || "/api/placeholder/64/64"}
            alt={user.username}
            className="w-20 h-20 md:w-16 md:h-16 rounded-full relative border-2 border-white object-cover"
          />
        </div>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {user.username}
              </h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {getRoleBadge(user.role)}
              <button
                onClick={() => setUpdateRoleModal({ open: true, user })}
                className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors duration-300"
              >
                <Pencil className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {/* <div className="bg-gray-50 px-3 py-1 rounded-full">
              <span className="text-gray-500">登録日:</span>
              <span className="ml-1 text-gray-700">
                {new Date(user.createdAt).toLocaleDateString("ja-JP")}
              </span>
            </div> */}
            <div className="bg-gray-50 px-3 py-1 rounded-full">
              <span className="text-gray-500">投稿:</span>
              <span className="ml-1 text-gray-700">
                {user.articleCount || 0}
              </span>
            </div>
            <div className="bg-gray-50 px-3 py-1 rounded-full">
              <span className="text-gray-500">状態:</span>
              <span className="ml-1 text-gray-700">
                {user.status || "通常"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Section Component
  const TabSection = ({ activeTab, setActiveTab }) => (
    <div className="overflow-x-auto mb-8">
      <div className="flex gap-2 min-w-max p-1">
        {[
          { id: "all", icon: <Users />, text: "すべて" },
          { id: "creators", icon: <Star />, text: "クリエイター" },
          { id: "admins", icon: <Shield />, text: "管理者" },
          { id: "users", icon: <UserIcon />, text: "ユーザー" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-purple-50"
            }`}
          >
            {tab.icon}
            <span className="hidden md:inline">{tab.text}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Simple Search Bar Component
  const SearchBar = () => (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
      <div className="bg-gray-50 rounded-full p-4 flex items-center">
        <Search className="w-6 h-6 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="ユーザーを検索..."
          className="w-full bg-transparent outline-none text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
  // Role Update Modal Component
  const UpdateRoleModal = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          ユーザーの役割を変更
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          {updateRoleModal.user?.username}の新しい役割を選択してください
        </p>
        <div className="grid grid-cols-1 gap-4">
          {["ADMIN", "CREATOR", "USER"].map((role) => (
            <button
              key={role}
              onClick={() => updateUserRole(updateRoleModal.user?.id, role)}
              className="p-4 rounded-2xl border-2 border-dashed hover:border-solid transition-all duration-300 flex items-center justify-between"
              style={{
                borderColor:
                  role === "ADMIN"
                    ? "#9333ea"
                    : role === "CREATOR"
                    ? "#f59e0b"
                    : "#10b981",
              }}
            >
              {getRoleBadge(role)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setUpdateRoleModal({ open: false, user: null })}
          className="mt-6 w-full bg-gray-100 text-gray-700 py-3 rounded-full hover:bg-gray-200 transition-colors duration-300"
        >
          キャンセル
        </button>
      </div>
    </div>
  );

  // Main Component Return/Render
  console.log("Users", users);
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
            <Crown className="inline-block mr-2 text-yellow-400" />
            ユーザー管理
          </h1>
          <p className="text-gray-600">みんなで楽しく学ぼう！</p>
        </div>

        {/* Stats Section */}
        <UserStats users={users} />

        {/* Search Bar */}
        <SearchBar />

        {/* Tabs */}
        <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* User Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredUsers
            .filter((user) => {
              if (activeTab === "creators") return user.role === "CREATOR";
              if (activeTab === "admins") return user.role === "ADMIN";
              if (activeTab === "users") return user.role === "USER";
              return true;
            })
            .map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              ユーザーが見つかりません
            </h3>
            <p className="text-gray-500">検索条件を変更してお試しください</p>
          </div>
        )}

        {/* Modal */}
        {updateRoleModal.open && <UpdateRoleModal />}

        {/* Refresh Button */}
        <button
          onClick={() => {
            setLoading(true);
            checkAuthorization();
          }}
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5 md:w-6 md:h-6" />
          <span className="hidden md:inline">更新</span>
        </button>
      </div>
    </div>
  );
};

export default UserManagementPage;
