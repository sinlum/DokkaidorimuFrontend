"use client";
import React, { useState, useEffect } from "react";
import { Star, Trophy, Medal, Brain, Rocket } from "lucide-react";
import { getScoreSummary } from "../_util/api";
import {
  FaFlask,
  FaClock,
  FaBookReader,
  FaPray,
  FaPiggyBank,
  FaGlobeAfrica,
} from "react-icons/fa";

const categoryConfig = {
  science: {
    icon: <FaFlask className="w-8 h-8" />,
    color: "text-sky-400",
    gradientFrom: "from-sky-300",
    gradientTo: "to-sky-400",
    bgColor: "bg-sky-50",
    displayName: "化学",
  },
  history: {
    icon: <FaClock className="w-8 h-8" />,
    color: "text-amber-400",
    gradientFrom: "from-amber-300",
    gradientTo: "to-amber-400",
    bgColor: "bg-amber-50",
    displayName: "歴史",
  },
  biography: {
    icon: <FaBookReader className="w-8 h-8" />,
    color: "text-fuchsia-400",
    gradientFrom: "from-fuchsia-300",
    gradientTo: "to-fuchsia-400",
    bgColor: "bg-fuchsia-50",
    displayName: "伝記",
  },
  religion: {
    icon: <FaPray className="w-8 h-8" />,
    color: "text-indigo-400",
    gradientFrom: "from-indigo-300",
    gradientTo: "to-indigo-400",
    bgColor: "bg-indigo-50",
    displayName: "宗教",
  },
  economic: {
    icon: <FaPiggyBank className="w-8 h-8" />,
    color: "text-emerald-400",
    gradientFrom: "from-emerald-300",
    gradientTo: "to-emerald-400",
    bgColor: "bg-emerald-50",
    displayName: "経済",
  },
  politics: {
    icon: <FaGlobeAfrica className="w-8 h-8" />,
    color: "text-rose-400",
    gradientFrom: "from-rose-300",
    gradientTo: "to-rose-400",
    bgColor: "bg-rose-50",
    displayName: "政治",
  },
};

const ScoreSummaryPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await getScoreSummary();
        setSummary(data);
        // Calculate total score
        const total = Object.values(data.categoryScores).reduce(
          (sum, score) => sum + score,
          0
        );
        setTotalScore(total);
      } catch (error) {
        setError(error.message);
        console.error("Failed to load score summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-bounce">
            <Rocket className="w-16 h-16 text-purple-400" />
          </div>
          <p className="text-purple-600 text-lg font-medium animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8">
          <p className="text-rose-500 text-center font-medium text-lg">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="inline-block">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              マイスコア
            </h1>
            <div className="bg-white rounded-full px-6 py-3 shadow-lg">
              <p className="text-purple-500 font-medium text-lg">
                がんばったね！ここまでの成果をみてみよう！
              </p>
            </div>
          </div>
        </div>

        {/* Score Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Points Card */}
          <div className="bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <Medal className="w-12 h-12 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-violet-600">合計スコア</h2>
              <div className="text-4xl font-bold text-violet-600">
                {totalScore.toFixed(1)}点
              </div>
              <div className="bg-white/50 px-4 py-2 rounded-full">
                <span className="text-violet-600 font-medium">
                  獲得ポイント
                </span>
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-md">
                <Trophy className="w-12 h-12 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-pink-600">平均スコア</h2>
              <div className="text-4xl font-bold text-pink-600">
                {summary.overallAverageScore.toFixed(1)}%
              </div>
              <div className="bg-white/50 px-4 py-2 rounded-full">
                <span className="text-pink-600 font-medium">
                  受験回数: {summary.totalQuizzesTaken}回
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Scores Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(summary.categoryScores)
            .sort(([, a], [, b]) => b - a)
            .map(([category, score], index) => {
              const normalizedCategory = category.toLowerCase();
              const config = categoryConfig[normalizedCategory] || {
                icon: <Brain className="w-8 h-8" />,
                color: "text-purple-400",
                gradientFrom: "from-purple-300",
                gradientTo: "to-purple-400",
                bgColor: "bg-purple-50",
                displayName: category,
              };

              return (
                <div
                  key={category}
                  className={`${config.bgColor} rounded-3xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300`}
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 150}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl bg-white shadow-md ${config.color}`}
                      >
                        {config.icon}
                      </div>
                      <h3 className={`text-xl font-bold ${config.color}`}>
                        {config.displayName}
                      </h3>
                    </div>
                    <span className={`text-3xl font-bold ${config.color}`}>
                      {score.toFixed(1)}点
                    </span>
                  </div>
                  <div className="relative h-6 bg-white rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} rounded-full transition-all duration-1000`}
                      style={{ width: `${(score / totalScore) * 100}%` }}
                    />
                  </div>

                  {/* Achievement Badge */}
                  <div className="mt-6">
                    {score >= 5 ? (
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md w-fit">
                        <Trophy className={`w-5 h-5 ${config.color}`} />
                        <span className={`${config.color} font-bold`}>
                          すごい！
                        </span>
                      </div>
                    ) : score >= 3 ? (
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md w-fit">
                        <Star className={`w-5 h-5 ${config.color}`} />
                        <span className={`${config.color} font-bold`}>
                          よくできました！
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md w-fit">
                        <Brain className={`w-5 h-5 ${config.color}`} />
                        <span className={`${config.color} font-bold`}>
                          がんばろう！
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Encouraging Message */}
        <div
          className="text-center mt-12 p-8 bg-white rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300"
          style={{
            animation: "fadeIn 0.5s ease-out 0.8s forwards",
            opacity: 0,
          }}
        >
          <p className="text-xl font-bold">
            {totalScore >= 10 ? (
              <span className="flex items-center justify-center gap-3 text-yellow-400">
                <Trophy className="w-8 h-8" />
                素晴らしい成績だね！その調子！
              </span>
            ) : totalScore >= 5 ? (
              <span className="flex items-center justify-center gap-3 text-blue-400">
                <Star className="w-8 h-8" />
                よく頑張ったね！もっと上を目指そう！
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3 text-purple-400">
                <Brain className="w-8 h-8" />
                これからも一緒に頑張ろう！
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummaryPage;
