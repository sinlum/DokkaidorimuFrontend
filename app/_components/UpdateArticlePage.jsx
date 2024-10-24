"use client";
import React, { useState, useEffect } from "react";
import {
  FaUpload,
  FaPlus,
  FaMinus,
  FaCheck,
  FaStar,
  FaBookOpen,
  FaTags,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-xl font-bold mb-2 text-indigo-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 bg-white text-lg"
    />
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xl font-bold mb-2 text-indigo-700">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      rows="6"
      className="w-full p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 bg-white text-lg"
    ></textarea>
  </div>
);

const FileUpload = ({ label, onChange, accept, preview, file, fileType }) => (
  <div className="mb-4">
    <label className="block text-xl font-bold mb-2 text-indigo-700">
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        onChange={onChange}
        accept={accept}
        className="hidden"
        id={`file-${label}`}
      />
      <label
        htmlFor={`file-${label}`}
        className={`flex items-center justify-center w-full p-3 ${
          file ? "bg-green-400" : "bg-yellow-300"
        } text-indigo-700 rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors duration-300 text-lg font-bold`}
      >
        {file ? <FaCheck className="mr-2" /> : <FaUpload className="mr-2" />}
        {file ? "アップロード完了" : "アップロード"}
      </label>
    </div>
    {preview && fileType === "image" && (
      <div className="mt-2 p-2 bg-white rounded-lg shadow-md">
        <img
          src={preview}
          alt="Preview"
          className="w-full h-50 object-cover rounded-lg"
        />
      </div>
    )}
    {file && fileType === "audio" && (
      <div className="mt-2 p-2 bg-white rounded-lg shadow-md">
        <audio controls className="w-full">
          <source src={preview} type={file.type} />
          Your browser does not support the audio element.
        </audio>
      </div>
    )}
  </div>
);

const QuizQuestion = ({
  question,
  onQuestionChange,
  onAnswerChange,
  onAddAnswer,
  onRemoveAnswer,
  onCorrectAnswerChange,
}) => (
  <div className="mb-6 p-4 bg-green-100 rounded-lg shadow-md border-2 border-green-300">
    <InputField
      label="質問"
      value={question.text}
      onChange={(e) => onQuestionChange(e.target.value)}
    />
    <div className="mb-2">
      <label className="block text-lg font-bold mb-2 text-indigo-700">
        質問タイプ
      </label>
      <select
        value={question.type}
        onChange={(e) => onQuestionChange(e.target.value, "type")}
        className="w-full p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 bg-white text-lg"
      >
        <option value="truefalse">○/×</option>
        <option value="multiple">複数選択</option>
      </select>
    </div>
    {question.type === "truefalse" ? (
      <div className="mb-2">
        <label className="block text-lg font-bold mb-2 text-indigo-700">
          正解
        </label>
        <select
          value={question.correctAnswer}
          onChange={(e) => onCorrectAnswerChange(e.target.value)}
          className="w-full p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 bg-white text-lg"
        >
          <option value="true">○</option>
          <option value="false">×</option>
        </select>
      </div>
    ) : (
      <>
        {question.answers.map((answer, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => onAnswerChange(index, e.target.value)}
              className="flex-grow p-3 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 bg-white text-lg"
            />
            <button
              type="button"
              onClick={() => onCorrectAnswerChange(answer)}
              className={`ml-2 p-2 ${
                question.correctAnswer === answer
                  ? "bg-green-500"
                  : "bg-gray-300"
              } text-white rounded-full hover:bg-opacity-80 transition-colors duration-300`}
            >
              <FaCheck />
            </button>
            <button
              type="button"
              onClick={() => onRemoveAnswer(index)}
              className="ml-2 p-2 bg-red-400 text-white rounded-full hover:bg-red-500 transition-colors duration-300"
            >
              <FaMinus />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddAnswer}
          className="mt-2 p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors duration-300"
        >
          <FaPlus />
        </button>
      </>
    )}
  </div>
);

const categoriesWithGenres = {
  Science: [
    "Technology",
    "Engineering",
    "Health Sciences",
    "Space Exploration",
    "Earth Sciences",
    "Chemistry",
    "Biology",
  ],
  Bible: [
    "Theology",
    "Historical Context",
    "Biblical Studies",
    "Scriptural Analysis",
    "Prophets",
    "Apostolic Writings",
    "Psalms and Proverbs",
  ],
  Biography: [
    "Historical Figures",
    "Contemporary Figures",
    "Artists",
    "Politicians",
    "Scientists",
    "Philosophers",
    "Inventors",
  ],
  Economic: [
    "Microeconomics",
    "Macroeconomics",
    "Economic Theory",
    "Global Economics",
    "Financial Markets",
    "Economic Policy",
    "Development Economics",
  ],
  Politics: [
    "Political Theory",
    "International Relations",
    "Public Policy",
    "Comparative Politics",
    "Government Systems",
    "Political History",
    "Civic Rights",
  ],
  History: [
    "Ancient History",
    "Modern History",
    "Medieval History",
    "Historical Wars",
    "Cultural History",
    "Economic History",
    "Kachin History",
  ],
};

const UpdateArticlePage = ({ articleId }) => {
  const [articleFormData, setArticleFormData] = useState({
    title: "",
    content: "",
    image: null,
    audioSrc: null,
    category: "",
    genre: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/articles/${articleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const articleData = response.data;
        setArticleFormData({
          title: articleData.title,
          content: articleData.content,
          category: articleData.category,
          genre: articleData.subcategory,
          image: null,
          audioSrc: null,
        });
        setImagePreview(articleData.imageUrl);
        setAudioPreview(articleData.audioUrl);
        setQuizQuestions(articleData.quizQuestions || []);
        setGenres(categoriesWithGenres[articleData.category] || []);
      } catch (error) {
        toast.error("Error fetching article data: " + error.message);
      }
    };

    fetchArticleData();
  }, [articleId]);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setArticleFormData({
      ...articleFormData,
      category: selected,
      genre: "",
    });
    setGenres(categoriesWithGenres[selected] || []);
  };

  const handleGenreChange = (e) => {
    setArticleFormData({
      ...articleFormData,
      genre: e.target.value,
    });
  };

  const handleInputChange = (field, value) => {
    setArticleFormData({ ...articleFormData, [field]: value });
  };

  const handleFileUpload = (field, file) => {
    setArticleFormData({ ...articleFormData, [field]: file });
    if (field === "image" && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (field === "audioSrc" && file) {
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
    }
  };

  const handleQuestionChange = (index, value, field = "text") => {
    const newQuestions = [...quizQuestions];
    newQuestions[index][field] = value;
    if (field === "type") {
      newQuestions[index].correctAnswer = value === "truefalse" ? "true" : "";
      newQuestions[index].answers = value === "multiple" ? ["", ""] : undefined;
    }
    setQuizQuestions(newQuestions);
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].answers[answerIndex] = value;
    setQuizQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].answers.push("");
    setQuizQuestions(newQuestions);
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuizQuestions(newQuestions);
  };
  const handleCorrectAnswerChange = (questionIndex, value) => {
    const newQuestions = [...quizQuestions];
    newQuestions[questionIndex].correctAnswer = value;
    setQuizQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    // Add article data
    const articleData = {
      title: articleFormData.title,
      content: articleFormData.content,
      category: articleFormData.category,
      subcategory: articleFormData.genre,
    };
    formData.append("article", JSON.stringify(articleData));

    // Add image file only if a new image is selected
    if (articleFormData.image) {
      formData.append("image", articleFormData.image);
    }

    // Add audio file only if a new audio is selected
    if (articleFormData.audioSrc) {
      formData.append("audio", articleFormData.audioSrc);
    }

    // Add quiz questions
    formData.append("quizQuestions", JSON.stringify(quizQuestions));

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/articles/${articleId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Article updated successfully!", {
        position: "top-center",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Error updating article: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    document.body.classList.add(
      "bg-gradient-to-br",
      "from-yellow-200",
      "via-pink-200",
      "to-blue-200"
    );

    return () => {
      document.body.classList.remove(
        "bg-gradient-to-br",
        "from-yellow-200",
        "via-pink-200",
        "to-blue-200"
      );
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600 flex items-center justify-center">
            <FaStar className="text-yellow-400 mr-2" />
            記事を更新しよう！
            <FaStar className="text-yellow-400 ml-2" />
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-100 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">
                記事情報
              </h2>
              <InputField
                label="タイトル"
                value={articleFormData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
              <TextArea
                label="内容"
                value={articleFormData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload
                  label="画像"
                  onChange={(e) => handleFileUpload("image", e.target.files[0])}
                  accept="image/*"
                  preview={imagePreview}
                  file={articleFormData.image}
                  fileType="image"
                />
                <FileUpload
                  label="音声"
                  onChange={(e) =>
                    handleFileUpload("audioSrc", e.target.files[0])
                  }
                  accept="audio/*"
                  preview={audioPreview}
                  file={articleFormData.audioSrc}
                  fileType="audio"
                />
              </div>
              {/* Add category and genre selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-lg font-bold mb-2 text-indigo-700"
                  >
                    カテゴリー
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="category"
                      value={articleFormData.category}
                      onChange={handleCategoryChange}
                      className="appearance-none relative block w-full px-3 py-3 pl-10 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 bg-white text-lg"
                    >
                      <option value="">カテゴリーを選択</option>
                      {Object.keys(categoriesWithGenres).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="genre"
                    className="block text-lg font-bold mb-2 text-indigo-700"
                  >
                    ジャンル
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTags className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="genre"
                      value={articleFormData.genre}
                      onChange={handleGenreChange}
                      disabled={!genres.length}
                      className="appearance-none relative block w-full px-3 py-3 pl-10 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 bg-white text-lg"
                    >
                      <option value="">ジャンルを選択</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-100 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">
                クイズ問題
              </h2>
              {quizQuestions.map((question, index) => (
                <QuizQuestion
                  key={index}
                  question={question}
                  onQuestionChange={(value, field) =>
                    handleQuestionChange(index, value, field)
                  }
                  onAnswerChange={(answerIndex, value) =>
                    handleAnswerChange(index, answerIndex, value)
                  }
                  onAddAnswer={() => handleAddAnswer(index)}
                  onRemoveAnswer={(answerIndex) =>
                    handleRemoveAnswer(index, answerIndex)
                  }
                  onCorrectAnswerChange={(value) =>
                    handleCorrectAnswerChange(index, value)
                  }
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-4 bg-indigo-500 text-white text-xl font-bold rounded-lg transition-colors duration-300 shadow-lg flex items-center justify-center ${
                isLoading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:bg-indigo-600"
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  更新中...
                </>
              ) : (
                "更新する"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateArticlePage;
