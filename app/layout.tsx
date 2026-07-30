import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "보령 서해풀빌라 - 충청남도 최고의 프라이빗 풀빌라",
  description: "충청남도 보령 원산도에 위치한 프리미엄 풀빌라. 실내 스위밍 스파와 온열 사우나를 갖춘 완벽한 프라이빗 공간.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
