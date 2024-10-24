"use client";
import React, { useState, useEffect } from "react";
import {
  FaAtom,
  FaMicrochip,
  FaCog,
  FaHeartbeat,
  FaRocket,
  FaGlobeAmericas,
  FaFlask,
  FaDna,
} from "react-icons/fa";
import CategoryPage from "../_components/CategoryPage";
import LoadingSpinner from "../_components/LoadingSpinner";

const subcategories = [
  { name: "すべて", icon: FaAtom, color: "from-purple-400 to-purple-600" },
  { name: "Technology", icon: FaMicrochip, color: "from-blue-400 to-blue-600" },
  { name: "Engineering", icon: FaCog, color: "from-green-400 to-green-600" },
  {
    name: "Health Sciences",
    icon: FaHeartbeat,
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "Space Exploration",
    icon: FaRocket,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Earth Sciences",
    icon: FaGlobeAmericas,
    color: "from-teal-400 to-teal-600",
  },
  { name: "Chemistry", icon: FaFlask, color: "from-red-400 to-red-600" },
  { name: "Biology", icon: FaDna, color: "from-indigo-400 to-indigo-600" },
];

const SciencePage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/articles/category/science"
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
        text: "科学の世界",
        icon: FaAtom,
        subtitle: "どの分野について学ぶ？",
      }}
      categories={subcategories}
      articles={articles}
      category="science"
    />
  );
};

export default SciencePage;
