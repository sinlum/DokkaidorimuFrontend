"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaStar, FaTrophy, FaRocket } from "react-icons/fa";
import { saveQuizScore } from "../_util/api";

const CongratulationsModal = ({ score, totalQuestions, onClose, onFinish }) => {
  const percentage = (score / totalQuestions) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      onFinish();
    }, 7000);
    return () => clearTimeout(timer);
  }, [onClose, onFinish]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-400 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl max-w-md w-full mx-4">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <FaStar
              key={i}
              className="absolute text-yellow-200 animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-bold text-white mb-4 animate-scale">
            すごい！
          </h2>
          <p className="text-2xl text-white mb-6">あなたのスコアは</p>
          <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 border-4 border-yellow-400 animate-rotate">
            <span className="text-4xl font-bold text-purple-600">
              {score}/{totalQuestions}
            </span>
          </div>
          <p className="text-xl text-white mb-8">
            {percentage >= 80
              ? "天才！"
              : percentage >= 60
              ? "よくできました！"
              : "がんばりましたね！"}
          </p>
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold hover:bg-green-600 transition-colors duration-300 animate-pulse"
          >
            <FaRocket className="inline-block mr-2" />
            回答を確認
          </button>
        </div>
      </div>
    </div>
  );
};

const QuizComponent = ({ questions, category, onFinish, articleId }) => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  console.log("QuizComponent received:", { questions, category, articleId });

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    setShowResults(true);
    const newScore = questions.reduce(
      (acc, q) => (answers[q.id] === q.correctAnswer ? acc + 1 : acc),
      0
    );
    setScore(newScore);
    setShowModal(true);

    console.log("Submitting score:", {
      category,
      score: newScore,
      totalQuestions: questions.length,
      articleId,
    });

    try {
      const result = await saveQuizScore(
        category,
        newScore,
        questions.length,
        articleId
      );
      console.log("Score saved successfully:", result);
    } catch (error) {
      console.error("Failed to save quiz score:", error);
    }
  };

  return (
    <div className="max-w-3xl rounded-lg mx-auto text-xl p-6 min-h-screen">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">クイズ</h2>
        {questions.map((q) => (
          <div key={q.id} className="mb-6">
            <p className="font-bold mb-2">{q.text}</p>
            {q.type === "truefalse" ? (
              <div className="space-x-4">
                {["true", "false"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(q.id, option)}
                    className={`px-4 py-2 rounded-lg ${
                      answers[q.id] === option
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors duration-200`}
                  >
                    {option === "true" ? "○" : "×"}
                  </button>
                ))}
              </div>
            ) : q.type === "multiple" && Array.isArray(q.answers) ? (
              <div className="space-y-2">
                {q.answers.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(q.id, option)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      answers[q.id] === option
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors duration-200`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-red-500">質問タイプが無効です。</p>
            )}
            {showResults && (
              <p
                className={`mt-2 ${
                  answers[q.id] === q.correctAnswer
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {answers[q.id] === q.correctAnswer ? "正解!" : "不正解"}
              </p>
            )}
          </div>
        ))}
        {!showResults && (
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
          >
            回答を送信
          </button>
        )}
        {showResults && (
          <Link
            href="/"
            className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
          >
            戻る
          </Link>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {showModal && (
        <CongratulationsModal
          score={score}
          totalQuestions={questions.length}
          onClose={() => setShowModal(false)}
          onFinish={onFinish}
        />
      )}
    </div>
  );
};

const QuizPage = ({ questions, category, onFinish, articleId }) => {
  console.log("QuizPage received:", { questions, category, articleId });
  useEffect(() => {
    document.body.classList.add(
      "bg-gradient-to-br",
      "from-pink-300",
      "via-purple-300",
      "to-indigo-400"
    );

    return () => {
      document.body.classList.remove(
        "bg-gradient-to-br",
        "from-pink-300",
        "via-purple-300",
        "to-indigo-400"
      );
    };
  }, []);

  return (
    <QuizComponent
      questions={questions}
      category={category}
      onFinish={onFinish}
      articleId={articleId}
    />
  );
};

export default QuizPage;
