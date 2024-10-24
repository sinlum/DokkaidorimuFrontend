"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Briefcase,
  Calendar,
  BookOpen,
  Twitter,
  Linkedin,
  ChartColumnStacked,
  Github,
  Star,
} from "lucide-react";
import { getProfileImageUrl, truncateContent } from "../_util/helper";
import Link from "next/link";
import LoadingSpinner from "./LoadingSpinner";

const ArticleCard = ({ title, date, content, category, readTime, id }) => {
  return (
    <div className="group mb-4 relative overflow-hidden rounded-[2rem] bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-75 transition-opacity group-hover:opacity-100" />

      {/* Main content container with inner border effect */}
      <div className="relative m-1 bg-white rounded-[1.85rem] p-6 h-full">
        {/* Category badge */}
        <div className="inline-flex items-center mb-4">
          <span className="relative inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm">
            <ChartColumnStacked className="w-4 h-4 mr-1.5" />
            {category}
          </span>
        </div>

        {/* Title with hover effect */}
        <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-700 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
          {title}
        </h3>

        {/* Content preview */}
        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
          {content.length > 100 ? content.substring(0, 100) + "..." : content}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-red-500" />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Read more button with hover effect */}
          <Link
            href={`/articleView/${id}`}
            className="relative inline-flex items-center px-6 py-2 overflow-hidden rounded-full group/button"
          >
            <span className="absolute rounded-full w-full h-full bg-gradient-to-r from-purple-800 to-pink-600 opacity-70 group-hover/button:opacity-100 transition-opacity duration-300" />
            <span className="relative pl-3 flex items-center text-center text-white font-medium">
              もっと読む
              <svg
                className="w-4 h-4 ml-2 transform transition-transform group-hover/button:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ Icon, href, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-${color}-500 hover:text-${color}-600 transition-colors duration-300`}
  >
    <Icon className="w-8 h-8" />
  </a>
);

const CreatorProfilePage = ({ authorId }) => {
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/userProfile/${authorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCreatorData(response.data);
        setLoading(false);
      } catch (err) {
        setError("データの取得に失敗しました (Failed to fetch data)");
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [authorId]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-300 to-yellow-300">
        <div className="text-3xl font-bold text-white">{error}</div>
      </div>
    );
  if (!creatorData)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-300 to-blue-300">
        <div className="text-3xl font-bold text-white">
          データがありません (No data available)
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 border-8 border-yellow-400">
          <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-48 relative"></div>
          <div className="px-6 py-8 md:flex md:items-center md:justify-between relative">
            <div className="md:flex md:items-center">
              <img
                src={
                  getProfileImageUrl(creatorData.imgUrl) ||
                  "https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png"
                }
                alt={creatorData.username}
                className="w-40 h-40 rounded-full object-cover border-8 border-yellow-400 shadow-lg -mt-20 md:mr-6 mx-auto md:mx-0"
              />
              <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-4xl flex items-center gap-2 font-bold text-purple-700">
                  {creatorData.username}
                  {(creatorData.role === "CREATOR" ||
                    creatorData.role === "ADMIN") && (
                    <span>
                      <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    </span>
                  )}
                </h1>
                <div className="flex items-center justify-center md:justify-start text-gray-600 mt-2">
                  <Briefcase className="w-6 h-6 mr-2 text-green-500" />
                  <span className="text-xl font-semibold text-green-600">
                    {creatorData.status || "すごい作家さん (Amazing Writer)"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end space-x-4 mt-4 md:mt-0">
              <SocialIcon Icon={Twitter} href="#" color="blue" />
              <SocialIcon Icon={Linkedin} href="#" color="indigo" />
              <SocialIcon Icon={Github} href="#" color="purple" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-purple-700 inline-block px-4 py-2 rounded-full">
              おもしろい記事
            </h2>
            {creatorData.articles && creatorData.articles.length > 0 ? (
              creatorData.articles.map((article, index) => (
                <ArticleCard
                  key={index}
                  id={article.id}
                  title={article.title}
                  category={article.category}
                  date={new Date(article.createdAt).toLocaleDateString()}
                  content={article.content}
                  readTime={`${Math.ceil(
                    article.content.split(" ").length / 200
                  )} 分で読めます`}
                />
              ))
            ) : (
              <p className="text-2xl font-bold text-purple-600 bg-yellow-200 p-4 rounded-2xl">
                まだ記事がないよ！楽しみに待っていてね♪
              </p>
            )}
          </div>
          <div>
            <div className="bg-gradient-to-br from-green-200 to-blue-200 rounded-3xl shadow-lg p-6 sticky top-6 border-8 border-green-400">
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                {creatorData.username}のひみつ
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                {creatorData.bio ||
                  "ひみつはまだないよ！ (No secrets revealed yet!)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfilePage;
