"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import Nav from "@/components/Nav";
import { Button } from "antd";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useAnalyticsModals } from "@/hooks/useAnalyticsModals";
import { useAnalyticsProcessing } from "@/hooks/useAnalyticsProcessing";
import { useTokhirgoo } from "@/hook/useTokhirgoo";
import AnalyticsFilters from "@/components/analytics/AnalyticsFilters";
import ProgressCards from "@/components/analytics/ProgressCards";
import ChartsSection from "@/components/analytics/ChartsSection";
import EmployeeCards from "@/components/analytics/EmployeeCards";
import CommentsSidebar from "@/components/analytics/CommentsSidebar";
import EmployeeModal from "@/components/analytics/EmployeeModal";
import AttentionModal from "@/components/analytics/AttentionModal";
import {
  FilePdfOutlined,
  PrinterOutlined,
  FileTextOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import dynamic from "next/dynamic";
import moment from "moment";
import { socket } from "@/services/uilchilgee";

const GeneratePDF = dynamic(() => import("@/components/modal/PdfTatakh"), {
  ssr: false,
});

const Analytic = () => {
  // Use custom hooks for data management
  const analyticsData = useAnalyticsData();
  const modals = useAnalyticsModals();
  const { msgTokhirgoo: onooTokhirgoo } = useTokhirgoo(analyticsData.token, "onooTokhirgoo");
  const processing = useAnalyticsProcessing(
    analyticsData.khariultGaralt,
    analyticsData.tulkhuurUgGaralt,
    analyticsData.apiChartData,
    analyticsData.token,
    analyticsData.dateRange,
    onooTokhirgoo
  );

  // Socket connection for real-time updates
  useEffect(() => {
    socket().on("sudalgaaBugluw", (a) => {
      analyticsData.khariultGaralt.mutate();
    });
    return () => {
      socket().off("sudalgaaBugluw");
    };
  }, []);

  // Department hierarchy functions
  const getDepartmentsByLevel = useCallback((dedKhesguud, level = 0) => {
    const levels = {};

    function traverse(items, currentLevel, parentPath = []) {
      if (!levels[currentLevel]) levels[currentLevel] = [];

      items.forEach((item) => {
        const itemWithPath = {
          ...item,
          level: currentLevel,
          parentPath: [...parentPath],
          fullPath: [...parentPath, item.ner].join(" / "),
        };

        levels[currentLevel].push(itemWithPath);

        if (item.dedKhesguud && item.dedKhesguud.length > 0) {
          traverse(item.dedKhesguud, currentLevel + 1, [
            ...parentPath,
            item.ner,
          ]);
        }
      });
    }

    traverse(dedKhesguud, level);
    return levels;
  }, []);

  // Update department levels when selectedZardal changes
  useEffect(() => {
    if (modals.selectedZardal && modals.selectedZardal.dedKhesguud) {
      const levels = getDepartmentsByLevel(modals.selectedZardal.dedKhesguud);
      modals.setDepartmentLevels(levels);
      modals.setSelectedDepartments({});
    } else {
      modals.setDepartmentLevels({});
      modals.setSelectedDepartments({});
    }
  }, [modals.selectedZardal, getDepartmentsByLevel]);

  // Function to handle department selection at any level
  const handleDepartmentSelect = useCallback(
    (level, value) => {
      const newSelections = {};

      for (let i = 0; i <= level; i++) {
        if (i < level) {
          newSelections[i] = modals.selectedDepartments[i];
        } else {
          newSelections[i] = value;
        }
      }

      modals.setSelectedDepartments(newSelections);
    },
    [modals.selectedDepartments]
  );

  // Function to get available options for a specific level
  const getAvailableOptionsForLevel = useCallback(
    (level) => {
      if (level === 0) {
        return modals.departmentLevels[0] || [];
      }

      const parentSelection = modals.selectedDepartments[level - 1];
      if (!parentSelection) return [];

      // Build the selected path directly here to avoid circular dependency
      const path = [];
      for (let i = 0; i < level; i++) {
        if (modals.selectedDepartments[i]) {
          const levelOptions =
            i === 0 ? modals.departmentLevels[0] : modals.departmentLevels[i];
          const selected = levelOptions?.find(
            (opt) => opt.ner === modals.selectedDepartments[i]
          );
          if (selected) {
            path.push(selected.ner);
          }
        }
      }
      const selectedParentPath = path.join(" / ");

      return (modals.departmentLevels[level] || []).filter((item) => {
        const expectedParentPath = item.parentPath.join(" / ");
        return expectedParentPath === selectedParentPath;
      });
    },
    [modals.departmentLevels, modals.selectedDepartments]
  );

  // Function to get the selected path up to a certain level
  const getSelectedPath = useCallback(
    (maxLevel) => {
      const path = [];
      for (let i = 0; i <= maxLevel; i++) {
        if (modals.selectedDepartments[i]) {
          const levelOptions = modals.departmentLevels[i] || [];
          const selected = levelOptions.find(
            (opt) => opt.ner === modals.selectedDepartments[i]
          );
          if (selected) {
            path.push(selected.ner);
          }
        }
      }
      return path.join(" / ");
    },
    [modals.selectedDepartments, modals.departmentLevels]
  );

  const maxLevel = Math.max(
    ...Object.keys(modals.departmentLevels).map(Number),
    -1
  );
  const totalEmployees = analyticsData.ajiltanGaralt?.niitToo || 1;

  const leastSuggestionsCount = processing.getFilteredDataByMainDateRange(
    analyticsData.apiChartData.ajiltanSanal || []
  ).length;

  const mostSuggestionsCount = processing.getFilteredDataByMainDateRange(
    analyticsData.apiChartData.ajiltanSanalHighest || []
  ).length;
  const attentionNeededWordCount = processing.progressData.negativeWordCount;
  const totalSurveysInSystem = processing.progressData.totalSurveysCount || 1;
  const totalWordsAnalyzed = processing.progressData.totalWordCount || 1;

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: landscape;
        margin: 0;
      }
    `,
  });


  const showEmployeeDialogWithData = useCallback(
    (type) => {
      modals.showEmployeeDialog(type, analyticsData.apiChartData);
    },
    [modals.showEmployeeDialog, analyticsData.apiChartData]
  );

  return (
    <Nav>
      <style jsx>{`
        @keyframes slowPulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .drawer-toggle {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .drawer-toggle:focus,
        .drawer-toggle:active,
        .drawer-toggle:hover {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
      <div className="flex justify-center items-center lg:pr-[295px] relative">
        <button
          onClick={modals.toggleSidebar}
          className="fixed top-6 right-1 z-[1001] flex items-center justify-center w-16 h-16 drawer-toggle lg:hidden focus:outline-none focus:ring-0 border-0"
        >
          {modals.sidebarOpen ? (
            <CloseOutlined className="flex items-center justify-center w-12 h-12 text-gray-700" />
          ) : (
            <FileTextOutlined className="flex items-center justify-center w-24 h-24 text-gray-700" />
          )}
        </button>

        <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4 lg:gap-8 lg:p-0">
          <div className="flex flex-col lg:flex-row justify-between w-90vw lg:w-full gap-4 [@media(min-width:1024px)_and_(max-width:1280px)]:justify-center">
            <AnalyticsFilters
              ognoo={analyticsData.ognoo}
              onChangeOgnoo={analyticsData.onChangeOgnoo}
              zardalGaralt={analyticsData.zardalGaralt}
              selectedZardal={modals.selectedZardal}
              setSelectedZardal={modals.setSelectedZardal}
              setZardalKhuudaslalt={analyticsData.setZardalKhuudaslalt}
              ajiltanGaralt={analyticsData.ajiltanGaralt}
              selectedDepartments={modals.selectedDepartments}
              setSelectedDepartments={modals.setSelectedDepartments}
              departmentLevels={modals.departmentLevels}
              getAvailableOptionsForLevel={getAvailableOptionsForLevel}
              handleDepartmentSelect={handleDepartmentSelect}
              maxLevel={maxLevel}
            />

            <div className="items-start justify-start flex-shrink-0 hidden gap-2 md:flex">
              <Button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 text-xs bg-white lg:text-sm"
                size="small"
              >
                <PrinterOutlined />
                <span className="hidden sm:inline">Хэвлэх</span>
              </Button>
              <Button
                onClick={modals.showModal}
                className="flex items-center justify-center gap-2 text-xs bg-white lg:text-sm"
                size="small"
              >
                <FilePdfOutlined />
                <span className="hidden sm:inline">PDF</span>
              </Button>
              <GeneratePDF
                title="PDF харах"
                open={modals.isModalOpen}
                onCancel={modals.handleCancel}
                cancelText="Хаах"
                htmlRef={printRef}
              />
            </div>
          </div>

          <div
            ref={printRef}
            className="flex flex-col items-center justify-center w-full h-full print:mt-2"
          >
            <div className="items-center justify-between hidden w-full print:flex print:px-4">
              {analyticsData.ognoo ? (
                <span>
                  Тайлангийн огноо:{" "}
                  {moment(analyticsData.ognoo[0]).format("YYYY/MM/DD")}
                  {" - "}
                  {moment(analyticsData.ognoo[1]).format("YYYY/MM/DD")}
                </span>
              ) : (
                <span>График тайлан</span>
              )}
              <span>Огноо: {new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex flex-col items-center justify-center w-[90vw] lg:w-full h-full gap-4 lg:gap-8 print:border-2 print:border-dashed print:p-4">
              <ProgressCards
                progressData={processing.progressData}
                selectedOption={analyticsData.selectedOption}
              />

              <ChartsSection
                lineGraphicTailan={analyticsData.lineGraphicTailan}
                graphicTailan={analyticsData.graphicTailan}
                selectedOption={analyticsData.selectedOption}
                rawSurveyData={processing.getFilteredDataByMainDateRange(analyticsData.khariultGaralt?.jagsaalt || [])}
                dateRange={analyticsData.dateRange}
              />

              <EmployeeCards
                leastSuggestionsCount={leastSuggestionsCount}
                mostSuggestionsCount={mostSuggestionsCount}
                attentionNeededWordCount={attentionNeededWordCount}
                totalEmployees={totalEmployees}
                totalSurveysInSystem={totalSurveysInSystem}
                totalWordsAnalyzed={totalWordsAnalyzed}
                attentionComments={processing.attentionComments}
                getFilteredDataByMainDateRange={
                  processing.getFilteredDataByMainDateRange
                }
                showEmployeeDialog={showEmployeeDialogWithData}
                showAttentionModal={modals.showAttentionModal}
              />
            </div>
          </div>
        </div>

        <CommentsSidebar
          sidebarOpen={modals.sidebarOpen}
          toggleSidebar={modals.toggleSidebar}
          commentFilter={processing.commentFilter}
          setCommentFilter={processing.setCommentFilter}
          khariultGaralt={analyticsData.khariultGaralt}
          filteredRecentComments={processing.filteredRecentComments}
          renderHighlighted={processing.renderHighlighted}
          renderCommentWithScore={processing.renderCommentWithScore}
        />
      </div>

      <EmployeeModal
        employeeDialogOpen={modals.employeeDialogOpen}
        handleEmployeeDialogCancel={modals.handleEmployeeDialogCancel}
        dialogTitle={modals.dialogTitle}
        selectedEmployeeData={modals.selectedEmployeeData}
        getFilteredDataByMainDateRange={
          processing.getFilteredDataByMainDateRange
        }
      />

      <AttentionModal
        attentionModalOpen={modals.attentionModalOpen}
        handleAttentionModalCancel={modals.handleAttentionModalCancel}
        attentionComments={processing.attentionComments}
        getFilteredDataByMainDateRange={
          processing.getFilteredDataByMainDateRange
        }
        renderHighlighted={processing.renderHighlighted}
      />
    </Nav>
  );
};

export default Analytic;
