"use client";

import { useAuth } from "@/services/auth";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/styles/Loading.module.css";

export default function SetgegdelLoading() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [urlToken, setUrlToken] = useState(null);

  useEffect(() => {
    // Check for token in URL parameters
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setUrlToken(tokenParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkAuth = async () => {
      // Allow access if either auth token or URL token exists
      if (!token && !urlToken) {
        router.push("/");
      }
    };

    checkAuth();
  }, [token, urlToken, router]);

  if (!token && !urlToken) {
    return null;
  }

  return (
    <div id={styles.page_loading}>
      <div className={styles.three_balls}>
        <div className={styles.ball + " " + styles.ball1}></div>
        <div className={styles.ball + " " + styles.ball2}></div>
        <div className={styles.ball + " " + styles.ball3}></div>
      </div>
    </div>
  );
}
