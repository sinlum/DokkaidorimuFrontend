import Link from "next/link";

function ArticleSectionForHome({ articles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article, index) => (
        <Link key={index} href={"/"}>
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg rounded-lg overflow-hidden">
            <img
              src={article.img}
              alt={article.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">{article.title}</h2>
              <p className="mt-2 text-gray-600">{article.description}</p>
              <div className="mt-4 flex items-center space-x-3">
                <img
                  src={article.img}
                  alt={article.username || "Unknown Author"}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">
                  {article.author || "Unknown Author"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ArticleSectionForHome;
