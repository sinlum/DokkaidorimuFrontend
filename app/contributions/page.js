"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Heart,
  MessageCircle,
  Bookmark,
  Star,
  Edit,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useUser } from "../_components/userContext";
import { getProfileImageUrl, truncateContent } from "../_util/helper";
import { deleteArticle } from "../_util/api";
import Link from "next/link";

const ContributionListPage = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    articleId: null,
  });
  const { user } = useUser();

  useEffect(() => {
    fetchArticles();
  }, [user.id]);

  const fetchArticles = async () => {
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
      setLoading(false);
    } catch (err) {
      setError("記事を取得できませんでした");
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    try {
      await deleteArticle(articleId);
      fetchArticles(); // Refresh the list after deletion
      setDeleteConfirmation({ isOpen: false, articleId: null });
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-300 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-20 animate-pulse"></div>

        <div className="bg-gradient-to-b from-white to-pink-50 rounded-3xl p-8 max-w-md shadow-2xl border-4 border-red-200 relative overflow-hidden transform transition-all animate-scaleIn">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4 animate-bounce">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
            冒険を削除しますか？
          </h2>

          {/* Subtitle */}
          <h3 className="text-lg font-medium text-purple-600 mb-4 text-center">
            ⚠️ 大切な確認 ⚠️
          </h3>

          {/* Message */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border-2 border-red-100">
            <p className="text-gray-700 text-center leading-relaxed">
              この冒険を本当に削除してもいいですか？
              <br />
              <span className="text-red-500 font-medium">
                削除すると、二度と読むことができなくなります。
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, articleId: null })
              }
              className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-bold"
            >
              <X className="w-4 h-4" />
              キャンセル
            </button>
            <button
              onClick={() => handleDelete(deleteConfirmation.articleId)}
              className="px-6 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full hover:from-red-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-bold"
            >
              <Trash2 className="w-4 h-4" />
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ArticleCard = ({ article }) => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border-4 border-dashed border-yellow-400 hover:scale-[1.02]">
      <div className="flex flex-col md:flex-row gap-6 relative overflow-hidden">
        {/* Image Section */}
        <div className="w-full md:w-1/3 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl animate-pulse opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <img
            src={
              getProfileImageUrl(article.imageUrl) || "/api/placeholder/300/200"
            }
            alt={article.title}
            className="w-full h-48 object-cover rounded-2xl shadow-lg transform group-hover:scale-[1.02] transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-600 shadow-lg">
            {article.category || "冒険"}
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/3 space-y-4">
          <h3 className="text-2xl font-bold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 inline-block px-4 py-2 rounded-lg">
            {article.title}
          </h3>

          <p className="text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            {truncateContent(article.content, 1)}
          </p>

          {/* Stats Section */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="bg-red-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <div className="bg-white p-1.5 rounded-full">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </div>
              <span className="text-red-600 font-medium">
                {article.likeCount}
              </span>
            </div>

            <div className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <div className="bg-white p-1.5 rounded-full">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-green-600 font-medium">
                {article.commentCount}
              </span>
            </div>

            <div className="bg-blue-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <div className="bg-white p-1.5 rounded-full">
                <Bookmark className="w-5 h-5 text-blue-500 fill-current" />
              </div>
              <span className="text-blue-600 font-medium">
                {article.bookmarkCount}
              </span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/update-article/${article.articleId}`}
              className="bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold py-2.5 px-5 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Edit className="w-4 h-4" />
              へんしゅう
            </Link>

            <button
              onClick={() =>
                setDeleteConfirmation({
                  isOpen: true,
                  articleId: article.articleId,
                })
              }
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold py-2.5 px-5 rounded-full hover:from-red-500 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Trash2 className="w-4 h-4" />
              さくじょ
            </button>

            <Link
              href={`/articleView/${article.articleId}`}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold py-2.5 px-5 rounded-full hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Star className="w-4 h-4" />
              よむ
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-16 h-16 bg-purple-300 rounded-full opacity-20 blur-xl"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-green-300">
        <div className="text-4xl font-bold text-white animate-bounce">
          ロード中...わくわく！
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-300 to-yellow-300">
        <div className="text-4xl font-bold text-white">{error}</div>
      </div>
    );
  }
  console.log("Articles", articles);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-700 bg-yellow-300 inline-block px-6 py-3 rounded-full shadow-lg">
          寄稿記事
        </h1>

        <div className="bg-white rounded-full mb-8 p-4 flex items-center shadow-lg">
          <Search className="w-6 h-6 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="冒険を探す"
            className="w-full bg-transparent outline-none text-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-yellow-100 rounded-3xl border-4 border-yellow-400 shadow-lg">
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-blue-600">
              まだ冒険がないよ！新しい冒険を書いてみよう！
            </p>
            <p className="text-xl text-gray-700 mt-2">
              (No adventures yet! Let's write a new one!)
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard key={article.articleId} article={article} />
          ))
        )}
      </div>
      {deleteConfirmation.isOpen && <ConfirmationDialog />}
    </div>
  );
};

export default ContributionListPage;
