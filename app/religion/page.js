"use client";
import React, { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaCross,
  FaGlobeAmericas,
  FaHandHoldingHeart,
  FaLandmark,
  FaOm,
  FaPrayingHands,
  FaStarAndCrescent,
  FaStarOfDavid,
  FaUniversity,
  FaYinYang,
} from "react-icons/fa";
import { GiGreatPyramid } from "react-icons/gi";
import CategoryPage from "../_components/CategoryPage";
import LoadingSpinner from "../_components/LoadingSpinner";

const subcategories = [
  { name: "すべて", icon: FaPrayingHands, color: "from-blue-400 to-blue-600" },
  { name: "Christianity", icon: FaCross, color: "from-red-400 to-red-600" },
  {
    name: "Islam",
    icon: FaStarAndCrescent,
    color: "from-green-400 to-green-600",
  },
  { name: "Hinduism", icon: FaOm, color: "from-orange-400 to-orange-600" },
  { name: "Buddhism", icon: FaYinYang, color: "from-yellow-400 to-yellow-600" },
  { name: "Judaism", icon: FaStarOfDavid, color: "from-blue-600 to-blue-800" },
  {
    name: "Sacred Texts",
    icon: FaBookOpen,
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Religious Institutions",
    icon: FaLandmark,
    color: "from-gray-400 to-gray-600",
  },
  {
    name: "Spirituality",
    icon: FaHandHoldingHeart,
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "Theology",
    icon: FaUniversity,
    color: "from-indigo-400 to-indigo-600",
  },
  {
    name: "World Religions",
    icon: FaGlobeAmericas,
    color: "from-teal-400 to-teal-600",
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
          "http://localhost:8080/api/articles/category/religion"
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
        text: "宗教の世界",
        icon: FaPrayingHands,
        subtitle: "どの分野について学ぶ？",
      }}
      categories={subcategories}
      articles={articles}
      category="religion"
    />
  );
};

export default SciencePage;
