"use client";

import { memo } from "react";

const EmployeeCards = memo(({
  leastSuggestionsCount,
  mostSuggestionsCount,
  attentionNeededWordCount,
  totalEmployees,
  totalSurveysInSystem,
  totalWordsAnalyzed,
  attentionComments,
  getFilteredDataByMainDateRange,
  showEmployeeDialog,
  showAttentionModal
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 justify-between items-center w-full lg:grid-cols-3 lg:gap-8">
      {/* Бага саналтай албан хаагч */}
      <div
        className="flex overflow-hidden relative justify-between items-center p-6 w-full h-48 rounded-xl border shadow-lg transition-shadow cursor-pointer hover:shadow-xl"
        onClick={() => showEmployeeDialog("least")}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1A5276 0%, #154360 50%, #0E3A53 100%)",
            animation: "slowPulse 8s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "linear-gradient(45deg, #1A5276 0%, #154360 50%, #0E3A53 100%)",
            animation: "slowPulse 8s ease-in-out infinite",
            animationDelay: "4s",
          }}
        ></div>

        {/* Content */}
        <div className="flex relative z-10 justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-14 h-14 rounded-full">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Бага саналтай албан хаагч
            </h1>
          </div>

          {/* Circular Progress */}
          <div className="relative w-20 h-20">
            <svg
              className="w-20 h-20 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-white opacity-20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="font-mono text-white"
                fontFamily="monospace"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${Math.min(
                  (leastSuggestionsCount /
                    Math.max(totalEmployees, 1)) *
                    100,
                  100
                )}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="flex absolute inset-0 justify-center items-center">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {leastSuggestionsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Их саналтай албан хаагч */}
      <div
        className="flex overflow-hidden relative justify-between items-center p-6 w-full h-48 rounded-xl border shadow-lg transition-shadow cursor-pointer hover:shadow-xl"
        onClick={() => showEmployeeDialog("most")}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1A5276 0%, #154360 50%, #0E3A53 100%)",
            animation: "slowPulse 8s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "linear-gradient(45deg, #1A5276 0%, #154360 50%, #0E3A53 100%)",
            animation: "slowPulse 8s ease-in-out infinite",
            animationDelay: "4s",
          }}
        ></div>

        {/* Content */}
        <div className="flex relative z-10 justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-14 h-14 rounded-full">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Их саналтай албан хаагч
            </h1>
          </div>

          {/* Circular Progress */}
          <div className="relative w-20 h-20">
            <svg
              className="w-20 h-20 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-white opacity-20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-white"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${Math.min(
                  (mostSuggestionsCount /
                    Math.max(totalSurveysInSystem, 1)) *
                    100,
                  100
                )}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="flex absolute inset-0 justify-center items-center">
              <span
                className="font-sans text-2xl font-bold text-white"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {mostSuggestionsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Анхаарах шаардлагатай */}
      <div
        className="flex overflow-hidden relative justify-between items-center p-6 w-full h-48 rounded-xl border shadow-lg transition-shadow cursor-pointer hover:shadow-xl"
        onClick={showAttentionModal}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #1A5276 0%, #154360 50%, #0E3A53 100%)",
            animation: "slowPulse 8s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "linear-gradient(45deg, #1A5276 0%, #154360 50%, #0E3A53 100%)",
            animation: "slowPulse 8s ease-in-out infinite",
            animationDelay: "4s",
          }}
        ></div>

        {/* Content */}
        <div className="flex relative z-10 justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center w-14 h-14 rounded-full">
              <svg
                className="w-12 h-12 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">
                {attentionNeededWordCount} Сэтгэгдлүүд
              </h1>
              <p className="text-sm text-blue-100">
                Анхаарах шаардлагатай
              </p>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="relative w-20 h-20">
            <svg
              className="w-20 h-20 transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-white opacity-20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-white"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${Math.min(
                  (getFilteredDataByMainDateRange(attentionComments)
                    .length /
                    Math.max(totalWordsAnalyzed, 1)) *
                    100,
                  100
                )}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="flex absolute inset-0 justify-center items-center">
              <span
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {
                  getFilteredDataByMainDateRange(attentionComments)
                    .length
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EmployeeCards.displayName = 'EmployeeCards';

export default EmployeeCards;
