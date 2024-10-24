"use client";
import React, { useState, useEffect } from "react";
import {
  FaAtom,
  FaMicrochip,
  FaCog,
  FaIndustry,
  FaHeartbeat,
  FaFighterJet,
  FaRocket,
  FaGlobeAmericas,
  FaCoins,
  FaTheaterMasks,
  FaFlask,
  FaDna,
  FaHistory,
  FaChessBoard,
  FaLandmark,
  FaUsers,
  FaPalette,
  FaShieldAlt,
} from "react-icons/fa";
import { GiGreatPyramid } from "react-icons/gi";
import CategoryPage from "../_components/CategoryPage";
import LoadingSpinner from "../_components/LoadingSpinner";

const subcategories = [
  { name: "すべて", icon: FaHistory, color: "from-purple-400 to-purple-600" },
  {
    name: "Ancient History",
    icon: GiGreatPyramid,
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Modern History",
    icon: FaChessBoard,
    color: "from-green-400 to-green-600",
  },
  {
    name: "Modern History",
    icon: FaIndustry,
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "World Wars",
    icon: FaFighterJet,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Cultural History",
    icon: FaTheaterMasks,
    color: "from-teal-400 to-teal-600",
  },
  { name: "Economic History", icon: FaCoins, color: "from-red-400 to-red-600" },
  {
    name: "Political History",
    icon: FaLandmark,
    color: "from-indigo-400 to-indigo-600",
  },
  { name: "Social History", icon: FaUsers, color: "from-teal-400 to-teal-600" },
  { name: "Art History", icon: FaPalette, color: "from-pink-400 to-pink-600" },
  {
    name: "Military History",
    icon: FaShieldAlt,
    color: "from-gray-600 to-gray-800",
  },
];

const SciencePage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/articles/category/history"
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
        text: "歴史の世界",
        icon: FaAtom,
        subtitle: "どの分野について学ぶ？",
      }}
      categories={subcategories}
      articles={articles}
      category="history"
    />
  );
};

export default SciencePage;
