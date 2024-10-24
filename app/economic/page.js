"use client";
import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaChartBar,
  FaChartLine,
  FaCoins,
  FaGlobeAmericas,
  FaHandHoldingUsd,
  FaIndustry,
  FaPiggyBank,
  FaShoppingCart,
  FaUniversity,
  FaUsers,
} from "react-icons/fa";

import CategoryPage from "../_components/CategoryPage";
import LoadingSpinner from "../_components/LoadingSpinner";

const subcategories = [
  { name: "すべて", icon: FaChartLine, color: "from-blue-400 to-blue-600" },
  {
    name: "Microeconomics",
    icon: FaCoins,
    color: "from-green-400 to-green-600",
  },
  {
    name: "Macroeconomics",
    icon: FaGlobeAmericas,
    color: "from-red-400 to-red-600",
  },
  {
    name: "Finance",
    icon: FaHandHoldingUsd,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Industrial Economics",
    icon: FaIndustry,
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Economic Theory",
    icon: FaUniversity,
    color: "from-indigo-400 to-indigo-600",
  },
  {
    name: "Econometrics",
    icon: FaChartBar,
    color: "from-teal-400 to-teal-600",
  },
  {
    name: "Personal Finance",
    icon: FaPiggyBank,
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "Corporate Finance",
    icon: FaBuilding,
    color: "from-gray-400 to-gray-600",
  },
  {
    name: "Consumer Economics",
    icon: FaShoppingCart,
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "Labor Economics",
    icon: FaUsers,
    color: "from-cyan-400 to-cyan-600",
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
          "http://localhost:8080/api/articles/category/economic"
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
        text: "経済の世界",
        icon: FaChartLine,
        subtitle: "どの分野について学ぶ？",
      }}
      categories={subcategories}
      articles={articles}
      category="economic"
    />
  );
};

export default SciencePage;
