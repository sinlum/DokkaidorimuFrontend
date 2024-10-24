import React, { useMemo } from "react";
import ArticleRow from "./ArticleRow";

const ArticleTable = React.memo(({ articles, onUpdate, onDelete }) => {
  // Memoize the rows to prevent unnecessary re-renders
  const articleRows = useMemo(() => {
    return articles.map((article) => (
      <ArticleRow
        key={article.articleId}
        id={article.articleId}
        article={article}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    ));
  }, [articles, onUpdate, onDelete]);

  return (
    <div className="overflow-x-auto bg-gradient-to-br from-amber-50 to-orange-100">
      <table className="min-w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          <tr>
            <th className="py-2 text-white px-4 border-b text-left text-xs sm:text-sm">
              Article
            </th>
            <th className="py-2 px-4 text-white border-b text-center text-xs sm:text-sm">
              Likes
            </th>
            <th className="py-2 px-4 text-white border-b text-center text-xs sm:text-sm">
              Comments
            </th>
            <th className="py-2 px-4 text-white border-b text-center text-xs sm:text-sm">
              Bookmark
            </th>
            <th className="py-2 px-4 text-white border-b text-center text-xs sm:text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{articleRows}</tbody>
      </table>
    </div>
  );
});

// Add a display name for easier debugging
ArticleTable.displayName = "ArticleTable";

export default ArticleTable;
