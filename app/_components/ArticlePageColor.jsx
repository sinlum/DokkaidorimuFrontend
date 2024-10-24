"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { GoComment } from "react-icons/go";
import { GiSittingDog } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { RiEyeLine } from "react-icons/ri";
import { LuSendHorizonal } from "react-icons/lu";
import AudioPlayer from "../_components/AudioPlayer";
import PlainTextArticleContent from "./PlainTextArticleContent";
import Comment from "./Comment";
import { getAudioUrl, getProfileImageUrl } from "../_util/helper";
import { useUser } from "./userContext";

const ArticlePage = ({
  articleData,
  quizLink,
  quizButtonText,
  backgroundGradient,
  backLink,
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [likeCount, setLikeCount] = useState(articleData.likeCount || 0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [viewCount, setViewCount] = useState(articleData.viewCount || 0);

  useEffect(() => {
    fetchLikeStatus();
    fetchComments();
    fetchBookmarkStatus();
    fetchViewCount();
  }, [articleData.id, backgroundGradient]);

  const fetchData = async (url, errorMessage) => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    }
  };

  const fetchLikeStatus = () =>
    fetchData(
      `http://localhost:8080/api/articles/${articleData.id}/like-status`,
      "Error fetching like status:"
    )
      .then((data) => setLiked(data?.liked))
      .catch((error) => console.error("Failed to fetch like status:", error));

  const fetchBookmarkStatus = () =>
    fetchData(
      `http://localhost:8080/api/bookmarks/${articleData.id}/bookmark-status`,
      "Error fetching bookmark status:"
    )
      .then((data) => setBookmarked(data?.bookmarked))
      .catch((error) =>
        console.error("Failed to fetch bookmark status:", error)
      );

  const fetchComments = async () => {
    if (!hasMore) return;
    try {
      const data = await fetchData(
        `http://localhost:8080/api/articles/${articleData.id}/comments?page=${page}&size=10`,
        "Error fetching comments:"
      );
      if (data && data.content) {
        const newComments = data.content.map((comment) => ({
          ...comment,
          articleId: articleData.id,
        }));
        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const uniqueNewComments = newComments.filter(
            (c) => !existingIds.has(c.id)
          );
          return [...prev, ...uniqueNewComments];
        });
        setHasMore(page < data.totalPages - 1);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]); // Set to empty array if fetch fails
    }
  };

  const fetchViewCount = async () => {
    try {
      const data = await fetchData(
        `http://localhost:8080/api/articles/${articleData.id}/view-count`,
        "Error fetching view count:"
      );
      setViewCount(data);
    } catch (error) {
      console.error("Failed to fetch view count:", error);
    }
  };

  const handleAction = async (url, method, successAction, errorMessage) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? JSON.stringify({}) : undefined,
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await response.json();
        } catch (e) {
          console.warn("Response was not valid JSON:", e);
          responseData = await response.text();
        }
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            responseData
          )}`
        );
      }

      if (
        responseData === null ||
        responseData === undefined ||
        responseData === ""
      ) {
        console.warn("Response was empty");
        successAction({});
      } else {
        successAction(responseData);
      }
    } catch (error) {
      console.error(errorMessage, error);
      setError(errorMessage + " " + error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleLikeClick = () => {
    if (!user) {
      setError("You must be logged in to like an article.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    handleAction(
      `http://localhost:8080/api/articles/like/${articleData.id}`,
      liked ? "DELETE" : "POST",
      (data) => {
        setLikeCount(data);
        setLiked(!liked);
      },
      "Error updating like status:"
    );
  };

  const handleBookmarkClick = () =>
    handleAction(
      `http://localhost:8080/api/bookmarks/${articleData.id}`,
      bookmarked ? "DELETE" : "POST",
      () => setBookmarked(!bookmarked),
      "Error updating bookmark status:"
    );

  const handleCommentSubmit = async () => {
    if (comment.trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/articles/${articleData.id}/comments`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: comment }),
          }
        );
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorData}`
          );
        }
        const data = await response.json();
        setComment("");
        setShowCommentBox(false);
        setComments((prev) => [
          { ...data, articleId: articleData.id },
          ...(Array.isArray(prev) ? prev : []),
        ]);
      } catch (error) {
        console.error("Error posting comment:", error);
        setError("Failed to post comment. Please try again.");
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 p-6 bg-white shadow-md rounded-lg">
      <img
        className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
        src={getProfileImageUrl(articleData.image)}
        alt={articleData.title}
      />
      <h1 className="text-4xl font-bold text-purple-600 mb-6">
        {articleData.title}
      </h1>
      <div className="flex items-center mb-6 text-gray-600">
        <FaClock className="mr-2" />
        <span>{format(new Date(articleData.addedTime), "yyyy年MM月dd日")}</span>
      </div>
      <AudioPlayer audioSrc={getAudioUrl(articleData.audioSrc)} />
      <div className="max-w-none mb-8 space-y-6 text-pretty text-xl leading-relaxed font-comic-sans">
        <PlainTextArticleContent content={articleData.content} />
      </div>
      <div className="flex items-center space-x-4 border-t pt-6 mb-8">
        <img
          src={getProfileImageUrl(articleData.writer.image)}
          alt={articleData.writer.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-purple-200"
        />
        <div>
          <Link href={`/creatorProfile/${articleData.writer.userId}`}>
            <div className="flex items-center">
              <p className="font-semibold text-purple-600 text-xl">
                {articleData.writer.name}
              </p>
              <FaStar className="ml-1 text-yellow-400" />
            </div>
          </Link>
          <p className="text-gray-600">{articleData.writer.role}</p>
        </div>
      </div>
      <div className="flex space-x-4 mb-8">
        <ActionButton
          onClick={handleLikeClick}
          active={liked}
          activeColor="text-pink-500"
          icon={liked ? <FaHeart /> : <FaRegHeart />}
          likeCount={likeCount}
          text="いいね"
        />
        <ActionButton
          onClick={() => setShowCommentBox(!showCommentBox)}
          icon={<GoComment />}
          text="コメント"
          activeColor="text-blue-500"
        />
        <ActionButton
          onClick={handleBookmarkClick}
          active={bookmarked}
          activeColor="text-yellow-500"
          icon={bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          text="ブックマーク"
        />
        <ActionButton
          icon={<RiEyeLine className="text-green-500 hidden" />}
          text={`${viewCount}回閲覧`}
          activeColor="text-green-500"
        />
      </div>
      {showCommentBox && (
        <CommentBox
          comment={comment}
          setComment={setComment}
          onSubmit={handleCommentSubmit}
        />
      )}
      <div className="mt-6">
        {Array.isArray(comments) && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              fetchComments={fetchComments}
              currentUserRole={user?.role}
              onDelete={handleDeleteComment}
            />
          ))
        ) : (
          <p>まだコメントはありません。</p>
        )}
        {hasMore && (
          <button
            onClick={fetchComments}
            className="mt-4 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
          >
            もっと見る
          </button>
        )}
      </div>
      {quizLink && (
        <Link href={quizLink} passHref>
          <button className="w-full bg-green-400 text-white px-6 py-4 rounded-xl text-xl font-bold hover:bg-green-500 transition-colors duration-300 mb-8 shadow-lg">
            <FaCheckCircle className="inline-block mr-3" />
            {quizButtonText || "クイズに挑戦する"}
          </button>
        </Link>
      )}
      <Link href={backLink}>
        <div className="flex items-center justify-start mt-6 group">
          <GiSittingDog className="text-2xl text-blue-500 group-hover:text-blue-600 transition-colors duration-300 mr-2 transform group-hover:scale-110" />
          <span className="text-lg font-semibold text-blue-500 group-hover:text-blue-600 transition-colors duration-300">
            記事一覧に戻る
          </span>
        </div>
      </Link>
    </div>
  );
};

const ActionButton = ({
  onClick,
  active,
  activeColor,
  icon,
  text,
  likeCount,
}) => (
  <button
    onClick={onClick}
    className={`${
      active ? `${activeColor} font-semibold` : "text-gray-600"
    } px-2 py-1 rounded-full flex gap-1 items-center md:font-semibold md:text-base justify-center text-sm sm:px-4 sm:py-2 bg-white shadow-md hover:shadow-lg transition-shadow duration-300`}
  >
    {icon}
    {likeCount > 0 ? (
      <span className="text-xs">
        {likeCount} {likeCount === 1 ? "いいね" : "いいね"}
      </span>
    ) : (
      <span>{text}</span>
    )}
  </button>
);

const CommentBox = ({ comment, setComment, onSubmit }) => (
  <div className="mt-6 flex items-center">
    <div className="relative w-full">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="コメントを書く..."
        className="border outline-none rounded-full p-4 w-full h-10 md:h-12 pr-10  shadow-lg"
      />
      <button
        onClick={onSubmit}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 text-lg"
      >
        <LuSendHorizonal />
      </button>
    </div>
  </div>
);

export default ArticlePage;
