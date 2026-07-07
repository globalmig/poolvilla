import Image from "next/image";
import Link from "next/link";
import ImageSlider from "../components/ImageSlider";
import Footer from "../components/Footer";

function makeImgs(folder: string, base: string, total: number): string[] {
  return [
    `/${folder}/${base}.jpg`,
    ...Array.from({ length: total - 1 }, (_, i) =>
      `/${folder}/${base}_${String(i + 1).padStart(2, "0")}.jpg`
    ),
  ];
}

const SPA_IMGS  = makeImgs("스파풀(A,B,C공통)",   "KakaoTalk_20260702_113804103", 13);
const SAUNA_IMGS = makeImgs("온열사우나(A,B,C공통)", "KakaoTalk_20260702_113835181",  8);

const facilities = [
  {
    id: "spa-pool",
    name: "실내 온수수영장 & 스파",
    nameEn: "Indoor Heated Pool & Spa",
    desc: "각 객실마다 독립적인 실내 온수수영장이 구비되어 있습니다. 수온은 미온수 기준 28~30°C로 유지되며, 사용 시간은 15:00~21:00입니다. 수영장 크기는 2.2M × 6M (수심 1.2M)이며, 미온수 이용 요금은 1박당 50,000원 (현장결제)입니다.",
    details: [
      "크기: 2.2M × 6M · 수심 1.2M",
      "미온수 온도: 28~30°C",
      "이용 시간: 15:00 ~ 21:00",
      "미온수 이용 요금: 1박당 50,000원 (현장결제)",
      "객실 이용 시 미온수 이용 필수 (냉수 이용 불가)",
    ],
    images: SPA_IMGS,
  },
  {
    id: "sauna",
    name: "온열 사우나",
    nameEn: "Heated Sauna",
    desc: "각 객실 내 프라이빗 온열 사우나를 통해 피로를 풀고 건강한 땀을 흘려보세요. 자연 방식의 온열로 몸의 순환을 돕고 힐링 타임을 선사합니다.",
    details: [
      "전 객실 프라이빗 온열 사우나 구비",
      "건식 온열 방식",
      "24시간 이용 가능",
    ],
    images: SAUNA_IMGS,
  },
];

export default function SpecialPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "50vh" }}>
        <Image
          src={SPA_IMGS[0]}
          alt="부대시설"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-4 text-white/90">
            Facilities
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">부대시설</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-8 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">
            Private Amenities
          </span>
          <p className="text-base text-gray-500 leading-relaxed">
            원산도풀빌라의 모든 객실에는 전용 실내 온수수영장과 스파, 온열 사우나가 갖춰져 있습니다.
            <br className="hidden md:block" />
            타인의 시선 없이 오롯이 나만의 힐링 시간을 즐기세요.
          </p>
        </div>
      </section>

      {/* Facility Sections */}
      {facilities.map((fac, idx) => (
        <section key={fac.id} className={`py-16 px-8 ${idx % 2 === 1 ? "bg-[#FAFAF9]" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Image — alternates left/right */}
            <div
              className={`${idx % 2 === 1 ? "md:order-2" : ""} relative overflow-hidden rounded-3xl shadow-xl`}
              style={{ height: "440px" }}
            >
              <ImageSlider images={fac.images} alt={fac.name} className="h-full" />
            </div>

            {/* Text */}
            <div className={idx % 2 === 1 ? "md:order-1" : ""}>
              <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-2">
                {fac.nameEn}
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
                {fac.name}
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-8">
                {fac.desc}
              </p>
              <ul className="space-y-2.5">
                {fac.details.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2A8EA2] shrink-0 mt-1.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* Additional amenities bar */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-8 text-center">
            Additional Amenities
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "실내 바베큐", sub: "안방그릴 · 30,000원" },
              { label: "주방 · 거실", sub: "전 객실 완비" },
              { label: "WiFi", sub: "전 객실 무료" },
              { label: "주차", sub: "무료 주차 가능" },
            ].map(({ label, sub }) => (
              <div key={label} className="rounded-2xl bg-[#FAFAF9] px-6 py-8 text-center">
                <p className="text-base font-bold text-gray-800 mb-1.5">{label}</p>
                <p className="text-sm text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-[#FAFAF9] p-10">
          <div>
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-2">Reservation</p>
            <p className="text-xl font-bold text-gray-900">프라이빗 풀빌라를 예약하세요</p>
          </div>
          <div className="flex gap-3">
            <Link href="/booking"
              className="btn-pop text-sm font-semibold rounded-full px-7 py-3 bg-[#2A8EA2] text-white shadow-sm hover:shadow-lg transition-shadow">
              실시간예약
            </Link>
            <Link href="/rooms"
              className="btn-pop text-sm font-semibold rounded-full px-7 py-3 bg-white border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors">
              객실 보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
