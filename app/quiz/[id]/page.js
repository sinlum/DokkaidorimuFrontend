"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuizPage from "../../_components/Quiz";
import LoadingSpinner from "@/app/_components/LoadingSpinner"; // Assuming you have this component

function MyQuiz({ params }) {
  const router = useRouter();
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const articleId = params.id;

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/articles/${articleId}`
        );
        if (!response.ok) {
          throw new Error("クイズデータの取得に失敗しました");
        }
        const data = await response.json();

        // Assuming the API returns quiz questions in the format your QuizPage expects
        // You might need to transform the data if the API format is different
        setQuizData(data.quizQuestions || []);
        setCategory(data.category);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [articleId]);

  const handleQuizFinish = () => {
    router.push("/"); // or any other action you want to take when the quiz finishes
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  if (!quizData || quizData.length === 0) {
    return (
      <div className="text-center mt-10">クイズの質問が見つかりません。</div>
    );
  }

  console.log("cat", category);

  return (
    <QuizPage
      questions={quizData}
      category={category}
      onFinish={handleQuizFinish}
      articleId={articleId}
    />
  );
}

export default MyQuiz;
