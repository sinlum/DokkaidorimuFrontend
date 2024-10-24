"use client";
import React, { useState, useEffect } from "react";
import { BsFillFlagFill } from "react-icons/bs";
import {
  FaBalanceScale,
  FaClipboardList,
  FaGlobeAmericas,
  FaHandshake,
  FaLandmark,
  FaNewspaper,
  FaUniversity,
  FaUsers,
  FaVoteYea,
} from "react-icons/fa";
import { GiEarthAmerica, GiPoliceBadge } from "react-icons/gi";
import CategoryPage from "../_components/CategoryPage";
import LoadingSpinner from "../_components/LoadingSpinner";

const subcategories = [
  { name: "すべて", icon: FaGlobeAmericas, color: "from-blue-400 to-blue-600" },
  {
    name: "Political Theory",
    icon: FaUniversity,
    color: "from-indigo-400 to-indigo-600",
  },
  { name: "Governance", icon: FaLandmark, color: "from-red-400 to-red-600" },
  {
    name: "International Relations",
    icon: GiEarthAmerica,
    color: "from-green-400 to-green-600",
  },
  {
    name: "Public Policy",
    icon: FaClipboardList,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "Elections",
    icon: FaVoteYea,
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Political Parties",
    icon: FaUsers,
    color: "from-pink-400 to-pink-600",
  },
  {
    name: "Law and Justice",
    icon: FaBalanceScale,
    color: "from-teal-400 to-teal-600",
  },
  {
    name: "Diplomacy",
    icon: FaHandshake,
    color: "from-orange-400 to-orange-600",
  },
  {
    name: "National Security",
    icon: GiPoliceBadge,
    color: "from-gray-600 to-gray-800",
  },
  {
    name: "Political Media",
    icon: FaNewspaper,
    color: "from-cyan-400 to-cyan-600",
  },
  {
    name: "Nationalism",
    icon: BsFillFlagFill,
    color: "from-red-600 to-red-800",
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
          "http://localhost:8080/api/articles/category/politics"
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
        text: "政治の世界",
        icon: FaGlobeAmericas,
        subtitle: "どの分野について学ぶ？",
      }}
      categories={subcategories}
      articles={articles}
      category="politic"
    />
  );
};

export default SciencePage;
