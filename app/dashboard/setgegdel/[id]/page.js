"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Spin, message } from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  PhoneOutlined,
  MessageOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Head from "next/head";
import { useAuth } from "@/services/auth";
import { useTulkhuurUg } from "@/hook/useTulkhuurUg";
import uilchilgee from "@/services/uilchilgee";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function SetgegdelDetail() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  // Get tulkhuurUg for highlighting
  const { tulkhuurUgGaralt } = useTulkhuurUg(token);

  // Get ID from URL
  const [id, setId] = useState(null);

  useEffect(() => {
    // Get the ID from the URL path
    const pathParts = window.location.pathname.split("/");
    const recordId = pathParts[pathParts.length - 1];
    setId(recordId);
  }, []);

  // Fetch single record
  useEffect(() => {
    if (!id || !token) return;

    const fetchRecord = async () => {
      try {
        setLoading(true);
        const response = await uilchilgee(token).get(`/khariult/${id}`);
        setRecord(response.data);
      } catch (err) {
        setError("Сэтгэгдэл олдсонгүй");
        message.error("Сэтгэгдэл олдсонгүй");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, token]);

  // Highlighting logic
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
          <span
            key={key}
            className="px-1 font-medium text-green-800 bg-green-100 rounded"
          >
            {part}
          </span>
        );
      }
      if (type === "Muu") {
        return (
          <span
            key={key}
            className="px-1 font-medium text-red-800 bg-red-100 rounded"
          >
            {part}
          </span>
        );
      }
      return <span key={key}>{part}</span>;
    });
  };

  const goBack = () => {
    router.back();
  };

  // Don't render anything if no token (loading component will handle redirect)
  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[url('/assets/bg-from-unsplash.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="flex items-center justify-center min-h-screen p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 shadow-2xl bg-white/95 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Уншиж байна...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-[url('/assets/bg-from-unsplash.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
        <div className="flex items-center justify-center min-h-screen p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 shadow-2xl bg-white/95 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-6xl">😞</div>
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Сэтгэгдэл олдсонгүй
              </h2>
              <p className="mb-6 text-gray-600">
                Уучлаарай, энэ сэтгэгдэл байхгүй эсвэл устгагдсан байна.
              </p>
              <Button
                type="primary"
                onClick={goBack}
                icon={<ArrowLeftOutlined />}
              >
                Буцах
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/assets/bg-from-unsplash.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <Head>
        <title>Сэтгэгдлийн дэлгэрэнгүй</title>
        <link rel="icon" href="/assets/logo.webp" />
      </Head>

      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="container px-4 py-8 mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="p-6 shadow-2xl bg-white/95 backdrop-blur-sm rounded-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={goBack}
                      icon={<ArrowLeftOutlined />}
                      type="text"
                      className="flex items-center"
                    >
                      Буцах
                    </Button>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 overflow-hidden">
                        <img
                          className="w-full h-full object-cover scale-[1.5]"
                          src="/assets/logo.webp"
                          alt="Logo"
                        />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-800 uppercase">
                          Сэтгэгдлийн дэлгэрэнгүй
                        </h1>
                        <p className="text-sm text-gray-600 break-all">
                          ID: {record._id}
                        </p>
                      </div>
                    </div>
                  </div>
                  {record.surugEsekh && (
                    <span className="px-3 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
                      Сөрөг сэтгэгдэл
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Employee Info */}
                <Card className="shadow-lg">
                  <div className="flex items-start space-x-4">
                    <UserOutlined className="mt-1 text-2xl text-gray-500" />
                    <div className="flex-1">
                      <h3 className="mb-4 text-lg font-semibold text-gray-800">
                        Алба хаагчийн мэдээлэл
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            Овог нэр:
                          </div>
                          <div className="font-medium text-gray-900">
                            {record.ajiltan?.ovog} {record.ajiltan?.ner}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            Албан тушаал:
                          </div>
                          <div className="text-gray-900">
                            {record.ajiltan?.albanTushaal}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            Цол:
                          </div>
                          <div className="text-gray-900">
                            {record.ajiltan?.tsol}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            Тасаг:
                          </div>
                          <div className="text-gray-900">
                            {record.ajiltan?.tasag}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Contact Info */}
                <Card className="shadow-lg">
                  <div className="flex items-start space-x-4">
                    <PhoneOutlined className="mt-1 text-2xl text-gray-500" />
                    <div className="flex-1">
                      <h3 className="mb-4 text-lg font-semibold text-gray-800">
                        Холбоо барих мэдээлэл
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            Утасны дугаар:
                          </div>
                          <div className="font-mono text-lg text-gray-900">
                            {record.utas}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-600">
                            Илгээсэн огноо:
                          </div>
                          <div className="text-gray-900">
                            {moment(record.ognoo || record.createdAt).format(
                              "YYYY-MM-DD HH:mm:ss"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Comment */}
                <Card className="shadow-lg">
                  <div className="flex items-start space-x-4">
                    <MessageOutlined className="mt-1 text-2xl text-gray-500" />
                    <div className="flex-1">
                      <h3 className="mb-4 text-lg font-semibold text-gray-800">
                        Сэтгэгдэл
                      </h3>
                      <div className="p-4 rounded-lg bg-gray-50 min-h-[120px]">
                        <div className="text-base leading-relaxed text-gray-800">
                          {renderHighlighted(record.tailbar)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Survey Answers */}
                {record.khariultuud && record.khariultuud.length > 0 && (
                  <Card className="shadow-lg">
                    <div className="flex items-start space-x-4">
                      <CalendarOutlined className="mt-1 text-2xl text-gray-500" />
                      <div className="flex-1">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                          Анкетын хариултууд
                        </h3>
                        {record.asuultiinNer && (
                          <div className="p-3 mb-4 rounded-lg bg-blue-50">
                            <p className="text-sm font-medium text-blue-800">
                              {record.asuultiinNer}
                            </p>
                            {record.asuultiinTurul && (
                              <p className="mt-1 text-xs text-blue-600">
                                Төрөл: {record.asuultiinTurul}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="p-3 mb-4 rounded-lg bg-gray-50">
                          <p className="text-sm font-medium text-gray-800">
                            Нийт үнэлгээ: {record.khariultuud.length} асуулт
                          </p>
                          <p className="text-xs text-gray-600">
                            Хариултууд:{" "}
                            {record.khariultuud
                              .map((a) => a.khariult)
                              .join(", ")}
                          </p>
                        </div>
                        <div className="space-y-4 overflow-y-auto max-h-96">
                          {record.khariultuud.map((answer, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-lg bg-gray-50"
                            >
                              <div className="mb-2 text-sm font-medium text-gray-700">
                                {answer.asuult}
                              </div>
                              <div className="text-base text-gray-800">
                                {renderHighlighted(answer.khariult)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
