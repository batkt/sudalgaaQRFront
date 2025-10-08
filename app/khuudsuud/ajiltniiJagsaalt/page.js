"use client";

import Nav from "@/components/Nav";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Popover,
  Upload,
  message,
  Dropdown,
  Menu,
  Popconfirm,
  Card,
  Avatar,
  Tag,
  DatePicker,
  Checkbox,
  Select,
} from "antd";
import {
  SettingOutlined,
  QrcodeOutlined,
  CloseCircleOutlined,
  FileExcelOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserAddOutlined,
  SwapOutlined,
  EyeOutlined,
  MessageOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import QRCode from "qrcode.react";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import useJagsaalt from "@/hook/useJagsaalt";
import uilchilgee, { aldaaBarigch, url } from "@/services/uilchilgee";
import getBase64 from "@/tools/functions/getBase64";
import { useAuth } from "@/services/auth";
import { modal } from "@/components/ant/Modal";
import Excel from "@/components/modal/Excel";
import { useRouter } from "next/navigation";
import AjiltanNemekh from "@/components/modal/AjiltanNemekh";
import BaganiinSongolt from "@/components/table/BaganiinSongolt";
import moment from "moment";

const order = { createdAt: -1 };
const searchKeys = [
  "ovog",
  "ner",
  "tsol",
  "tasag",
  "register",
  "kheltes",
  "duureg",
  "albanTushaal",
  "utas",
  "asuult",
];

const UploadKharya = ({ zurgiinId, data, token, ajiltanGaralt }) => {
  const zuragRef = useRef(null);
  const ekhniiZuragRef = useRef(null);
  const buttonRef = useRef(null);
  const emptyRef = useRef(null);
  const [zurag, setZurag] = useState();

  function beforeUpload(file, callback) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    callback(file);
    return true;
  }

  function khadgalakh(data) {
    const id = data._id;
    uilchilgee(token)
      .put(`/ajiltan/${id}`, { zurgiinId: zurag })
      .then(({ data }) => {
        if (!!data) {
          if (data === "Amjilttai") {
            uilchilgee(token)
              .post("/confirmFile", {
                filename: zurag,
                path: "ajiltan",
              })
              .then(({ data }) => {});
            message.success("Амжилттай хадгалагдлаа!");
            emptyRef.current.classList.remove("hidden");
            buttonRef.current.classList.add("hidden");
            ajiltanGaralt?.mutate();
          }
        }
      });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Upload
        showUploadList={false}
        multiple={false}
        name="file"
        maxCount={1}
        action={`${url}/upload`}
        method="POST"
        onChange={(v) => setZurag(v.file.response)}
        beforeUpload={(file) => {
          function handleChange(img) {
            getBase64(img, (img) => (zuragRef.current.src = img));
            zuragRef.current.classList.remove("hidden");
            emptyRef.current.classList.add("hidden");
            buttonRef.current.classList.remove("hidden");
            ekhniiZuragRef.current.classList.add("hidden");
          }
          return beforeUpload(file, handleChange);
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-start justify-center w-24 h-24 overflow-hidden">
            <img
              ref={ekhniiZuragRef}
              className=""
              src={
                zurgiinId
                  ? `${url}/file?path=ajiltan/${zurgiinId}`
                  : "/assets/profile.png"
              }
              style={{ borderRadius: "100%" }}
            />
            <img ref={zuragRef} src="" className="hidden" />
          </div>
          <Button ref={emptyRef} className="text-white bg-blue-600 w-fit">
            {zurgiinId ? "Зураг солих" : "Зураг оруулах"}
          </Button>
        </div>
      </Upload>
      <Button
        ref={buttonRef}
        className="hidden text-white bg-blue-600 w-fit"
        onClick={() => khadgalakh(data)}
      >
        Хадгалах
      </Button>
    </div>
  );
};

const EmployeeCard = ({
  record,
  index,
  token,
  ajiltanGaralt,
  navigateToPage,
  showModal,
  showModal2,
  showModal3,
  nevtersenAjiltanErkh,
  erkhUgyu,
  zasya,
  ajiltanUstgakh,
  negAjiltan,
  selectedRowKeys,
  setSelectedRowKeys,
  selectedRecords,
  setSelectedRecords,
}) => {
  return (
    <Card
      key={record._id}
      className="transition-shadow border border-gray-200 shadow-sm hover:shadow-md"
      size="small"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b">
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
                    selectedRecords.filter((rec) => rec._id !== record._id)
                  );
                }
              }}
            />
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 rounded-full">
              №{index + 1}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Popover
              trigger="click"
              content={
                <UploadKharya
                  zurgiinId={record.zurgiinId}
                  data={record}
                  token={token}
                  ajiltanGaralt={ajiltanGaralt}
                />
              }
            >
              <Avatar
                size={60}
                src={
                  record.zurgiinId
                    ? `${url}/file?path=ajiltan/${record.zurgiinId}`
                    : "/assets/profile.png"
                }
                className="border-2 border-gray-200"
              />
            </Popover>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">
              {record.ovog} {record.ner}
            </div>
            <div className="text-sm text-gray-600">{record.tsol}</div>
            <div className="text-xs text-gray-500">
              {record.tasag} {record.kheltes && `- ${record.kheltes}`}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="p-2 text-sm text-gray-900 rounded bg-gray-50">
            Регистр: {record.register}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {record.erkh && (
            <Tag
              color={
                record.erkh === "superAdmin"
                  ? "red"
                  : record.erkh === "admin"
                  ? "blue"
                  : record.erkh === "boss"
                  ? "orange"
                  : "green"
              }
            >
              {record.erkh === "superAdmin"
                ? "Super Admin"
                : record.erkh === "admin"
                ? "Admin"
                : record.erkh === "boss"
                ? "Boss"
                : "User Admin"}
            </Tag>
          )}
          {record.utas && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <PhoneOutlined />
              <span>{record.utas}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex space-x-2">
            <Popover
              trigger="click"
              content={
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xs">Хаалга</p>
                    <Button
                      onClick={showModal}
                      size="small"
                      className="flex items-center justify-center"
                    >
                      <QrcodeOutlined />
                    </Button>
                  </div>
                  <div className="h-8 mx-2 border-l border-dashed"></div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xs">Ширээ</p>
                    <Button
                      onClick={showModal2}
                      size="small"
                      className="flex items-center justify-center"
                    >
                      <QrcodeOutlined />
                    </Button>
                  </div>
                  <div className="h-8 mx-2 border-l border-dashed"></div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xs">Гадаа</p>
                    <Button
                      onClick={showModal3}
                      size="small"
                      className="flex items-center justify-center"
                    >
                      <QrcodeOutlined />
                    </Button>
                  </div>
                </div>
              }
            >
              <Button
                size="small"
                icon={<QrcodeOutlined />}
                onClick={() => navigateToPage(record._id)}
                className="hover:text-blue-400"
              />
            </Popover>
            {/* <Button
              size="small"
              icon={<EyeOutlined />}
              className="hover:text-blue-400"
            /> */}
          </div>

          {nevtersenAjiltanErkh && nevtersenAjiltanErkh !== "userAdmin" && (
            <Popover
              placement="bottomRight"
              trigger="click"
              content={() => (
                <div className="flex flex-col w-32 space-y-2">
                  {nevtersenAjiltanErkh === "superAdmin" && (
                    <Button
                      type="text"
                      size="small"
                      className="flex items-center justify-start"
                      onClick={() => erkhUgyu(negAjiltan, record._id)}
                    >
                      <UserAddOutlined className="mr-2" />
                      Эрх
                    </Button>
                  )}
                  <Button
                    type="text"
                    size="small"
                    className="flex items-center justify-start"
                    onClick={() => zasya(record._id)}
                  >
                    <EditOutlined className="mr-2" />
                    Засах
                  </Button>
                  {nevtersenAjiltanErkh !== "boss" && (
                    <Popconfirm
                      title="Ажилтан устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      okButtonProps={{ className: "bg-blue-500" }}
                      onConfirm={() => ajiltanUstgakh(record._id)}
                    >
                      <Button
                        type="text"
                        size="small"
                        className="flex items-center justify-start text-red-500"
                      >
                        <DeleteOutlined className="mr-2" />
                        Устгах
                      </Button>
                    </Popconfirm>
                  )}
                </div>
              )}
            >
              <Button size="small">
                <MoreOutlined />
              </Button>
            </Popover>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function ajiltniiJagsaalt() {
  const router = useRouter();
  const { token, nevtersenAjiltanErkh } = useAuth();
  const excel = useRef(null);
  const ajiltanRef = useRef(null);
  const [negAjiltan, setNegAjiltan] = useState({});
  const [asuultData, setAsuultData] = useState("");
  const [shineBagana, setShineBagana] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [filters, setFilters] = useState({
    ner: null,
    albanTushaal: null,
    duureg: null,
    tsol: null,
    tasag: null,
    kheltes: null,
  });

  const query = useMemo(() => {
    let baseQuery = {};

    if (filters.ner) {
      baseQuery.ner = { $regex: filters.ner, $options: "i" };
    }
    if (filters.albanTushaal) {
      baseQuery.albanTushaal = { $regex: filters.albanTushaal, $options: "i" };
    }
    if (filters.duureg) {
      baseQuery.duureg = { $regex: filters.duureg, $options: "i" };
    }
    if (filters.tsol) {
      baseQuery.tsol = { $regex: filters.tsol, $options: "i" };
    }
    if (filters.tasag) {
      baseQuery.tasag = { $regex: filters.tasag, $options: "i" };
    }
    if (filters.kheltes) {
      baseQuery.kheltes = { $regex: filters.kheltes, $options: "i" };
    }

    return baseQuery;
  }, [filters]);

  const ajiltanGaralt = useJagsaalt(
    "/ajiltan",
    query,
    order,
    undefined,
    searchKeys,
    100
  );

  const filterOptions = useMemo(() => {
    const data = ajiltanGaralt?.data?.jagsaalt || [];
    return {
      ner: [
        ...new Set(
          data
            .map((item) => item.ner)
            .filter(Boolean)
            .map((name) => name.trim())
        ),
      ].sort(),
      albanTushaal: [
        ...new Set(
          data
            .map((item) => item.albanTushaal)
            .filter(Boolean)
            .map((tushaal) => tushaal.trim())
        ),
      ].sort(),
      duureg: [
        ...new Set(
          data
            .map((item) => item.duureg)
            .filter(Boolean)
            .map((duureg) => duureg.trim())
        ),
      ].sort(),
      tsol: [
        ...new Set(
          data
            .map((item) => item.tsol)
            .filter(Boolean)
            .map((tsol) => tsol.trim())
        ),
      ].sort(),
      tasag: [
        ...new Set(
          data
            .map((item) => item.tasag)
            .filter(Boolean)
            .map((tasag) => tasag.trim())
        ),
      ].sort(),
      kheltes: [
        ...new Set(
          data
            .map((item) => item.kheltes)
            .filter(Boolean)
            .map((kheltes) => kheltes.trim())
        ),
      ].sort(),
    };
  }, [ajiltanGaralt?.data?.jagsaalt]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    uilchilgee()
      .get("/idevkhteiAsuultIdAvya")
      .then((response) => {
        setAsuultData(response.data);
      })
      .catch((error) => {
        aldaaBarigch(error);
      });
  }, []);

  function navigateToPage(id) {
    const fetchData = async () => {
      try {
        const response = await uilchilgee().get(`/ajiltanIdgaarAvya/${id}`);
        setNegAjiltan(response.data);
      } catch (error) {}
    };
    fetchData();
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const showModal3 = () => {
    setIsModalOpen3(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen3(false);
  };

  const printRef = useRef(null);
  const printRef2 = useRef(null);
  const printRef3 = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint2 = useReactToPrint({
    content: () => printRef2.current,
  });

  const handlePrint3 = useReactToPrint({
    content: () => printRef3.current,
  });

  const columns = useMemo(() => {
    var data = [
      {
        title: <div className="text-center">№</div>,
        key: "index",
        className: "text-center",
        render: (text, record, index) =>
          (ajiltanGaralt?.data?.khuudasniiDugaar || 0) *
            (ajiltanGaralt?.data?.khuudasniiKhemjee || 0) -
          (ajiltanGaralt?.data?.khuudasniiKhemjee || 0) +
          index +
          1,
        width: "0.5rem",
      },
      {
        title: "Зураг",
        dataIndex: "zurgiinId",
        width: "4rem",
        align: "center",
        ellipsis: true,
        render: (zurgiinId, data) => {
          var zuragcomp = (
            <img
              src={
                zurgiinId
                  ? `${url}/file?path=ajiltan/${zurgiinId}`
                  : "/assets/profile.png"
              }
              style={{ borderRadius: "50%" }}
            />
          );
          return (
            zuragcomp && (
              <Popover
                trigger="click"
                content={
                  <UploadKharya
                    zurgiinId={zurgiinId}
                    data={data}
                    token={token}
                    ajiltanGaralt={ajiltanGaralt}
                  />
                }
              >
                <div className="inline-flex justify-center w-6 h-6 p-1 bg-gray-200 rounded-full shadow-xl">
                  {zuragcomp}
                </div>
              </Popover>
            )
          );
        },
      },
      {
        title: <div className="text-center">Овог</div>,
        key: "ovog",
        className: "text-left",
        dataIndex: "ovog",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Нэр</div>,
        key: "ner",
        dataIndex: "ner",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Регистр</div>,
        key: "register",
        dataIndex: "register",
        ellipsis: true,
      },
    ];
    var tasalsanBagana = [
      {
        title: <div className="text-center">Цол</div>,
        dataIndex: "tsol",
        key: "tsol",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Тасаг</div>,
        width: "6 rem",
        dataIndex: "tasag",
        key: "tasag",
        ellipsis: true,
      },
      {
        title: <div className="text-center">Хэлтэс</div>,
        width: "6 rem",
        dataIndex: "kheltes",
        key: "kheltes",
        ellipsis: true,
      },
      {
        title: <SettingOutlined />,
        key: "qrKharakh",
        width: "4rem",
        align: "center",
        ellipsis: true,
        render: (text, record) => {
          const id = text._id;
          return (
            <Popover
              trigger="click"
              content={
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>Хаалга</p>
                    <Button
                      onClick={showModal}
                      className="flex items-center justify-center"
                    >
                      <QrcodeOutlined />
                    </Button>
                  </div>
                  <div className="h-full py-4 border-2 border-dashed"></div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>Ширээ</p>
                    <Button
                      onClick={showModal2}
                      className="flex items-center justify-center"
                    >
                      <QrcodeOutlined />
                    </Button>
                  </div>
                  <div className="h-full py-4 border-2 border-dashed"></div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>Гадаа</p>
                    <Button
                      onClick={showModal3}
                      className="flex items-center justify-center"
                    >
                      <QrcodeOutlined />
                    </Button>
                  </div>
                </div>
              }
            >
              <Button
                className="flex items-center justify-center"
                onClick={() => navigateToPage(id)}
              >
                <QrcodeOutlined />
              </Button>
            </Popover>
          );
        },
      },
    ];
    data = [...data, ...shineBagana, ...tasalsanBagana];

    if (nevtersenAjiltanErkh && nevtersenAjiltanErkh !== "userAdmin") {
      data.push({
        title: "",
        key: "Uurchlukh",
        width: "3rem",
        align: "center",
        ellipsis: true,
        render: (data) => {
          const id = data._id;
          return (
            <div className="flex flex-row items-center justify-center w-full h-full">
              <Popover
                placement="bottom"
                trigger="click"
                content={() => (
                  <div className="flex flex-col w-24 space-y-2">
                    {nevtersenAjiltanErkh === "superAdmin" && (
                      <a
                        className="flex items-center justify-between w-full p-2 rounded-lg ant-dropdown-link hover:bg-green-100 dark:hover:bg-gray-600"
                        onClick={() => erkhUgyu(negAjiltan, id)}
                      >
                        <UserAddOutlined style={{ fontSize: "18px" }} />
                        <label>Эрх</label>
                      </a>
                    )}
                    <a
                      className="flex items-center justify-between w-full p-2 rounded-lg ant-dropdown-link hover:bg-green-100 dark:hover:bg-gray-600"
                      onClick={() => zasya(id)}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                      <label>Засах</label>
                    </a>
                    <Popconfirm
                      title="Ажилтан устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      okButtonProps={{ className: "bg-blue-500" }}
                      onConfirm={() => ajiltanUstgakh(id)}
                    >
                      {nevtersenAjiltanErkh !== "boss" && (
                        <a className="flex items-center justify-between w-full p-2 rounded-lg ant-dropdown-link hover:bg-green-100 dark:hover:bg-gray-600">
                          <DeleteOutlined
                            style={{ fontSize: "18px", color: "red" }}
                          />
                          <label>Устгах</label>
                        </a>
                      )}
                    </Popconfirm>
                  </div>
                )}
              >
                <a
                  onClick={() => navigateToPage(id)}
                  className="flex items-center justify-center p-1 rounded-full hover:bg-gray-200"
                >
                  <MoreOutlined style={{ fontSize: "18px" }} />
                </a>
              </Popover>
            </div>
          );
        },
      });
    }
    return data;
  }, [token, ajiltanGaralt, nevtersenAjiltanErkh, selectedRowKeys]);

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
          <div>Ажилтан бүртгэх</div>
          <CloseCircleOutlined
            onClick={() => excel.current.khaaya()}
            className="text-2xl hover:text-red-400"
          />
        </div>
      ),
      icon: <FileExcelOutlined />,
      footer,
      content: (
        <Excel ref={excel} token={token} ajiltanMutate={ajiltanGaralt.mutate} />
      ),
    });
  }

  function erkhUgyu(ajiltan, id) {
    const footer = [
      <div className="flex justify-end">
        <Button onClick={() => ajiltanRef.current.khaaya()}>Хаах</Button>
        <Button
          type="primary"
          className="bg-blue-500"
          onClick={() => ajiltanRef.current.khadgalya()}
        >
          Хадгалах
        </Button>
      </div>,
    ];
    modal({
      title: `${ajiltan?.ovog?.[0] || ""}${ajiltan?.ovog ? "." : ""}${
        ajiltan?.ner
      }`,
      content: (
        <AjiltanNemekh
          ref={ajiltanRef}
          token={token}
          data={ajiltan}
          ajiltanId={id}
        />
      ),
      footer,
    });
  }

  function ajiltanUstgakh(id) {
    uilchilgee(token)
      .delete(`ajiltan/${id}`)
      .then((res) => ajiltanGaralt.refresh())
      .catch((err) => aldaaBarigch(err));
  }

  function zasya(id) {
    if (!id) return message.warning("Ажилтан сонгогдоогүй байна!");
    router.push(`/khuudsuud/burtgekh/${id}`);
  }

  const onSelectChange = (newSelectedRowKeys, newSelectedRecords) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRecords(newSelectedRecords);
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Устгах ажилтан сонгоно уу");
      return;
    }

    Modal.confirm({
      title: "Ажилтан устгах уу?",
      content: `${selectedRowKeys.length} ажилтан устгах гэж байна.`,
      okText: "Тийм",
      cancelText: "Үгүй",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const deletePromises = selectedRowKeys.map((id) =>
            uilchilgee(token).delete(`ajiltan/${id}`)
          );

          await Promise.all(deletePromises);

          message.success(
            `${selectedRowKeys.length} ажилтан амжилттай устгагдлаа`
          );
          setSelectedRowKeys([]);
          setSelectedRecords([]);
          // Refresh the data
          ajiltanGaralt.refresh();
        } catch (error) {
          message.error("Устгахад алдаа гарлаа");
        }
      },
    });
  };

  return (
    <Nav onSearch={ajiltanGaralt.onSearch}>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <DatePicker.RangePicker
            style={{ height: "32px" }}
            size="small"
            placeholder={["Эхлэх огноо", "Дуусах огноо"]}
            format={"YYYY-MM-DD"}
            getPopupContainer={() => document.body}
          />

          <Select
            placeholder="Нэр"
            size="small"
            className="w-32"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.ner}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, ner: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.ner.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Албан тушаал"
            size="small"
            className="w-32"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.albanTushaal}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, albanTushaal: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.albanTushaal.map((tushaal) => (
              <Select.Option key={tushaal} value={tushaal}>
                {tushaal}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Дүүрэг"
            size="small"
            className="w-28"
            style={{ height: "32px" }}
            allowClear
            showSearch
            value={filters.duureg}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, duureg: value }))
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {filterOptions.duureg.map((duureg) => (
              <Select.Option key={duureg} value={duureg}>
                {duureg}
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

          <Button
            size="small"
            style={{ height: "32px" }}
            className="px-3 text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-700"
            onClick={() =>
              setFilters({
                ner: null,
                albanTushaal: null,
                duureg: null,
                tsol: null,
                tasag: null,
                kheltes: null,
              })
            }
          >
            Цэвэрлэх
          </Button>

          <div className="flex gap-2 ml-auto">
            <div className="flex-wrap items-center justify-center hidden gap-2 md:flex">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => excelOruulya()}>
                      Excel оруулах
                    </Menu.Item>
                  </Menu>
                }
                trigger="click"
              >
                <button className="flex items-center justify-between w-40 h-10 px-4 py-2 bg-white border rounded-lg cursor-pointer">
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
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                className="flex items-center justify-between w-40 h-10 px-4 py-2 text-sm"
                columns={[
                  {
                    title: <div className="text-center">Албан тушаал</div>,
                    width: "8rem",
                    dataIndex: "albanTushaal",
                    key: "albanTushaal",
                    ellipsis: true,
                  },
                  {
                    title: <div className="text-center">Дүүрэг</div>,
                    dataIndex: "duureg",
                    width: "6rem",
                    key: "duureg",
                    ellipsis: true,
                  },
                  {
                    title: <div className="text-center">Нэр дуудлага</div>,
                    dataIndex: "porool",
                    width: "6rem",
                    key: "porool",
                    ellipsis: true,
                  },
                  {
                    title: <div className="text-center">Утас</div>,
                    dataIndex: "utas",
                    width: "6rem",
                    key: "utas",
                    ellipsis: true,
                  },
                  {
                    title: <div className="text-center">Эрх</div>,
                    dataIndex: "erkh",
                    width: "6rem",
                    key: "erkh",
                    ellipsis: true,
                    render: (data) => {
                      if (data === "superAdmin")
                        return (
                          <div className="uppercase border text-center font-[400] rounded-full w-full py-1 px-2 bg-red-300">
                            super admin
                          </div>
                        );
                      if (data === "admin")
                        return (
                          <div className="uppercase border text-center font-[400] rounded-full w-full py-1 px-2 bg-blue-300">
                            admin
                          </div>
                        );
                      if (data === "boss")
                        return (
                          <div className="uppercase border text-center font-[400] rounded-full w-full py-1 px-2 bg-yellow-300 ">
                            boss
                          </div>
                        );
                      if (data === "userAdmin")
                        return (
                          <div className="uppercase border text-center font-[400] rounded-full w-full py-1 px-2 bg-green-300">
                            user admin
                          </div>
                        );
                      if (!data) return <div> </div>;
                    },
                  },
                ]}
              />
            </div>
            <Button
              type="primary"
              danger
              className="flex items-center justify-center w-40 h-10 px-4 py-2"
              disabled={selectedRowKeys.length === 0}
              onClick={handleDeleteSelected}
            >
              <span className="text-sm">Устгах ({selectedRowKeys.length})</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4">
        {isMobile ? (
          <div className="flex flex-col items-center space-y-4">
            {ajiltanGaralt?.data?.jagsaalt?.map((record, index) => (
              <div key={record._id} className="w-[90vw]">
                <EmployeeCard
                  record={record}
                  index={
                    (ajiltanGaralt?.data?.khuudasniiDugaar || 0) *
                      (ajiltanGaralt?.data?.khuudasniiKhemjee || 0) -
                    (ajiltanGaralt?.data?.khuudasniiKhemjee || 0) +
                    index
                  }
                  token={token}
                  ajiltanGaralt={ajiltanGaralt}
                  navigateToPage={navigateToPage}
                  showModal={showModal}
                  showModal2={showModal2}
                  showModal3={showModal3}
                  nevtersenAjiltanErkh={nevtersenAjiltanErkh}
                  erkhUgyu={erkhUgyu}
                  zasya={zasya}
                  ajiltanUstgakh={ajiltanUstgakh}
                  negAjiltan={negAjiltan}
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                  selectedRecords={selectedRecords}
                  setSelectedRecords={setSelectedRecords}
                />
              </div>
            ))}

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
                  disabled={ajiltanGaralt?.data?.khuudasniiDugaar <= 1}
                  onClick={() =>
                    ajiltanGaralt.setKhuudaslalt((kh) => ({
                      ...kh,
                      khuudasniiDugaar: Math.max(1, kh.khuudasniiDugaar - 1),
                    }))
                  }
                >
                  Өмнөх
                </Button>
                {/* <span className="text-xs">
                  {ajiltanGaralt?.data?.khuudasniiDugaar} /{" "}
                  {Math.ceil(
                    (ajiltanGaralt?.data?.niitMur || 0) /
                      (ajiltanGaralt?.data?.khuudasniiKhemjee || 20)
                  )}
                </span> */}
                <Button
                  disabled={
                    ajiltanGaralt?.data?.khuudasniiDugaar >=
                    Math.ceil(
                      (ajiltanGaralt?.data?.niitMur || 0) /
                        (ajiltanGaralt?.data?.khuudasniiKhemjee || 20)
                    )
                  }
                  onClick={() =>
                    ajiltanGaralt.setKhuudaslalt((kh) => ({
                      ...kh,
                      khuudasniiDugaar: kh.khuudasniiDugaar + 1,
                    }))
                  }
                >
                  Дараах
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <Table
              bordered
              tableLayout={
                ajiltanGaralt?.data?.jagsaalt?.length > 0 ? "auto" : "fixed"
              }
              size="small"
              scroll={{ x: "max-content", y: "calc(100vh - 20rem)" }}
              rowClassName="hover:bg-blue-50"
              rowKey={(row) => row._id}
              loading={!ajiltanGaralt}
              dataSource={ajiltanGaralt?.data?.jagsaalt}
              columns={columns}
              rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
                getCheckboxProps: (record) => ({
                  name: record._id,
                }),
              }}
              pagination={{
                current: ajiltanGaralt?.data?.khuudasniiDugaar,
                pageSize: ajiltanGaralt?.data?.khuudasniiKhemjee,
                total: ajiltanGaralt?.data?.niitMur,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100, 500],
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  ajiltanGaralt.setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
            />
          </div>
        )}
      </div>

      <Modal
        title={`${negAjiltan.ovog}  ${negAjiltan.ner}`}
        open={
          isModalOpen ? isModalOpen : isModalOpen2 ? isModalOpen2 : isModalOpen3
        }
        closable={false}
        centered
        width={600}
        maskClosable
        okText={"Хэвлэх"}
        className="max-h-[600px]"
        footer={null}
      >
        {isModalOpen2 ? (
          <div
            ref={printRef2}
            className="flex flex-col bg-white justify-between items-center p-12 h-[600px]"
          >
            <div className="flex flex-col items-center justify-center w-full gap-4 h-1/2 print:mt-12">
              <p className="uppercase font-[600]">тангараг</p>
              <p className="space-y-2 text-justify">
                Монгол Улсын иргэн би цагдаагийн албанд ажиллахдаа Монгол Улсын
                Үндсэн хууль, бусад хууль, алба хаагчийн ёс зүй, сахилга, нууцыг
                чанд сахин, чин шударгаар ажиллаж, шаардлага гарвал амь биеэ үл
                хайрлан зүтгэхээ батлан тангараглая. Би энэ тангаргаасаа няцваас
                хуулийн хариуцлага хүлээнэ.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 h-1/2 print:mt-32">
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col justify-start items-center w-[200px] h-[200px] border rounded-full overflow-hidden">
                  <img
                    className="object-contain"
                    src={`${url}/file?path=ajiltan/${negAjiltan?.zurgiinId}`}
                  />
                </div>
                <div className="flex items-center justify-center p-6 border">
                  <QRCode
                    value={`https://sudalgaa.zevtabs.mn/anket/${negAjiltan._id}/anket`}
                    renderAs="svg"
                    level="H"
                    size={150}
                    imageSettings={{
                      src: "/assets/shuukhLogo.webp",
                      excavate: true,
                      height: 40,
                      width: 40,
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full">
                <div className="flex flex-col items-start justify-center w-1/4 gap-2">
                  <span>Нэр :</span>
                  <span>Тасаг :</span>
                </div>
                <div className="flex flex-col items-start justify-center w-3/4 gap-2">
                  <span>
                    {negAjiltan?.ovog?.[0]}.{negAjiltan?.ner}
                  </span>
                  <span>{negAjiltan?.tasag}</span>
                </div>
              </div>
            </div>
          </div>
        ) : isModalOpen3 ? (
          <div
            ref={printRef3}
            className="flex flex-col bg-white justify-between items-center p-12 h-[600px]"
          >
            <div className="flex flex-col items-center justify-center gap-4 print:mt-32">
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center justify-center p-6 border">
                  <QRCode
                    value={`https://sudalgaa.zevtabs.mn/anket/${negAjiltan._id}/anket`}
                    renderAs="svg"
                    level="H"
                    size={350}
                    imageSettings={{
                      src: "/assets/shuukhLogo,webp",
                      excavate: true,
                      height: 100,
                      width: 100,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            ref={printRef}
            className="flex flex-col items-center justify-center p-12 overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center w-full mb-8">
              <h1 className="mb-8 text-lg font-bold">
                ТА ДООРХ QR-ЫГ УНШУУЛЖ, САНАЛАА ӨГНӨ ҮҮ.
              </h1>
              <h1 className="flex items-center justify-center text-justify">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Тээврийн цагдаагийн албанаас
                алба хаагч бүрийн харилцаа, хандлага, байгууллагын үйл
                ажиллагааг сайжруулах зорилгоор Танд үйлчилж байгаа алба
                хаагчийн харилцаа, хандлага, ёс зүй, ур чадварын үнэлгээг үнэлж
                байна.
              </h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center gap-8">
                <div className="flex flex-col justify-start items-center w-[200px] h-[200px] border rounded-full overflow-hidden">
                  <img
                    className="object-contain"
                    src={`${url}/file?path=ajiltan/${negAjiltan?.zurgiinId}`}
                  />
                </div>
                <div className="flex items-center justify-center p-6 border">
                  <QRCode
                    value={`https://sudalgaa.zevtabs.mn/anket/${negAjiltan._id}/anket`}
                    renderAs="svg"
                    level="H"
                    size={150}
                    imageSettings={{
                      src: "/assets/shuukhLogo.webp",
                      excavate: true,
                      height: 40,
                      width: 40,
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full">
                <div className="flex flex-col items-start justify-center w-1/4 gap-2">
                  <span>Овог :</span>
                  <span>Нэр :</span>
                  <span>Цол :</span>
                  <span>Тасаг :</span>
                  <span>Хэлтэс :</span>
                </div>
                <div className="flex flex-col items-start justify-center w-3/4 gap-2">
                  <span>{negAjiltan?.ovog}</span>
                  <span>{negAjiltan?.ner}</span>
                  <span>{negAjiltan?.tsol}</span>
                  <span>{negAjiltan?.tasag}</span>
                  <span>{negAjiltan?.kheltes}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button type="default" onClick={handleCancel}>
            Хаах
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button
                type="primary"
                onClick={
                  isModalOpen
                    ? handlePrint
                    : isModalOpen2
                    ? handlePrint2
                    : handlePrint3
                }
                className="bg-blue-400"
              >
                Хэвлэх
              </Button>
            )}
            content={() =>
              isModalOpen
                ? printRef.current
                : isModalOpen2
                ? printRef2.current
                : printRef3.current
            }
            pageStyle="@page { size: A5; margin: 0; } @media print { body { margin: 0; } }"
            bodyClass=""
          />
        </div>
      </Modal>
    </Nav>
  );
}
