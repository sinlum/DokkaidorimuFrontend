"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBookOpen,
  FaFire,
  FaStar,
  FaRocket,
  FaEnvelope,
  FaQuestionCircle,
  FaLightbulb,
  FaPuzzlePiece,
  FaSpinner,
  FaHeart,
  FaComment,
  FaBookmark,
} from "react-icons/fa";
import { getProfileImageUrl } from "./_util/helper";

const ArticleCard = ({ article, isHot }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
    <div className="relative">
      <img
        src={getProfileImageUrl(article.imageUrl) || "/samura.jpeg"}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      {/* Category Badge */}
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          {article.category}
        </span>
      </div>
      {/* Hot/New Badge */}
      <div
        className={`absolute top-0 right-0 ${
          isHot
            ? "bg-gradient-to-r from-red-500 to-pink-500"
            : "bg-gradient-to-r from-blue-500 to-indigo-500"
        } text-white px-4 py-2 rounded-bl-2xl font-bold shadow-lg`}
      >
        {isHot ? (
          <FaFire className="inline mr-2 animate-pulse" />
        ) : (
          <FaBookOpen className="inline mr-2" />
        )}
        {isHot ? "ホット" : "新着"}
      </div>
      {/* Engagement Metrics */}
      {isHot && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm text-white px-4 py-2 flex justify-around items-center text-sm font-medium">
          <div className="flex items-center gap-1">
            <div className="bg-white/20 p-1.5 rounded-full">
              <FaHeart className="text-pink-200 w-4 h-4" />
            </div>
            <span>{article.likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-white/20 p-1.5 rounded-full">
              <FaComment className="text-blue-200 w-4 h-4" />
            </div>
            <span>{article.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-white/20 p-1.5 rounded-full">
              <FaBookmark className="text-yellow-200 w-4 h-4" />
            </div>
            <span>{article.bookmarkCount}</span>
          </div>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold text-purple-700 mb-2">
        {article.title}
      </h3>
      <p className="text-gray-600 mb-4">
        {article.content.length > 100
          ? article.content.substring(0, 100) + "..."
          : article.content}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-spin blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={
                getProfileImageUrl(article.authorImageUrl) ||
                "/api/placeholder/24/24"
              }
              alt={article.username}
              className="w-8 h-8 rounded-full relative border-2 border-white"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {article.username}
          </span>
        </div>
        <Link
          href={`/articleView/${article.id}`}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
        >
          よむ
        </Link>
      </div>
    </div>
  </div>
);

const DailyFunFact = () => {
  const [fact, setFact] = useState("");

  useEffect(() => {
    // In a real app, you'd fetch this from an API or database
    const facts = [
      "バナナは果物ではなく、ベリーの一種です。",
      "蜂は地球の重力を感じません。",
      "人間の脳は、寝ている間も活発に活動しています。",
      "チョコレートは、昔は貨幣として使われていました。",
      "宇宙飛行士の身長は、宇宙で数センチ伸びます。",
    ];
    setFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  return (
    <div className="bg-green-100 rounded-2xl p-6 shadow-lg mb-8">
      <h3 className="text-2xl font-bold text-green-700 mb-4">
        <FaLightbulb className="inline-block mr-2" />
        今日の豆知識
      </h3>
      <p className="text-lg text-green-800">{fact}</p>
    </div>
  );
};

const InteractivePuzzle = () => {
  const [puzzle, setPuzzle] = useState("");
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const puzzles = [
      {
        q: "あなたが立っているとき、私は横になっています。あなたが横になるとき、私は立っています。私は何でしょう？",
        a: "足",
      },
      {
        q: "私は上がったり下がったりしますが、動きません。私は何でしょう？",
        a: "階段",
      },
      {
        q: "私は世界中を旅しますが、いつも角に座っています。私は何でしょう？",
        a: "切手",
      },
    ];
    const selectedPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setPuzzle(selectedPuzzle.q);
    setAnswer(selectedPuzzle.a);
  }, []);

  return (
    <div className="bg-purple-100 rounded-2xl p-6 shadow-lg mb-8">
      <h3 className="text-2xl font-bold text-purple-700 mb-4">
        <FaPuzzlePiece className="inline-block mr-2" />
        なぞなぞチャレンジ
      </h3>
      <p className="text-lg text-purple-800 mb-4">{puzzle}</p>
      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors duration-300"
      >
        {showAnswer ? "答えを隠す" : "答えを見る"}
      </button>
      {showAnswer && (
        <p className="mt-4 text-lg font-bold text-purple-700">答え: {answer}</p>
      )}
    </div>
  );
};

const HomePage = () => {
  const [articles, setArticles] = useState({
    latestArticles: [],
    hotArticles: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/articles/dashboard"
        );
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const LoadingSection = () => (
    <div className="flex justify-center items-center h-48">
      <FaSpinner className="animate-spin text-4xl text-purple-600" />
    </div>
  );

  const ErrorSection = ({ message }) => (
    <div className="text-center p-8 bg-red-50 rounded-lg">
      <p className="text-red-600">エラーが発生しました: {message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
      >
        リトライ
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-purple-800 mb-12">
          <FaRocket className="inline-block mr-2 animate-bounce" />
          わくわく知識探検
        </h1>

        <DailyFunFact />

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6">
            <FaBookOpen className="inline-block mr-2" />
            さいしんきじ
          </h2>
          {loading ? (
            <LoadingSection />
          ) : error ? (
            <ErrorSection message={error} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} isHot={false} />
              ))}
            </div>
          )}
        </section>

        <InteractivePuzzle />

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-red-600 mb-6">
            <FaFire className="inline-block mr-2" />
            ホットなきじ
          </h2>
          {loading ? (
            <LoadingSection />
          ) : error ? (
            <ErrorSection message={error} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.hotArticles.map((article) => (
                <ArticleCard key={article.id} article={article} isHot={true} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">わくわく知識探検</h3>
              <p>楽しく学ぼう、世界の不思議！</p>
            </div>
            <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
              <Link
                href="/about"
                className="text-yellow-300 hover:text-yellow-100 mx-2"
              >
                <FaQuestionCircle className="inline-block mr-1" />
                サイトについて
              </Link>
              <Link
                href="/contact"
                className="text-yellow-300 hover:text-yellow-100 mx-2"
              >
                <FaEnvelope className="inline-block mr-1" />
                お問い合わせ
              </Link>
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right">
              <p>&copy; 2024 わくわく知識探検</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating animation elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className="absolute text-yellow-300 opacity-50 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
