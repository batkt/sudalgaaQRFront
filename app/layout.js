"use client";

import { AuthProvider } from "@/services/auth";
import "@styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ШҮҮХИЙН ШИЙДВЭР ГҮЙЦЭТГЭХ ЕРӨНХИЙ ГАЗАР</title>
        <link rel="icon" href="/assets/shuukhLogo.webp" />
      </head>
      <body>
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
