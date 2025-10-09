"use client";
import Nav from "components/Nav";
import React, { useMemo, useRef, useState, useEffect } from "react";
import _ from "lodash";
import {
  Button,
  DatePicker,
  Dropdown,
  Menu,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Space,
  Table,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import BulegBurtgekh from "./BulegBurtgekh";
import Excel from "@/components/modal/Excel";
import { useAuth } from "@/services/auth";
import { modal } from "components/ant/Modal";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import useBuleg from "@/hook/useBuleg";
import useSWR from "swr";
import createMethod from "tools/functions/crud/createMethod";

import getListMethod from "tools/functions/crud/getListMethod";
import deleteMethod from "tools/functions/crud/deleteMethod";
import formatNumber from "tools/functions/crud/formatNumber";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const useBulegiinDun = (token, idnuud, ognoo) => {
  const { data, mutate } = useSWR(
    ["BulegiinDunAvya", ognoo, idnuud],
    (url, ognoo, idnuud) =>
      createMethod(url, token, {
        idnuud,
        ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      }).then((a) => a.data),
    { revalidateOnFocus: false }
  );
  return { bulegiinDun: data, mutate };
};

const useDansniiKhuulga = (token, bulgiinId, ognoo) => {
  const [khuudaslalt, setDansniiKhuulgaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
  });

  const { data, mutate } = useSWR(
    token
      ? ["bankniiGuilgee", ognoo, bulgiinId, khuudaslalt, token]
      : null,
    (url, ognoo, bulgiinId, { search, ...khuudaslalt }, token) =>
      getListMethod(url, token, {
        ...khuudaslalt,
        query: {
          bulgiinId,
          $or: [
            {
              TxDt: {
                $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
              },
            },
            {
              tranDate: {
                $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
              },
            },
          ],
        },
        select: { TxDt: 1, dansniiDugaar: 1, Amt: 1, CtActnName: 1 },
      }).then((a) => a.data),
    { revalidateOnFocus: false }
  );

  return {
    dansniiKhuulgaGaralt: data,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate: mutate,
  };
};

function pusher(list, buleg) {
  if (!!buleg?.dedKhesguud && buleg?.dedKhesguud.length > 0)
    buleg?.dedKhesguud.forEach((a) => pusher(list, a));
  list.push(buleg?._id);
}

function Dun({ token, ognoo, buleg }) {
  const Idnuud = useMemo(() => {
    let idnuud = [];
    pusher(idnuud, buleg);
    return idnuud;
  }, [buleg]);

  const { bulegiinDun, mutate } = usebulegiinDun(
    token,

    Idnuud,
    ognoo
  );

  buleg.mutate = mutate;

  return <div>{formatNumber(bulegiinDun)}</div>;
}

function BulegMur({
  buleg,
  index,
  parent,
  token,

  ognoo,

  bulegBurtgekh,
  bulegUstgaya,
}) {
  const [showDed, setShowDed] = useState(false);

  const Idnuud = useMemo(() => {
    let idnuud = [];
    pusher(idnuud, buleg);
    return idnuud;
  }, [buleg]);

  const { bulegiinDun } = usebulegiinDun(token, Idnuud, ognoo);

  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
  } = useDansniiKhuulga(token, buleg?._id, ognoo);

  function guilgeeUstgaya(guilgeeniiId) {
    uilchilgee(token)
      .post("/bulegTsutslaya", { guilgeeniiId })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай устгалаа.") });
          dansniiKhuulgaMutate();
        }
      });
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full flex-row space-x-2">
        <div
          className="box flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-center z-10"
          onClick={() => setShowDed(!showDed)}
        >
          {bulegbuleg.dedKhesguud ? (showDed ? "-" : "+") : ""}
        </div>
        <div className="flex-1 box flex items-center rounded-sm px-2">
          {buleg.ner}
        </div>
        <div
          className="box flex w-80 items-center rounded-sm px-2"
          style={{ width: !parent && "22.5rem" }}
        >
          {formatNumber(bulegiinDun || 0)}₮
        </div>
        {parent && (
          <Dropdown
            overlayClassName="p-2"
            overlay={
              <Menu className="p-2">
                <Menu.Item
                  key="Заалт нэмэх"
                  className="dark:hover:bg-dark-2 flex  items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700"
                  onClick={() => bulegUstgaya(buleg)}
                >
                  <DeleteOutlined />
                  <span>{t("Устгах")}</span>
                </Menu.Item>
                <Menu.Item
                  key="Заалт Excel-ээс оруулах"
                  className="dark:hover:bg-dark-2 flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700"
                  onClick={() => bulegBurtgekh(buleg)}
                >
                  <EditOutlined />
                  <span>{t("Засах")}</span>
                </Menu.Item>
              </Menu>
            }
            trigger="click"
            className="cursor-pointer"
          >
            <div className="box flex w-8 rotate-90 transform cursor-pointer items-center justify-center">
              <MoreOutlined style={{ display: "flex" }} />
            </div>
          </Dropdown>
        )}
      </div>
      {showDed && buleg.dedKhesguud && (
        <div className="w-full pl-12">
          <Buleg
            t={t}
            buleguud={buleg.dedKhesguud}
            token={token}
            ognoo={ognoo}
          />
        </div>
      )}
      {showDed &&
        dansniiKhuulgaGaralt &&
        dansniiKhuulgaGaralt?.jagsaalt?.map((a) => (
          <div className="flex w-full flex-row space-x-4 pl-12 " key={a?._id}>
            <div className="box flex h-8 w-8 items-center justify-center rounded-sm text-center">
              {index + 1}
            </div>
            <div
              className="box flex items-center rounded-sm px-2"
              style={{ width: "calc(100% - 63.25rem)" }}
            >
              {a.dansniiDugaar}
            </div>
            <div className="box flex w-80 items-center rounded-sm px-2">
              {a.CtActnName}
            </div>
            <div className="box flex w-80 items-center rounded-sm px-2">
              {moment(a.TxDt).format("YYYY-MM-DD")}
            </div>
            <div className="box flex w-80 items-center rounded-sm px-2">
              {formatNumber(a.Amt || 0)}₮
            </div>
            <Popconfirm
              title="Холбогдсон бүлэг устгахдаа итгэлтэй байна уу?"
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => guilgeeUstgaya(a._id)}
              className="h-5 w-5"
            >
              <div className="box flex w-8 cursor-pointer items-center justify-center">
                <CloseOutlined style={{ display: "flex" }} />
              </div>
            </Popconfirm>
          </div>
        ))}
    </div>
  );
}

function Buleg({
  buleguud,
  parent,
  token,

  ognoo,

  bulegBurtgekh,
  bulegUstgaya,
  t,
}) {
  return (
    <div className={`w-full space-y-4 ${parent ? "bulegkhusnegt" : ""}`}>
      {buleguud?.map((a, i) => (
        <BulegMur
          t={t}
          key={a?._id}
          buleg={a}
          index={i}
          parent={parent}
          ognoo={ognoo}
          token={token}
          bulegBurtgekh={bulegBurtgekh}
          bulegUstgaya={bulegUstgaya}
        />
      ))}
    </div>
  );
}

function KholbosonBulegTable({ columns, garalt, pagination }) {
  return (
    <div className="py-2 pl-4">
      <Table
        size="small"
        dataSource={garalt?.jagsaalt}
        columns={columns}
        rowKey={(row) => row._id}
        pagination={pagination}
        bordered
      />
    </div>
  );
}

function bulegExpander({ mur, token, ognoo, onRefresh }) {
  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
  } = useDansniiKhuulga(mur && token, mur?._id, ognoo);

  function guilgeeUstgaya(guilgeeniiId) {
    uilchilgee(token)
      .post("/bulegTsutslaya", { guilgeeniiId })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай устгалаа.") });
          dansniiKhuulgaMutate();
          sergeeya();
        }
      });
  }

  function sergeeya() {
    onRefresh();
    mur.mutate && mur.mutate();
  }

  return (
    <div className="">
      {mur.dedKhesguud && mur.dedKhesguud?.length > 0 && (
        <div className="py-2 pl-4">
          <BulegTable
            showHeader={false}
            buleg={mur}
            token={token}
            onRefresh={sergeeya}
            columns={[
              {
                title: "№",
                key: "index",
                width: "3rem",
                align: "center",
                render: (text, record, index) => index + 1,
              },
              {
                title: t("Дэд бүлэг"),
                dataIndex: "ner",
                ellipsis: true,
                align: "center",
              },
              // {
              //   title: t("Дүн"),
              //   dataIndex: "davkhar",
              //   ellipsis: true,
              //   align: "left",
              //   width: "13rem",
              //   render(text, row) {
              //     return <Dun token={token} buleg={row} ognoo={ognoo} />;
              //   },
              // },
            ]}
            garalt={{ jagsaalt: mur.dedKhesguud }}
            pagination={false}
            ognoo={ognoo}
          />
        </div>
      )}
    </div>
  );
}

function BulegTable({
  columns,
  garalt,
  pagination,
  token,

  ognoo,
  rowClassName,
  showHeader,
  expandedRowClassName,
  onRefresh,
}) {
  const [expandedKeys, setExpandedKeys] = useState([]);

  return (
    <Table
      bordered
      size="small"
      scroll={{ y: "calc(100vh - 20rem)" }}
      dataSource={garalt?.jagsaalt}
      columns={columns}
      rowClassName={rowClassName}
      showHeader={showHeader}
      expandable={{
        expandedRowRender: (mur) =>
          expandedKeys.includes(mur._id) && (
            <BulegExpander
              mur={mur}
              onRefresh={onRefresh}
              columns={columns}
              ognoo={ognoo}
              token={token}
            />
          ),
        expandedRowKeys: expandedKeys,
        expandedRowClassName: expandedRowClassName,
        onExpand: (a, b) => {
          if (true === a) expandedKeys.push(b._id);
          else {
            const index = expandedKeys.indexOf(b._id);
            expandedKeys.splice(index, 1);
          }
          setExpandedKeys([...expandedKeys]);
        },
      }}
      rowKey={(row) => row._id}
      pagination={pagination}
    />
  );
}

function buleg({ token: serverToken, needsClientAuth }) {
  const { t } = useTranslation();
  const { token } = useAuth();
  const bulegRef = useRef(null);
  const excel = useRef(null);
  const [ognoo, setOgnoo] = useState(null);
  function excelOruulya() {
    const footer = [
      <div className="flex justify-end">
        <Button
          type="primary"
          className="bg-blue-600"
          onClick={() => excel.current.khadgalya()}
        >
          Хадгалах
        </Button>
      </div>,
    ];
    modal({
      width: "80vw",
      title: (
        <div className="flex justify-between w-full">
          <div>Бүлэг бүртгэх</div>
          <CloseCircleOutlined
            onClick={() => excel.current.khaaya()}
            className="text-2xl hover:text-red-400"
          />
        </div>
      ),
      icon: <FileExcelOutlined />,
      footer,
      content: (
        <Excel ref={excel} token={token} ajiltanMutate={bulegGaralt.mutate} bulegGaralt={bulegGaralt.jagsaalt} />
      ),
    });
  }
  if (needsClientAuth && !token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Нэвтэрч байна...</span>
      </div>
    );
  }

  useEffect(() => {
    if (!token && !needsClientAuth) {
      window.location.href = "/";
    }
  }, [token, needsClientAuth]);

  const { bulegGaralt, setBulegKhuudaslalt, bulegMutate } = useBuleg(token);

  function onRefresh() {
    bulegMutate();
  }

  function bulegBurtgekh(data) {
    const footer = [
      <Space>
        <Button onClick={() => bulegRef.current.khaaya()}>{t("Хаах")}</Button>
        <Button
          className="bg-blue-500 text-white"
          onClick={() => bulegRef.current.khadgalya()}
        >
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: t("Төрөлжүүлэлтийн бүлэг үүсгэх"),
      icon: <FileExcelOutlined />,
      width: 850,
      content: (
        <BulegBurtgekh
          t={t}
          ref={bulegRef}
          token={token}
          onRefresh={onRefresh}
          data={_.cloneDeep(data)}
        />
      ),
      footer,
    });
  }

  function bulegUstgaya(data) {
    deleteMethod("buleg", token, data._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: "Амжилттай устгагдлаа" });
          onRefresh();
        }
      })
      .catch(aldaaBarigch);
  }

  return (
    <Nav
      onSearch={(search) =>
        setBulegKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
    >
      <div className="space-y-5">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t("Бүлгийн жагсаалт")}
          </h1>
          <p className="text-gray-600">
            {t("Бүлгүүдийг удирдах болон шинэ бүлэг бүртгэх")}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex w-full flex-col md:flex-row md:items-center justify-between gap-4">
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              className="w-full md:w-auto"
            >
              <DatePicker.RangePicker
                className="w-full"
                size="large"
                placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                format={"YYYY-MM-DD"}
                getPopupContainer={() => document.body}
              />
            </div>

            <div
              className="flex gap-2 items-center"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => excelOruulya()}>
                      Excel оруулах
                    </Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <button className="flex items-center hidden justify-between w-40 h-10 px-4 py-2 bg-white border rounded-lg cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 mr-2"
                  >
                    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <line x1="10" y1="9" x2="8" y2="9"></line>
                  </svg>
                  <span className="text-sm">Excel</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 ml-2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </Dropdown>

              <button
                style={{
                  backgroundColor: "#4285F4",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                }}
                className="btn w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={() => bulegBurtgekh()}
              >
                <span className="flex h-5 w-5 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-plus h-4 w-4"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </span>
                <span>{t("Бүлэг")}</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-sm"
          data-aos="fade-left"
          data-aos-duration="1000"
        >
          <BulegTable
            token={token}
            onRefresh={onRefresh}
            garalt={bulegGaralt}
            ognoo={ognoo}
            rowClassName={(record, index) =>
              index % 2 === 0
                ? "bg-white dark:bg-gray-600"
                : "bg-gray-50 dark:bg-gray-800"
            }
            expandedRowClassName={() => "bg-white dark:bg-gray-700"}
            columns={[
              {
                title: "№",
                key: "index",
                width: "3rem",
                align: "center",
                render: (text, record, index) => index + 1,
              },
              {
                title: t("Бүлэг"),
                dataIndex: "ner",
                ellipsis: true,
                align: "center",
                width: "65vw",
              },

              {
                title: <SettingOutlined />,
                dataIndex: "davkhar",
                align: "center",
                width: 60,
                render(_, mur) {
                  return (
                    <Popover
                      placement="left"
                      trigger="click"
                      content={
                        <div className="flex flex-col w-40">
                          <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                            onClick={() => bulegBurtgekh(mur)}
                          >
                            <EditOutlined
                              style={{ fontSize: 16, color: "blue" }}
                            />
                            <span>{t("Засах")}</span>
                          </div>

                          <Popconfirm
                            title={t(
                              "Та бүлэг устгах гэж байна. Үргэлжлүүлэх үү?"
                            )}
                            okText={t("Тийм")}
                            cancelText={t("Үгүй")}
                            okButtonProps={{
                              style: {
                                backgroundColor: "#1890ff",
                                color: "white",
                                border: "none",
                              },
                            }}
                            onConfirm={() => bulegUstgaya(mur)}
                          >
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-gray-700">
                              <DeleteOutlined
                                style={{ fontSize: 16, color: "red" }}
                              />
                              <span>{t("Устгах")}</span>
                            </div>
                          </Popconfirm>
                        </div>
                      }
                    >
                      <Button
                        type="text"
                        shape="circle"
                        icon={<MoreOutlined style={{ fontSize: 18 }} />}
                      />
                    </Popover>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </Nav>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default buleg;
