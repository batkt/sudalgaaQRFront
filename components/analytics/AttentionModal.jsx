"use client";

import { memo, useState, useEffect } from "react";
import { Modal, Table } from "antd";
import moment from "moment";

const AttentionModal = memo(
  ({
    attentionModalOpen,
    handleAttentionModalCancel,
    attentionComments,
    getFilteredDataByMainDateRange,
    renderHighlighted,
  }) => {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      if (attentionModalOpen) {
        setCurrentPage(1);
      }
    }, [attentionModalOpen]);
    return (
      <Modal
        title={
          <div className="flex items-center justify-between w-full px-2 py-1">
            <span className="text-lg font-semibold text-gray-800">
              Анхаарах шаардлагатай сэтгэгдлүүд
            </span>
            <button
              onClick={handleAttentionModalCancel}
              className="flex items-center justify-center w-8 h-8 text-xl font-bold text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        }
        open={attentionModalOpen}
        closable={false}
        footer={
          <div className="sticky bottom-0 z-10 flex justify-end p-4 bg-white border-t border-gray-200">
            <button
              onClick={handleAttentionModalCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Хаах
            </button>
          </div>
        }
        width={1400}
        height={600}
        className="analytics-attention-dialog"
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
          {attentionComments.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-600">Сэтгэгдлүүд ачаалж байна...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                 <Table
                   dataSource={getFilteredDataByMainDateRange(attentionComments)}
                   rowKey="_id"
                   pagination={{
                     current: currentPage,
                     pageSize: 20,
                     showSizeChanger: false,
                     showQuickJumper: false,
                     showTotal: (total, range) =>
                       `${range[0]}-${range[1]} / ${total}`,
                     className: "analytics-pagination",
                     onChange: (page) => setCurrentPage(page),
                   }}
                   size="middle"
                   className="analytics-attention-table"
                   scroll={{ y: 400 }}
                   tableLayout="fixed"
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
                          Иргэн
                        </span>
                      ),
                      key: "utas",
                      width: 120,
                      render: (_, record) => (
                        <span className="text-sm text-gray-600">
                          {record.utas || "-"}
                        </span>
                      ),
                    },
                    {
                      title: (
                        <span className="font-semibold text-center text-gray-700">
                          Ажилтан
                        </span>
                      ),
                      key: "ajiltan",
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
                      width: 100,
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
                        <span className="font-semibold text-center text-gray-700">
                          Судалгааны төрөл
                        </span>
                      ),
                      key: "asuultiinNer",
                      width: 100,
                      render: (_, record) => (
                        <div className="text-xs text-gray-600">
                          <div className="p-1 text-center rounded bg-blue-50">
                            {record.asuultiinNer || "-"}
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: (
                        <span className="font-semibold text-center text-gray-700">
                          Сэтгэгдэл
                        </span>
                      ),
                      key: "tailbar",
                      width: 200,
                      render: (_, record) => (
                        <div className="text-sm text-gray-600">
                          {record.tailbar ? (
                            <div className="p-2 break-words border-l-4 border-yellow-400 rounded bg-yellow-50">
                              {renderHighlighted(record.tailbar)}
                            </div>
                          ) : (
                            <span className="text-gray-400">
                              Сэтгэгдэл байхгүй
                            </span>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: (
                        <span className="font-semibold text-center text-gray-700">
                          Огноо
                        </span>
                      ),
                      key: "ognoo",
                      width: 120,
                      render: (_, record) => (
                        <span className="text-sm text-gray-600">
                          {moment(record.ognoo).format("MM/DD HH:mm")}
                        </span>
                      ),
                    },
                    {
                      title: (
                        <span className="font-semibold text-center text-gray-700">
                          Үйлдэл
                        </span>
                      ),
                      key: "action",
                      width: 100,
                      render: (_, record) => (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `https://qr.zevtabs.mn/setgegdel/${record._id}`,
                              "_blank"
                            );
                          }}
                          className="px-3 py-1 text-xs text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Дэлгэрэнгүй
                        </button>
                      ),
                    },
                  ]}
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }
                />
              </div>

              <div className="block md:hidden">
                <div className="space-y-3">
                  {getFilteredDataByMainDateRange(attentionComments).map(
                    (comment, index) => (
                      <div
                        key={comment._id}
                        className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            #{index + 1}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `https://qr.zevtabs.mn/setgegdel/${comment._id}`,
                                "_blank"
                              );
                            }}
                            className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                          >
                            Дэлгэрэнгүй
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Иргэн:
                            </span>
                            <p className="text-sm text-gray-800">
                              {comment.utas || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Ажилтан:
                            </span>
                            <p className="text-sm text-gray-800">
                              {comment.ajiltan?.ovog?.[0] || ""}.{" "}
                              {comment.ajiltan?.ner || ""}
                            </p>
                            <p className="text-xs text-gray-500">
                              {comment.ajiltan?.register || ""}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Албан тушаал:
                            </span>
                            <p className="text-sm text-gray-800">
                              {comment.ajiltan?.tsol || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Тасаг/Хэлтэс:
                            </span>
                            <p className="text-sm text-gray-800">
                              {comment.ajiltan?.tasag || "-"} /{" "}
                              {comment.ajiltan?.kheltes || "-"}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Судалгааны төрөл:
                            </span>
                            <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                              {comment.asuultiinNer || "-"}
                            </span>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Сэтгэгдэл:
                            </span>
                            <div className="p-2 mt-1 text-sm text-gray-800 break-words border-l-4 border-yellow-400 rounded bg-yellow-50">
                              {comment.tailbar || "Сэтгэгдэл байхгүй"}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-600">
                              Огноо:
                            </span>
                            <p className="text-sm text-gray-800">
                              {moment(comment.ognoo).format("MM/DD HH:mm")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    );
  }
);

AttentionModal.displayName = "AttentionModal";

export default AttentionModal;
