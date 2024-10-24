// components/LoadingSpinner.js
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 z-50">
      <div className="relative w-64 h-64">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#FCD34D"
            strokeWidth="8"
            strokeDasharray="70 30"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#EC4899"
            strokeWidth="8"
            strokeDasharray="55 45"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="-360 50 50"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="8"
            strokeDasharray="40 60"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-2xl font-bold text-indigo-700 animate-bounce">
            ロード中...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
