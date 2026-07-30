import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { DEFAULT_PRICING } from "@/lib/pricing";
import { ALL_ROOM_IDS } from "@/lib/bookings";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const SITE_TITLE = "보령 서해풀빌라 - 충청남도 최고의 프라이빗 풀빌라";
const SITE_DESCRIPTION = "충청남도 보령 원산도에 위치한 프리미엄 풀빌라. 실내 스위밍 스파와 온열 사우나를 갖춘 완벽한 프라이빗 공간.";
const OG_IMAGE = "/스파풀(A,B,C공통)/KakaoTalk_20260702_113804103.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["보령 풀빌라", "원산도 풀빌라", "서해 풀빌라", "충남 풀빌라", "보령 펜션", "원산도 펜션", "스파 풀빌라", "온열사우나 펜션", "실내수영장 펜션", "서해안 풀빌라"],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  verification: {
    other: {
      "naver-site-verification": "987ba2d9458e07028850c9068185744d09874bfb",
    },
  },
};

function buildJsonLd() {
  const allPrices = Object.values(DEFAULT_PRICING.rooms).flatMap((r) => [r.weekday, r.weekend, r.peak, r.normal]);
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": SITE_URL,
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE}`,
    description: SITE_DESCRIPTION,
    priceRange: `₩${min.toLocaleString("ko-KR")} - ₩${max.toLocaleString("ko-KR")}`,
    numberOfRooms: ALL_ROOM_IDS.length,
    checkinTime: "15:00",
    checkoutTime: "11:00",
    address: {
      "@type": "PostalAddress",
      streetAddress: "원산도 4길 39-23",
      addressLocality: "보령시 오천면",
      addressRegion: "충청남도",
      addressCountry: "KR",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "실내 스위밍 스파", value: true },
      { "@type": "LocationFeatureSpecification", name: "온열 사우나", value: true },
      { "@type": "LocationFeatureSpecification", name: "무료 주차", value: true },
      { "@type": "LocationFeatureSpecification", name: "전기차 충전", value: true },
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = buildJsonLd();

  return (
    <html lang="ko" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
