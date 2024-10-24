"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { getProfileImageUrl, truncateContent } from "../_util/helper";

const CategoryPage = ({ pageTitle, categories, articles, category }) => {
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const filteredArticles =
    selectedCategory === "すべて"
      ? articles
      : articles.filter((article) => article.subcategory === selectedCategory);

  useEffect(() => {
    document.body.classList.add(
      "bg-gradient-to-br",
      "from-blue-300",
      "via-purple-300",
      "to-pink-300"
    );

    return () => {
      document.body.classList.remove(
        "bg-gradient-to-br",
        "from-blue-300",
        "via-purple-300",
        "to-pink-300"
      );
    };
  }, []);

  const ArticleCard = ({
    id,
    title,
    username,
    content,
    authorImageUrl,
    imageUrl,
    subcategory,
  }) => (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-4 border-yellow-300">
      <div className="relative">
        <img
          src={getProfileImageUrl(imageUrl)}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 bg-yellow-400 text-white px-3 py-1 rounded-bl-2xl font-bold">
          {subcategory}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-purple-700 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">
          {content.length > 100 ? content.substring(0, 80) + "..." : content}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-spin blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <img
                src={authorImageUrl || "/api/placeholder/24/24"}
                alt={username}
                className="w-8 h-8 rounded-full relative border-2 border-white"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {username}
            </span>
          </div>
          <Link href={`/${category}/${id}`} passHref>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
              よむ
            </span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-300 rounded-full opacity-50 animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-6xl font-bold text-center text-purple-800 mb-12 ">
          {pageTitle.icon && (
            <pageTitle.icon className="inline-block mr-4 text-yellow-500" />
          )}
          {pageTitle.text}
        </h1>

        <div className="mb-12 bg-white bg-opacity-80 rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            {pageTitle.subtitle}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`bg-gradient-to-r ${
                  cat.color
                } text-white px-5 py-3 rounded-full flex items-center transition-all duration-300 transform hover:scale-110 shadow-md ${
                  selectedCategory === cat.name
                    ? "ring-4 ring-yellow-400 scale-110"
                    : ""
                }`}
              >
                <cat.icon className="mr-2 text-xl" />
                <span className="font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={index} {...article} category={category} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center text-3xl text-purple-800 mt-12 bg-white bg-opacity-80 rounded-3xl p-8 shadow-lg animate-pulse">
            この分野の記事はまだないよ。他の分野を探検してみよう！
          </div>
        )}
      </div>

      {/* Floating stars */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <FaStar
            key={index}
            className="absolute text-yellow-400 animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
