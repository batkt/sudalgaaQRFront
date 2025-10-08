"use client";

import React, { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import {
  Button,
  Form,
  Input,
  List,
  Switch,
  Popconfirm,
  message,
  Tooltip,
} from "antd";
import {
  CopyOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAuth } from "/services/auth";
import { useTokhirgoo } from "/hook/useTokhirgoo";

const defaultSettings = {
  enableBadCommentNotification: false,
  sendSmsOnBadComment: false,
  phoneNumbers: [],
  primaryPhone: null,
  msgIlgeekhKey: "",
  msgIlgeekhDugaar: "",
};

const Page = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState(defaultSettings);
  const [newPhone, setNewPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const { token } = useAuth();
  const { msgTokhirgoo, saveMsgTokhirgoo } = useTokhirgoo(
    token,
    "msgTokhirgoo"
  );

  useEffect(() => {
    const first = msgTokhirgoo;
    if (first) {
      setSettings((s) => ({
        ...s,
        phoneNumbers: Array.isArray(first?.utas) ? first.utas : [],
        primaryPhone:
          Array.isArray(first?.utas) && first.utas.length > 0
            ? first.utas[0]
            : null,
        msgIlgeekhKey: first?.msgIlgeekhKey || "",
        msgIlgeekhDugaar: first?.msgIlgeekhDugaar || "",
      }));
    }
  }, [msgTokhirgoo]);

  const phoneNumbers = useMemo(() => settings.phoneNumbers || [], [settings]);
  const maxPhones = 10;

  function normalize(num) {
    return String(num || "")
      .replace(/\s+/g, "")
      .replace(/[-()+]/g, "");
  }

  function validatePhone(num) {
    const trimmed = normalize(num);
    return /^([9768])\d{7}$/.test(trimmed);
  }

  function addPhone() {
    const value = normalize(newPhone);
    if (!value) return;
    if (!validatePhone(value)) {
      message.warning("Утасны дугаар буруу байна (8 орон)");
      return;
    }
    if (phoneNumbers.includes(value)) {
      message.info("Энэ дугаар бүртгэлтэй байна");
      return;
    }
    if (phoneNumbers.length >= maxPhones) {
      message.warning(`Дээд тал нь ${maxPhones} дугаар оруулах боломжтой`);
      return;
    }
    setSettings((s) => ({ ...s, phoneNumbers: [...phoneNumbers, value] }));
    setNewPhone("");
    if (!settings.primaryPhone) {
      setSettings((s) => ({ ...s, primaryPhone: value }));
    }
  }

  function removePhone(target) {
    const updated = phoneNumbers.filter((p) => p !== target);
    setSettings((s) => ({
      ...s,
      phoneNumbers: updated,
      primaryPhone:
        s.primaryPhone === target ? updated[0] || null : s.primaryPhone,
    }));
  }

  function beginEdit(target) {
    setEditing(target);
    setEditValue(target);
  }

  function cancelEdit() {
    setEditing(null);
    setEditValue("");
  }

  function confirmEdit(oldValue) {
    const next = normalize(editValue);
    if (!validatePhone(next)) {
      message.warning("Утасны дугаар буруу байна (8 орон)");
      return;
    }
    if (next !== oldValue && phoneNumbers.includes(next)) {
      message.info("Энэ дугаар бүртгэлтэй байна");
      return;
    }
    const updated = phoneNumbers.map((p) => (p === oldValue ? next : p));
    setSettings((s) => ({
      ...s,
      phoneNumbers: updated,
      primaryPhone: s.primaryPhone === oldValue ? next : s.primaryPhone,
    }));
    cancelEdit();
  }

  async function savePhoneNumbers() {
    setSaving(true);
    try {
      await saveMsgTokhirgoo(token, {
        utas: settings.phoneNumbers,
        msgIlgeekhKey: settings.msgIlgeekhKey || "",
        msgIlgeekhDugaar: settings.msgIlgeekhDugaar || "",
      });
      message.success("Утасны дугаарууд хадгалагдлаа");
    } catch (e) {
      message.error("Утасны дугаарууд хадгалах үед алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  async function saveSmsSettings() {
    setSaving(true);
    try {
      await saveMsgTokhirgoo(token, {
        utas: settings.phoneNumbers || [],
        msgIlgeekhKey: settings.msgIlgeekhKey,
        msgIlgeekhDugaar: settings.msgIlgeekhDugaar,
      });
      message.success("SMS үйлчилгээний тохиргоо хадгалагдлаа");
    } catch (e) {
      message.error("SMS үйлчилгээний тохиргоо хадгалах үед алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Nav>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-xl font-semibold">Мэдэгдэл илгээх тохиргоо</h1>

        {/* <div className="p-5 mb-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center py-2">
            <div>
              <div className="font-medium">
                Сөрөг сэтгэгдэл ирвэл SMS илгээх
              </div>
              <div className="text-xs text-gray-500">
                Дараах дугааруудад SMS илгээнэ
              </div>
            </div>
            <Switch
              checked={settings.sendSmsOnBadComment}
              onChange={(v) =>
                setSettings((s) => ({ ...s, sendSmsOnBadComment: v }))
              }
            />
          </div>
        </div> */}

        <div className="p-5 mb-6 bg-white rounded-lg shadow">
          <div className="mb-3 font-medium">SMS үйлчилгээний тохиргоо</div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-700">MSG илгээх KEY</div>
              <Input
                value={settings.msgIlgeekhKey}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, msgIlgeekhKey: e.target.value }))
                }
                placeholder="Жишээ: sk_live_..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-sm text-gray-700">MSG илгээх дугаар</div>
              <Input
                value={settings.msgIlgeekhDugaar}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    msgIlgeekhDugaar: e.target.value,
                  }))
                }
                placeholder="Жишээ: 77007700"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              className="bg-green-600"
              loading={saving}
              onClick={saveSmsSettings}
            >
              SMS тохиргоо хадгалах
            </Button>
          </div>
        </div>

        <div className="p-5 mb-6 bg-white rounded-lg shadow">
          <div className="mb-3 font-medium">SMS илгээх дугаарууд</div>
          <div className="flex gap-2 items-center mb-3">
            <Input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Утасны дугаар (8 орон)"
              onPressEnter={addPhone}
              className="max-w-xs"
            />
            <Button
              type="primary"
              className="bg-blue-600"
              onClick={addPhone}
              disabled={phoneNumbers.length >= maxPhones}
            >
              Нэмэх
            </Button>
            <div className="ml-auto text-xs text-gray-500">
              {phoneNumbers.length}/{maxPhones}
            </div>
          </div>
          {phoneNumbers.length === 0 ? (
            <div className="text-sm text-gray-500">Одоогоор дугаар алга.</div>
          ) : (
            <List
              className="gap-3"
              itemLayout="horizontal"
              dataSource={phoneNumbers}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    editing === item ? (
                      <>
                        <Tooltip title="Хадгалах" key="save">
                          <Button
                            type="primary"
                            className="bg-blue-600"
                            icon={<CheckOutlined />}
                            onClick={() => confirmEdit(item)}
                          />
                        </Tooltip>
                        <Tooltip title="Болих" key="cancel">
                          <Button
                            icon={<CloseOutlined />}
                            onClick={cancelEdit}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <div className="flex gap-2 items-center">
                          <Tooltip title="Хуулах" key="copy">
                            <Button
                              aria-label="copy-phone"
                              icon={<CopyOutlined />}
                              onClick={() =>
                                navigator.clipboard?.writeText(item)
                              }
                            />
                          </Tooltip>
                          <Tooltip title="Засах" key="edit">
                            <Button
                              aria-label="edit-phone"
                              icon={<EditOutlined />}
                              onClick={() => beginEdit(item)}
                            />
                          </Tooltip>
                          <Popconfirm
                            title="Дугаар устгах уу?"
                            okText="Тийм"
                            cancelText="Үгүй"
                            okButtonProps={{ className: "bg-blue-500" }}
                            onConfirm={() => removePhone(item)}
                          >
                            <Button
                              type="primary"
                              danger
                              key="remove"
                              aria-label="remove-phone"
                            >
                              Устгах
                            </Button>
                          </Popconfirm>
                        </div>
                      </>
                    ),
                  ]}
                >
                  {editing === item ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="max-w-xs"
                    />
                  ) : (
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-2 items-baseline">
                        <span className="text-base font-medium">
                          +976 {item}
                        </span>
                      </div>
                    </div>
                  )}
                </List.Item>
              )}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              className="bg-blue-600"
              loading={saving}
              onClick={savePhoneNumbers}
            >
              Утасны дугаарууд хадгалах
            </Button>
          </div>
        </div>
      </div>
    </Nav>
  );
};

export default Page;
