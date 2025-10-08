"use client";

import { memo } from "react";
import { BsSearch } from "react-icons/bs";
import moment from "moment";
import { useRouter } from "next/navigation";

const CommentsSidebar = memo(
  ({
    sidebarOpen,
    toggleSidebar,
    commentFilter,
    setCommentFilter,
    khariultGaralt,
    filteredRecentComments,
    renderHighlighted,
    renderCommentWithScore,
  }) => {
    const router = useRouter();

    return (
      <>
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[999] lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div
          className={`
          fixed z-[1000] top-0 right-0 h-full p-4 bg-white text-gray-500 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          w-full max-w-sm
          lg:translate-x-0 lg:top-[100px] lg:w-[295px] lg:h-[calc(100vh-100px)] lg:rounded-l-xl lg:max-w-[295px]
        `}
        >
          <div className="flex flex-col items-center justify-start h-full">
            <h1 className="py-4 text-black">Сүүлд ирсэн сэтгэгдлүүд</h1>
            <div className="flex items-center gap-2 mb-2">
              <button
                className={`px-2 py-1 text-sm rounded border ${
                  commentFilter === "all"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-50"
                }`}
                onClick={() => setCommentFilter("all")}
              >
                Энгийн
              </button>
              <button
                className={`px-2 py-1 text-sm rounded border ${
                  commentFilter === "good"
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-700"
                }`}
                onClick={() => setCommentFilter("good")}
              >
                Эерэг
              </button>
              <button
                className={`px-2 py-1 text-sm rounded border ${
                  commentFilter === "bad"
                    ? "bg-red-600 text-white"
                    : "bg-red-50 text-red-700"
                }`}
                onClick={() => setCommentFilter("bad")}
              >
                Сөрөг
              </button>
            </div>
            <hr className="w-full border-2 border-dashed" />

            <div className="relative flex items-center justify-center w-full h-10 px-4 py-2 mt-4 bg-gray-100 rounded-2xl">
              <input
                onChange={(e) => khariultGaralt?.onSearch(e.target.value)}
                className="w-full pr-10 bg-gray-100 outline-none"
                type="text"
                placeholder="Хайлт..."
              />
              <button className="absolute flex items-center justify-center w-8 h-8 p-1 rounded-full right-2 hover:text-blue-400">
                <BsSearch />
              </button>
            </div>

            <div className="w-full mt-4 border-b border-gray-300"></div>

            <div className="flex flex-col w-full gap-2 mt-4 overflow-y-auto">
              {filteredRecentComments.map((a, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col w-full h-full gap-2 p-3 pt-0 text-sm transition-colors rounded-lg cursor-pointer lg:p-4 hover:bg-blue-50"
                    onClick={() => window.open(`/setgegdel/${a._id}`, "_blank")}
                  >
                    <div className="flex flex-col justify-between w-full gap-2 text-sm text-black sm:flex-row sm:items-center sm:gap-0">
                      <div className="flex-1">
                        <p className="font-medium">{a.utas}</p>
                        <p className="text-xs text-gray-600">
                          Хэнд: {a?.ajiltan?.ovog} {a?.ajiltan?.ner}
                        </p>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="text-xs sm:text-sm">
                          {moment(a.ognoo).format("YYYY/MM/DD HH:mm")}
                        </p>
                        <p className="text-xs font-medium">
                          {a?.ajiltan?.ovog?.[0]}.{a?.ajiltan?.ner}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-800">
                      {renderCommentWithScore ? renderCommentWithScore(a) : renderHighlighted(a.tailbar)}
                    </div>
                    <hr className="text-black" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
);

CommentsSidebar.displayName = "CommentsSidebar";

export default CommentsSidebar;
