"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "./userContext";
import { webSocketManager } from "../services/websocket/WebSocketManager";
import {
  FaTree,
  FaSearch,
  FaComments,
  FaBell,
  FaUser,
  FaRoute,
  FaBookmark,
  FaSignOutAlt,
  FaBars,
  FaStar,
  FaPlusCircle,
  FaNewspaper,
} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { GiJourney } from "react-icons/gi";
import { getProfileImageUrl, formatRelativeTime } from "../_util/helper";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  searchArticles,
} from "../_util/api";

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();
  const { user, setUser } = useUser();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotificationDropdown = () =>
    setNotificationDropdownOpen(!notificationDropdownOpen);

  useOutsideClick(dropdownRef, () => setDropdownOpen(false));
  useOutsideClick(notificationDropdownRef, () =>
    setNotificationDropdownOpen(false)
  );
  useOutsideClick(searchRef, () => {
    setShowResults(false);
    setIsSearchFocused(false);
  });

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("トークンが見つかりません");
      setUser(null);
      router.push("/signin");
      return;
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUser(null);
    router.push("/signin");
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const results = await searchArticles(query);
        setSearchResults(results);
        setShowResults(true);
      } catch (error) {
        console.error("検索結果の取得中にエラーが発生しました:", error);
      }
    } else {
      setShowResults(false);
    }
  };

  const handleResultClick = (id) => {
    setSearchQuery("");
    setShowResults(false);
    router.push(`/articleView/${id}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  const fetchNotificationsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter((n) => !n.read).length);
    } catch (error) {
      console.error("通知の取得中にエラーが発生しました:", error);
      setError("通知の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotificationsData();
    }
  }, [user, fetchNotificationsData]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await fetchUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("未読カウントの取得中にエラーが発生しました:", error);
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    webSocketManager
      .connect()
      .then(() => {
        const notificationTopic = `/user/${user.username}/topic/notifications`;
        webSocketManager.subscribe(notificationTopic, handleWebSocketMessage);
      })
      .catch((error) => {
        console.error("WebSocketへの接続に失敗しました:", error);
      });
  }, [user]);

  const handleWebSocketMessage = useCallback((message) => {
    if (message.type === "NOTIFICATION_UPDATE") {
      handleCombinedUpdate(message.payload);
    }
  }, []);

  const handleCombinedUpdate = useCallback((update) => {
    const { notification, unreadCount } = update;
    setNotifications((prevNotifications) => {
      const notificationExists = prevNotifications.some(
        (notif) => notif.id === notification.id
      );
      if (notificationExists) {
        return prevNotifications;
      }
      return [notification, ...prevNotifications];
    });
    setUnreadCount(unreadCount);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
      connectWebSocket();
    }
    return () => {
      if (user) {
        const notificationTopic = `/user/${user.username}/topic/notifications`;
        webSocketManager.unsubscribe(notificationTopic);
      }
      webSocketManager.disconnect();
    };
  }, [user, connectWebSocket, fetchNotificationsData, fetchUnreadCount]);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error("通知を既読にする際にエラーが発生しました:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("すべての通知を既読にする際にエラーが発生しました:", error);
    }
  };
  const renderSearchResults = () => (
    <div className="absolute top-full left-0 right-0 bg-white rounded-3xl shadow-xl max-h-64 overflow-hidden z-50 border-4 border-yellow-400">
      {searchResults.length > 0 ? (
        <div>
          <div className="px-4 py-2 bg-blue-100 border-b-4 border-yellow-400 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-purple-600">検索結果</h3>
            <span className="text-xs text-blue-600">
              {searchResults.length}件見つかりました
            </span>
          </div>
          <div className="overflow-y-auto max-h-56 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-blue-100">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="px-4 py-2 hover:bg-yellow-100 cursor-pointer transition-colors duration-150 border-b-2 border-blue-200 last:border-b-0"
                onClick={() => handleResultClick(result.id)}
              >
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-3 text-sm" />
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-purple-700 truncate">
                      {result.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <FaSearch className="text-purple-400 text-lg mb-2 mx-auto" />
          <p className="text-sm text-blue-600">結果が見つかりません</p>
        </div>
      )}
    </div>
  );

  const renderUserDropdown = () => (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-3xl shadow-xl py-2 z-50 border-4 border-yellow-400"
    >
      <Link
        href="/profile"
        className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
      >
        <FaUser className="mr-2 text-blue-500" /> プロフィール
      </Link>
      <Link
        href="/bookmarks"
        className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
      >
        <FaBookmark className="mr-2 text-blue-500" /> ブックマーク
      </Link>
      <Link
        href="/mySpace"
        className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
      >
        <GiJourney className="mr-2 text-blue-500" /> 私のスペース
      </Link>
      {(user.role === "ADMIN" || user.role === "CREATOR") && (
        <>
          <Link
            href="/contributions"
            className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
          >
            <FaNewspaper className="mr-2 text-blue-500" /> 寄稿記事
          </Link>
          <Link
            href="/add-article"
            className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
          >
            <FaPlusCircle className="mr-2 text-blue-500" /> 記事作成
          </Link>
        </>
      )}
      {user.role === "ADMIN" && (
        <>
          <Link
            href="/userManagement"
            className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
          >
            <FaUser className="mr-2 text-blue-500" /> ユーザー管理
          </Link>
          <Link
            href="/articleManagement"
            className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
          >
            <FaNewspaper className="mr-2 text-blue-500" /> 記事管理
          </Link>
        </>
      )}
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 text-lg text-purple-700 hover:bg-yellow-100 transition-colors duration-200 w-full text-left"
      >
        <FaSignOutAlt className="mr-2 text-blue-500" /> ログアウト
      </button>
    </div>
  );

  const renderGuestDropdown = () => (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-3xl shadow-xl py-2 z-50 border-4 border-yellow-400"
    >
      <Link
        href="/signin"
        className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
      >
        <FaUser className="mr-2 text-blue-500" /> サインイン
      </Link>
      <Link
        href="/signup"
        className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-yellow-100 transition-colors duration-200"
      >
        <FaUser className="mr-2 text-blue-500" /> 新規登録
      </Link>
    </div>
  );

  const renderNotificationDropdown = () => (
    <div
      ref={notificationDropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl py-2 z-50 border-4 border-yellow-400"
    >
      <div className="px-4 py-2 border-b-4 border-yellow-400 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-purple-600">通知</h3>
        <button
          onClick={markAllAsRead}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          すべて既読にする
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-blue-100">
        {isLoading ? (
          <div className="px-4 py-3 text-sm text-purple-600">読み込み中...</div>
        ) : error ? (
          <div className="px-4 py-3 text-sm text-red-600">{error}</div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 hover:bg-yellow-100 border-b-2 border-blue-200 last:border-b-0 flex items-start transition-colors duration-200 ${
                !notification.read ? "bg-blue-50" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="relative mr-3">
                <img
                  src={getProfileImageUrl(notification.senderImgUrl)}
                  alt="ユーザー"
                  className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-700">
                  {notification.message}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-sm text-purple-600">
            通知はありません
          </div>
        )}
      </div>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-full text-white hover:text-yellow-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 md:flex hidden items-center">
              <FaTree className="h-8 w-8 text-yellow-300" />
              <span className="ml-2 text-2xl font-bold text-white">
                読解ドリム
              </span>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="記事を探す"
                className="bg-white rounded-full py-2 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-48 md:w-64"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IoCloseOutline className="h-4 w-4" />
                </button>
              )}
              <FaSearch className="absolute right-3 top-3 text-gray-500" />
              {showResults && renderSearchResults()}
            </div>
            <Link
              href="/chat"
              className="ml-4 text-white hover:text-yellow-300 transition-colors duration-200"
            >
              <FaComments className="h-6 w-6" />
            </Link>
            {user && (
              <div className="ml-4 relative">
                <button
                  onClick={toggleNotificationDropdown}
                  className="p-1 rounded-full text-white hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <FaBell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notificationDropdownOpen && renderNotificationDropdown()}
              </div>
            )}
            <div className="ml-4 relative">
              <button
                onClick={toggleDropdown}
                className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                {user ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={getProfileImageUrl(user.imgUrl)}
                    alt={user.username}
                  />
                ) : (
                  <FaUser className="h-8 w-8 text-white p-1" />
                )}
              </button>
              {dropdownOpen &&
                (user ? renderUserDropdown() : renderGuestDropdown())}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
