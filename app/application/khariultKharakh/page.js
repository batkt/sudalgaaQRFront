"use client";

import Nav from "@/components/Nav";
import { useMemo, useState, useEffect } from "react";
import {
  EyeOutlined,
  MessageOutlined,
  FileExcelOutlined,
  DownOutlined,
  DownloadOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Table,
  Popover,
  Modal,
  Button,
  DatePicker,
  Card,
  Tag,
  Menu,
  Drawer,
  Dropdown,
  Checkbox,
  message,
  Select,
  Row,
  Col,
} from "antd";
import { useAuth } from "@/services/auth";
import { useTulkhuurUg } from "@/hook/useTulkhuurUg";
import moment from "moment";
import useJagsaalt from "@/hook/useJagsaalt";
import deleteMethod from "@/tools/functions/crud/deleteMethod";

const searchKeys = ["ajiltan.ner", "tailbar", "asuultiinNer"];
const order = { createdAt: -1 };
const khuudasniiKhemjee = 100;

const page = () => {
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    ajiltan: null,
    tsol: null,
    tasag: null,
    kheltes: null,
    asuultiinNer: null,
    turul: null,
  });
  const { token } = useAuth();
  const { tulkhuurUgGaralt } = useTulkhuurUg(token);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const query = useMemo(() => {
    let baseQuery = {
      asuultiinId: {
        $ne: "654a406e943e5ca31352edb1",
      },
    };

    if (ekhlekhOgnoo.length > 0) {
      baseQuery.createdAt = {
        $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
      };
    }

    if (filters.ajiltan) {
      baseQuery["ajiltan.ner"] = { $regex: filters.ajiltan, $options: "i" };
    }
    if (filters.tsol) {
      baseQuery["ajiltan.tsol"] = { $regex: filters.tsol, $options: "i" };
    }
    if (filters.tasag) {
      baseQuery["ajiltan.tasag"] = { $regex: filters.tasag, $options: "i" };
    }
    if (filters.kheltes) {
      baseQuery["ajiltan.kheltes"] = { $regex: filters.kheltes, $options: "i" };
    }
    if (filters.asuultiinNer) {
      baseQuery.asuultiinNer = { $regex: filters.asuultiinNer, $options: "i" };
    }
    if (filters.turul) {
      baseQuery.asuultiinTurul = { $regex: filters.turul, $options: "i" };
    }

    return baseQuery;
  }, [ekhlekhOgnoo, filters]);

  const [modalData, setModalData] = useState([]);
  const [modalGarchig, setModalGarchig] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const showModal = (khariultuud, data) => {
    setIsModalVisible(true);
    setModalData(khariultuud);
    setModalGarchig(data?.asuultiinNer);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showDrawer = (record) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedRecord(null);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRecords) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRecords(newSelectedRecords);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      name: record._id,
    }),
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Устгах Санал сонгоно уу");
      return;
    }

    Modal.confirm({
      title: "Санал устгах уу?",
      content: `${selectedRowKeys.length} санал устгах гэж байна.`,
      okText: "Тийм",
      cancelText: "Үгүй",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map((id) =>
            deleteMethod("khariult", token, id)
          );

          await Promise.all(deletePromises);

          message.success(
            `${selectedRowKeys.length} Санал амжилттай устгагдлаа`
          );
          setSelectedRowKeys([]);
          setSelectedRecords([]);
          khariultGaralt.mutate();
        } catch (error) {
          message.error("Устгахад алдаа гарлаа");
        }
      },
    });
  };

  const khariultGaralt = useJagsaalt(
    "/khariult",
    query,
    order,
    undefined,
    searchKeys,
    khuudasniiKhemjee
  );

  const filterOptions = useMemo(() => {
    const data = khariultGaralt?.data?.jagsaalt || [];
    return {
      ajiltan: [
        ...new Set(data.map((item) => item.ajiltan?.ner).filter(Boolean).map(name => name.trim())),
      ].sort(),
      tsol: [
        ...new Set(data.map((item) => item.ajiltan?.tsol).filter(Boolean).map(tsol => tsol.trim())),
      ].sort(),
      tasag: [
        ...new Set(data.map((item) => item.ajiltan?.tasag).filter(Boolean).map(tasag => tasag.trim())),
      ].sort(),
      kheltes: [
        ...new Set(data.map((item) => item.ajiltan?.kheltes).filter(Boolean).map(kheltes => kheltes.trim())),
      ].sort(),
      asuultiinNer: [
        ...new Set(data.map((item) => item.asuultiinNer).filter(Boolean).map(asuult => asuult.trim())),
      ].sort(),
      turul: [
        ...new Set(data.map((item) => item.asuultiinTurul).filter(Boolean).map(turul => turul.trim())),
      ].sort(),
    };
  }, [khariultGaralt?.data?.jagsaalt]);

  const goodKeywords = (tulkhuurUgGaralt?.jagsaalt || []).filter(
    (k) => k.turul === "Sain"
  );
  const badKeywords = (tulkhuurUgGaralt?.jagsaalt || []).filter(
    (k) => k.turul === "Muu"
  );
  const { regexAll, lowerToType } = (() => {
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
  })();

  const renderHighlighted = (text) => {
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

  const onChangeOgnoo = (dates, dateString) => {
    if (!dates) {
      setEkhlekhOgnoo([]);
    }
    if (dates && dates.length === 2) {
      setEkhlekhOgnoo(dateString);
    }
  };

  const MobileCardView = ({ data }) => {
    return (
      <div className="p-10 space-y-4">
        {data?.map((record, index) => (
          <Card
            key={record._id}
            className="border border-gray-200 shadow-sm transition-shadow hover:shadow-md"
            size="small"
          >
            <div className="space-y-3">
              <div className="flex justify-center items-center pb-2 border-b">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedRowKeys.includes(record._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRowKeys([...selectedRowKeys, record._id]);
                        setSelectedRecords([...selectedRecords, record]);
                      } else {
                        setSelectedRowKeys(
                          selectedRowKeys.filter((key) => key !== record._id)
                        );
                        setSelectedRecords(
                          selectedRecords.filter(
                            (rec) => rec._id !== record._id
                          )
                        );
                      }
                    }}
                  />
                  <CalendarOutlined className="text-gray-500" />
                  <span className="text-sm font-medium">
                    {moment(record.createdAt).format("MM/DD HH:mm")}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    №
                    {(khariultGaralt?.data?.khuudasniiDugaar || 0) *
                      (khariultGaralt?.data?.khuudasniiKhemjee || 0) -
                      (khariultGaralt?.data?.khuudasniiKhemjee || 0) +
                      index +
                      1}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserOutlined className="mt-1 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    {record.ajiltan?.ovog ? record.ajiltan.ovog[0] + "." : ""}
                    {record.ajiltan?.ner}
                  </div>
                  <div className="text-sm text-gray-600">
                    {record.ajiltan?.tsol}
                  </div>
                  <div className="text-xs text-gray-500">
                    {record.ajiltan?.tasag} - {record.ajiltan?.kheltes}
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700">Асуулт:</div>
                <div className="p-2 text-sm text-gray-900 bg-gray-50 rounded">
                  {record.asuultiinNer}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Tag
                  color={
                    record.asuultiinTurul === "sudalgaanii"
                      ? "blue"
                      : record.asuultiinTurul === "ajiltnii"
                      ? "green"
                      : "orange"
                  }
                  className="mb-0"
                >
                  {record.asuultiinTurul === "sudalgaanii"
                    ? "Судалгааны"
                    : record.asuultiinTurul === "ajiltnii"
                    ? "Ажилтны"
                    : "Иргэдийн"}
                </Tag>
                {record.utas && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <PhoneOutlined />
                    <span>{record.utas}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex space-x-2">
                  <Button
                    size="small"
                    icon={<MessageOutlined />}
                    onClick={() => showModal(record.khariultuud, record)}
                    className="hover:text-blue-400"
                  />
                  <Popover
                    trigger="click"
                    placement="topRight"
                    content={
                      <div className="max-w-xs">
                        {renderHighlighted(record.tailbar)}
                      </div>
                    }
                    overlayClassName="custom-popover"
                  >
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      className="hover:text-blue-400"
                    />
                  </Popover>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const desktopColumns = useMemo(
    () => [
      {
        title: (
          <div className="flex justify-center">
            <Checkbox
              checked={
                selectedRowKeys.length > 0 &&
                selectedRowKeys.length ===
                  (khariultGaralt?.data?.jagsaalt?.length || 0)
              }
              indeterminate={
                selectedRowKeys.length > 0 &&
                selectedRowKeys.length <
                  (khariultGaralt?.data?.jagsaalt?.length || 0)
              }
              onChange={(e) => {
                if (e.target.checked) {
                  const allIds =
                    khariultGaralt?.data?.jagsaalt?.map((item) => item._id) ||
                    [];
                  const allRecords = khariultGaralt?.data?.jagsaalt || [];
                  setSelectedRowKeys(allIds);
                  setSelectedRecords(allRecords);
                } else {
                  setSelectedRowKeys([]);
                  setSelectedRecords([]);
                }
              }}
            />
          </div>
        ),
        key: "select",
        className: "text-center",
        width: "50px",
        render: (text, record) => (
          <div className="flex justify-center">
            <Checkbox
              checked={selectedRowKeys.includes(record._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRowKeys([...selectedRowKeys, record._id]);
                  setSelectedRecords([...selectedRecords, record]);
                } else {
                  setSelectedRowKeys(
                    selectedRowKeys.filter((key) => key !== record._id)
                  );
                  setSelectedRecords(
                    selectedRecords.filter((rec) => rec._id !== record._id)
                  );
                }
              }}
            />
          </div>
        ),
      },
      {
        title: <div className="text-center">№</div>,
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (khariultGaralt?.data?.khuudasniiDugaar || 0) *
            (khariultGaralt?.data?.khuudasniiKhemjee || 0) -
          (khariultGaralt?.data?.khuudasniiKhemjee || 0) +
          index +
          1,
        width: "60px",
      },
      {
        title: <div className="text-center">Огноо</div>,
        key: "ognoo",
        align: "center",
        dataIndex: "createdAt",
        width: "140px",
        render: (a) => {
          return (
            <div className="flex justify-center items-center">
              {moment(a).format("YYYY/MM/DD HH:mm")}
            </div>
          );
        },
        ellipsis: true,
      },
      {
        title: <div className="text-center">Ажилтан</div>,
        key: "ajiltan",
        className: "text-left",
        dataIndex: "ajiltan",
        width: "120px",
        render: (a) => {
          return (
            <div>
              {a.ovog ? a?.ovog?.[0] + "." : ""}
              {a.ner}
            </div>
          );
        },
        ellipsis: true,
      },
      {
        title: <div className="text-center">Цол</div>,
        key: "tsol",
        className: "text-left",
        dataIndex: "ajiltan",
        width: "100px",
        render: (a) => {
          return <div>{a.tsol}</div>;
        },
        ellipsis: true,
      },
      {
        title: <div className="text-center">Тасаг</div>,
        key: "tasag",
        dataIndex: "ajiltan",
        width: 70,
        minWidth: 70,
        maxWidth: 70,
        render: (a) => {
          return (
            <div
              style={{
                fontSize: "12px",
                width: "70px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {a.tasag}
            </div>
          );
        },
        ellipsis: true,
      },
      {
        title: <div className="text-center">Хэлтэс</div>,
        key: "kheltes",
        dataIndex: "ajiltan",
        width: 70,
        minWidth: 70,
        maxWidth: 70,
        render: (a) => {
          return (
            <div
              style={{
                fontSize: "12px",
                width: "70px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {a.kheltes}
            </div>
          );
        },
        ellipsis: true,
      },
      {
        title: <div className="text-center">Асуулт</div>,
        key: "asuultiinNer",
        dataIndex: "asuultiinNer",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Төрөл</div>,
        dataIndex: "asuultiinTurul",
        width: "120px",
        align: "center",
        key: "asuultiinTurul",
        render: (a) => {
          return (
            <div className="flex justify-center items-center">
              <div
                className={`border text-center rounded-full w-fit py-1 px-2 ${
                  a === "sudalgaanii"
                    ? "bg-blue-300"
                    : a === "ajiltnii"
                    ? "bg-green-300"
                    : "bg-yellow-300"
                }`}
              >
                {a === "sudalgaanii"
                  ? "Судалгааны"
                  : "ajiltnii"
                  ? "Ажилтны"
                  : "Иргэдийн"}
              </div>
            </div>
          );
        },
        ellipsis: true,
      },
      {
        title: <div className="text-center">Утас</div>,
        dataIndex: "utas",
        align: "center",
        key: "utas",
        width: "100px",
      },
      {
        title: <div className="text-center">Хариулт</div>,
        dataIndex: "khariultuud",
        width: "80px",
        align: "center",
        key: "khariultuud",
        render: (khariultuud, data) => {
          return (
            <div className="flex justify-center items-center">
              <Button
                className="flex justify-center items-center rounded-full hover:text-blue-400"
                onClick={() => showModal(khariultuud, data)}
              >
                <MessageOutlined />
              </Button>
            </div>
          );
        },
        ellipsis: true,
      },
      {
        title: <div className="text-center">Сэтгэгдэл</div>,
        dataIndex: "tailbar",
        width: "80px",
        align: "center",
        key: "tailbar",
        render: (a) => (
          <div className="flex justify-center items-center">
            <Popover
              className="hover:text-blue-400"
              trigger="hover"
              placement="top"
              content={
                <div className="popover-content">
                  <div className="popover-item">{renderHighlighted(a)}</div>
                </div>
              }
              overlayClassName="custom-popover"
            >
              <Button className="flex justify-center items-center rounded-full hover:text-blue-400">
                <EyeOutlined />
              </Button>
            </Popover>
          </div>
        ),
        ellipsis: true,
      },
    ],
    [khariultGaralt, selectedRowKeys]
  );

  return (
    <Nav onSearch={khariultGaralt.onSearch}>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <DatePicker.RangePicker
            style={{ height: "32px" }}
            size="small"
            placeholder={["Эхлэх огноо", "Дуусах огноо"]}
            format={"YYYY-MM-DD"}
            onChange={onChangeOgnoo}
            getPopupContainer={() => document.body}
          />

          <Select
            placeholder="Ажилтан"
            size="small"
            className="w-32"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.ajiltan}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, ajiltan: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.ajiltan.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Цол"
            size="small"
            className="w-28"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.tsol}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, tsol: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.tsol.map((tsol) => (
              <Select.Option key={tsol} value={tsol}>
                {tsol}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Тасаг"
            size="small"
            className="w-24"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.tasag}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, tasag: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.tasag.map((tasag) => (
              <Select.Option key={tasag} value={tasag}>
                {tasag}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Хэлтэс"
            size="small"
            className="w-24"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.kheltes}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, kheltes: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.kheltes.map((kheltes) => (
              <Select.Option key={kheltes} value={kheltes}>
                {kheltes}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Асуулт"
            size="small"
            className="w-40"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.asuultiinNer}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, asuultiinNer: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.asuultiinNer.map((asuult) => (
              <Select.Option key={asuult} value={asuult}>
                {asuult}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Төрөл"
            size="small"
            className="w-32"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.turul}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, turul: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.turul.map((turul) => (
              <Select.Option key={turul} value={turul}>
                {turul}
              </Select.Option>
            ))}
          </Select>

          <Button
            size="small"
            type="primary"
            style={{ height: "32px" }}
            className="px-3 bg-blue-500"
            onClick={() =>
              setFilters({
                ajiltan: null,
                tsol: null,
                tasag: null,
                kheltes: null,
                asuultiinNer: null,
                turul: null,
              })
            }
          >
            Цэвэрлэх
          </Button>

          <div className="flex gap-2 ml-auto">
            <Popover
              content={() => (
                <div className="flex flex-col pl-4 w-32">
                  <a
                    className="flex items-center p-1 space-x-2 rounded-lg cursor-pointer hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => {
                      const { Excel } = require("antd-table-saveas-excel");
                      const excelExport = new Excel();
                      excelExport
                        .addSheet("Судалгаа")
                        .addColumns([
                          {
                            title: "Бөглөсөн огноо",
                            dataIndex: "createdAt",
                            render(ognoo) {
                              return moment(ognoo).format(
                                "YYYY-MM-DD HH:mm:ss"
                              );
                            },
                          },
                          {
                            title: "Тасаг",
                            dataIndex: ["ajiltan", "tasag"],
                          },
                          {
                            title: "Хэлтэс",
                            dataIndex: ["ajiltan", "kheltes"],
                          },
                          {
                            title: "Цол",
                            dataIndex: ["ajiltan", "tsol"],
                          },
                          {
                            title: "Овог",
                            dataIndex: ["ajiltan", "ovog"],
                          },
                          {
                            title: "Нэр",
                            dataIndex: ["ajiltan", "ner"],
                          },
                          {
                            title: "Санал хүсэлт",
                            dataIndex: "tailbar",
                          },
                          {
                            title: "Утас",
                            dataIndex: "utas",
                          },
                          {
                            title: "Ажилтан танд туслахад бэлэн байсан уу?",
                            dataIndex: ["khariultuud", "0", "khariult"],
                          },
                          {
                            title: "Ажилтны эелдэг таатай харилцаа",
                            dataIndex: ["khariultuud", "1", "khariult"],
                          },
                          {
                            title:
                              "Ажилтны бүх үйлчлүүлэгчидтэй ижил тэгш харилцах байдал",
                            dataIndex: ["khariultuud", "2", "khariult"],
                          },
                          {
                            title: "Ажилдаа хариуцлагатай ханддаг байдал",
                            dataIndex: ["khariultuud", "3", "khariult"],
                          },
                          {
                            title: "Ажилтны цаг баримтлах, ашиглах байдал",
                            dataIndex: ["khariultuud", "4", "khariult"],
                          },
                          {
                            title:
                              "Ажилтны асуудлыг нэг удаагийн хандалтаар шийдэж өгөхийг хичээдэг байдал",
                            dataIndex: ["khariultuud", "5", "khariult"],
                          },
                          {
                            title: "Ажилтны мэргэжлийн ур чадвар, мэдлэг",
                            dataIndex: ["khariultuud", "6", "khariult"],
                          },
                          {
                            title: "Ажилтны шударга байдал / Гар харах /",
                            dataIndex: ["khariultuud", "7", "khariult"],
                          },
                        ])
                        .addDataSource(khariultGaralt?.data?.jagsaalt)
                        .saveAs(`${"Судалгаа"}.xlsx`);
                    }}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>{"Татах"}</label>
                  </a>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <Button
                type="primary"
                className="hidden gap-2 items-center w-full bg-blue-500 md:w-auto lg:flex"
                style={{ marginTop: "10px" }}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Excel</span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DownOutlined style={{ fontSize: "12px" }} />
                </span>
              </Button>
            </Popover>
            <Button
              type="primary"
              danger
              className="w-full md:w-auto"
              style={{ marginTop: "10px" }}
              disabled={selectedRowKeys.length === 0}
              onClick={handleDeleteSelected}
            >
              Устгах ({selectedRowKeys.length})
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4">
        {isMobile ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-[90vw]">
              <MobileCardView data={khariultGaralt?.data?.jagsaalt} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <Table
              bordered
              tableLayout="fixed"
              size="small"
              scroll={{ x: "max-content", y: "calc(100vh - 20rem)" }}
              rowClassName="hover:bg-blue-50"
              rowKey={(row) => row._id}
              loading={!khariultGaralt}
              dataSource={khariultGaralt?.data?.jagsaalt}
              columns={desktopColumns}
              pagination={{
                current: khariultGaralt?.data?.khuudasniiDugaar,
                pageSize: khariultGaralt?.data?.khuudasniiKhemjee,
                total: khariultGaralt?.data?.niitMur,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100, 500],
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  khariultGaralt.setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
            />
          </div>
        )}

        {isMobile && (
          <div className="flex flex-col items-center py-4 space-y-4">
            {selectedRowKeys.length > 0 && (
              <Button
                type="primary"
                danger
                onClick={handleDeleteSelected}
                className="w-full max-w-xs"
              >
                Устгах ({selectedRowKeys.length})
              </Button>
            )}
            <div className="flex items-center space-x-4">
              <Button
                disabled={khariultGaralt?.data?.khuudasniiDugaar <= 1}
                onClick={() =>
                  khariultGaralt.setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar: Math.max(1, kh.khuudasniiDugaar - 1),
                  }))
                }
              >
                Өмнөх
              </Button>
              {/* <span className="text-sm">
                  {khariultGaralt?.data?.khuudasniiDugaar} /{" "}
                  {Math.ceil(
                    (khariultGaralt?.data?.niitMur || 0) /
                      (khariultGaralt?.data?.khuudasniiKhemjee || 20)
                  )}
                </span> */}
              <Button
                disabled={
                  khariultGaralt?.data?.khuudasniiDugaar >=
                  Math.ceil(
                    (khariultGaralt?.data?.niitMur || 0) /
                      (khariultGaralt?.data?.khuudasniiKhemjee || 20)
                  )
                }
                onClick={() =>
                  khariultGaralt.setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar: kh.khuudasniiDugaar + 1,
                  }))
                }
              >
                Дараах
              </Button>
            </div>
          </div>
        )}
      </div>

      <Drawer
        title="Дэлгэрэнгүй мэдээлэл"
        placement="bottom"
        height="80%"
        onClose={closeDrawer}
        open={drawerVisible}
        className="md:hidden"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Огноо:
                </label>
                <div className="text-sm text-gray-900">
                  {moment(selectedRecord.createdAt).format("YYYY-MM-DD HH:mm")}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Ажилтан:
                </label>
                <div className="text-sm text-gray-900">
                  {selectedRecord.ajiltan?.ovog
                    ? selectedRecord.ajiltan.ovog[0] + "."
                    : ""}
                  {selectedRecord.ajiltan?.ner}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Цол:
                </label>
                <div className="text-sm text-gray-900">
                  {selectedRecord.ajiltan?.tsol}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Тасаг:
                </label>
                <div className="text-sm text-gray-900">
                  {selectedRecord.ajiltan?.tasag}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Хэлтэс:
                </label>
                <div className="text-sm text-gray-900">
                  {selectedRecord.ajiltan?.kheltes}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Асуулт:
                </label>
                <div className="p-3 text-sm text-gray-900 bg-gray-50 rounded">
                  {selectedRecord.asuultiinNer}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Утас:
                </label>
                <div className="text-sm text-gray-900">
                  {selectedRecord.utas || "Байхгүй"}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Сэтгэгдэл:
                </label>
                <div className="p-3 text-sm text-gray-900 bg-gray-50 rounded">
                  {renderHighlighted(selectedRecord.tailbar)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                type="primary"
                block
                onClick={() =>
                  showModal(selectedRecord.khариулtuud, selectedRecord)
                }
              >
                Хариултуудыг харах
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        title={modalGarchig}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={isMobile ? "95%" : "50%"}
        centered={isMobile}
      >
        <div className="space-y-4">
          {modalData.map((item, index) => (
            <div key={index} className="pb-3 border-b last:border-b-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-start space-x-2">
                  <span className="flex-shrink-0 px-2 py-1 mt-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    {index + 1}
                  </span>
                  <div className="flex-1 text-sm font-medium text-gray-700">
                    {item.asuult}
                  </div>
                </div>
                <div className="p-2 ml-8 text-sm text-gray-900 bg-gray-50 rounded">
                  {item.khariult}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </Nav>
  );
};

export default page;
