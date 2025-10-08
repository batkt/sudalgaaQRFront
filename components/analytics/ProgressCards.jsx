"use client";

import { memo } from "react";

const ProgressCards = memo(({ progressData, selectedOption }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 [@media(min-width:1024px)_and_(max-width:1280px)]:grid-cols-3 items-center justify-between w-full gap-4">
      {[
        {
          title: "Өмнөх сарын санал",
          progress: progressData.progress1,
        },
        {
          title: "Энэ сарын санал",
          progress: progressData.progress2,
        },
        {
          title: "Сөрөг санал",
          progress: progressData.progress3,
        },
        {
          title: "Эерэг санал",
          progress: progressData.progress4,
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 w-full h-20 text-2xl bg-white rounded-xl shadow-md"
        >
          <h5 className="text-sm lg:text-lg">{item.title}</h5>
          <div className="flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              className="lg:w-[60px] lg:h-[60px]"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="1"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="calc(2 * 3.14159 * 10)"
                className="transition-all duration-300 ease-in-out"
                strokeDashoffset="0"
              />
              <text
                x="12"
                y="14"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="8"
                fill="#333"
              >
                {`${Math.round(
                  selectedOption === "day"
                    ? item.progress[0]
                    : item.progress[1]
                )}`}
              </text>
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
});

ProgressCards.displayName = 'ProgressCards';

export default ProgressCards;
