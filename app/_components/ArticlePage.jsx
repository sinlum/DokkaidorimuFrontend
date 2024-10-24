"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { GoComment } from "react-icons/go";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { TiArrowBackOutline } from "react-icons/ti";
import { FcApproval, FcClock } from "react-icons/fc";
import { LuSendHorizonal } from "react-icons/lu";
import Comment from "./Comment";
import { getProfileImageUrl } from "../_util/helper";
import { useUser } from "./userContext";
import { HiOutlineChartBar } from "react-icons/hi";

const ArticlePage = ({ article, backLink }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(article.likeCount);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [viewCount, setViewCount] = useState(article.viewCount || 0);
  console.log("likeCount", likeCount);
  useEffect(() => {
    fetchLikeStatus();
    fetchComments();
    fetchBookmarkStatus();
    fetchViewCount();
  }, [article.id]);

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
      `http://localhost:8080/api/articles/${article.id}/like-status`,
      "Error fetching like status:"
    )
      .then((data) => setLiked(data?.liked))
      .catch((error) => console.error("Failed to fetch like status:", error));

  const fetchBookmarkStatus = () =>
    fetchData(
      `http://localhost:8080/api/bookmarks/${article.id}/bookmark-status`,
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
        `http://localhost:8080/api/articles/${article.id}/comments?page=${page}&size=10`,
        "Error fetching comments:"
      );
      if (data) {
        const newComments = data.content.map((comment) => ({
          ...comment,
          articleId: article.id,
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
    }
  };

  const fetchViewCount = async () => {
    try {
      const data = await fetchData(
        `http://localhost:8080/api/articles/${article.id}/view-count`,
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
        successAction({}); // Call successAction with an empty object
      } else {
        successAction(responseData);
      }
    } catch (error) {
      console.error(errorMessage, error);
      setError(errorMessage + " " + error.message);
      // Clear the error after 5 seconds
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
      `http://localhost:8080/api/articles/like/${article.id}`,
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
      `http://localhost:8080/api/bookmarks/${article.id}`,
      bookmarked ? "DELETE" : "POST",
      () => setBookmarked(!bookmarked),
      "Error updating bookmark status:"
    );

  const handleCommentSubmit = async () => {
    if (comment.trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:8080/api/articles/${article.id}/comments`,
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
        setComments((prev) => [{ ...data, articleId: article.id }, ...prev]);
      } catch (error) {
        console.error("Error posting comment:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };
  console.log("comment", comments);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-amber-50 to-orange-100 shadow-md rounded-lg">
      <img
        className="w-full h-96 md:h-3/4 object-cover rounded-lg"
        src={getProfileImageUrl(article.imageUrl)}
        alt={article.title}
      />
      <h1 className="text-3xl uppercase font-bold mt-4 mb-2 text-stone-600">
        {article.title}
      </h1>
      <div className="flex items-center gap-1 mb-4 mt-3">
        <FcClock />
        <p className="text-gray-500">
          {format(new Date(article.createdAt), "MMMM dd, yyyy")}
        </p>
      </div>
      <p className="text-stone-600 mb-6 tracking-wide leading-10 font-semibold text-lg">
        {article.content.replace(/<[^>]+>/g, "")}
      </p>
      <div className="flex items-center mb-6">
        <img
          className="h-10 w-10 rounded-full mr-4 shadow-lg"
          src={getProfileImageUrl(article.authorImageUrl)}
          alt={article.username || "Unknown Author"}
        />
        <Link href={`/creatorProfile/${article.userId}`}>
          <div className="flex justify-center items-center gap-1">
            <p className="text-base font-semibold text-stone-600">
              {article.username || "Unknown Author"}
            </p>
            <span>
              <FcApproval />
            </span>
          </div>
        </Link>
      </div>

      <div className="flex space-x-1 mt-5">
        <ActionButton
          onClick={handleLikeClick}
          active={liked}
          activeColor="text-red-500"
          icon={liked ? <AiFillLike /> : <AiOutlineLike />}
          likeCount={likeCount}
        />
        <ActionButton
          onClick={() => setShowCommentBox(!showCommentBox)}
          icon={<GoComment />}
          text="Comment"
        />
        <ActionButton
          onClick={handleBookmarkClick}
          active={bookmarked}
          activeColor="text-blue-500"
          icon={bookmarked ? <BsBookmarkFill /> : <BsBookmark />}
          text="Bookmark"
        />
        <ActionButton
          icon={<HiOutlineChartBar />}
          text={`${viewCount} Views`}
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
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            fetchComments={fetchComments}
            currentUserRole={user?.role}
            onDelete={handleDeleteComment}
          />
        ))}
        {hasMore && (
          <button
            onClick={fetchComments}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load More Comments
          </button>
        )}
      </div>
      <Link href={backLink}>
        <div className="text-blue-500 mt-6 flex gap-2 items-center justify-start">
          <TiArrowBackOutline />
          <span>Back To Articles</span>
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
    } px-2 py-1 rounded-full flex gap-1 items-center md:font-semibold md:text-base justify-center text-xs sm:px-4 sm:py-2`}
  >
    {icon}

    {likeCount > 0 ? (
      <span className="text-sm">
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
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
        placeholder="Write a comment..."
        className="border outline-none rounded-full p-4 w-full h-10 md:h-12 pr-10 bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg"
      />
      <button
        onClick={onSubmit}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-600 hover:text-stone-900 text-lg"
      >
        <LuSendHorizonal />
      </button>
    </div>
  </div>
);

export default ArticlePage;
