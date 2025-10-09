"use client";

import { Button, message, Upload, Empty, Select, Space, Divider } from "antd";
import React, { useEffect, useImperativeHandle, useState } from "react";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import {
  DeleteOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import downloadFileWithToken from "/tools/functions/downloadFileWithToken";

function beforeUpload(file, callback) {
  const isJpgOrPng =
    file.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isJpgOrPng) {
    message.error("Та зөвхөн xlsx өргөтгөлтэй EXCEL оруулна уу");
  }

  callback(file);
  return false;
}

function Excel({ token, destroy, ajiltanMutate, bulegGaralt }, ref) {
  const [file, setFile] = useState(null);
  const [jagsaalt, setJagsaalt] = useState(null);
  const [aldaa, setAldaa] = useState(null);
  const [selectedBuleg, setSelectedBuleg] = useState(null);
  useEffect(() => {
    if (file === null) {
      setJagsaalt(null);
      setAldaa(null);
    }
  }, [file]);

  // Get only parent departments (root level)
  const getParentDepartments = (departments) => {
    return departments.map((dept) => ({
      ...dept,
      displayName: dept.ner,
    }));
  };

  // Download department template
  const downloadBulegTemplate = async (bulegId, bulegName) => {
    try {
      const response = await uilchilgee(token).get(
        `/downloadTemplate/${bulegId}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bulegName}_template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(`${bulegName} загварыг амжилттай татлаа`);
    } catch (error) {
      console.error("Error downloading template:", error);
      message.error("Загвар татахад алдаа гарлаа");
    }
  };
  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        if (!!file) {
          const formData = new FormData();
          formData.append("file", file);
          message.loading({
            content: "Excel загвар хадгалж байна.",
            duration: 100000,
            key: "excelLoader",
          });
          uilchilgee(token)
            .post("/ajiltanTatya", formData)
            .then(({ data, status }) => {
              if (
                status === 200 &&
                (data === "Amjilttai" || (data && data.success === true))
              ) {
                message.destroy("excelLoader");
                const successMessage =
                  data && data.message ? data.message : "Амжилттай хадгаллаа";
                const importedCount =
                  data && data.imported
                    ? ` (${data.imported} мөр орууллаа хийгдлээ)`
                    : "";
                message.success(successMessage + importedCount);
                // Reset form state
                setFile(null);
                setAldaa(null);
                // Refresh data
                if (ajiltanMutate) {
                  ajiltanMutate();
                }
                // Close modal after a short delay to show success message
                if (destroy) {
                  setTimeout(() => {
                    destroy();
                  }, 500);
                }
              } else {
                message.destroy("excelLoader");
                const errorMessage =
                  data && data.message
                    ? data.message
                    : "Хадгалахад алдаа гарлаа";
                message.error(errorMessage);
              }
            })
            .catch((e) => {
              message.destroy("excelLoader");
              if (!!e?.response?.data?.aldaa) {
                setAldaa(e?.response?.data?.aldaa);
                message.error("Excel файлд алдаа байна");
              } else {
                aldaaBarigch(e);
              }
            });
        } else {
          message.warning("Excel файл аа сонгоно уу?");
        }
      },
      khaaya() {
        if (destroy) {
          destroy();
        }
      },
    }),
    [file, token, ajiltanMutate, destroy]
  );

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with Excel upload and Department template download */}
      <div className="flex gap-3 items-center">
        <Upload
          name="avatar"
          multiple={false}
          showUploadList={false}
          beforeUpload={(f) =>
            beforeUpload(f, (file) => {
              setFile(file);
            })
          }
        >
          <Button icon={<FileExcelOutlined />}>Оруулах</Button>
        </Upload>

        {!jagsaalt && bulegGaralt && bulegGaralt.length > 0 && (
          <div className="flex gap-2 items-center">
            <Select
              placeholder="Хэсгийн загвар татах"
              className="w-48"
              value={selectedBuleg}
              onChange={(value) => {
                setSelectedBuleg(value);
              }}
              options={getParentDepartments(bulegGaralt).map((buleg) => ({
                value: buleg._id,
                label: buleg.displayName,
              }))}
            />
            <Button
              type="default"
              icon={<DownloadOutlined />}
              disabled={!selectedBuleg}
              onClick={() => {
                if (selectedBuleg) {
                  const parentDepts = getParentDepartments(bulegGaralt);
                  const buleg = parentDepts.find(
                    (b) => b._id === selectedBuleg
                  );
                  if (buleg) {
                    downloadBulegTemplate(buleg._id, buleg.ner);
                  }
                }
              }}
            >
              Татах
            </Button>
          </div>
        )}
      </div>

      {/* File preview with improved design */}
      {!!file && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileExcelOutlined className="text-lg text-green-600" />
              </div>
              <div>
                <div className="font-medium text-green-800">{file?.name}</div>
                <div className="text-sm text-green-600">
                  {(file?.size / 1024).toFixed(1)} KB
                </div>
              </div>
            </div>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => setFile(null)}
            >
              Устгах
            </Button>
          </div>
        </div>
      )}

      {/* Error display */}
      {aldaa && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="mb-2 font-medium text-red-600">Алдаа:</div>
          <div
            className="overflow-auto max-h-52 text-sm text-red-600"
            dangerouslySetInnerHTML={{
              __html: aldaa,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(Excel);
