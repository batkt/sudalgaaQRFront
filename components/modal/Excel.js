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
              if (status === 200 && data === "Amjilttai") {
                message.success("Амжилттай хадгаллаа");
                ajiltanMutate();
                destroy();
              }
            })
            .catch((e) => {
              if (!!e?.response?.data?.aldaa)
                setAldaa(e?.response?.data?.aldaa);
              else aldaaBarigch(e);
            })
            .finally(() => message.destroy("excelLoader"));
        } else message.warning("Excel файл аа сонгоно уу?");
      },
      khaaya() {
        destroy();
      },
    }),
    [file]
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileExcelOutlined className="text-green-600 text-lg" />
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 font-medium mb-2">Алдаа:</div>
          <div
            className="max-h-52 overflow-auto text-red-600 text-sm"
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
