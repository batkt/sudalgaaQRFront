"use client";

import { memo, useState, useEffect } from "react";
import { Modal, Table } from "antd";

const EmployeeModal = memo(
  ({
    employeeDialogOpen,
    handleEmployeeDialogCancel,
    dialogTitle,
    selectedEmployeeData,
    getFilteredDataByMainDateRange,
  }) => {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      if (employeeDialogOpen) {
        setCurrentPage(1);
      }
    }, [employeeDialogOpen]);
    return (
      <Modal
        title={
          <div className="flex items-center justify-between w-full py-1 px-2">
            <span className="text-lg font-semibold text-gray-800">
              {dialogTitle} (
              {getFilteredDataByMainDateRange(selectedEmployeeData).length})
            </span>
            <button
              onClick={handleEmployeeDialogCancel}
              className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        }
        open={employeeDialogOpen}
        closable={false}
        footer={
          <div className="flex justify-end p-4 border-t border-gray-200 bg-white sticky bottom-0 z-10">
            <button
              onClick={handleEmployeeDialogCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Хаах
            </button>
          </div>
        }
        width={1200}
        height={600}
        className="analytics-employee-dialog"
        styles={{
          body: {
            height: "500px",
            padding: "16px",
            backgroundColor: "#ffffff",
            overflowY: "hidden",
          },
          header: {
            backgroundColor: "#f8fafc",
            borderBottom: "2px solid #e2e8f0",
            borderRadius: "12px 12px 0 0",
          },
        }}
      >
        <div className="bg-white rounded-lg">
          <Table
            dataSource={getFilteredDataByMainDateRange(selectedEmployeeData)}
            rowKey="_id"
            pagination={{
              current: currentPage,
              pageSize: 20,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
              className: "analytics-pagination",
              onChange: (page) => setCurrentPage(page),
            }}
            size="middle"
            className="analytics-employee-table"
            scroll={{ y: 400 }}
            columns={[
              {
                title: (
                  <span className="font-semibold text-center text-gray-700">
                    №
                  </span>
                ),
                key: "index",
                width: 50,
                 render: (_, __, index) => (
                   <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-black">
                     {(currentPage - 1) * 20 + index + 1}
                   </div>
                 ),
              },
              {
                title: (
                  <span className="font-semibold text-center text-gray-700">
                    Нэр
                  </span>
                ),
                key: "name",
                width: 180,
                render: (_, record) => (
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {record.ajiltan?.ovog?.[0] || ""}.
                      {record.ajiltan?.ner || ""}
                    </span>
                    <span className="text-gray-500">
                      {record.ajiltan?.register || ""}
                    </span>
                  </div>
                ),
              },
              {
                title: (
                  <span className="font-semibold text-center text-gray-700">
                    Албан тушаал
                  </span>
                ),
                dataIndex: ["ajiltan", "tsol"],
                key: "tsol",
                width: 160,
                render: (text) => (
                  <span className="text-sm text-gray-600 analytics-text-clamp-2">
                    {text || "-"}
                  </span>
                ),
              },
              {
                title: (
                  <span className="font-semibold text-center text-gray-700">
                    Тасаг/Хэлтэс
                  </span>
                ),
                key: "department",
                width: 200,
                render: (_, record) => (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 analytics-text-clamp-1">
                      {record.ajiltan?.tasag || "-"}
                    </span>
                    {record.ajiltan?.kheltes && (
                      <span className="text-xs text-gray-400">
                        {record.ajiltan.kheltes}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                title: (
                  <span className="items-center font-semibold text-center text-gray-700">
                    Утас
                  </span>
                ),
                dataIndex: ["ajiltan", "utas"],
                key: "utas",
                width: 120,
                render: (text) => (
                  <span className="text-sm text-center text-gray-600">
                    {text || "-"}
                  </span>
                ),
              },
              {
                title: (
                  <span className="font-semibold text-center text-gray-700">
                    Санал тоо
                  </span>
                ),
                dataIndex: "surveyCount",
                key: "surveyCount",
                width: 100,
                sorter: (a, b) => a.surveyCount - b.surveyCount,
                defaultSortOrder: "descend",
                render: (count) => (
                  <div className="flex items-center justify-center">
                    <div className="flex items-center justify-center text-sm text-black shadow-sm">
                      {count}
                    </div>
                  </div>
                ),
              },
            ]}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }
          />
        </div>
      </Modal>
    );
  }
);

EmployeeModal.displayName = "EmployeeModal";

export default EmployeeModal;
