"use client";

import { BsCheckCircle, BsSearch } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import { BiRefresh } from "react-icons/bi";
import { HiMenu, HiX } from "react-icons/hi";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Nav from "@/components/Nav";
import { Button, Switch, message, Modal, DatePicker, Select } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import useJagsaalt from "@/hook/useJagsaalt";
import { useAuth } from "@/services/auth";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";

const searchKeys = ["ner", "turul"];

const sudalgaa = () => {
  const { token, nevtersenAjiltanErkh } = useAuth();
  const { confirm } = Modal;

  function asuultIdevkhteiBolgokh(id) {
    if (songogdsonSudalgaa === id)
      return message.warning("Сонгогдсон судалгаа байна");
    uilchilgee()
      .get(`/asuultIdevkhjuulye/${id}`)
      .then((response) => {
        if (response.data === "Amjilttai") {
          message.success("Судалгаа амжилттай сонгогдлоо!");
        }
        sudalgaaJagsaalt.refresh();
      })
      .catch((error) => {
        aldaaBarigch(error);
      });
  }

  const router = useRouter();
  const [shuultuurType, setShuultuurType] = useState({ createdAt: -1 });
  const [songogdsonSudalgaa, setSongogdsonSudalgaa] = useState(null);
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const query = useMemo(() => {
    if (ekhlekhOgnoo && ekhlekhOgnoo?.length > 0) {
      return {
        createdAt: {
          $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
        },
      };
    }
    return undefined;
  }, [ekhlekhOgnoo]);

  const sudalgaaJagsaalt = useJagsaalt(
    "/asuult",
    query,
    shuultuurType,
    undefined,
    searchKeys
  );

  useEffect(() => {
    uilchilgee()
      .get("/idevkhteiAsuultIdAvya")
      .then((res) => {
        setSongogdsonSudalgaa(res.data);
        if (!res.data) {
          message.warning("Сонгогдсон судалгаа байхгүй байна!");
          asuultIdevkhteiBolgokh(sudalgaaJagsaalt?.jagsaalt?.[0]?._id);
        }
      });
  }, [sudalgaaJagsaalt]);

  const onChangeOgnoo = (dates, dateString) => {
    if (!dates) {
      setEkhlekhOgnoo([]);
    }
    if (dates && dates.length === 2) {
      setEkhlekhOgnoo(dateString);
    }
  };

  function handleShuultuurType(value) {
    const shuultuurType = JSON.parse(value);
    setShuultuurType(shuultuurType);
  }

  const showDeleteConfirmation = (id) => {
    confirm({
      title: "Судалгаа устгах",
      icon: <ExclamationCircleOutlined />,
      content: "Та итгэлтэй байна уу? Устгах үйлдэл буцаагдахгүй!",
      okText: "Тийм",
      okType: "danger",
      cancelText: "Үгүй",
      onOk() {
        sudalgaaUstgakh(id);
      },
    });
  };

  function sudalgaaUstgakh(id) {
    uilchilgee(token)
      .delete(`asuult/${id}`)
      .then((res) => sudalgaaJagsaalt.refresh())
      .catch((err) => aldaaBarigch(err));
  }

  function sudalgaaZasya(id) {
    router.push(`/application/sudalgaa/${id}`);
  }

  return (
    <Nav onSearch={sudalgaaJagsaalt?.onSearch}>
      <div className="flex justify-center items-center lg:pr-[295px] relative">
        <button
          onClick={toggleSidebar}
          className="fixed top-6 right-1 z-[1001] flex items-center justify-center drawer-toggle lg:hidden"
        >
          {sidebarOpen ? (
            <CloseOutlined className="flex items-center justify-center w-12 h-12 text-gray-700" />
          ) : (
            <MenuOutlined className="flex items-center justify-center w-12 h-12 text-gray-700" />
          )}
        </button>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[999] lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div className="w-[90vw] lg:w-full flex flex-col justify-center items-stretch lg:px-0">
          <div className="flex justify-start items-center mb-4">
            <div className="flex justify-center gap-2 lg:gap-4">
              <h1 className="text-lg lg:text-xl">Судалгаа</h1>
              <div className="flex justify-center items-end text-xs gap-2 lg:gap-4">
                <div>Аппликэйшн</div>
                {"|"}
                <div>Судалгаа</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
            <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-2 lg:gap-4 w-full lg:w-auto">
              <Select
                value={JSON.stringify(shuultuurType)}
                size="small"
                style={{ width: "100%", minWidth: "8rem", maxWidth: "200px" }}
                onChange={(v) => handleShuultuurType(v)}
              >
                <Select.Option value={JSON.stringify({ ner: 1 })}>
                  Гарчигаар
                </Select.Option>
                <Select.Option value={JSON.stringify({ turul: 1 })}>
                  Төрлөөр
                </Select.Option>
                <Select.Option value={JSON.stringify({ createdAt: -1 })}>
                  Шинээр
                </Select.Option>
                <Select.Option value={JSON.stringify({ createdAt: 1 })}>
                  Хуучнаар
                </Select.Option>
              </Select>
              <DatePicker.RangePicker
                size="small"
                placeholder={["Эхлэх огноо", "Дуусах огноо"]}
                format={"YYYY-MM-DD"}
                className="flex justify-center items-center w-full lg:w-auto"
                onChange={onChangeOgnoo}
              />
            </div>
            <div className="flex gap-2 w-full lg:w-auto justify-end">
              {nevtersenAjiltanErkh && nevtersenAjiltanErkh !== "userAdmin" && (
                <Button
                  onClick={() => router.push("/application/sudalgaa/new")}
                  className="bg-blue-600 text-white py-2 px-4 rounded-3xl flex justify-center items-center gap-2 text-xs lg:text-sm"
                >
                  <PlusCircleOutlined />
                  <span className="hidden sm:inline">Шинээр үүсгэх</span>
                </Button>
              )}
            </div>
          </div>

          <div className="pb-4 py-2">
            <hr />
          </div>

          <div className="lg:w-full w-[90vw] flex flex-col justify-center items-start gap-4">
            {sudalgaaJagsaalt?.jagsaalt?.map((a) => {
              return (
                <div
                  key={a._id}
                  className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-16 w-full p-4 lg:p-7 bg-white rounded-lg hover:bg-blue-100 transition-colors duration-300`}
                >
                  <div className="text-base lg:text-lg w-full font-medium">
                    {a.ner}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 w-full lg:w-auto">
                    <div className="w-fit text-xs text-gray-600">
                      {moment(a.createdAt).format("YYYY/MM/DD")}
                    </div>

                    <div className="w-fit text-xs">
                      <div
                        className={`border rounded-full w-fit py-1 px-2 text-xs ${
                          a.turul === "sudalgaanii"
                            ? "bg-blue-300"
                            : a.turul === "ajiltnii"
                            ? "bg-green-300"
                            : "bg-yellow-300"
                        }`}
                      >
                        {a.turul === "sudalgaanii"
                          ? "Судалгааны"
                          : a.turul === "ajiltnii"
                          ? "Ажилтны"
                          : "Иргэдийн"}
                      </div>
                    </div>
                  </div>

                  {nevtersenAjiltanErkh && (
                    <div className="flex justify-center items-center gap-2 lg:gap-4 w-full lg:w-auto">
                      {(nevtersenAjiltanErkh === "superAdmin" ||
                        nevtersenAjiltanErkh === "admin") && (
                        <Switch
                          className="bg-gray-300 m-1 lg:m-2"
                          checked={a.idevkhteiEsekh}
                          onChange={() => asuultIdevkhteiBolgokh(a._id)}
                          size="default"
                        />
                      )}
                      <Button
                        className="flex justify-center items-center bg-gray-300"
                        type="primary"
                        size="small"
                        onClick={() => sudalgaaZasya(a._id)}
                      >
                        {nevtersenAjiltanErkh !== "userAdmin" ? (
                          <EditOutlined className="text-xs" />
                        ) : (
                          <EyeOutlined className="text-xs" />
                        )}
                      </Button>
                      {(nevtersenAjiltanErkh === "superAdmin" ||
                        nevtersenAjiltanErkh === "admin") && (
                        <Button
                          className="flex justify-center items-center text-red-400"
                          type="primary"
                          danger
                          size="small"
                          onClick={() => showDeleteConfirmation(a._id)}
                        >
                          <DeleteOutlined className="text-xs" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`
            fixed z-[1000] top-0 right-0 h-full p-4 bg-white text-gray-500 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
            w-full max-w-sm
            lg:translate-x-0 lg:top-[100px] lg:w-[295px] lg:h-[calc(100vh-100px)] lg:rounded-l-xl lg:max-w-[295px] lg:pr-12
          `}
        >
          <div className="h-full w-full flex flex-col gap-4">
            <div className="flex items-center justify-between w-full mb-4 lg:hidden">
              <h2 className="text-lg text-black font-medium">
                Судалгааны мэдээлэл
              </h2>
            </div>

            <div className="flex flex-col">
              <div className="text-xs pb-4">
                <p>Судалгаа</p>
              </div>
              <div className="flex justify-between items-center text-sm pb-3 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                <a className="flex gap-2 justify-center items-center">
                  <IoMdRefresh className="text-lg" />
                  <p>Нийт</p>
                </a>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {sudalgaaJagsaalt?.jagsaalt?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-3 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                <a className="flex gap-2 justify-center items-center">
                  <BiRefresh className="text-lg" />
                  <p>Идэвхтэй</p>
                </a>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {sudalgaaJagsaalt?.jagsaalt?.filter((a) => a.idevkhteiEsekh)
                    ?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-3 hover:bg-gray-50 px-2 py-1 rounded transition-colors cursor-pointer">
                <a className="flex gap-2 justify-center items-center">
                  <BsCheckCircle />
                  <p>Дууссан</p>
                </a>
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                  {sudalgaaJagsaalt?.jagsaalt?.filter((a) => !a.idevkhteiEsekh)
                    ?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Nav>
  );
};

export default sudalgaa;
