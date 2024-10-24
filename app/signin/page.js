"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaRocket,
  FaStar,
  FaHeart,
  FaGoogle,
  FaSpinner,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import Cookies from "js-cookie";
import { useUser } from "../_components/userContext";

const SignInPage = () => {
  const router = useRouter();
  const { fetchUser, user } = useUser();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      handleOAuthCallback(token);
    }
    if (user) {
      router.push("/");
    }
  }, [user]);

  const handleOAuthCallback = async (token) => {
    try {
      localStorage.setItem("token", token);
      await fetchUser(token);
      router.push("/");
    } catch (error) {
      console.error("Error during OAuth callback:", error);
      setMessage("An error occurred during sign in. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      const { jwt: token, role: userRole } = data;

      // Set token as a cookie
      Cookies.set("token", token, { expires: 7 }); // expires in 7 days

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", userRole);
      await fetchUser(token);
      router.push("/");
    } catch (error) {
      setMessage("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-pink-300 to-blue-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      {[...Array(10)].map((_, i) => (
        <FaStar
          key={i}
          className="absolute text-yellow-400 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl relative">
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-green-400 rounded-full flex items-center justify-center transform rotate-12 animate-bounce">
          <FaRocket className="text-white text-3xl" />
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-400 rounded-full flex items-center justify-center transform -rotate-12 animate-bounce">
          <FaHeart className="text-white text-3xl" />
        </div>

        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-pink-500">
            おかえり！
          </h2>
          <p className="mt-2 text-center text-xl text-purple-400">
            冒険をつづけよう！
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-6 w-6 text-blue-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-t-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-blue-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-lg"
                  placeholder="メールアドレスをいれてね"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                あいことば
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-6 w-6 text-green-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-b-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-green-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-lg"
                  placeholder="あいことばをいれてね"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                おぼえておく
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                あいことばをわすれた？
              </a>
            </div>
          </div>

          {message && (
            <p className="text-red-500 text-sm text-center">{message}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FaRocket className="h-5 w-5 text-pink-300 group-hover:text-pink-400" />
                </span>
              )}
              ぼうけんにもどる！
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-purple-500 text-lg">
                または
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-purple-600 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
            >
              <FaGoogle className="mr-2 text-red-500" />
              Googleですぐにはじめる
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          アカウントをもっていない？{" "}
          <Link
            href="/signup"
            className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-300"
          >
            サインアップする
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
