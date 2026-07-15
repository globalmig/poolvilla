import Image from "next/image";
import Link from "next/link";
import ImageSlider from "../components/ImageSlider";
import Footer from "../components/Footer";

function makeImgs(folder: string, base: string, total: number): string[] {
  return [`/${folder}/${base}.jpg`, ...Array.from({ length: total - 1 }, (_, i) => `/${folder}/${base}_${String(i + 1).padStart(2, "0")}.jpg`)];
}

const attractions = [
  {
    id: "wonsando-beach",
    name: "원산도 해수욕장",
    nameEn: "Wonsando Beach",
    category: "해수욕장",
    distance: "도보 이동 가능",
    desc: "원산도 내 위치한 아름다운 해수욕장으로, 맑고 투명한 바닷물과 고운 모래사장이 펼쳐집니다. 풀빌라에서 도보로 이동 가능하여 언제든 가볍게 방문할 수 있습니다.",
    images: makeImgs("주변관광지(원산도해수욕장)", "KakaoTalk_20260702_114439758", 5),
  },
  {
    id: "obongsan-beach",
    name: "오봉산 해수욕장",
    nameEn: "Obongsan Beach",
    category: "해수욕장",
    distance: "차량 10분",
    desc: "오봉산 기슭에 자리한 조용하고 깨끗한 해수욕장입니다. 원산도의 자연을 배경으로 여유로운 바다 시간을 즐길 수 있는 숨겨진 명소입니다.",
    images: makeImgs("주변관광지(오봉산해수욕장)", "KakaoTalk_20260702_114310365", 7),
  },
  {
    id: "sachang-beach",
    name: "사창 해수욕장",
    nameEn: "Sachang Beach",
    category: "해수욕장",
    distance: "차량 10분",
    desc: "잔잔한 파도와 넓은 백사장이 특징인 사창 해수욕장. 가족 단위 방문객이 즐기기 좋은 포근한 분위기의 해변입니다.",
    images: makeImgs("주변관광지(사창해수욕장)", "KakaoTalk_20260702_114243966", 3),
  },
  {
    id: "mobility",
    name: "원산도 모빌리티",
    nameEn: "Wonsando Mobility",
    category: "레저",
    distance: "차량 5분",
    desc: "전기 바이크, 버기카 등 다양한 모빌리티를 체험해보세요. 섬의 자연과 풍경을 색다른 방식으로 즐길 수 있는 액티비티입니다.",
    images: makeImgs("주변관광지(원산도 모빌리티)", "KakaoTalk_20260702_114220367", 5),
  },
  {
    id: "bridge",
    name: "원산안면대교",
    nameEn: "Wonsando-Anmyeon Bridge",
    category: "관광",
    distance: "차량 10분",
    desc: "원산도와 안면도를 잇는 아름다운 대교입니다. 서해의 일몰을 배경으로 특별한 드라이브와 인생 사진을 남길 수 있는 명소입니다.",
    images: makeImgs("주변관광지(원산안면대교)", "KakaoTalk_20260702_114417167", 6),
  },
];

const categoryColor: Record<string, string> = {
  해수욕장: "#4A7FA5",
  레저: "#5B8E6E",
  관광: "#8B6E9E",
};

export default function TravelPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "50vh" }}>
        <Image src={attractions[0].images[0]} alt="주변관광지" fill className="object-cover brightness-110 saturate-[1.1]" unoptimized priority />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.5)]">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-4 text-white/90">Nearby Attractions</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">주변 관광지</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-8 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">Explore Wonsando</span>
          <p className="text-base text-gray-500 leading-relaxed">
            원산도의 아름다운 해수욕장과 레저 시설, 관광 명소를 탐험해보세요.
            <br className="hidden md:block" />
            풀빌라에서의 프라이빗 휴식과 함께 원산도의 매력을 만끽하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* Attractions — alternating layout */}
      {attractions.map((att, idx) => (
        <section key={att.id} className={`py-16 px-8 ${idx % 2 === 1 ? "bg-[#FAFAF9]" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className={`${idx % 2 === 1 ? "md:order-2" : ""} relative overflow-hidden rounded-3xl shadow-xl`} style={{ height: "400px" }}>
              {att.images.length > 1 ? <ImageSlider images={att.images} alt={att.name} className="h-full" /> : <Image src={att.images[0]} alt={att.name} fill className="object-cover" unoptimized />}
            </div>

            {/* Text */}
            <div className={idx % 2 === 1 ? "md:order-1" : ""}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: categoryColor[att.category] ?? "#888" }}>
                  {att.category}
                </span>
                <span className="text-sm text-gray-400">{att.distance}</span>
              </div>
              <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-1.5">{att.nameEn}</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">{att.name}</h2>
              <p className="text-base text-gray-500 leading-relaxed">{att.desc}</p>
            </div>
          </div>
        </section>
      ))}

      {/* Map */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-2">Location</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">오시는 길</h2>
            <p className="text-sm text-gray-400">충남 보령시 오천면 원산도 4길 39-23</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-xl" style={{ height: "420px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d126.45!3d36.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b37ef1a4f8c0f%3A0x1234567890!2z7JWI7IKw64+Z!5e0!3m2!1sko!2skr!4v1700000000000"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="서해스파풀빌라 위치"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-[#FAFAF9] p-6 sm:p-10 text-center md:text-left">
          <div>
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-2">Reservation</p>
            <p className="text-xl font-bold text-gray-900">원산도에서 특별한 추억을 만들어 보세요</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/booking" className="btn-pop text-sm font-semibold rounded-full px-7 py-3 bg-[#2A8EA2] text-white shadow-sm hover:shadow-lg transition-shadow whitespace-nowrap text-center">
              실시간예약
            </Link>
            <Link
              href="/rooms"
              className="btn-pop text-sm font-semibold rounded-full px-7 py-3 bg-white border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors whitespace-nowrap text-center"
            >
              객실 보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
