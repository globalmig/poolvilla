import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "보령 원산도풀빌라 - 충청남도 최고의 프라이빗 풀빌라",
  description:
    "충청남도 보령 원산도에 위치한 프리미엄 풀빌라. 실내 온수수영장, 스파, 사우나를 갖춘 완벽한 프라이빗 공간.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
