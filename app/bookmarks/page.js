"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaBookmark, FaArrowRight, FaSearch } from "react-icons/fa";
import axios from "axios";
import { getProfileImageUrl } from "../_util/helper";

const BookmarkCard = ({ article }) => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-4 border-yellow-400">
    <div className="relative">
      <img
        src={getProfileImageUrl(article.imageUrl) || "/placeholder-image.jpg"}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-0 right-0 bg-yellow-400 text-white p-2 rounded-bl-2xl">
        <FaBookmark className="inline mr-1" /> {article.category}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-2xl font-bold text-purple-600 mb-2">
        {article.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{article.content}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-spin blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={
                getProfileImageUrl(article.authorImg) ||
                "/api/placeholder/24/24"
              }
              alt={article.username}
              className="w-8 h-8 rounded-full relative border-2 border-white"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {article.username}
          </span>
        </div>
        <Link href={`/bookmarks/${article.id}`} passHref>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
            よむ
          </span>
        </Link>
      </div>
    </div>
  </div>
);

const BookmarkPage = () => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/bookmarks",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBookmarkedArticles(response.data);
      } catch (error) {
        console.error("Error fetching bookmarked articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedArticles();
  }, []);
  console.log("data:", bookmarkedArticles);

  useEffect(() => {
    document.body.classList.add(
      "bg-gradient-to-br",
      "from-yellow-300",
      "via-green-300",
      "to-blue-300"
    );

    return () => {
      document.body.classList.remove(
        "bg-gradient-to-br",
        "from-yellow-300",
        "via-green-300",
        "to-blue-300"
      );
    };
  }, []);

  const filteredArticles = bookmarkedArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-red-400 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-400 transform rotate-45 animate-spin"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-purple-800 bg-white px-8 py-4 rounded-full inline-block">
          <FaBookmark className="inline-block mr-4 text-yellow-500 animate-bounce" />
          きみのお気に入り記事
        </h1>

        {/* Search bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-12 rounded-full bg-white border-2 border-yellow-400 focus:outline-none focus:border-yellow-500 text-lg"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 text-xl" />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-xl text-purple-800">読み込み中...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <BookmarkCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-3xl p-8 mt-8 shadow-lg">
            <img
              src="/defaultIcon-ai.png"
              alt="No bookmarks"
              className="w-64 h-full mx-auto mb-2"
            />
            <p className="text-2xl text-purple-600 font-bold">
              {searchTerm
                ? "検索結果が見つかりません。"
                : "まだお気に入りの記事がありません。"}
            </p>
            <p className="text-xl text-gray-600 mt-2">
              {searchTerm
                ? "別のキーワードで試してみてください。"
                : "記事を読んで、好きな記事をブックマークしてみよう！"}
            </p>
            <Link
              href="/"
              className="mt-6 bg-green-500 text-white py-3 px-6 rounded-full text-xl font-bold hover:bg-green-600 transition-colors duration-300 inline-flex items-center"
            >
              記事を探す <FaArrowRight className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;
