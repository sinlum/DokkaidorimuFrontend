import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // Adjust this to match your backend URL
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is important for handling authentication cookies
});

// Add an interceptor to include the authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Adjust this based on how you're storing the token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const saveQuizScore = async (
  category,
  score,
  totalQuestions,
  articleId
) => {
  try {
    console.log("Sending quiz score:", {
      category,
      score,
      totalQuestions,
      articleId,
    });
    const response = await api.post("/quiz-scores", {
      category,
      score,
      totalQuestions,
      articleId: Number(articleId),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error saving quiz score:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getScoreSummary = async () => {
  try {
    const response = await api.get("/quiz-scores/summary");

    // Validate the response structure
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response format");
    }

    // Transform the response if needed
    const summary = {
      categoryScores: response.data.categoryScores || {},
      overallAverageScore: response.data.overallAverageScore || 0,
      totalQuizzesTaken: response.data.totalQuizzesTaken || 0,
    };

    console.log("Fetched score summary:", summary);
    return summary;
  } catch (error) {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          throw new Error("認証が必要です。ログインしてください。");
        case 403:
          throw new Error("このアクションの権限がありません。");
        case 404:
          throw new Error("スコアが見つかりません。");
        default:
          throw new Error("スコアの取得中にエラーが発生しました。");
      }
    }

    // Handle network errors or other issues
    console.error("Error fetching score summary:", error);
    throw new Error("サーバーとの通信に失敗しました。");
  }
};  

export const getQuizScores = async () => {
  try {
    const response = await api.get("/quiz-scores");
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz scores:", error);
    throw error;
  }
};

export const getQuizScoresByCategory = async (category) => {
  try {
    const response = await api.get(`/quiz-scores/category/${category}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz scores by category:", error);
    throw error;
  }
};

export const getAverageScoresByCategory = async () => {
  try {
    const response = await api.get("/quiz-scores/average-by-category");
    return response.data;
  } catch (error) {
    console.error("Error fetching average scores by category:", error);
    throw error;
  }
};

export const getOverallAverageScore = async () => {
  try {
    const response = await api.get("/quiz-scores/overall-average");
    return response.data;
  } catch (error) {
    console.error("Error fetching overall average score:", error);
    throw error;
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await api.get("/notifications", {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching notifications:",
      error.response || error.message
    );
    throw error;
  }
};
export const fetchUnreadNotificationCount = async () => {
  try {
    const response = await api.get("/notifications/count", {
      headers: authHeader(),
    });
    return response.data.count;
  } catch (error) {
    console.error(
      "Error fetching unread notification count:",
      error.response || error.message
    );
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.put(`/notifications/${notificationId}/read`, null, {
      headers: authHeader(),
    });
  } catch (error) {
    console.error(
      "Error marking notification as read:",
      error.response || error.message
    );
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await api.put("/notifications/read-all", null, {
      headers: authHeader(),
    });
  } catch (error) {
    console.error(
      "Error marking all notifications as read:",
      error.response || error.message
    );
    throw error;
  }
};

export const searchArticles = async (query) => {
  try {
    const response = await api.get("/articles/search", {
      params: { query },
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error searching articles:", error.response || error.message);
    throw error;
  }
};
export const fetchArticleById = async (id) => {
  try {
    const response = await apiService.get(`/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    throw error;
  }
};
export const fetchArticleComments = async (articleId) => {
  try {
    const response = await apiService.get(`/articles/${articleId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for article ${articleId}:`, error);
    throw error;
  }
};
export const deleteArticle = async (articleId) => {
  try {
    await api.delete(`/articles/${articleId}`, {
      headers: authHeader(),
    });
  } catch (error) {
    console.error(
      `Error deleting article ${articleId}:`,
      error.response || error.message
    );
    throw error;
  }
};
