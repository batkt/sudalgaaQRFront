"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/services/auth";
import { useRouter, usePathname } from "next/navigation";
import { Spin, message } from "antd";

// Pages that don't require authentication
const PUBLIC_PAGES = [
  "/",
  "/setgegdel", // Allow access to setgegdel pages
  "/anket", // Allow access to anket pages
];

// Check if current path is public
const isPublicPage = (pathname) => {
  return PUBLIC_PAGES.some((publicPath) => {
    if (publicPath === "/setgegdel") {
      // Allow all setgegdel pages (including dynamic routes)
      return pathname.startsWith("/setgegdel");
    }
    if (publicPath === "/anket") {
      // Allow all anket pages (including dynamic routes)
      return pathname.startsWith("/anket");
    }
    return pathname === publicPath;
  });
};

export default function AuthGuard({ children }) {
  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // If it's a public page, allow access
      if (isPublicPage(pathname)) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // If user has token, allow access
      if (token) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      // If no token and not a public page, redirect to login
      setIsAuthorized(false);
      setIsLoading(false);

      // Show message and redirect
      message.warning("Та эхлээд нэвтэрнэ үү");
      router.push("/");
    };

    // Small delay to ensure token is loaded from cookies
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, [token, pathname, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Spin size="large" />
          <p className="text-gray-600">Нэвтэрч байна...</p>
        </div>
      </div>
    );
  }

  // If not authorized and not a public page, show unauthorized message
  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔒</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Хандах эрх байхгүй
          </h2>
          <p className="mb-6 text-gray-600">Та эхлээд нэвтэрч орно уу.</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    );
  }

  // If authorized or public page, render children
  return children;
}
