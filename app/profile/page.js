"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaBook,
  FaHome,
  FaSchool,
  FaCamera,
  FaStar,
  FaUserTag,
} from "react-icons/fa";
import { getProfileImageUrl } from "../_util/helper";
import LoadingSpinner from "../_components/LoadingSpinner";
import { useUser } from "../_components/userContext";

const ProfileUpdatePage = () => {
  const { user } = useUser();
  const isCreator = (user && user.role === "CREATOR") || user.role === "ADMIN";

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    address: "",
    school: "",
    status: "",
    email: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.classList.add(
      "bg-gradient-to-br",
      "from-pink-300",
      "via-purple-300",
      "to-indigo-400"
    );

    return () => {
      document.body.classList.remove(
        "bg-gradient-to-br",
        "from-pink-300",
        "via-purple-300",
        "to-indigo-400"
      );
    };
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/userProfile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setFormData({
        name: data.username,
        bio: data.bio,
        status: data.status || "",
        email: data.email || "",
        address: data.address,
        school: data.school || "",
      });
      setProfilePicture(data.imgUrl);
    } catch (error) {
      toast.error(
        isCreator
          ? "プロフィールの取得に失敗しました"
          : "プロフィールの取得に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (profilePicFile) {
      formDataToSend.append("profilePic", profilePicFile);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:8080/api/updateProfile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        isCreator
          ? "プロフィールが更新されました"
          : "プロフィールが更新されました！"
      );
      fetchUserProfile();
    } catch (error) {
      toast.error(
        isCreator
          ? "プロフィールの更新に失敗しました"
          : "プロフィールの更新に失敗しました"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen rounded-lg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            <FaStar
              className="text-yellow-300 opacity-50"
              size={Math.random() * 20 + 10}
            />
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden md:max-w-2xl relative z-10">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-3xl text-center font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
              {isCreator ? "プロフィール" : "きみのプロフィール"}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <img
                    src={
                      profilePicture
                        ? getProfileImageUrl(profilePicture)
                        : "/placeholder-avatar.png"
                    }
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-pink-300 group-hover:border-yellow-300 transition-all duration-300"
                  />
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-3 cursor-pointer hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform group-hover:scale-110"
                    onClick={triggerFileInput}
                  >
                    <FaCamera className="text-white" size={24} />
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="bg-pink-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                <label
                  htmlFor="name"
                  className="flex items-center text-xl font-medium text-pink-700 mb-2"
                >
                  <FaUser className="mr-2 text-pink-500" />{" "}
                  {isCreator ? "名前" : "なまえ"}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div className="bg-purple-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                <label
                  htmlFor="bio"
                  className="flex items-center text-xl font-medium text-purple-700 mb-2"
                >
                  <FaBook className="mr-2 text-purple-500" />{" "}
                  {isCreator ? "自己紹介" : "じこしょうかい"}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                ></textarea>
              </div>
              <div className="bg-blue-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                <label
                  htmlFor="address"
                  className="flex items-center text-xl font-medium text-blue-700 mb-2"
                >
                  <FaHome className="mr-2 text-blue-500" />{" "}
                  {isCreator ? "住所" : "じゅうしょ"}
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="bg-green-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                <label
                  htmlFor="school"
                  className="flex items-center text-xl font-medium text-green-700 mb-2"
                >
                  <FaSchool className="mr-2 text-green-500" />{" "}
                  {isCreator ? "学校" : "がっこう"}
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              {isCreator && (
                <div className="bg-yellow-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
                  <label
                    htmlFor="status"
                    className="flex items-center text-xl font-medium text-yellow-700 mb-2"
                  >
                    <FaUserTag className="mr-2 text-yellow-500" /> ステータス
                  </label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-xl font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      更新中...
                    </div>
                  ) : (
                    "プロフィールを更新する"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdatePage;
