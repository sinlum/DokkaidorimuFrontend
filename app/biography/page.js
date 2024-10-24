"use client";
import React, { useState, useEffect } from "react";
import {
  FaAward,
  FaCrown,
  FaFlagUsa,
  FaFlask,
  FaFutbol,
  FaGraduationCap,
  FaGuitar,
  FaPalette,
  FaReadme,
  FaTheaterMasks,
  FaUser,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { GiGreatPyramid } from "react-icons/gi";
import CategoryPage from "../_components/CategoryPage";
import LoadingSpinner from "../_components/LoadingSpinner";

const subcategories = [
  { name: "すべて", icon: FaUser, color: "from-blue-400 to-blue-600" },
  {
    name: "Historical Figures",
    icon: FaCrown,
    color: "from-purple-400 to-purple-600",
  },
  { name: "Politicians", icon: FaFlagUsa, color: "from-red-400 to-red-600" },
  { name: "Scientists", icon: FaFlask, color: "from-green-400 to-green-600" },
  { name: "Artists", icon: FaPalette, color: "from-pink-400 to-pink-600" },
  { name: "Athletes", icon: FaFutbol, color: "from-yellow-400 to-yellow-600" },
  {
    name: "Entertainers",
    icon: FaTheaterMasks,
    color: "from-indigo-400 to-indigo-600",
  },
  {
    name: "Educators",
    icon: FaGraduationCap,
    color: "from-teal-400 to-teal-600",
  },
  {
    name: "Entrepreneurs",
    icon: FaAward,
    color: "from-orange-400 to-orange-600",
  },
  { name: "Musicians", icon: FaGuitar, color: "from-cyan-400 to-cyan-600" },
  { name: "Humanitarians", icon: FaUsers, color: "from-gray-400 to-gray-600" },
];

const SciencePage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/articles/category/biography"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 text-2xl mt-10">
        エラーが発生しました: {error}
      </div>
    );
  }
  console.log("Article-data:", articles);

  return (
    <CategoryPage
      pageTitle={{
        text: "伝記の世界",
        icon: FaReadme,
        subtitle: "どの分野について学ぶ？",
      }}
      categories={subcategories}
      articles={articles}
      category="biography"
    />
  );
};

export default SciencePage;
