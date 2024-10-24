import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import ActionMenu from "./ActionMenu";
import { formatDate } from "../_util/helper";

const ArticleRow = React.memo(({ article, onUpdate, onDelete, id }) => {
  // Memoize the date formatting to prevent unnecessary recalculations

  // Create stable callback functions for update and delete
  const handleUpdate = useCallback(() => {
    onUpdate(id);
  }, [onUpdate, id]);

  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [onDelete, id]);

  return (
    <tr className="hover:bg-gradient-to-br from-amber-100 to-orange-120">
      <td className="py-2 px-4 border-b flex items-center space-x-2 sm:space-x-4">
        <img
          src={`http://localhost:8080${article.imageUrl}`}
          alt={article.title}
          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
        />
        <div>
          <p className="text-xs sm:text-sm font-semibold">{article.title}</p>
          <p className="text-xs text-gray-500">
            {formatDate(article.createdAt, "YYYY-MM-DD")}
          </p>
        </div>
      </td>
      <td className="py-2 px-4 border-b text-center text-xs sm:text-sm">
        {article.likeCount}
      </td>
      <td className="py-2 px-4 border-b text-center text-xs sm:text-sm">
        {article.commentCount}
      </td>
      <td className="py-2 px-4 border-b text-center text-xs sm:text-sm">
        {article.bookmarkCount}
      </td>
      <td className="py-2 px-4 border-b text-center text-xs sm:text-sm">
        <ActionMenu onUpdate={handleUpdate} onDelete={handleDelete} />
      </td>
    </tr>
  );
});

// Add a display name for easier debugging
ArticleRow.displayName = "ArticleRow";

export default ArticleRow;
