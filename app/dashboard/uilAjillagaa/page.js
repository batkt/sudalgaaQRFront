"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Nav from "@/components/Nav";
import useScanDetection from "use-scan-detection";
import uilchilgee, { aldaaBarigch, socket, url } from "@/services/uilchilgee";
import { Avatar, Card, Table, notification } from "antd";
import colors from "tailwindcss/colors";
import useJagsaalt from "@/hook/useJagsaalt";
import moment from "moment";

const order = { createdAt: -1 };

const niitAjiltan = 64;

const UilAjillagaa = () => {
  const [orjIrsenAjiltan, setOrjIrsenAjiltan] = useState({
    ovog: undefined,
    ner: undefined,
    tsol: undefined,
    albanTushaal: undefined,
    zurgiinId: undefined,
  });
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const divRev = useRef(null);
  if (typeof window !== "undefined") {
    useScanDetection({
      onError: (err) => {},
      onComplete: (code) => {
        divRev.current.focus();
        if (code) {
          const match = code.match(/[0-9a-fA-F]{24}/);
          if (match) {
            const ajiltanId = match[0];
            uilchilgee()
              .post("/irtsUgye", { ajiltniiId: ajiltanId })
              .then(({ data }) => {
                notification.success({ message: data, duration: 1 });
              })
              .catch((err) => aldaaBarigch(err));
          }
        }
      },
    });
  }

  const query = useMemo(() => {
    const odoo = new Date();
    odoo.setHours(0, 0, 0, 0);
    const garaasQuery = {
      ognoo: {
        $gte: odoo,
        $lte: new Date(odoo.getTime() + 24 * 60 * 60 * 1000 - 1),
      },
    };

    return garaasQuery;
  }, []);

  const khariultQuery = useMemo(() => {
    return {
      ...query,
      asuultiinId: "654a406e943e5ca31352edb1",
    };
  }, [query]);

  const {
    data: irtsData,
    mutate: irtsMutate,
    setKhuudaslalt: setIrtsKhuudaslalt,
  } = useJagsaalt("/irts", query, order, undefined, undefined, 20);
  const { data: sanalData, mutate: sanalMutate } = useJagsaalt(
    "/khariult",
    khariultQuery
  );

  useEffect(() => {
    setProgress1(() => {
      return irtsData ? irtsData?.niitMur / niitAjiltan : 0;
    });
    setProgress2(() => {
      return sanalData ? sanalData?.niitMur / niitAjiltan : 0;
    });
  }, [irtsData, sanalData]);

  useEffect(() => {
    socket().on("irtsBugluw", (obj) => {
      setOrjIrsenAjiltan(obj);
      irtsMutate();
      sanalMutate();
    });
    return () => {
      socket().off("irtsBugluw");
    };
  }, []);
  useEffect(() => {
    socket().on("unelgeeUguw", () => {
      sanalMutate();
    });
    return () => {
      socket().off("unelgeeUguw");
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        title: <div className="text-center">№</div>,
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (irtsData?.khuudasniiDugaar || 0) *
            (irtsData?.khuudasniiKhemjee || 0) -
          (irtsData?.khuudasniiKhemjee || 0) +
          index +
          1,
        width: "3rem",
      },
      {
        title: <div className="text-center">Овог</div>,
        key: "ovog",
        align: "left",
        width: "8rem",
        dataIndex: "ovog",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Нэр</div>,
        key: "ner",
        align: "left",
        width: "8rem",
        dataIndex: "ner",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Цол</div>,
        key: "tsol",
        align: "left",
        dataIndex: "tsol",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Албан тушаал</div>,
        key: "albanTushaal",
        align: "left",
        dataIndex: "albanTushaal",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Бүртгэгдсэн огноо</div>,
        key: "ognoo",
        align: "left",
        width: "10rem",
        dataIndex: "ognoo",
        ellipsis: true,
        render: (a) => {
          return moment(a).format("YYYY-MM-DD HH:mm:ss");
        },
      },
    ],
    []
  );

  return (
    <Nav>
      <div
        className="w-full flex flex-col justify-center items-center p-2 md:p-4 gap-4 md:gap-6"
        ref={divRev}
      >
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 justify-center items-start w-[90vw] lg:w-full max-w-7xl">
          <div className="flex justify-center items-start w-full lg:w-auto lg:flex-1 lg:max-w-md xl:max-w-lg">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-none p-4 rounded-xl shadow-xl bg-gray-100">
              <div className="text-center">
                <p className="text-lg md:text-xl lg:text-2xl font-semibold">
                  Орж ирсэн
                </p>
              </div>

              <div className="text-center mt-4">
                <div className="flex justify-center items-center w-full rounded-full overflow-hidden">
                  <img
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-cover rounded-full"
                    src={
                      orjIrsenAjiltan?.zurgiinId
                        ? `${url}/file?path=ajiltan/${orjIrsenAjiltan?.zurgiinId}`
                        : "/assets/profile.png"
                    }
                    alt="Profile"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center text-sm md:text-base lg:text-lg font-semibold">
                  <p className="text-gray-600">Овог:</p>
                  <p className="text-right flex-1 ml-2 truncate">
                    {orjIrsenAjiltan?.ovog || "-"}
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base lg:text-lg font-semibold">
                  <p className="text-gray-600">Нэр:</p>
                  <p className="text-right flex-1 ml-2 truncate">
                    {orjIrsenAjiltan?.ner || "-"}
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm md:text-base lg:text-lg font-semibold">
                  <p className="text-gray-600">Цол:</p>
                  <p className="text-right flex-1 ml-2 truncate">
                    {orjIrsenAjiltan?.tsol || "-"}
                  </p>
                </div>
                <div className="flex justify-between items-start text-sm md:text-base lg:text-lg font-semibold">
                  <p className="text-gray-600 flex-shrink-0">Албан тушаал:</p>
                  <p className="text-right flex-1 ml-2 break-words">
                    {orjIrsenAjiltan?.albanTushaal || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-center w-full lg:w-auto">
            <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 w-full lg:w-fit justify-center items-center">
              <div className="w-full xl:w-auto flex flex-col justify-center items-center bg-white rounded-xl shadow-lg p-4">
                <h5 className="text-xl md:text-2xl font-semibold mb-4">Ирц</h5>

                <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row justify-center items-center gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke={colors.sky[700]}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="calc(2 * 3.14159 * 10)"
                        className="transition-all ease-in-out duration-300"
                        strokeDashoffset={`calc(2 * 3.14159 * 10 * (1 - ${progress1}))`}
                      />
                      <text
                        x="12"
                        y="14"
                        textAnchor="middle"
                        fontSize="5"
                        fill="#333"
                        className="font-semibold"
                      >{`${Math.round(progress1 * 100)}%`}</text>
                    </svg>
                  </div>

                  <div className="flex flex-col gap-2 text-center sm:text-left xl:text-center 2xl:text-left">
                    <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-center gap-1">
                      <p className="text-sm md:text-base lg:text-lg font-medium text-gray-700">
                        Нийт албан хаагчид:
                      </p>
                      <p className="text-cyan-600 text-sm md:text-base lg:text-lg font-semibold">
                        {niitAjiltan}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-center gap-1">
                      <p className="text-sm md:text-base lg:text-lg font-medium text-gray-700">
                        Ирц бүртгэгдсэн:
                      </p>
                      <p className="text-cyan-600 text-sm md:text-base lg:text-lg font-semibold">
                        {irtsData?.niitMur}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-auto flex flex-col justify-center items-center h-[300px] bg-white rounded-xl shadow-lg p-4">
                <h5 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4">
                  Санал хүсэлт
                </h5>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke={colors.sky[500]}
                        strokeWidth="2"
                        strokeDasharray="calc(2 * 3.14159 * 10)"
                        strokeDashoffset={`calc(2 * 3.14159 * 10 * (1 - ${progress2}))`}
                        className="transition-all ease-in-out duration-300"
                      />
                      <text
                        x="12"
                        y="14"
                        textAnchor="middle"
                        fontSize="5"
                        fill="#333"
                        className="font-semibold"
                      >{`${Math.round(progress2 * 100)}%`}</text>
                    </svg>
                  </div>

                  <div className="flex flex-col gap-2 text-center sm:text-left">
                    <p className="text-sm md:text-base">
                      Нийт албан хаагчид:{" "}
                      <span className="text-sky-600 font-semibold">
                        {niitAjiltan}
                      </span>
                    </p>
                    <p className="text-sm md:text-base">
                      Санал өгсөн:{" "}
                      <span className="text-sky-600 font-semibold">
                        {sanalData?.niitMur}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[90vw] lg:w-full max-w-7xl">
          <Table
            bordered
            tableLayout="fixed"
            className="mt-4"
            size="small"
            scroll={{
              x: 800,
              y: "calc(100vh - 25rem)",
            }}
            rowClassName="hover:bg-blue-100"
            rowKey={(row) => row._id}
            dataSource={irtsData?.jagsaalt}
            columns={columns}
            pagination={{
              current: irtsData?.khuudasniiDugaar,
              pageSize: irtsData?.khuudasniiKhemjee,
              total: irtsData?.niitMur,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100, 500],
              showQuickJumper: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total}`,
              responsive: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setIrtsKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>
      </div>
    </Nav>
  );
};
export default UilAjillagaa;
