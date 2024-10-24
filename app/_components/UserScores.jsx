"use client";
import React, { useState, useEffect } from "react";
import {
  getQuizScores,
  getAverageScoresByCategory,
  getOverallAverageScore,
} from "../_util/api";

const UserScores = () => {
  const [scores, setScores] = useState([]);
  const [averageScores, setAverageScores] = useState([]);
  const [overallAverage, setOverallAverage] = useState(0);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const [scoresData, averageScoresData, overallAverageData] =
          await Promise.all([
            getQuizScores(),
            getAverageScoresByCategory(),
            getOverallAverageScore(),
          ]);
        setScores(scoresData);
        setAverageScores(averageScoresData);
        setOverallAverage(overallAverageData);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Quiz Scores</h2>

      <h3 className="text-xl font-semibold mb-2">Recent Scores</h3>
      <ul className="mb-6">
        {scores.map((score, index) => (
          <li key={index} className="mb-2">
            {score.category}: {score.score}/{score.totalQuestions} (
            {((score.score / score.totalQuestions) * 100).toFixed(2)}%)
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Average Scores by Category</h3>
      <ul className="mb-6">
        {averageScores.map((avgScore, index) => (
          <li key={index} className="mb-2">
            {avgScore.category}: {avgScore.averageScore.toFixed(2)}%
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Overall Average Score</h3>
      <p>{overallAverage.toFixed(2)}%</p>
    </div>
  );
};

export default UserScores;
