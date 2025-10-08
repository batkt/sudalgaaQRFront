"use client";

import { useAuth } from "@/services/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/Loading.module.css";

export default function nuutsUgSolikhLoading() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        router.push("/");
      }
    };

    checkAuth();
  }, [token, router]);

  if (!token) {
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
