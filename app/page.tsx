import Image from "next/image";
import Link from "next/link";
import HeroSection from "./components/HeroSection";
import ImageSlider from "./components/ImageSlider";
import SectionTitle from "./components/SectionTitle";
import Footer from "./components/Footer";

function makeImgs(folder: string, base: string, total: number): string[] {
  return [`/${folder}/${base}.jpg`, ...Array.from({ length: total - 1 }, (_, i) => `/${folder}/${base}_${String(i + 1).padStart(2, "0")}.jpg`)];
}

const A = makeImgs("객실(A-type)", "KakaoTalk_20260702_113958589", 19);
const B = makeImgs("객실(B-type)", "KakaoTalk_20260702_114035977_02", 12);
const C = makeImgs("객실(C-type)", "KakaoTalk_20260702_114144440", 10);
const SPA = makeImgs("스파풀(A,B,C공통)", "KakaoTalk_20260702_113804103", 13);
const SAU = makeImgs("온열사우나(A,B,C공통)", "KakaoTalk_20260702_113835181_01", 8);
const T_W = makeImgs("주변관광지(원산도해수욕장)", "KakaoTalk_20260702_114439758", 5);
const T_O = makeImgs("주변관광지(오봉산해수욕장)", "KakaoTalk_20260702_114310365", 7);
const T_S = makeImgs("주변관광지(사창해수욕장)", "KakaoTalk_20260702_114243966", 3);
const T_M = makeImgs("주변관광지(원산도 모빌리티)", "KakaoTalk_20260702_114220367", 5);
const T_B = makeImgs("주변관광지(원산안면대교)", "KakaoTalk_20260702_114417167", 6);
const T_C = makeImgs("주변관광지(바이더오카페)", "KakaoTalk_20260713_151425396", 4);
const T_D = makeImgs("주변관광지(영목항전망대)", "KakaoTalk_20260713_151113650", 6);

// About 섹션 슬라이더 + 갤러리 프리뷰에 사용할 대표 이미지
const showcaseImgs = [SPA[0], SPA[2], SPA[5], A[0], B[0], C[0], SAU[0], T_W[0]];

const roomTypes = [
  {
    slug: "a",
    name: "프리미엄 A타입",
    desc: "37평형 · 최대 8인",
    sub: "낮은 아일랜드 식탁 · 더블침대 · 실내 스위밍 스파 · 온열 사우나",
    image: A[0],
  },
  {
    slug: "b",
    name: "프리미엄 B타입",
    desc: "37평형 · 최대 8인",
    sub: "더블침대 · 실내 스위밍 스파 · 온열 사우나",
    image: B[0],
  },
  {
    slug: "c",
    name: "스탠다드 C타입",
    desc: "37평형 · 최대 6인",
    sub: "더블침대 · 실내 스위밍 스파 · 온열 사우나",
    image: C[0],
  },
];

const facilities = [
  { name: "스위밍 스파", image: SPA[2] },
  { name: "온탕 스파", image: SPA[10] },
  { name: "온열 사우나", image: SAU[0] },
  { name: "실내 바베큐 그릴", image: "/grill.jpg", paid: true },
  { name: "실외 바베큐", image: "/grill.jpg", paid: true },
];

const travels = [
  { name: "원산도 해수욕장", image: T_W[0] },
  { name: "오봉산 해수욕장", image: T_O[0] },
  { name: "사창 해수욕장", image: T_S[0] },
  { name: "원산도 모빌리티", image: T_M[0] },
  { name: "원산안면대교", image: T_B[0] },
  { name: "바이더오카페", image: T_C[0] },
  { name: "영목항전망대", image: T_D[0] },
];

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* ── About ── */}
      <section className="py-28 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-5">About</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-1 leading-snug">충청남도 보령,</h2>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8 leading-snug">원산도의 프라이빗 풀빌라</h2>
            <p className="text-base text-gray-500 leading-loose mb-3">
              서해의 아름다운 섬 원산도에 위치한 프리미엄 풀빌라입니다. 각 객실마다 독립적인 스위밍 스파와 사우나를 갖추고 있어 완벽한 프라이버시와 함께 최고의 휴식을 선사합니다.
            </p>
            <p className="text-base text-gray-500 leading-loose mb-10">실내 스위밍 스파와 온열 사우나까지 — 토탈 힐링 스페이스에서 특별한 추억을 만들어 보세요.</p>
            <Link href="/guide" className="btn-pop inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors">
              이용안내 보기 →
            </Link>
          </div>
          <div className="relative h-120 md:h-135 rounded-3xl overflow-hidden shadow-xl">
            <ImageSlider images={showcaseImgs.slice(0, 5)} alt="서해스파풀빌라 전경" className="h-full" />
          </div>
        </div>
      </section>

      {/* ── Room Types ── */}
      <section className="py-28 px-8 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle en="Accommodation" ko="객실 소개" />
          <div className="grid md:grid-cols-3 gap-6">
            {roomTypes.map((room) => (
              <Link key={room.slug} href={`/rooms/${room.slug}`} className="btn-pop group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500">
                <div className="relative overflow-hidden" style={{ height: "320px" }}>
                  <Image src={room.image} alt={room.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                    <span className="w-9 h-9 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                      →
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{room.desc}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{room.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facilities ── */}
      <section className="py-28 px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle en="Special" ko="부대시설" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {facilities.map((f) => (
              <Link key={f.name} href="/special" className="btn-pop group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-500" style={{ height: "320px" }}>
                <Image src={f.image} alt={f.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center gap-2">
                  <p className="text-white text-base font-semibold">{f.name}</p>
                  {/* {f.paid && <span className="rounded-full bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold text-white">유료</span>} */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cinematic banner ── */}
      <section className="relative overflow-hidden mx-4 md:mx-8 rounded-3xl" style={{ height: "60vh" }}>
        <Image src={SPA[11]} alt="서해스파풀빌라" fill className="object-cover brightness-110 saturate-[1.1]" unoptimized />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-8 [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.5)]">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-6 text-white/90">Exclusive Spa Pool Villa</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
            오직 당신만을 위한
            <br />
            프라이빗 공간
          </h2>
          <Link href="/booking" className="btn-pop text-sm font-semibold rounded-full px-8 py-3.5 bg-[#2A8EA2] text-white shadow-lg transition-colors duration-300">
            지금 예약하기
          </Link>
        </div>
      </section>

      {/* ── Travel ── */}
      <section className="py-28 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <SectionTitle en="Nearby Attractions" ko="주변 관광지" align="left" noMargin />
            <Link href="/travel" className="shrink-0 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {travels.map((t) => (
              <Link key={t.name} href="/travel" className="btn-pop group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-500" style={{ height: "260px" }}>
                <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      <section className="py-28 px-8 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <SectionTitle en="Gallery" ko="여행갤러리" align="left" noMargin />
            <Link href="/gallery" className="shrink-0 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              갤러리 전체보기 →
            </Link>
          </div>
          {/* First tile spans 2x2, leaving one empty cell in the last row at both
              2-col and 4-col widths — the last tile spans 2 columns to fill it. */}
          <div className="grid grid-cols-2 md:grid-cols-4 md:auto-rows-[184px] gap-3 md:gap-4">
            {showcaseImgs.map((src, i) => (
              <Link
                key={i}
                href="/gallery"
                className={`btn-pop group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-500 ${
                  i === 0
                    ? "col-span-2 aspect-video md:aspect-auto md:row-span-2"
                    : i === showcaseImgs.length - 1
                      ? "col-span-2 aspect-video md:aspect-auto"
                      : "col-span-1 aspect-square md:aspect-auto"
                }`}
              >
                <Image src={src} alt={`갤러리 ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
