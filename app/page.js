"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import Head from "next/head";
import { useAuth } from "@/services/auth";
import { destroyCookie } from "nookies";
import moment from "moment";

const { Password } = Input;

function Nevtrekh() {
  const [form] = Form.useForm();
  const [namaigsana, setNamaigsana] = useState(false);

  useEffect(() => {
    destroyCookie(null, "hitoken");
    localStorage.removeItem("nevtersenAjiltan");
  }, []);

  const { newterya } = useAuth();

  return (
    <div className="flex justify-center items-center bg-[url('/assets/bg-from-unsplash.jpg')] bg-cover bg-center bg-no-repeat w-screen h-screen dark:bg-gray-800 relative">
      <Head>
        <title>Нэвтрэх хуудас</title>
        <link rel="icon" href="/assets/logo.png" />
      </Head>
      <div className="w-full sm:w-[640px] md:w-[768px] lg:w-[1024px] h-fit rounded-xl bg-blue-300 lg:flex hidden justify-center items-center">
        <div className="flex flex-col justify-end items-center w-[40%] !h-[408px] rounded-l-xl bg-[url('/assets/subBg.png')] bg-contain bg-center bg-no-repeat py-10 px-20"></div>
        <div className="block xl:flex justify-start items-center w-[60%] bg-white p-20 pt-10 rounded-r-xl">
          <div className="flex w-full h-screen xl:h-auto">
            <div className="my-auto border-r- bg-white dark:bg-gray-900 xl:dark:bg-gray-800 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none !w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
              <div className="flex flex-col items-center justify-start w-full mb-10">
                <div className="flex items-center justify-center w-20 h-20 overflow-hidden">
                  <img
                    className="w-full h-full object-cover scale-[1.5]"
                    src="/assets/logo.png"
                  />
                </div>
                <h2 className="uppercase font-[750] ">
                  Тээврийн цагдаагийн алба
                </h2>
              </div>
              <Form
                form={form}
                initialValues={{}}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    newterya({ ...form.getFieldsValue(), namaigsana });
                }}
              >
                <Form.Item name="nevtrekhNer">
                  <Input
                    autoComplete="off"
                    placeholder="Нэвтрэх нэр"
                    type="text"
                    className="login-input"
                  />
                </Form.Item>
                <Form.Item name="nuutsUg">
                  <Password placeholder="Нууц үг" className="login-input" />
                </Form.Item>
              </Form>
              <div className="flex items-center justify-between gap-4 mt-4 text-xs text-gray-700 intro-x dark:text-gray-600 sm:text-sm">
                <div className="flex items-center mr-auto w-fit">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="mr-2 border form-check-input"
                    onChange={({ target }) => setNamaigsana(target.checked)}
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    Намайг сана
                  </label>
                </div>
                <a href={null}>Нууц үг сэргээх?</a>
                <div>
                  <Button
                    onClick={() => {
                      newterya({ ...form.getFieldsValue(), namaigsana });
                    }}
                    className="flex items-center justify-center w-full gap-2 px-2 py-2 pr-3 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md group hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Нэвтрэх
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-auto flex flex-col lg:hidden bg-white dark:bg-gray-900 xl:dark:bg-gray-800 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none !w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
        <div className="flex flex-col items-center justify-start w-full mb-10">
          <div className="flex items-center justify-center w-20 h-20 overflow-hidden">
            <img
              className="w-full h-full object-cover scale-[1.5]"
              src="/assets/logo.png"
            />
          </div>
          <h2 className="uppercase font-[750] ">Тээврийн цагдаагийн алба</h2>
        </div>
        <Form
          form={form}
          initialValues={{}}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter")
              newterya({ ...form.getFieldsValue(), namaigsana });
          }}
        >
          <h2 className="uppercase font-[600] mb-4">Нэвтрэх</h2>
          <Form.Item name="nevtrekhNer">
            <Input
              autoComplete="off"
              placeholder="Нэвтрэх нэр"
              type="text"
              className="login-input"
            />
          </Form.Item>
          <Form.Item name="nuutsUg">
            <Password placeholder="Нууц үг" className="login-input" />
          </Form.Item>
        </Form>
        <div className="flex items-center justify-between gap-4 mt-4 text-xs text-gray-700 intro-x dark:text-gray-600 sm:text-sm">
          <div className="flex items-center mr-auto w-fit">
            <input
              id="remember-me"
              type="checkbox"
              className="mr-2 border form-check-input"
              onChange={({ target }) => setNamaigsana(target.checked)}
            />
            <label className="cursor-pointer select-none" htmlFor="remember-me">
              Намайг сана
            </label>
          </div>
          <a href="">Нууц үг сэргээх?</a>
          <div>
            <Button
              onClick={() => {
                newterya({ ...form.getFieldsValue(), namaigsana });
              }}
              className="flex items-center justify-center w-full gap-2 px-2 py-2 pr-3 text-sm font-medium text-white bg-blue-800 border border-transparent rounded-md group hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Нэвтрэх
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute left-0 right-0 flex flex-col items-center gap-2 px-4 bottom-2 sm:flex-row sm:justify-between">
        <div className="px-4 py-2 bg-black bg-opacity-50 select-none rounded-xl">
          <h2 className="text-sm text-center text-white sm:text-base sm:text-left">
            {"Тээврийн цагдаагийн албаны захиалгаар бүтээв."}
          </h2>
        </div>

        <div className="px-4 py-2 bg-black bg-opacity-50 select-none rounded-xl">
          <h2 className="text-sm text-center text-white sm:text-base sm:text-right">
            Powered by Zevtabs LLC &copy;2023-
            {moment(new Date()).format("YYYY")} он
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Nevtrekh;
