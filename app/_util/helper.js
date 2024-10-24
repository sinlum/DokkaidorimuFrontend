// utils/imageHelpers.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getProfileImageUrl = (imgUrl) => {
  if (!imgUrl) return `${API_BASE_URL}/default-profile-pic.jpg`;
  return imgUrl.startsWith("http://") || imgUrl.startsWith("https://")
    ? imgUrl
    : `${API_BASE_URL}${imgUrl}`;
};
export const getAudioUrl = (audioUrl) => {
  if (!audioUrl) return `${API_BASE_URL}/default-audio.mp3`;
  return audioUrl.startsWith("http://") || audioUrl.startsWith("https://")
    ? audioUrl
    : `${API_BASE_URL}${audioUrl}`;
};
export const updateOnlineStatus = async (isOnline) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/user/online-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ isOnline }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update online status");
    }
  } catch (error) {
    console.error("Error updating online status:", error);
  }
};

export function formatDate(date, format) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  const formatMap = {
    YYYY: year,
    MM: month,
    DD: day,
    HH: hours,
    mm: minutes,
    ss: seconds,
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => formatMap[match]);
}
// Function to truncate the content to 7 words
export function truncateContent(text, wordCount) {
  const words = text.split(/\s+/);
  if (words.length > wordCount) {
    return words.slice(0, wordCount).join(" ") + "...";
  }
  return text;
}
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
