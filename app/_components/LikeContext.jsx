// LikeContext.js
"use client";
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedArticles, setLikedArticles] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const fetchLikedArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/liked-articles",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const likedArticlesMap = response.data.reduce((acc, articleId) => {
          acc[articleId] = true;
          return acc;
        }, {});
        setLikedArticles(likedArticlesMap);
      } catch (error) {
        console.error("Error fetching liked articles:", error);
      }
    };

    fetchLikedArticles();
  }, []);

  const toggleLike = async (articleId) => {
    const isLiked = likedArticles[articleId];
    try {
      if (isLiked) {
        const response = await axios.delete(
          `http://localhost:8080/api/articles/like/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikedArticles((prev) => ({
          ...prev,
          [articleId]: false,
        }));
        setLikeCounts((prev) => ({
          ...prev,
          [articleId]: response.data,
        }));
      } else {
        const response = await axios.post(
          `http://localhost:8080/api/articles/like/${articleId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLikedArticles((prev) => ({
          ...prev,
          [articleId]: true,
        }));
        setLikeCounts((prev) => ({
          ...prev,
          [articleId]: response.data,
        }));
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  return (
    <LikeContext.Provider value={{ likedArticles, toggleLike, likeCounts }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLikeContext = () => useContext(LikeContext);
