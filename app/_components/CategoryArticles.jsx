import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getProfileImageUrl } from "../_util/helper";

const CategoryArticles = ({ subcategories, initialArticles, categoryLink }) => {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response =
          selectedSubcategory === "All"
            ? await axios.get(
                `http://localhost:8080/api/articles/category${categoryLink}`
              )
            : await axios.get(
                `http://localhost:8080/api/articles/subcategory/${selectedSubcategory}`
              );
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [selectedSubcategory, categoryLink]);

  return (
    <div className="mt-1 md:mt-0 min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg p-3">
      {/* Mobile Subcategory Dropdown */}
      <div className="md:hidden mb-4 relative">
        <button
          onClick={() => setShowSubcategories(!showSubcategories)}
          className="w-full bg-gradient-to-br from-amber-50 to-orange-100 text-black font-semibold py-2 px-4 rounded-lg shadow flex justify-between items-center"
        >
          <span>{selectedSubcategory}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`ml-2 transition-transform ${
              showSubcategories ? "rotate-180" : ""
            }`}
          />
        </button>
        {showSubcategories && (
          <div className="absolute z-10 w-full mt-2 bg-gradient-to-br from-amber-50 to-orange-100 border border-gray-300 rounded-lg shadow-lg">
            {subcategories.map((subcategory, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSubcategory(subcategory);
                  setShowSubcategories(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                {subcategory}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Subcategory Buttons */}
      <div className="mb-3 overflow-x-auto whitespace-nowrap pb-2 hidden md:flex">
        {subcategories.map((subcategory, index) => (
          <button
            key={index}
            onClick={() => setSelectedSubcategory(subcategory)}
            className={`py-2 px-4 mx-1 rounded-full transition-colors ${
              subcategory === selectedSubcategory
                ? "bg-blue-600 text-white"
                : "bg-gradient-to-br from-amber-50 to-orange-100 text-gray-800 hover:bg-gray-200"
            } text-sm font-medium shadow-md`}
          >
            {subcategory}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <Link key={index} href={`${categoryLink}/${article.id}`}>
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg rounded-lg overflow-hidden">
              <img
                src={`http://localhost:8080${article.imageUrl}`}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">{article.title}</h2>
                <p className="mt-2 text-gray-600">
                  {article.content
                    .replace(/<[^>]+>/g, "")
                    .split(" ")
                    .slice(0, 20)
                    .join(" ") + "..."}
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <img
                    src={getProfileImageUrl(article.authorImageUrl)}
                    alt={article.username || "Unknown Author"}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">
                    {article.username || "Unknown Author"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryArticles;
