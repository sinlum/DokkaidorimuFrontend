"use client";
import { useSearchParams } from "next/navigation";
import UpdateArticlePage from "../../_components/UpdateArticlePage";

export default function UpdateArticle({ params }) {
  const articleId = params.id;
  if (!articleId) {
    return <div>No article ID provided</div>;
  }

  return <UpdateArticlePage articleId={articleId} />;
}
