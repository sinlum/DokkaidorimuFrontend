function ArticleCard({ article }) {
  return (
    <div className="border-2 rounded-lg overflow-hidden shadow-md bg-white ">
      <img
        className="w-full h-48 object-cover"
        src={article.img}
        alt={article.title}
      />
      <div className="p-4">
        <h2 className="font-bold text-xl mb-2 text-stone-600">
          {article.title}
        </h2>
        <p className=" mb-4 text-stone-600">
          {article.text.split(" ").slice(0, 30).join(" ") + "...."}
        </p>
        <div className="flex gap-3 items-center bg-green-500 p-2 rounded shadow-lg">
          <img
            className="h-10 w-10 rounded-full mr-2 shadow-lg"
            src={article.authorImg}
            alt={article.author}
          />
          <p className="text-white text-md font-semibold">{article.author}</p>
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;
