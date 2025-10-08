import { useState, useEffect, useMemo, useCallback } from "react";
import uilchilgee from "@/services/uilchilgee";

export const useAnalyticsProcessing = (
  khariultGaralt,
  tulkhuurUgGaralt,
  apiChartData,
  token,
  dateRange,
  onooTokhirgoo
) => {
  const [progressData, setProgressData] = useState({
    progress1: [0, 0],
    progress2: [0, 0],
    progress3: [0, 0],
    progress4: [0, 0],
  });

  const [topEmployees, setTopEmployees] = useState([]);
  const [mostSurveys, setMostSurveys] = useState(1);

  const [attentionComments, setAttentionComments] = useState([]);
  const [commentFilter, setCommentFilter] = useState("all");

  const getFilteredDataByMainDateRange = useCallback(
    (data) => {
      if (!dateRange || !Array.isArray(data)) {
        return data;
      }

      const [startDate, endDate] = dateRange;
      const filtered = data.filter((item) => {
        const itemDate = item.ognoo || item.createdAt || item.updatedAt;
        if (!itemDate) return true;

        const dataDate = new Date(itemDate).toISOString().split("T")[0];

        return dataDate >= startDate && dataDate <= endDate;
      });

      return filtered;
    },
    [dateRange]
  );

  const loadAttentionComments = useCallback(async () => {
    const markedKeywords = (tulkhuurUgGaralt?.jagsaalt || []).filter(
      (k) => k.ankhaarakhEsekh === true
    );

    if (markedKeywords.length === 0) {
      setAttentionComments([]);
      return;
    }

    const markedKeywordTexts = markedKeywords
      .map((k) =>
        (k.tailbar || "").trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      )
      .filter(Boolean);

    const markedRegex =
      markedKeywordTexts.length > 0
        ? new RegExp(`(${markedKeywordTexts.join("|")})`, "gi")
        : null;

    try {
      const allComments = khariultGaralt?.jagsaalt || [];

      const dateFilteredComments = getFilteredDataByMainDateRange(allComments);

      const commentsWithMarkedKeywords = dateFilteredComments.filter(
        (comment) => {
          if (!comment.tailbar || !markedRegex) return false;
          const hasMatch = markedRegex.test(comment.tailbar);
          return hasMatch;
        }
      );

      setAttentionComments(commentsWithMarkedKeywords);
    } catch (error) {
      setAttentionComments([]);
    }
  }, [
    tulkhuurUgGaralt?.jagsaalt,
    khariultGaralt?.jagsaalt,
    dateRange,
    getFilteredDataByMainDateRange,
  ]);

  const goodKeywords = useMemo(
    () => (tulkhuurUgGaralt?.jagsaalt || []).filter((k) => k.turul === "Sain"),
    [tulkhuurUgGaralt?.jagsaalt]
  );

  const badKeywords = useMemo(
    () => (tulkhuurUgGaralt?.jagsaalt || []).filter((k) => k.turul === "Muu"),
    [tulkhuurUgGaralt?.jagsaalt]
  );

  const { regexAll, lowerToType } = useMemo(() => {
    const all = [...goodKeywords, ...badKeywords]
      .map((k) => (k.tailbar || "").trim())
      .filter(Boolean);
    const unique = Array.from(new Set(all)).sort((a, b) => b.length - a.length);
    const escaped = unique.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const map = new Map();
    goodKeywords.forEach((k) =>
      map.set((k.tailbar || "").trim().toLowerCase(), "Sain")
    );
    badKeywords.forEach((k) =>
      map.set((k.tailbar || "").trim().toLowerCase(), "Muu")
    );
    const pattern = escaped.length
      ? `(?<![\\p{L}\\p{N}])(${escaped.join("|")})(?![\\p{L}\\p{N}])`
      : null;
    return {
      regexAll: pattern ? new RegExp(pattern, "giu") : null,
      lowerToType: map,
    };
  }, [goodKeywords, badKeywords]);

  const renderHighlighted = (text, comment = null) => {
    if (!text || !regexAll) return text;
    const parts = text.split(regexAll);
    return parts.map((part, idx) => {
      const key = `${part}-${idx}`;
      const type = lowerToType.get((part || "").toLowerCase());
      if (type === "Sain") {
        return (
          <span key={key} className="px-1 text-green-800 bg-green-100 rounded">
            {part}
          </span>
        );
      }
      if (type === "Muu") {
        return (
          <span key={key} className="px-1 text-red-800 bg-red-100 rounded">
            {part}
          </span>
        );
      }
      return <span key={key}>{part}</span>;
    });
  };

  const calculateScoreFromResponses = (comment) => {
    if (!comment?.khariultuud || !Array.isArray(comment.khariultuud)) return 0;

    let totalScore = 0;
    comment.khariultuud.forEach(({ khariult }) => {
      if (khariult && typeof khariult === "string") {
        const match = khariult.match(/(\d+)/);
        if (match) {
          const score = parseInt(match[1], 10);
          if (score >= 1 && score <= 5) {
            totalScore += score;
          }
        }
      }
    });
    return totalScore;
  };

  const hasPositiveScore = (comment) => {
    const storedScore = comment?.onoo;
    const calculatedScore = calculateScoreFromResponses(comment);
    const score = storedScore || calculatedScore;
    if (!score || !onooTokhirgoo?.surugBosgo) return false;
    return score > onooTokhirgoo.surugBosgo;
  };

  const hasNegativeScore = (comment) => {
    const storedScore = comment?.onoo;
    const calculatedScore = calculateScoreFromResponses(comment);
    const score = storedScore || calculatedScore;
    if (!score || !onooTokhirgoo?.surugBosgo) return false;
    return score <= onooTokhirgoo.surugBosgo;
  };

  const renderCommentWithScore = (comment) => {
    const text = comment?.tailbar || "";
    const storedScore = comment?.onoo;
    const calculatedScore = calculateScoreFromResponses(comment);
    const score = storedScore || calculatedScore;
    const isPositiveScore = hasPositiveScore(comment);
    const isNegativeScore = hasNegativeScore(comment);


    return (
      <div>
        {text && renderHighlighted(text, comment)}
        {score > 0 && (
          <div className="mt-1">
            <span
              className={`text-xs px-1 rounded ${
                isPositiveScore
                  ? "text-green-800 bg-green-100"
                  : isNegativeScore
                  ? "text-red-800 bg-red-100"
                  : "text-gray-600 bg-gray-100"
              }`}
            >
              Оноо: {score}
            </span>
           
           
          </div>
        )}
      </div>
    );
  };

  const filteredRecentComments = useMemo(() => {
    const items = khariultGaralt?.jagsaalt || [];

    const dateFilteredItems = getFilteredDataByMainDateRange(items);

    const hasPositiveScore = (comment) => {
      if (!comment.onoo || !onooTokhirgoo?.eyregBosgo) return false;
      return comment.onoo >= onooTokhirgoo.eyregBosgo;
    };

    const hasNegativeScore = (comment) => {
      if (!comment.onoo || !onooTokhirgoo?.surugBosgo) return false;
      return comment.onoo <= onooTokhirgoo.surugBosgo;
    };

    const hasPositiveKeywords = (comment) => {
      const text = comment?.tailbar || "";
      if (!text || !regexAll) return false;

      for (const m of text.matchAll(regexAll)) {
        const token = (m[0] || "").toLowerCase();
        const t = lowerToType.get(token);
        if (t === "Sain") return true;
      }
      return false;
    };

    const hasNegativeKeywords = (comment) => {
      const text = comment?.tailbar || "";
      if (!text || !regexAll) return false;

      for (const m of text.matchAll(regexAll)) {
        const token = (m[0] || "").toLowerCase();
        const t = lowerToType.get(token);
        if (t === "Muu") return true;
      }
      return false;
    };

    if (commentFilter === "all") {
      return dateFilteredItems.filter((a) => {
        const text = a?.tailbar || "";
        const storedScore = a?.onoo;
        const calculatedScore = calculateScoreFromResponses(a);
        const score = storedScore || calculatedScore;

        const isPositiveScore =
          score > 0 &&
          onooTokhirgoo?.surugBosgo &&
          score > onooTokhirgoo.surugBosgo;
        const isNegativeScore =
          score > 0 &&
          onooTokhirgoo?.surugBosgo &&
          score <= onooTokhirgoo.surugBosgo;

        const isSurugEsekh = a?.surugEsekh === true;

        if (!text) {
          return !isPositiveScore && !isNegativeScore && !isSurugEsekh;
        }

        let hasGood = false;
        let hasBad = false;
        for (const m of text.matchAll(regexAll)) {
          const token = (m[0] || "").toLowerCase();
          const t = lowerToType.get(token);
          if (t === "Sain") hasGood = true;
          if (t === "Muu") hasBad = true;
          if (hasGood || hasBad) break;
        }

        return !hasGood && !hasBad && !isPositiveScore && !isNegativeScore && !isSurugEsekh;
      });
    }

    if (commentFilter === "good") {
      return dateFilteredItems.filter((a) => {
        const text = a?.tailbar || "";
        const storedScore = a?.onoo;
        const calculatedScore = calculateScoreFromResponses(a);
        const score = storedScore || calculatedScore;

        const isPositiveScore =
          score > 0 &&
          onooTokhirgoo?.surugBosgo &&
          score > onooTokhirgoo.surugBosgo;

        let hasGood = false;
        let hasBad = false;
        if (text && regexAll) {
          for (const m of text.matchAll(regexAll)) {
            const token = (m[0] || "").toLowerCase();
            const t = lowerToType.get(token);
            if (t === "Sain") {
              hasGood = true;
            }
            if (t === "Muu") {
              hasBad = true;
            }
          }
        }

        if (hasBad) {
          return false; // Exclude any comment with negative keywords
        }
        
        return hasGood || isPositiveScore;
      });
    }

    if (commentFilter === "bad") {
      return dateFilteredItems.filter((a) => {
        const text = a?.tailbar || "";
        const storedScore = a?.onoo;
        const calculatedScore = calculateScoreFromResponses(a);
        const score = storedScore || calculatedScore;

        const isNegativeScore =
          score > 0 &&
          onooTokhirgoo?.surugBosgo &&
          score <= onooTokhirgoo.surugBosgo;

        const isSurugEsekh = a?.surugEsekh === true;

        let hasBad = false;
        if (text && regexAll) {
          for (const m of text.matchAll(regexAll)) {
            const token = (m[0] || "").toLowerCase();
            const t = lowerToType.get(token);
            if (t === "Muu") {
              hasBad = true;
              break;
            }
          }
        }

        return hasBad || isNegativeScore || isSurugEsekh;
      });
    }

    return dateFilteredItems;
  }, [
    khariultGaralt?.jagsaalt,
    commentFilter,
    regexAll,
    lowerToType,
    getFilteredDataByMainDateRange,
    onooTokhirgoo,
  ]);

  useEffect(() => {
    if (khariultGaralt?.jagsaalt) {
      const data = khariultGaralt.jagsaalt;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const currentMonthData = data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        );
      });

      const previousMonthData = data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === previousMonth &&
          itemDate.getFullYear() === previousYear
        );
      });

      const calculateAverageScore = (monthData) => {
        if (monthData.length === 0) return 0;

        let totalScore = 0;
        let totalQuestions = 0;

        monthData.forEach((item) => {
          if (item.khariultuud && Array.isArray(item.khariultuud)) {
            item.khariultuud.forEach((q) => {
              const score = parseInt(q.khariult);
              if (!isNaN(score) && score >= 1 && score <= 5) {
                totalScore += score;
                totalQuestions++;
              }
            });
          }
        });

        return totalQuestions > 0 ? totalScore / totalQuestions : 0;
      };

      const currentMonthAvg = calculateAverageScore(currentMonthData);
      const previousMonthAvg = calculateAverageScore(previousMonthData);

      const calculateWordCounts = (monthData) => {
        let positiveCount = 0;
        let negativeCount = 0;

        monthData.forEach((item) => {
          if (item.tailbar) {
            const text = item.tailbar.toLowerCase();
            if (
              text.includes("сайн") ||
              text.includes("сайхан") ||
              text.includes("маш сайн")
            ) {
              positiveCount++;
            }
            if (
              text.includes("муу") ||
              text.includes("муухан") ||
              text.includes("сайн биш")
            ) {
              negativeCount++;
            }
          }
        });

        return { positiveCount, negativeCount };
      };

      const currentWordCounts = calculateWordCounts(currentMonthData);
      const previousWordCounts = calculateWordCounts(previousMonthData);

      const employeeSurveyCounts = {};
      data.forEach((item) => {
        if (item.ajiltan && item.ajiltan._id) {
          const employeeId = item.ajiltan._id;
          if (!employeeSurveyCounts[employeeId]) {
            employeeSurveyCounts[employeeId] = {
              count: 0,
              name: `${item.ajiltan.ovog?.[0] || ""}.${item.ajiltan.ner || ""}`,
              totalScore: 0,
              questionCount: 0,
            };
          }
          employeeSurveyCounts[employeeId].count++;

          if (item.khariultuud && Array.isArray(item.khariultuud)) {
            item.khariultuud.forEach((q) => {
              const score = parseInt(q.khariult);
              if (!isNaN(score) && score >= 1 && score <= 5) {
                employeeSurveyCounts[employeeId].totalScore += score;
                employeeSurveyCounts[employeeId].questionCount++;
              }
            });
          }
        }
      });

      const employeeArray = Object.values(employeeSurveyCounts);
      const sortedByCount = employeeArray.sort((a, b) => a.count - b.count);
      const sortedByScore = employeeArray.sort(
        (a, b) =>
          b.totalScore / b.questionCount - a.totalScore / a.questionCount
      );

      const leastSurveys = sortedByCount[0]?.count || 0;
      const mostSurveysValue =
        sortedByCount[sortedByCount.length - 1]?.count || 0;

      const topEmployeesData = employeeArray
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((emp, index) => ({
          ...emp,
          rank: index + 1,
          averageScore:
            emp.questionCount > 0
              ? (emp.totalScore / emp.questionCount).toFixed(1)
              : 0,
        }));

      setTopEmployees(topEmployeesData);
      setMostSurveys(mostSurveysValue);

      setProgressData({
        progress1: [apiChartData.umnukhNiit || 0, apiChartData.umnukhNiit || 0],
        progress2: [apiChartData.odooNiit || 0, apiChartData.odooNiit || 0],
        progress3: [apiChartData.surug || 0, apiChartData.surug || 0],
        progress4: [apiChartData.eyreg || 0, apiChartData.eyreg || 0],
      });
    }
  }, [khariultGaralt?.jagsaalt, apiChartData]);

  useEffect(() => {
    if (tulkhuurUgGaralt?.jagsaalt && token && khariultGaralt?.jagsaalt) {
      loadAttentionComments();
    }
  }, [loadAttentionComments, token]);

  return {
    progressData,
    topEmployees,
    mostSurveys,
    attentionComments,
    commentFilter,
    setCommentFilter,
    getFilteredDataByMainDateRange,
    renderHighlighted,
    renderCommentWithScore,
    filteredRecentComments,
  };
};
