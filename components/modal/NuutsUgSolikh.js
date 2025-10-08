"use client";

import React, { useEffect } from "react";
import _ from "lodash";
import { Form, message, Input } from "antd";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";

const { Password } = Input;

function ajiltanNemekh({ token, data, destroy, ajiltanId }, ref) {
  const [form] = Form.useForm();

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      khadgalya() {
        if (!data) {
          message.warning("Ажилтан мэдээлэл олдсонгүй !");
          return;
        }
        const ugugdul = form.getFieldsValue();
        onFinish(ugugdul);
      },
    }),
    [data]
  );

  function onFinish(values) {
    const { nuutsUg, davtanNuutsUg } = values;
    if (nuutsUg !== davtanNuutsUg) {
      message.error("Нууц үг давхцахгүй байна");
      return;
    }
    uilchilgee(token)
      .post(`/nuutsUgSoliyo/${ajiltanId}`, { nuutsUg })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          message.success("Нууц үг амжилттай солигдлоо!");
          destroy();
        }
      })
      .catch((err) => aldaaBarigch(err));
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [data]);

  return (
    <Form form={form} className="w-full">
      <h2 className="uppercase font-[600] mb-4">Нууц үг солих</h2>
      <Form.Item
        name="nuutsUg"
        rules={[{ required: true, message: "Шинэ нууц үг оруулна уу" }]}
      >
        <Password
          autoComplete="off"
          placeholder="Шинэ нууц үг"
          type="password"
          className="login-input"
        />
      </Form.Item>
      <Form.Item
        name="davtanNuutsUg"
        rules={[
          { required: true, message: "Нууц үг давтан оруулна уу" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("nuutsUg") === value) {
                return Promise.resolve();
              }
              return Promise.reject("Нууц үг давхцахгүй байна");
            },
          }),
        ]}
      >
        <Password
          autoComplete="off"
          placeholder="Нууц үг давтан"
          type="password"
          className="login-input"
        />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(ajiltanNemekh);
