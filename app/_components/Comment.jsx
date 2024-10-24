import React, { useState, useRef, useEffect } from "react";
import { HiReply, HiDotsVertical } from "react-icons/hi";
import { FcApproval } from "react-icons/fc";
import { FaStar } from "react-icons/fa";
import { RiEyeLine } from "react-icons/ri";
import { getProfileImageUrl } from "../_util/helper";
import { useUser } from "./userContext";
import Link from "next/link";

const Comment = ({
  comment: initialComment,
  fetchComments,
  currentUserRole,
  onDelete,
}) => {
  const [comment, setComment] = useState(initialComment);
  const [reply, setReply] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useUser();
  const dropdownRef = useRef(null);
  const canDelete =
    user && (user.role === "ADMIN" || user.username === comment.username);

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleReplySubmit = async () => {
    if (reply.trim() !== "") {
      const newReply = {
        id: Date.now(), // Temporary ID
        content: reply,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        articleId: comment.articleId,
      };

      // Update local state immediately
      setComment((prevComment) => ({
        ...prevComment,
        replies: [...(prevComment.replies || []), newReply],
      }));

      setReply("");
      setShowReplyBox(false);

      try {
        const response = await fetch(
          `http://localhost:8080/api/articles/${comment.articleId}/comments/${comment.id}/replies`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: reply }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update the comment with the actual data from the server
        setComment((prevComment) => ({
          ...prevComment,
          replies: prevComment.replies.map((r) =>
            r.id === newReply.id ? data : r
          ),
        }));

        // Optionally, call fetchComments to update the entire comment tree
        fetchComments();
      } catch (error) {
        console.error("Error posting reply:", error);
        // Optionally, remove the optimistically added reply if the request fails
        setComment((prevComment) => ({
          ...prevComment,
          replies: prevComment.replies.filter((r) => r.id !== newReply.id),
        }));
      }
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/articles/${comment.articleId}/comments/${comment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      onDelete(comment.id);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("comment", comment);

  return (
    <div className="mb-4">
      <div className="flex items-start mb-4">
        <img
          className="h-8 w-8 rounded-full mr-2 shadow-md border-2 border-purple-200"
          src={getProfileImageUrl(comment.profileImageUrl)}
          alt={comment.username}
        />
        <div
          className="p-3 shadow-lg rounded-lg w-full relative bg-gradient-to-br from-blue-100 to-purple-100"
          onMouseEnter={() => setShowDeleteOption(true)}
          onMouseLeave={() => setShowDeleteOption(false)}
        >
          <Link href={`/creatorProfile/${comment.userId}`}>
            <div className="flex justify-start gap-1 items-center mb-1">
              <span className="font-semibold text-purple-600">
                {comment.username}
              </span>
              {(comment.role === "CREATOR" || comment.role === "ADMIN") && (
                <span>
                  <FaStar className="text-yellow-400" />
                </span>
              )}
            </div>
          </Link>
          <p className="text-md">{comment.content}</p>
          <div className="flex text-xs mt-1">
            <button
              className="flex items-center text-blue-500 hover:text-blue-600"
              onClick={() => setShowReplyBox(!showReplyBox)}
            >
              <div className="flex items-center justify-center gap-1">
                <HiReply />
                返信
              </div>
            </button>
          </div>
          {showReplyBox && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={reply}
                onChange={handleReplyChange}
                placeholder="返信を書く..."
                className="border outline-none rounded-full p-4 w-40 md:w-80 text-sm h-9 shadow-lg"
              />
              <button
                onClick={handleReplySubmit}
                className="text-blue-500 hover:text-blue-600 text-xs mt-1"
              >
                送信
              </button>
            </div>
          )}
          {showDeleteOption && canDelete && (
            <div className="absolute top-2 right-2" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-gray-500 hover:text-black"
              >
                <HiDotsVertical />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gradient-to-br from-yellow-100 to-green-100 ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      onClick={handleDeleteComment}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-700"
                      role="menuitem"
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              fetchComments={fetchComments}
              currentUserRole={currentUserRole}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
