"use client";

import { useState, useEffect, useRef } from "react";
import {
  BsSearch,
  BsGrid,
  BsBell,
  BsArrowsFullscreen,
  BsArrowsAngleContract,
  BsGraphUp,
  BsCheckCircle,
  BsCalculator,
} from "react-icons/bs";
import { MdOutlineSms, MdOutlineCategory } from "react-icons/md";
import { RiChatSettingsLine } from "react-icons/ri";
import Image from "next/image";
import { Button, Popover } from "antd";
import { MenuOutlined, CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import Link from "next/link";
import { FiLock, FiUserPlus, FiUsers } from "react-icons/fi";
import { useAuth } from "@/services/auth";
import { IoIosAnalytics } from "react-icons/io";
import { url } from "@/services/uilchilgee";
import { modal } from "./ant/Modal";
import NuutsUgSolikh from "./modal/NuutsUgSolikh";

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [style, setStyle] = useState("block");
  const toggleFullscreen = () => {
    const doc = window.document;
    const elem = doc.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else setStyle("hidden");
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else setStyle("hidden");
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <button
      className="hidden cursor-pointer sm:flex"
      onClick={toggleFullscreen}
    >
      {isFullscreen ? (
        <BsArrowsAngleContract className={style} />
      ) : (
        <BsArrowsFullscreen className={style} />
      )}
    </button>
  );
};

const Nav = ({ children, onSearch }) => {
  // const router = useRouter();
  // const pathName = usePathname();
  const nuutsUgRef = useRef(null);
  const drawerRef = useRef(null);
  const secondDrawerRef = useRef(null);

  const [nevtersenAjiltan, setNevtersenAjiltan] = useState(null);
  const [popoverKharagdakh, setPopoverKharagdakh] = useState(false);

  const { token, garya } = useAuth();

  useEffect(() => {
    const storedValue = localStorage.getItem("nevtersenAjiltan");
    const parsedValue = storedValue ? JSON.parse(storedValue) : null;
    setNevtersenAjiltan(parsedValue);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [songolt, setSongolt] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const drawerToggle = document.querySelector(".drawer-toggle");
      const isClickOnToggle =
        drawerToggle && drawerToggle.contains(event.target);

      if (
        !isClickOnToggle &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        secondDrawerRef.current &&
        !secondDrawerRef.current.contains(event.target)
      ) {
        setIsDrawerOpen(false);
        setSongolt("");
      }
    };

    if (isDrawerOpen || songolt !== "") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen, songolt]);

  // Дарк мод хийсний ар дээр комментноос гаргах

  // useEffect(() => {
  //   const prefersDarkMode =
  //     window.matchMedia &&
  //     window.matchMedia('(prefers-color-scheme: dark)').matches;

  //   setIsDarkMode(prefersDarkMode);
  // }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDrawer = () => {
    setIsDrawerOpen((curr) => !curr);
    if (songolt !== "") {
      setSongolt("");
    }
  };

  function nuutsUgSolyo(ajiltan, id) {
    const footer = [
      <div className="flex justify-end">
        <Button onClick={() => nuutsUgRef.current.khaaya()}>Хаах</Button>
        <Button
          type="primary"
          className="bg-blue-500"
          onClick={() => nuutsUgRef.current.khadgalya()}
        >
          Хадгалах
        </Button>
      </div>,
    ];
    modal({
      title: `${!!ajiltan?.ovog ? ajiltan?.ovog?.[0] : ""}${
        !!ajiltan?.ovog ? "." : ""
      }${ajiltan?.ner}`,
      content: (
        <NuutsUgSolikh
          ref={nuutsUgRef}
          token={token}
          data={ajiltan}
          ajiltanId={id}
        />
      ),
      footer,
    });
  }

  return (
    <div>
      <div className="overflow-hidden">
        <div className="flex justify-between items-center w-full bg-white shadow-md navi">
          <div className="flex gap-4 justify-center items-center">
            <button
              className="flex justify-center items-center p-2 mx-4 rounded-lg transition-colors duration-200 drawer-toggle sm:mx-8 hover:bg-gray-100"
              onClick={toggleDrawer}
            >
              {isDrawerOpen ? (
                <CloseOutlined className="flex justify-center items-center w-12 h-12" />
              ) : (
                <MenuOutlined className="flex justify-center items-center w-12 h-12" />
              )}
            </button>
            <div className="flex relative justify-center items-center px-4 py-2 h-10 bg-gray-100 rounded-2xl w-fit sm:w-full">
              <input
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-24 bg-gray-100 outline-none select-all sm:w-48"
                type="text"
                placeholder="Хайлт..."
              />
              <button className="absolute right-0 p-2 h-full rounded-full transition-colors duration-200 aspect-square hover:text-blue-400">
                <BsSearch />
              </button>
            </div>
            {/* <div className='flex gap-2 justify-center items-center px-4 py-2 h-10 bg-gray-100 rounded-2xl'>
              <button className='text-sm'>ХЭЛ</button>
              <BsCaretDownFill className='w-2'/>
            </div> */}
          </div>
          <div className="flex hidden absolute left-1/2 justify-center items-center w-full transform -translate-x-1/2 lg:flex pointer-events-none">
            <Link href="/dashboard/analytic" className="flex items-center cursor-pointer pointer-events-auto">
              <img className="w-32 h-32" src="/assets/logo.png" alt="logo" />
              <div className="hidden flex-col justify-center items-center xl:flex">
                <h2 className="w-full text-2xl text-center border-b">
                  ТЭЭВРИЙН ЦАГДААГИЙН АЛБА
                </h2>
                <h2 className="w-full text-sm text-center border-b">
                  ---ХӨДӨЛГӨӨНИЙ АЮУЛГҮЙ БАЙДЛЫН ТӨЛӨӨ---
                </h2>
              </div>
            </Link>
          </div>
          <div className="flex gap-6 justify-center items-center pr-16 switch sm:gap-4 md:gap-6">
            {/* <input
              type="checkbox"
              className="checkbox"
              id="switch"
              // checked={isDarkMode}
              // onChange={toggleTheme}
            />
            <label for="switch"></label>
            <BsGrid className="hidden cursor-pointer sm:flex" />
            <BsBell className="hidden cursor-pointer sm:flex" />
            <FullscreenButton /> */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <div className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Arial, sans-serif' }}>
                {currentTime.toLocaleTimeString('mn-MN', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: false 
                })}
              </div>
              <div className="text-xs text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>
                {currentTime.toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}
              </div>
            </div>
            <Popover
              onOpenChange={() =>
                setPopoverKharagdakh((odookhUtga) => !odookhUtga)
              }
              open={popoverKharagdakh}
              content={
                <div
                  className="flex flex-col gap-2"
                  onClick={() => setPopoverKharagdakh(false)}
                >
                  <Button
                    className="text-sm font-[300] flex gap-2 justify-start items-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
                    onClick={() =>
                      nuutsUgSolyo(nevtersenAjiltan, nevtersenAjiltan?._id)
                    }
                  >
                    <FiLock />
                    Нууц үг солих
                  </Button>
                  <Button
                    className="text-sm font-[300] flex gap-2 justify-start items-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    onClick={garya}
                  >
                    <LogoutOutlined />
                    Гарах
                  </Button>
                </div>
              }
              trigger="click"
            >
              <div className="flex overflow-hidden justify-center items-center rounded-full border-2 transition-colors duration-300 hover:border-slate-500 hover:shadow-lg">
                <img
                  className="w-[40px] h-[40px] object-cover"
                  src={
                    nevtersenAjiltan?.zurgiinId
                      ? `${url}/file?path=ajiltan/${nevtersenAjiltan?.zurgiinId}`
                      : "/assets/profile.png"
                  }
                />
              </div>
            </Popover>
          </div>
        </div>
        <div className="flex justify-start">
          <div
            ref={drawerRef}
            className={`drawer-container fixed left-0 z-[1000] ${
              isDrawerOpen ? "open" : ""}`}
          >
            <div className="drawer-content">
              <ul className="truncate cursor-pointer select-none">
                <li className="flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300] transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md">
                  <Link href="/dashboard/analytic" className="flex flex-col justify-center items-center w-full h-full">
                    <Image
                      src="/assets/analysis.png"
                      width={35}
                      height={35}
                      alt="Dashboard"
                      className="transition-transform duration-200 hover:scale-110"
                    />
                    Дашбоард
                  </Link>
                </li>
                <li
                  onClick={() => {
                    songolt !== "khuudsuud"
                      ? setSongolt("khuudsuud")
                      : setSongolt("");
                  }}
                  className={`flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300] transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md ${
                    songolt === "khuudsuud" ? "bg-blue-100 text-blue-700" : ""
                  }`}
                >
                  <Image
                    src="/assets/file.png"
                    width={35}
                    height={35}
                    alt="Bucket"
                    className="transition-transform duration-200 hover:scale-110"
                  />
                  Бүртгэл
                </li>
                <li
                  onClick={() => {
                    songolt !== "application"
                      ? setSongolt("application")
                      : setSongolt("");
                  }}
                  className={`flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300] transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md ${
                    songolt === "application" ? "bg-blue-100 text-blue-700" : ""
                  }`}
                >
                  <Image
                    src="/assets/website.png"
                    width={35}
                    height={35}
                    alt="Bucket"
                    className="transition-transform duration-200 hover:scale-110"
                  />
                  Судалгаа
                </li>
                <li
                  onClick={() => {
                    songolt !== "keyword"
                      ? setSongolt("keyword")
                      : setSongolt("");
                  }}
                  className={`flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300] transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md ${
                    songolt === "keyword" ? "bg-blue-100 text-blue-700" : ""
                  }`}
                >
                  <Image
                    src="/assets/keyword.png"
                    width={35}
                    height={35}
                    alt="Bucket"
                    className="transition-transform duration-200 hover:scale-110"
                  />
                  Түлхүүр үг
                </li>
                <li
                  onClick={() => {
                    songolt !== "tokhirgoo"
                      ? setSongolt("tokhirgoo")
                      : setSongolt("");
                  }}
                  className="flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300]"
                >
                  <Image
                    src="/assets/tokhirgoo.png"
                    width={35}
                    height={35}
                    alt="tokhirgoo"
                  />
                  Тохиргоо
                </li>
                <li className="flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300]">
                  {/* <Image 
                    src='/assets/bucket.png' 
                    width={35}
                    height={35}
                    alt='Bucket'
                  />
                  Түр тавив */}
                </li>
                <li className="flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300]">
                  {/* <Image 
                    src='/assets/bucket.png' 
                    width={35}
                    height={35}
                    alt='Bucket'
                  />
                  Түр тавив */}
                </li>
                <li className="flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300]">
                  {/* <Image 
                    src='/assets/bucket.png' 
                    width={35}
                    height={35}
                    alt='Bucket'
                  />
                  Түр тавив */}
                </li>
                <li className="flex flex-col justify-center items-center border-b border-r h-[var(--drawer-menunuud)] text-xs gap-2 font-[300]">
                  {/* <Image 
                    src='/assets/bucket.png' 
                    width={35}
                    height={35}
                    alt='Bucket'
                  />
                  Түр тавив */}
                </li>
              </ul>
            </div>
          </div>
          <div
            ref={secondDrawerRef}
            className={`secondDrawer-container fixed left-28 z-[1000] ${
              songolt !== "" ? "open" : ""
            }`}
          >
            <div className="h-[calc(100vh-100px)] p-2">
              {songolt === "sanalKhuselt" && (
                <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                  <Link
                    href="/sanalKhuselt/analytics"
                    className="flex justify-center items-center w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <BsGraphUp />
                      Аналитик
                    </span>
                  </Link>
                  <Link
                    href="/sanalKhuselt/turshilt"
                    className="flex justify-center items-center w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      Туршилт
                    </span>
                  </Link>
                  <Link
                    href="/sanalKhuselt/turshilt"
                    className="flex justify-center items-center w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      Туршилт
                    </span>
                  </Link>
                </ul>
              )}
              {songolt === "khuudsuud" && (
                <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                  <Link
                    href="/khuudsuud/ajiltniiJagsaalt"
                    className="flex justify-start items-start w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <FiUsers />
                      Нийт ажилтан
                    </span>
                  </Link>
                  {/* <Link
                    href="/khuudsuud/burtgekh"
                    className="flex justify-start items-start w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <FiUserPlus />
                      Бүртгэх
                    </span>
                  </Link> */}
                </ul>
              )}
              {songolt === "application" && (
                <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                  <Link
                    href="/application/khariultKharakh"
                    className="flex justify-start items-start w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <BsCheckCircle />
                      Жагсаалт
                    </span>
                  </Link>
                  <Link
                    href="/application/sudalgaa"
                    className="flex justify-start items-start w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <BsCalculator />
                      Судалгаа
                    </span>
                  </Link>
                  {/* <Link href="/application/qrKhuudas" className='flex justify-center items-center'>
                  <span className='text-sm font-[300] flex gap-2'><BiQr/>QR</span>
                </Link> */}
                </ul>
              )}
              {/* Dashboard submenu - commented out since dashboard now goes directly to page */}
              {/* {songolt === "dashboard" && (
                <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                  <Link
                    href="/dashboard/analytic"
                    className="flex justify-start items-start w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <IoIosAnalytics />
                      График тайлан
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/uilAjillagaa"
                    className="flex justify-start items-start w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <IoIosAnalytics />
                      Үйл ажиллагаа
                    </span>
                  </Link>
                </ul>
              )} */}
              {songolt === "keyword" && (
                <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                  <Link
                    href="/dashboard/keyword"
                    className="flex justify-start items-start w-full rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:translate-x-2"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <BsCheckCircle />
                      Жагсаалт
                    </span>
                  </Link>

                  {/* <Link href="/dashboard/turshilt" className='flex justify-center items-center'>
                  <span className='text-sm font-[300] flex gap-2 justify-center items-center text-gray-500'><BsCalculator/>Туршилт</span>
                </Link> */}
                  {/* <Link href="/application/qrKhuudas" className='flex justify-center items-center'>
                  <span className='text-sm font-[300] flex gap-2'><BiQr/>QR</span>
                </Link> */}
                </ul>
              )}
              {songolt === "tokhirgoo" && (
                <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                  <Link
                    href="/dashboard/sudalgaaniiTokhirgoo"
                    className="flex justify-center items-center"
                  >
                    <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                      <RiChatSettingsLine />
                      Оноо оруулах
                    </span>
                  </Link>

                  <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                    <Link
                      href="/dashboard/medegdelIlgeekh"
                      className="flex justify-center items-center"
                    >
                      <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                        <MdOutlineSms />
                        Мэдэгдэл илгээх
                      </span>
                    </Link>
                  </ul>
                  <ul className="flex flex-col gap-4 justify-center items-start truncate cursor-pointer select-none">
                    <Link
                      href="/application/tokhirgoo"
                      className="flex justify-center items-center"
                    >
                      <span className="text-sm font-[300] flex gap-2 justify-center items-center text-gray-500 hover:text-blue-600">
                        <MdOutlineCategory />
                        Бүлэг үүсгэх
                      </span>
                    </Link>
                  </ul>
                </ul>
              )}
            </div>
          </div>
          <div className="w-full max-w-[90vw] lg:max-w-full mx-auto flex flex-col justify-center items-stretch">
            <div className="w-full h-[calc(100vh-100px)] overflow-y-scroll py-10 px-4 sm:px-8 md:px-16 bg-gray-100 transition-all duration-300 dark:bg-gray-400">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
