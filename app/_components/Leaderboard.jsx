"use client";
import { useState, useEffect } from "react";
import { Crown, Flower, Medal, Trophy, Clock, Book } from "lucide-react";
import { getProfileImageUrl } from "../_util/helper";

const Leaderboard = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const [category, setCategory] = useState("Overall");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [categories, setCategories] = useState(["Overall"]);
  const [loading, setLoading] = useState(true);

  const timeRangeText = {
    weekly: { en: "This Week", jp: "今週" },
    monthly: { en: "This Month", jp: "今月" },
    "all-time": { en: "All Time", jp: "全期間" },
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/leaderboard/categories")
      .then((res) => res.json())
      .then((data) => setCategories(["Overall", ...data]))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const url =
      category === "total-scores"
        ? `http://localhost:8080/api/leaderboard/total-scores/${timeRange}`
        : `http://localhost:8080/api/leaderboard/${timeRange}/${category}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
        setLoading(false);
      });
  }, [timeRange, category]);

  const getRankBadge = (index) => {
    const badges = {
      0: {
        bg: "bg-gradient-to-r from-yellow-300 to-yellow-500",
        icon: <Trophy className="w-8 h-8 text-white" />,
        text: "1位",
      },
      1: {
        bg: "bg-gradient-to-r from-gray-300 to-gray-400",
        icon: <Medal className="w-8 h-8 text-white" />,
        text: "2位",
      },
      2: {
        bg: "bg-gradient-to-r from-amber-600 to-amber-700",
        icon: <Medal className="w-8 h-8 text-white" />,
        text: "3位",
      },
    };

    if (index > 2) {
      return (
        <div className="flex items-center justify-center w-12 h-12 text-gray-600 font-semibold">
          {index + 1}位
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col items-center p-2 rounded-lg ${badges[index].bg}`}
      >
        {badges[index].icon}
        <span className="text-white text-sm font-bold mt-1">
          {badges[index].text}
        </span>
      </div>
    );
  };

  console.log("data", leaderboardData);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 left-0 w-full h-full flex justify-between pointer-events-none opacity-30">
            <Flower className="w-16 h-16 text-pink-300 transform -rotate-45" />
            <Flower className="w-16 h-16 text-pink-300 transform rotate-45" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <span className="text-pink-500">ランキング</span>
            <Crown className="w-12 h-12 text-yellow-500" />
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            <span className="text-pink-500">頑張って</span>
            <span className="mx-2">•</span>
            <span className="text-blue-500">一緒に学ぼう</span>
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-8 border-4 border-dashed border-purple-200">
          <div className="flex flex-wrap gap-8 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <label className="text-lg font-bold text-purple-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                期間
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-full px-8 py-3 border-2 border-blue-200 focus:outline-none focus:border-blue-400 appearance-none cursor-pointer hover:shadow-lg transition-all text-lg"
              >
                {Object.entries(timeRangeText).map(([value, text]) => (
                  <option key={value} value={value}>
                    {text.jp}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-center gap-3">
              <label className="text-lg font-bold text-purple-700 flex items-center gap-2">
                <Book className="w-5 h-5" />
                カテゴリー
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gradient-to-r from-pink-50 to-purple-50 text-gray-700 rounded-full px-8 py-3 border-2 border-pink-200 focus:outline-none focus:border-pink-400 appearance-none cursor-pointer hover:shadow-lg transition-all text-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="total-scores">総合スコア</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600 text-lg">ロード中...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 transition-all ${
                    index < 3
                      ? "bg-gradient-to-r from-yellow-50 to-pink-50"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 mr-6">
                    {getRankBadge(index)}
                  </div>
                  <div className="flex-shrink-0 mr-6">
                    <img
                      src={
                        getProfileImageUrl(entry.imgUrl) ||
                        "/api/placeholder/64/64"
                      }
                      alt={entry.username}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-xl text-gray-800">
                      {entry.username}
                    </h3>
                    <div className="text-sm space-x-4">
                      {category === "total-scores" ? (
                        <>
                          <span className="text-pink-600 font-medium">
                            総スコア: {entry.totalScore?.toFixed(0)}
                          </span>
                          <span className="text-blue-600">
                            クイズ数: {entry.totalQuizzes}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-pink-600 font-medium">
                            平均: {entry.averageScore?.toFixed(1)}%
                          </span>
                          <span className="text-blue-600">
                            最高: {entry.highestScore}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 text-transparent bg-clip-text">
                    {category === "total-scores"
                      ? entry.averageScore?.toFixed(1)
                      : entry.totalScore?.toFixed(0)}
                  </div>
                </div>
              ))}

              {leaderboardData.length === 0 && (
                <div className="p-12 text-center text-gray-600">
                  <Star className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                  <p className="text-xl font-medium mb-2">
                    まだデータがありません！
                  </p>
                  <p className="text-gray-500">最初のチャンピオンになろう！</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
