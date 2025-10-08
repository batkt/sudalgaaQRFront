"use client";

import { AuthProvider } from "@/services/auth";
import "@styles/globals.css";
import { Inter, Roboto_Serif } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto_Serif({ subsets: ["latin"], weight: "200" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ТЭЭВРИЙН ЦАГДААГИЙН АЛБА</title>
        <link rel="icon" href="/assets/policeLogo.png" />
      </head>
      <body className={roboto.className}>
        <div>
          <div>
            <div />
          </div>
          <main>
            <AuthProvider>{children}</AuthProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
