"use client";

import { Button, message, Upload, Empty } from "antd";
import React, { useEffect, useImperativeHandle, useState } from "react";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import { DeleteOutlined, FileExcelOutlined } from "@ant-design/icons";
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

function Excel({ token, destroy, ajiltanMutate }, ref) {
  const [file, setFile] = useState(null);
  const [jagsaalt, setJagsaalt] = useState(null);

  const [aldaa, setAldaa] = useState(null);
  useEffect(() => {
    if (file === null) {
      setJagsaalt(null);
      setAldaa(null);
    }
  }, [file]);
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
    <div>
      <div className="w-full flex justify-between ">
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
          <Button>Excel оруулах</Button>
        </Upload>
      </div>
      {!!file && (
        <div className="flex flex-row space-x-2 items-center">
          <div>
            <FileExcelOutlined />
          </div>
          <div>{file?.name}</div>
          <div
            className="p-2 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer"
            onClick={() => setFile(null)}
          >
            <DeleteOutlined style={{ color: "red" }} />
          </div>
        </div>
      )}
      {!jagsaalt && (
        <Empty
          description={
            <a
              onClick={() =>
                downloadFileWithToken(
                  url + "/ajiltanZagvarAvya",
                  token,
                  "Ажилтан Excel загвар.xlsx"
                )
              }
            >
              <Button>Загвар татах</Button>
            </a>
          }
        />
      )}
      {aldaa && (
        <div
          className="max-h-52 overflow-auto text-red-600"
          dangerouslySetInnerHTML={{
            __html: aldaa,
          }}
        />
      )}
    </div>
  );
}

export default React.forwardRef(Excel);
