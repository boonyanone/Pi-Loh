import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "พี่โล่ - ที่ปรึกษา AI (AI Consultant)",
  description: "AI SME Assistant สำหรับที่ปรึกษาบัญชีและภาษี",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
