"use client";
import Image from "next/image";
import { useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import Footer from "../components/Footer";

function makeImgs(folder: string, base: string, total: number): string[] {
  return [`/${folder}/${base}.jpg`, ...Array.from({ length: total - 1 }, (_, i) => `/${folder}/${base}_${String(i + 1).padStart(2, "0")}.jpg`)];
}

const A = makeImgs("객실(A-type)", "KakaoTalk_20260702_113958589", 19);
const B = makeImgs("객실(B-type)", "KakaoTalk_20260702_114035977", 12);
const C = makeImgs("객실(C-type)", "KakaoTalk_20260702_114144440", 10);
const SPA = makeImgs("스파풀(A,B,C공통)", "KakaoTalk_20260702_113804103", 13);
const SAU = makeImgs("온열사우나(A,B,C공통)", "KakaoTalk_20260702_113835181", 8);
const T_W = makeImgs("주변관광지(원산도해수욕장)", "KakaoTalk_20260702_114439758", 32);
const T_O = makeImgs("주변관광지(오봉산해수욕장)", "KakaoTalk_20260702_114310365", 7);
const T_S = makeImgs("주변관광지(사창해수욕장)", "KakaoTalk_20260702_114243966", 3);
const T_M = makeImgs("주변관광지(원산도 모빌리티)", "KakaoTalk_20260702_114220367", 5);
const T_B = makeImgs("주변관광지(원산안면대교)", "KakaoTalk_20260702_114417167", 6);
const T_C = makeImgs("주변관광지(바이더오카페)", "KakaoTalk_20260713_151425396", 4);
const T_D = makeImgs("주변관광지(영목항전망대)", "KakaoTalk_20260713_151113650", 6);
const OUT = makeImgs("외관", "KakaoTalk_20260715_182900342", 2);

const galleryImages = [
  ...A.map((src, i) => ({ src, alt: `A타입 ${i + 1}`, category: "room" })),
  ...B.map((src, i) => ({ src, alt: `B타입 ${i + 1}`, category: "room" })),
  ...C.map((src, i) => ({ src, alt: `C타입 ${i + 1}`, category: "room" })),
  ...SPA.map((src, i) => ({ src, alt: `스파풀 ${i + 1}`, category: "facility" })),
  ...SAU.map((src, i) => ({ src, alt: `온열사우나 ${i + 1}`, category: "facility" })),
  ...T_W.map((src, i) => ({ src, alt: `원산도해수욕장 ${i + 1}`, category: "travel" })),
  ...T_O.map((src, i) => ({ src, alt: `오봉산해수욕장 ${i + 1}`, category: "travel" })),
  ...T_S.map((src, i) => ({ src, alt: `사창해수욕장 ${i + 1}`, category: "travel" })),
  ...T_M.map((src, i) => ({ src, alt: `원산도모빌리티 ${i + 1}`, category: "travel" })),
  ...T_B.map((src, i) => ({ src, alt: `원산안면대교 ${i + 1}`, category: "travel" })),
  ...T_C.map((src, i) => ({ src, alt: `바이더오카페 ${i + 1}`, category: "travel" })),
  ...T_D.map((src, i) => ({ src, alt: `영목항전망대 ${i + 1}`, category: "travel" })),
  ...OUT.map((src, i) => ({ src, alt: `외관 ${i + 1}`, category: "facility" })),
];

const categories = [
  { key: "all", label: "전체" },
  { key: "room", label: "객실" },
  { key: "facility", label: "부대시설" },
  { key: "travel", label: "주변관광지" },
];

export default function GalleryPage() {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = active === "all" ? galleryImages : galleryImages.filter((img) => img.category === active);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ height: "45vh" }}>
        <Image src={SPA[0]} alt="여행갤러리" fill className="object-cover brightness-110 saturate-[1.1]" unoptimized priority />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-10 text-white text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.5)]">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-5 text-white/90">Photo Gallery</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">여행갤러리</h1>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
          {/* Mobile: dropdown */}
          <div className="relative sm:hidden">
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              className="w-full appearance-none rounded-full pl-5 pr-10 py-2.5 text-sm font-semibold bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            >
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label} ({cat.key === "all" ? galleryImages.length : galleryImages.filter((g) => g.category === cat.key).length})
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Desktop: pill tabs */}
          <div className="hidden sm:flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`btn-pop shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  active === cat.key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat.label}
                <span className={`ml-1.5 ${active === cat.key ? "text-white/50" : "text-gray-400"}`}>
                  {cat.key === "all" ? galleryImages.length : galleryImages.filter((g) => g.category === cat.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-6 sm:py-12 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div key={active} className="fill-last-row-2-3-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {filtered.map((img, i) => (
              <div key={i} className="btn-pop relative overflow-hidden cursor-pointer group aspect-square rounded-2xl shadow-sm hover:shadow-2xl" onClick={() => setLightbox(img.src)}>
                <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button
            className="btn-pop absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 text-xl w-11 h-11 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="닫기"
          >
            <FiX />
          </button>
          <div className="relative max-w-5xl w-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox} alt="갤러리 이미지" width={1200} height={800} className="w-full h-auto max-h-[85vh] object-contain bg-black" unoptimized />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
