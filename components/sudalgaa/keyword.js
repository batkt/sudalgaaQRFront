"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Filter,
  Shield,
} from "lucide-react";
import deleteMethod from "@/tools/functions/crud/deleteMethod";
import createMethod from "@/tools/functions/crud/createMethod";
import updateMethod from "@/tools/functions/crud/updateMethod";
import { useAuth } from "@/services/auth";
import { useTulkhuurUg } from "@/hook/useTulkhuurUg";

const KeywordCollector = ({ text = "" }) => {
  const { token } = useAuth();
  const { tulkhuurUgGaralt, tulkhuurUgMutate } = useTulkhuurUg(token);

  const [newGood, setNewGood] = useState("");
  const [newBad, setNewBad] = useState("");
  const [goodSearch, setGoodSearch] = useState("");
  const [badSearch, setBadSearch] = useState("");
  const [goodSort, setGoodSort] = useState("asc");
  const [badSort, setBadSort] = useState("asc");
  const [alertState, setAlertState] = useState({ type: null, message: "" });
  const [inputErrors, setInputErrors] = useState({ good: false, bad: false });
  const [showOnlyMarked, setShowOnlyMarked] = useState(false);

  const showAlert = (type, message, timeoutMs = 3500) => {
    setAlertState({ type, message });
    if (timeoutMs) {
      window.clearTimeout(showAlert.__t);
      showAlert.__t = window.setTimeout(() => {
        setAlertState({ type: null, message: "" });
      }, timeoutMs);
    }
  };

  const goodKeywords =
    tulkhuurUgGaralt?.jagsaalt?.filter((k) => k.turul === "Sain") || [];
  const badKeywords =
    tulkhuurUgGaralt?.jagsaalt?.filter((k) => k.turul === "Muu") || [];

  const translations = {
    goodPlaceholder: "Эерэг түлхүүр үг оруулах",
    badPlaceholder: "Сөрөг түлхүүр үг оруулах",
    addButton: "Нэмэх",
    goodKeywordsTitle: "Эерэг түлхүүр үгс",
    badKeywordsTitle: "Сөрөг түлхүүр үгс",
    noKeywords: "Түлхүүр үг алга",
    searchPlaceholder: "Түлхүүр үг хайх...",
    sortAsc: "А-Я",
    sortDesc: "Я-А",
  };

  const addKeyword = async (trimmed, type) => {
    if (!trimmed) {
      // Show red warning for empty input
      if (type === "Sain") {
        setInputErrors((prev) => ({ ...prev, good: true }));
        setTimeout(
          () => setInputErrors((prev) => ({ ...prev, good: false })),
          3000
        );
      } else {
        setInputErrors((prev) => ({ ...prev, bad: true }));
        setTimeout(
          () => setInputErrors((prev) => ({ ...prev, bad: false })),
          3000
        );
      }
      showAlert("error", "Талбар хоосон байна");
      return;
    }

    // Clear any input errors when valid input is provided
    if (type === "Sain") {
      setInputErrors((prev) => ({ ...prev, good: false }));
    } else {
      setInputErrors((prev) => ({ ...prev, bad: false }));
    }

    const normalized = trimmed.trim().toLowerCase();
    const pool = type === "Sain" ? goodKeywords : badKeywords;
    const isDuplicate = pool.some(
      (k) => (k.tailbar || "").trim().toLowerCase() === normalized
    );
    if (isDuplicate) {
      showAlert(
        "warning",
        type === "Sain"
          ? "Энэ эерэг үг жагсаалтанд байна."
          : "Энэ сөрөг үг жагсаалтанд байна."
      );
      return;
    }
    const values = { tailbar: trimmed, turul: type };

    tulkhuurUgMutate(
      (current) => ({
        ...current,
        jagsaalt: [
          ...current.jagsaalt,
          { ...values, _id: Date.now().toString() },
        ],
      }),
      false
    );

    try {
      await createMethod("tulkhuurUg", token, values);
      tulkhuurUgMutate();
      if (type === "Sain") setNewGood("");
      if (type === "Muu") setNewBad("");
      showAlert(
        "success",
        type === "Sain"
          ? `Эерэг үг нэмэгдлээ: ${values.tailbar}`
          : `Сөрөг үг нэмэгдлээ: ${values.tailbar}`
      );
    } catch (err) {
      showAlert("error", `Нэмэхэд алдаа гарлаа: ${trimmed}`);
      tulkhuurUgMutate();
    }
  };

  const removeKeyword = (keyword) => {
    if (typeof keyword === "object" && keyword._id) {
      deleteMethod("tulkhuurUg", token, keyword._id)
        .then(() => {
          tulkhuurUgMutate();
          showAlert(
            "success",
            (keyword?.turul === "Sain" ? "Эерэг үг " : "Сөрөг үг ") +
              `устгалаа: ${keyword.tailbar}`
          );
        })
        .catch(() => {
          showAlert("error", `Устгахад алдаа гарлаа: ${keyword.tailbar || ""}`);
        });
    }
  };

  const toggleMark = async (keyword) => {
    if (typeof keyword === "object" && keyword._id) {
      const updatedKeyword = {
        ...keyword,
        ankhaarakhEsekh: !keyword.ankhaarakhEsekh,
      };

      tulkhuurUgMutate(
        (current) => ({
          ...current,
          jagsaalt: current.jagsaalt.map((k) =>
            k._id === keyword._id ? updatedKeyword : k
          ),
        }),
        false
      );

      try {
        await updateMethod("tulkhuurUg", token, updatedKeyword);
        tulkhuurUgMutate();
        showAlert(
          "success",
          `Түлхүүр үг анхаарах шаардлагатай ${
            updatedKeyword.ankhaarakhEsekh
              ? "тэмдэглэгдлээ"
              : "тэмдэглэлээс хасагдлаа"
          }: ${keyword.tailbar}`
        );
      } catch (err) {
        showAlert("error", `Шинэчлэхэд алдаа гарлаа: ${keyword.tailbar || ""}`);
        tulkhuurUgMutate();
      }
    }
  };

  const filteredGoodKeywords = useMemo(() => {
    let result = goodKeywords.filter((k) =>
      k.tailbar?.toLowerCase().includes(goodSearch.toLowerCase())
    );

    return result.sort((a, b) =>
      goodSort === "asc"
        ? a.tailbar.localeCompare(b.tailbar)
        : b.tailbar.localeCompare(a.tailbar)
    );
  }, [goodKeywords, goodSearch, goodSort]);

  const filteredBadKeywords = useMemo(() => {
    let result = badKeywords.filter((k) =>
      k.tailbar?.toLowerCase().includes(badSearch.toLowerCase())
    );

    if (showOnlyMarked) {
      result = result.filter((k) => k.ankhaarakhEsekh === true);
    }

    return result.sort((a, b) =>
      badSort === "asc"
        ? a.tailbar.localeCompare(b.tailbar)
        : b.tailbar.localeCompare(a.tailbar)
    );
  }, [badKeywords, badSearch, badSort, showOnlyMarked]);

  const allKeywords = [...goodKeywords, ...badKeywords];
  const escapedKeywords = allKeywords
    .map((k) =>
      k.tailbar ? k.tailbar.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : ""
    )
    .filter(Boolean);
  const regex =
    escapedKeywords.length > 0
      ? new RegExp(`\\b(${escapedKeywords.join("|")})\\b`, "gi")
      : null;
  const parts = regex && text ? text.split(regex) : [text];

  return (
    <div className="p-4 mx-auto max-w-5xl bg-white rounded-xl border border-gray-200 shadow-lg md:p-8 dark:bg-gray-900 dark:border-gray-700">
      <AnimatePresence>
        {alertState.type && (
          <div
            className="fixed top-4 right-4 z-50 w-full max-w-sm pointer-events-none"
            aria-live="polite"
            aria-atomic="true"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className={`pointer-events-auto shadow-md px-4 py-3 rounded-md flex items-start justify-between ${
                alertState.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : alertState.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-yellow-50 text-yellow-800 border border-yellow-200"
              }`}
              role="status"
            >
              <span className="pr-4">{alertState.message}</span>
              <button
                className="text-current shrink-0"
                onClick={() => setAlertState({ type: null, message: "" })}
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl text-gray-800 md:text-3xl dark:text-gray-100">
          Түлхүүр Үгийн Удирдлага
        </h1>
        <button
          onClick={() => setShowOnlyMarked(!showOnlyMarked)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            showOnlyMarked
              ? "text-white bg-blue-600 hover:bg-blue-700"
              : "text-gray-700 bg-gray-200 hover:bg-gray-300"
          }`}
          title={
            showOnlyMarked
              ? "Бүх сөрөг түлхүүр үг харуулах"
              : "Зөвхөн тэмдэглэгдсэн сөрөг түлхүүр үг харуулах"
          }
        >
          <Filter className="w-4 h-4" />
          {showOnlyMarked ? "Бүгдийг харуулах" : "Анхааруулах"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 md:gap-6 md:mb-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder={translations.goodPlaceholder}
              value={newGood}
              onChange={(e) => {
                setNewGood(e.target.value);
                // Clear error when user starts typing
                if (inputErrors.good) {
                  setInputErrors((prev) => ({ ...prev, good: false }));
                }
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && addKeyword(newGood.trim(), "Sain")
              }
              className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg text-sm transition-colors duration-200 ${
                inputErrors.good
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
              }`}
            />
            <Plus className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 -translate-y-1/2" />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addKeyword(newGood.trim(), "Sain")}
            className="w-full px-4 py-2 md:py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200 min-h-[40px] md:min-h-[44px] touch-manipulation"
            style={{ minHeight: "40px" }}
            aria-label={`${translations.addButton} эерэг түлхүүр үг`}
          >
            <span className="flex gap-2 justify-center items-center">
              <Plus className="w-4 h-4" />
              {translations.addButton}
            </span>
          </motion.button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder={translations.badPlaceholder}
              value={newBad}
              onChange={(e) => {
                setNewBad(e.target.value);
                // Clear error when user starts typing
                if (inputErrors.bad) {
                  setInputErrors((prev) => ({ ...prev, bad: false }));
                }
              }}
              onKeyDown={(e) =>
                e.key === "Enter" && addKeyword(newBad.trim(), "Muu")
              }
              className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg text-sm transition-colors duration-200 ${
                inputErrors.bad
                  ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-red-500 focus:ring-red-200"
              }`}
            />
            <Plus className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 -translate-y-1/2" />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addKeyword(newBad.trim(), "Muu")}
            className="w-full px-4 py-2 md:py-3 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 min-h-[40px] md:min-h-[44px] touch-manipulation"
            style={{ minHeight: "40px" }}
            aria-label={`${translations.addButton} сөрөг түлхүүр үг`}
          >
            <span className="flex gap-2 justify-center items-center">
              <Plus className="w-4 h-4" />
              {translations.addButton}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
        {/* Good */}
        <div className="p-4 rounded-lg border md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">
              {translations.goodKeywordsTitle}{" "}
              <span className="text-base text-gray-500">
                ({goodKeywords.length})
              </span>
            </h2>
            <button
              className="px-2 md:px-3 py-2 border rounded-md text-sm flex items-center gap-1 touch-manipulation min-h-[40px] md:min-h-[44px]"
              onClick={() => setGoodSort((p) => (p === "asc" ? "desc" : "asc"))}
              title={
                goodSort === "asc"
                  ? translations.sortAsc
                  : translations.sortDesc
              }
              aria-label={
                goodSort === "asc"
                  ? translations.sortAsc
                  : translations.sortDesc
              }
            >
              {goodSort === "asc" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder={translations.searchPlaceholder}
            value={goodSearch}
            onChange={(e) => setGoodSearch(e.target.value)}
            className="p-2 mb-4 w-full text-sm rounded-lg border"
          />
          <AnimatePresence>
            {filteredGoodKeywords.length > 0 ? (
              <ul className="overflow-y-auto space-y-2 max-h-96">
                {filteredGoodKeywords.map((keyword) => (
                  <motion.li
                    key={keyword._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-between items-center p-2 bg-green-50 rounded-lg"
                  >
                    <span className="flex-1">{keyword.tailbar}</span>
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="p-1 -m-1 md:p-2 md:-m-2 touch-manipulation"
                      aria-label={`${keyword.tailbar} устгах`}
                    >
                      <X className="w-4 h-4 text-green-600" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                {translations.noKeywords}
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Bad Keywords - Fixed positioning */}
        <div className="p-4 rounded-lg border md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">
              {translations.badKeywordsTitle}{" "}
              <span className="text-base text-gray-500">
                (
                {showOnlyMarked
                  ? filteredBadKeywords.length
                  : badKeywords.length}
                ){showOnlyMarked && ` / ${badKeywords.length}`}
              </span>
            </h2>
            <button
              className="px-2 md:px-3 py-2 border rounded-md text-sm flex items-center gap-1 touch-manipulation min-h-[40px] md:min-h-[44px]"
              onClick={() => setBadSort((p) => (p === "asc" ? "desc" : "asc"))}
              title={
                badSort === "asc" ? translations.sortAsc : translations.sortDesc
              }
              aria-label={
                badSort === "asc" ? translations.sortAsc : translations.sortDesc
              }
            >
              {badSort === "asc" ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder={translations.searchPlaceholder}
            value={badSearch}
            onChange={(e) => setBadSearch(e.target.value)}
            className="p-2 mb-4 w-full text-sm rounded-lg border"
          />
          <AnimatePresence>
            {filteredBadKeywords.length > 0 ? (
              <div className="space-y-2 max-h-96">
                {filteredBadKeywords.map((keyword) => (
                  <motion.div
                    key={keyword._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-between items-center p-2 bg-red-50 rounded-lg gap-3"
                  >
                    <span className="flex-1">{keyword.tailbar}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle Switch */}
                      <div className="group relative">
                        <button
                          onClick={() => toggleMark(keyword)}
                          className="p-1 touch-manipulation"
                          aria-label={`${
                            keyword.ankhaarakhEsekh
                              ? "Анхааруулах үгнээс хасах"
                              : "Анхааруулах үгэнд нэмэх"
                          }: ${keyword.tailbar}`}
                        >
                          <div className="relative w-8 h-4">
                            <div
                              className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                                keyword.ankhaarakhEsekh
                                  ? "bg-blue-600"
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                                  keyword.ankhaarakhEsekh
                                    ? "translate-x-4"
                                    : "translate-x-0.5"
                                }`}
                              />
                            </div>
                          </div>
                        </button>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          Анхааруулах үгэнд оруулах
                        </div>
                      </div>
                      {/* Delete Button */}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="p-1 touch-manipulation"
                        aria-label={`${keyword.tailbar} устгах`}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                {translations.noKeywords}
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default KeywordCollector;
