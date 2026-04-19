import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_TC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "命定天子 / 命定天女 | 八字合盤・命理配對",
  description: "輸入姓名與生日，透過命理算法分析命格，推算理想伴侶特質，並 AI 生成命定形象",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
