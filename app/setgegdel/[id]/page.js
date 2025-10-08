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
import { useTulkhuurUg } from "@/hook/useTulkhuurUg";
import uilchilgee from "@/services/uilchilgee";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";

export default function SetgegdelDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [urlToken, setUrlToken] = useState(null);
  const [khariultId, setKhariultId] = useState(null);

  // Get tulkhuurUg for highlighting - try with token if available, otherwise without
  const { tulkhuurUgGaralt } = useTulkhuurUg(urlToken);

  // Fallback: try to load keywords without token if token-based loading fails
  const { tulkhuurUgGaralt: fallbackTulkhuurUgGaralt } = useTulkhuurUg(null);

  // Use whichever has data
  const finalTulkhuurUgGaralt =
    tulkhuurUgGaralt?.jagsaalt?.length > 0
      ? tulkhuurUgGaralt
      : fallbackTulkhuurUgGaralt;

  // Get ID from URL
  const [id, setId] = useState(null);

  useEffect(() => {
    // Get the ID from the URL path
    const pathParts = window.location.pathname.split("/");
    const recordId = pathParts[pathParts.length - 1];
    setId(recordId);

    // Check for token and khariultId in URL parameters
    const tokenParam = searchParams.get("token");
    const khariultIdParam = searchParams.get("khariultId");

    if (tokenParam) {
      setUrlToken(tokenParam);
    }
    if (khariultIdParam) {
      setKhariultId(khariultIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;

    const fetchRecord = async () => {
      try {
        setLoading(true);

        // Use khariultId from URL params if available, otherwise use id from path
        const recordId = khariultId || id;

        // Use public API endpoint - no authentication required
        const response = await uilchilgee().get(`/public/khariult/${recordId}`);
        setRecord(response.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Сэтгэгдэл олдсонгүй");
          message.error("Сэтгэгдэл олдсонгүй");
        } else {
          setError("Серверийн алдаа");
          message.error("Серверийн алдаа");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, khariultId]);

  // Highlighting logic - use the same approach as analytics page
  const goodKeywords = (finalTulkhuurUgGaralt?.jagsaalt || []).filter(
    (k) => k.turul === "Sain"
  );
  const badKeywords = (finalTulkhuurUgGaralt?.jagsaalt || []).filter(
    (k) => k.turul === "Muu"
  );

  // Use actual keywords if available, otherwise use fallback test keywords
  const testGoodKeywords =
    goodKeywords.length > 0
      ? goodKeywords
      : [
          { tailbar: "сайн", turul: "Sain" },
          { tailbar: "маш сайн", turul: "Sain" },
          { tailbar: "гэрэл", turul: "Sain" },
          { tailbar: "түргэн", turul: "Sain" },
        ];

  const testBadKeywords =
    badKeywords.length > 0
      ? badKeywords
      : [
          { tailbar: "муу", turul: "Muu" },
          { tailbar: "удаан", turul: "Muu" },
          { tailbar: "авилга", turul: "Muu" },
          { tailbar: "хүнд", turul: "Muu" },
        ];

  const { regexAll, lowerToType } = (() => {
    const all = [...testGoodKeywords, ...testBadKeywords]
      .map((k) => (k.tailbar || "").trim())
      .filter(Boolean);
    const unique = Array.from(new Set(all)).sort((a, b) => b.length - a.length);
    const escaped = unique.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const map = new Map();
    testGoodKeywords.forEach((k) =>
      map.set((k.tailbar || "").trim().toLowerCase(), "Sain")
    );
    testBadKeywords.forEach((k) =>
      map.set((k.tailbar || "").trim().toLowerCase(), "Muu")
    );
    // Use simpler regex pattern like in analytics page
    const pattern = escaped.length ? `(${escaped.join("|")})` : null;
    return {
      regexAll: pattern ? new RegExp(pattern, "gi") : null,
      lowerToType: map,
    };
  })();

  const renderHighlighted = (text) => {
    if (!text) return text;

    // If no regex, return text as is
    if (!regexAll) return text;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-col items-center text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Сэтгэгдэл ачаалж байна...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 text-6xl">😞</div>
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Сэтгэгдэл олдсонгүй
              </h2>
              <p className="mb-6 text-gray-600">
                Уучлаарай, энэ сэтгэгдэл байхгүй эсвэл устгагдсан байна.
              </p>
              <Button
                type="default"
                onClick={goBack}
                icon={<ArrowLeftOutlined />}
                className="bg-gray-100 border-gray-300 hover:bg-gray-200"
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
    <>
      <Head>
        <title>Сэтгэгдлийн дэлгэрэнгүй</title>
        <link rel="icon" href="/assets/logo.webp" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div
          className="px-4 py-4 mx-auto"
          style={{ maxWidth: "1200px", width: "100%" }}
        >
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-end mb-2">
              {record.surugEsekh && (
                <span className="px-2 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-full bg-red-50">
                  Сөрөг сэтгэгдэл
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Сэтгэгдлийн дэлгэрэнгүй
            </h1>
          </div>

          {/* Main Content - Grid Layout */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Employee Info */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h2 className="flex items-center mb-3 text-base font-semibold text-gray-900">
                  <UserOutlined className="mr-2 text-sm text-green-500" />
                  Алба хаагчийн мэдээлэл
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Овог нэр
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {record.ajiltan?.ovog} {record.ajiltan?.ner}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Албан тушаал
                    </label>
                    <p className="text-sm text-gray-900">
                      {record.ajiltan?.albanTushaal}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Цол
                    </label>
                    <p className="text-sm text-gray-900">
                      {record.ajiltan?.tsol}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Тасаг
                    </label>
                    <p className="text-sm text-gray-900">
                      {record.ajiltan?.tasag}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h2 className="flex items-center mb-3 text-base font-semibold text-gray-900">
                  <PhoneOutlined className="mr-2 text-sm text-purple-500" />
                  Иргэний утасны дугаар
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Утасны дугаар
                    </label>
                    <p className="font-mono text-sm text-gray-900">
                      {record.utas}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Илгээсэн огноо
                    </label>
                    <p className="text-sm text-gray-900">
                      {moment(record.createdAt).format("YYYY-MM-DD HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Contact Info */}

              {/* Survey Answers */}
              {record.khariultuud && record.khariultuud.length > 0 && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h2 className="flex items-center mb-3 text-base font-semibold text-gray-900">
                    <CalendarOutlined className="mr-2 text-sm text-orange-500" />
                    Анкетын хариултууд
                  </h2>

                  {record.asuultiinNer && (
                    <div className="p-2 mb-3 border border-blue-200 rounded bg-blue-50">
                      <p className="text-xs font-medium text-blue-800">
                        {record.asuultiinNer}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 overflow-y-auto max-h-64">
                    {record.khariultuud.map((answer, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-gray-200 rounded bg-gray-50"
                      >
                        <div className="mb-1 text-xs font-medium text-gray-700">
                          {answer.asuult}
                        </div>
                        <div className="text-sm text-gray-800">
                          {answer.khariult}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comment Section - Full Width at Bottom */}
          <div className="mt-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h2 className="flex items-center mb-3 text-base font-semibold text-gray-900">
                <MessageOutlined className="mr-2 text-sm text-blue-500" />
                Сэтгэгдэл
              </h2>
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-sm leading-relaxed text-gray-800">
                  {renderHighlighted(record.tailbar)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
