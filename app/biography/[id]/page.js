"use client";
import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import LoadingSpinner from "@/app/_components/LoadingSpinner"; // Assuming you have this component
import ArticlePage from "@/app/_components/ArticlePageColor";
import { useUser } from "@/app/_components/userContext";

const MyArticlePage = () => {
  const params = useParams();
  const pathname = usePathname();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const id = params.id;
  const category = pathname.split("/")[1]; // Extracts category from the URL

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        setIsLoading(true);
        try {
          const articleResponse = await axios.get(
            `http://localhost:8080/api/articles/${id}`
          );
          setArticle(articleResponse.data);

          const commentsResponse = await axios.get(
            `http://localhost:8080/api/articles/${id}/comments`
          );
          setComments(commentsResponse.data);
        } catch (error) {
          console.error("Error fetching article or comments:", error);
          setError("Failed to load article. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchArticle();
    }
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  if (!article) {
    return <div className="text-center mt-10">Article not found.</div>;
  }
  console.log("ArticleData:", article);

  const articleData = {
    id: article.id,
    title: article.title,
    content: article.content,
    image: article.imageUrl || "/samura.jpeg", // Fallback image if not provided
    writer: {
      name: article.username || "匿名",
      role: article.status || "著者",
      image: article.authorImageUrl || "/pic.jpg", // Fallback image if not provided
      userId: article.userId,
    },
    addedTime: article.createdAt || "Unknown date",
    audioSrc: article.audioUrl || "/track1.mp3", // Fallback audio if not provided
  };

  return (
    <ArticlePage
      articleData={articleData}
      initialComments={comments}
      quizLink={`/quiz/${id}`}
      quizButtonText={`${article.title}のクイズに挑戦する`}
      backLink={"/biography"}
    />
  );
};

export default MyArticlePage;
