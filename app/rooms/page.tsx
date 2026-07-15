import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";

function makeImgs(folder: string, base: string, total: number): string[] {
  return [`/${folder}/${base}.jpg`, ...Array.from({ length: total - 1 }, (_, i) => `/${folder}/${base}_${String(i + 1).padStart(2, "0")}.jpg`)];
}

const A_IMGS = makeImgs("객실(A-type)", "KakaoTalk_20260702_113958589", 19);
const B_IMGS = makeImgs("객실(B-type)", "KakaoTalk_20260702_114035977", 12);
const C_IMGS = makeImgs("객실(C-type)", "KakaoTalk_20260702_114144440", 10);

const rooms = [
  {
    slug: "a",
    label: "프리미엄",
    typeLabel: "A타입",
    size: "37평형",
    maxGuests: 8,
    units: "201 · 301 · 401",
    cardImage: A_IMGS[0],
  },
  {
    slug: "b",
    label: "프리미엄",
    typeLabel: "B타입",
    size: "37평형",
    maxGuests: 8,
    units: "202 · 302 · 402",
    cardImage: B_IMGS[0],
  },
  {
    slug: "c",
    label: "스탠다드",
    typeLabel: "C타입",
    size: "37평형",
    maxGuests: 6,
    units: "201 · 301 · 401",
    cardImage: C_IMGS[0],
  },
];

export default function RoomsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "50vh" }}>
        <Image src={A_IMGS[2]} alt="객실소개" fill className="object-cover brightness-110 saturate-[1.1]" unoptimized priority />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.5)]">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-4 text-white/90">Accommodation</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">객실 소개</h1>
        </div>
      </section>

      {/* Room cards */}
      <section className="py-4 md:py-20 px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Link key={room.slug} href={`/rooms/${room.slug}`} className="btn-pop group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500">
                <div className="relative overflow-hidden" style={{ height: "320px" }}>
                  <Image src={room.cardImage} alt={room.label} fill className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                </div>
                <div className="p-8">
                  <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-1.5">{room.typeLabel}</p>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{room.label}</h2>
                  <div className="space-y-1.5 mb-5">
                    <p className="text-sm text-gray-500">
                      {room.size} · 최대 {room.maxGuests}인
                    </p>
                    <p className="text-sm text-gray-400">{room.units}호</p>
                  </div>
                  <span className="text-sm font-semibold text-[#2A8EA2]">자세히 보기 →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="max-w-[1280px] border-gray-200 shadow-xl border rounded-3xl mx-auto my-10">
          <Image src={"/building_map.png"} alt="객실소개" width={800} height={200} className=" mx-auto mb-6" unoptimized />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-[#FAFAF9] p-6 sm:p-10 text-center md:text-left">
          <div>
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-2">Reservation</p>
            <p className="text-xl font-bold text-gray-900">지금 바로 예약하세요</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/booking" className="btn-pop text-sm font-semibold rounded-full px-7 py-3 bg-[#2A8EA2] text-white shadow-sm hover:shadow-lg transition-shadow whitespace-nowrap text-center">
              실시간예약
            </Link>
            <Link
              href="/reservation"
              className="btn-pop text-sm font-semibold rounded-full px-7 py-3 bg-white border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors whitespace-nowrap text-center"
            >
              예약안내
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
