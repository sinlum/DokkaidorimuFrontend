// app/_components/AddArticleButton.js
"use client";
import Link from "next/link";
import { IoIosSend } from "react-icons/io";
import { useUser } from "./userContext";

export default function AddArticleButton() {
  const { user } = useUser();
  if (user && (user.role === "ADMIN" || user.role === "CREATOR")) {
    return (
      <Link href="/addArticle">
        <p
          className="fixed bottom-4 right-4 hover:bg-gray-800 p-3 rounded-full shadow-lg transition duration-300 flex items-center justify-center z-50"
          aria-label="Add Article"
        >
          <IoIosSend className="text-2xl text-sky-500" />
        </p>
      </Link>
    );
  }
  return null;
}
