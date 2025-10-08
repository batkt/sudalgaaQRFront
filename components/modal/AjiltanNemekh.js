"use client";

import React, { useEffect } from "react";
import _ from "lodash";
import { Form, message, Select } from "antd";
import uilchilgee, { aldaaBarigch } from "@/services/uilchilgee";

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
          message.warning("Ажилтан сонгогдоогүй байна !");
          return;
        }
        const ugugdul = form.getFieldsValue();
        uilchilgee(token)
          .put(`/ajiltan/${ajiltanId}`, ugugdul)
          .then(({ data }) => {
            if (data === "Amjilttai") {
              message.success("Амжилттай хадгалагдлаа!");
              destroy();
            }
          })
          .catch((err) => {
            aldaaBarigch(err);
          });
      },
    }),
    [data]
  );

  // function garya() {
  //   if (data !== undefined)
  //     Modal.confirm({
  //       content: "Та хадгалахгүй гарахдаа итгэлтэй байна уу?",
  //       okText: "Тийм",
  //       cancelText: "Үгүй",
  //       onOk: destroy,
  //       okButtonProps: { className: "bg-blue-500" },
  //     });
  //   else destroy();
  // }

  useEffect(() => {
    form.setFieldsValue({erkh: data.erkh});
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
    <Form
      labelAlign="left"
      labelCol={{
        span: 10,
      }}
      form={form}
    >
      <Form.Item name="erkh" label="Эрхийн тохиргоо" valuePropName="checked">
        <Select value={data.erkh} className="flex justify-end">
          <Select.Option value="superAdmin">SUPER ADMIN</Select.Option>
          <Select.Option value="admin">ADMIN</Select.Option>
          <Select.Option value="boss">BOSS</Select.Option>
          <Select.Option value="userAdmin">USER ADMIN</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(ajiltanNemekh);
