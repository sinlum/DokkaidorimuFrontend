"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Bookmark,
  Eye,
  Linkedin,
  LucideKey,
  MessageCircle,
  Search,
} from "lucide-react";
import { SlLike } from "react-icons/sl";
import { useUser } from "../_components/userContext";
import { getProfileImageUrl } from "../_util/helper";
import { FcLike } from "react-icons/fc";
import LoadingSpinner from "../_components/LoadingSpinner";
import { useRouter } from "next/navigation";

const TeacherArticlesDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    articleId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {}, []);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    setFilteredArticles(
      articles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, articles]);

  const fetchArticles = async () => {
    if (user && user.id) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/contributions/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArticles(response.data);
        setFilteredArticles(response.data);
      } catch (error) {
        setError("記事の取得に失敗しました。");
        console.error("記事の取得中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (articleId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedArticles = articles.filter(
        (article) => article.id !== articleId
      );
      setArticles(updatedArticles);
      setFilteredArticles(updatedArticles);
      setDeleteConfirmation({ isOpen: false, articleId: null });
    } catch (error) {
      setError("記事の削除に失敗しました。");
      console.error("記事の削除中にエラーが発生しました:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}年${month}月${day}日`;
  };

  const truncateContent = (content, lines) => {
    const truncated = content?.split("\n").slice(0, lines).join("\n");
    return truncated?.length < content?.length ? `${truncated}...` : truncated;
  };
  const handleUpdate = (articleId) => {
    router.push(`/update-article?id=${articleId}`);
  };

  if (loading)
    return (
      <div className="text-center p-4 text-yellow-600">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
        role="alert"
      >
        {error}
      </div>
    );
  console.log("data--", articles);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-purple-600 text-center">
        私のすばらしい記事
      </h1>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="記事を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 text-gray-900 rounded-full border-2 border-yellow-400 focus:outline-none focus:border-yellow-500"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-4 border-yellow-300"
          >
            <div className="relative">
              <img
                src={
                  getProfileImageUrl(article.imageUrl) ||
                  "/api/placeholder/400/200"
                }
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 right-0 bg-yellow-400 text-white px-3 py-1 rounded-bl-2xl font-bold">
                {article.category || "カテゴリなし"}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-purple-700 mb-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {formatDate(article.createdAt)}
              </p>
              <p className="text-gray-600 mb-4">
                {truncateContent(article.content, 1)}
              </p>
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex space-x-4">
                  <span className="flex items-center text-gray-500">
                    <Eye className="w-5 h-5 mr-1" /> {article.viewCount}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <MessageCircle className="w-5 h-5 mr-1" />{" "}
                    {article.commentCount || 0}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <Bookmark className="w-5 h-5 mr-1" />{" "}
                    {article.bookmarkCount}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <SlLike className="w-5 h-5 mr-1" /> {article.likeCount}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition duration-300"
                    onClick={() => handleUpdate(article.articleId)}
                  >
                    <span className="font-bold">編集</span>
                  </button>
                  <button
                    className="p-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition duration-300"
                    onClick={() =>
                      setDeleteConfirmation({
                        isOpen: true,
                        articleId: article.articleId,
                      })
                    }
                  >
                    <span className="font-bold">削除</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-yellow-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">
              本当に削除しますか？
            </h2>
            <p className="mb-6 text-gray-600">
              この記事を削除すると元に戻せません。本当によろしいですか？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-6 py-3 bg-green-400 text-white rounded-full hover:bg-green-500 transition duration-300"
                onClick={() =>
                  setDeleteConfirmation({ isOpen: false, articleId: null })
                }
              >
                キャンセル
              </button>
              <button
                className="px-6 py-3 bg-red-400 text-white rounded-full hover:bg-red-500 transition duration-300"
                onClick={() => handleDelete(deleteConfirmation.articleId)}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherArticlesDashboard;
