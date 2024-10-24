import Link from "next/link";
import ArticleCard from "./articleCard";

function ArticleSection({ category, articles }) {
  return (
    <>
      <div className="flex justify-start max-w-sm md:max-w-none lg:max-w-none">
        <ul className="flex flex-grow gap-2 overflow-y-auto mx-3 scrollbar-hide md:text-md">
          {category.map((cat) => (
            <button className="px-4 py-2 bg-stone-200 rounded-full text-stone-700 hover:bg-stone-300">
              {cat}
            </button>
          ))}
        </ul>
      </div>
      <section className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <Link key={index} href={`/science/${index}`}>
              <ArticleCard key={index} article={article} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default ArticleSection;
