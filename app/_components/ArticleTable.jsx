import Link from "next/link";
import React from "react";

const ArticleTable = ({ articles, title }) => {
  return (
    <div className="mt-1 md:mt-2 min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-3 rounded-lg">
      <p className="text-2xl uppercase mb-3 mt-3 p-2">{title}</p>
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-lg shadow-lg">
        <div className="table-auto">
          <table className="min-w-full bg-gradient-to-br from-amber-50 to-orange-100">
            <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              <tr>
                <th className="py-2 px-4 text-white border-b text-left text-xs md:text-base">
                  Article
                </th>
                <th className="py-2 px-4 text-white border-b text-center text-xs md:text-base">
                  Author
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => (
                <tr
                  key={index}
                  className="hover:bg-gradient-to-br from-amber-100 to-orange-120"
                >
                  <td className="py-2 px-4 border-b flex items-center space-x-2 sm:space-x-4">
                    <img
                      src={`http://localhost:8080${article.imageUrl}`}
                      alt={article.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
                    />
                    <div>
                      <Link key={index} href={`bookmarks/${article.articleId}`}>
                        <p
                          className="text-xs md:text-base font-semibold hover:underline
                          cursor-pointer"
                        >
                          {article.title}
                        </p>
                      </Link>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center text-xs md:text-base">
                    {article.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArticleTable;
