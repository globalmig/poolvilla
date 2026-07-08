import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import {
  FiDroplet,
  FiSun,
  FiMoon,
  FiMonitor,
  FiWind,
  FiPackage,
  FiCoffee,
  FiMapPin,
  FiWifi,
  FiHome,
  FiTruck,
  FiNavigation,
  FiSunrise,
  FiSunset,
} from "react-icons/fi";

const rules = [
  "체크인 15:00 / 체크아웃 11:00 (시간 엄수 부탁드립니다)",
  "전 객실 금연입니다. 흡연은 지정 구역에서만 가능합니다",
  "반려동물 동반 입실이 불가합니다",
  "외부 음식 반입은 허용되나, 외부인 방문은 불가합니다",
  "수영장 이용 시 반드시 수영복을 착용해 주세요",
  "야간 소음 자제 부탁드립니다 (22:00 이후)",
  "바베큐 그릴은 지정 구역에서만 사용 가능합니다",
  "체크아웃 시 객실 내 물품 분실 및 파손 여부를 확인합니다",
];

const amenities = [
  { icon: FiDroplet, name: "욕조 / 스파" },
  { icon: FiDroplet, name: "실내 온수수영장" },
  { icon: FiSun, name: "습식 사우나" },
  { icon: FiHome, name: "풀 주방 (식기·조리도구)" },
  { icon: FiMoon, name: "침구 · 수건 제공" },
  { icon: FiMonitor, name: "스마트TV" },
  { icon: FiWind, name: "에어컨 / 냉장고" },
  { icon: FiPackage, name: "어메니티 (샴푸·바디워시·드라이어)" },
  { icon: FiCoffee, name: "커피머신 / 전기포트" },
  { icon: FiMapPin, name: "무료 주차" },
  { icon: FiWifi, name: "무선 인터넷 (WiFi)" },
];

const faq = [
  {
    q: "체크인·체크아웃 시간은 언제인가요?",
    a: "체크인 15:00, 체크아웃 11:00입니다. 얼리 체크인 및 레이트 체크아웃은 상황에 따라 협의 가능합니다.",
  },
  {
    q: "수영장은 연중 이용 가능한가요?",
    a: "네, 실내 온수수영장은 연중 24시간 이용 가능합니다. 수온은 계절에 따라 조절됩니다.",
  },
  {
    q: "주변 편의점이나 마트가 있나요?",
    a: "원산도 내 편의점이 있으나, 큰 마트는 보령 시내에 있습니다. 미리 필요한 물품을 준비하시거나, 카페에서 간단한 음료·간식을 구매하실 수 있습니다.",
  },
  {
    q: "원산도까지 어떻게 가나요?",
    a: "보령 원산도 연륙교(원산안면대교)를 통해 차량으로 이동 가능합니다. 대중교통 이용 시 보령 버스터미널에서 원산도행 버스를 이용하시면 됩니다.",
  },
  {
    q: "바베큐는 어떻게 이용하나요?",
    a: "기본 바베큐 그릴은 무료로 제공됩니다. 실내 안방 양면그릴은 대여료 20,000원이며, 예약 시 별도 요청하시면 됩니다. 숯과 착화제는 체크인 시 별도 구매 가능합니다.",
  },
];

export default function GuidePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "45vh" }}>
        <Image
          src="/객실(A-type)/KakaoTalk_20260702_113958589_02.jpg"
          alt="이용안내"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-4 text-white/90">
            Information
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">이용안내</h1>
        </div>
      </section>

      {/* Check-in/out */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-[#FAFAF9] px-12 py-12 text-center">
            <FiSunrise size={22} className="mx-auto text-[#2A8EA2] mb-5" />
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-3">
              Check-In
            </p>
            <p className="text-5xl font-bold text-gray-900 tracking-tight">15:00</p>
            <p className="text-sm text-gray-400 mt-3">오후 3시부터 입실 가능</p>
          </div>
          <div className="rounded-3xl bg-[#FAFAF9] px-12 py-12 text-center">
            <FiSunset size={22} className="mx-auto text-[#2A8EA2] mb-5" />
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-3">
              Check-Out
            </p>
            <p className="text-5xl font-bold text-gray-900 tracking-tight">11:00</p>
            <p className="text-sm text-gray-400 mt-3">오전 11시까지 퇴실</p>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">
              Amenities
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              기본 제공 시설
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.name}
                  className="rounded-2xl bg-[#FAFAF9] flex flex-col items-center gap-3 px-4 py-8 text-center"
                >
                  <Icon size={20} className="text-[#2A8EA2]" />
                  <span className="text-sm text-gray-600 font-medium leading-snug">
                    {a.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-20 px-8 bg-[#111] mx-4 md:mx-8 rounded-3xl">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/70 mb-4">
              House Rules
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              이용 규칙
            </h2>
          </div>
          <ul className="space-y-4">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-5">
                <span className="text-xs text-[#2A8EA2] font-bold tracking-wide shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/60 leading-relaxed">
                  {rule}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              자주 묻는 질문
            </h2>
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <details key={i} className="group rounded-2xl bg-[#FAFAF9] px-6 open:shadow-sm transition-shadow">
                <summary className="flex items-center justify-between py-5 cursor-pointer text-gray-800 text-base font-semibold list-none">
                  {item.q}
                  <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#2A8EA2] text-base group-open:rotate-45 transition-transform duration-200 ml-4 shrink-0 font-bold">
                    +
                  </span>
                </summary>
                <div className="pb-6 text-sm text-gray-500 leading-loose">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Access */}
      <section className="py-20 px-8" id="access">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">
              How to Get Here
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              오시는 길
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-3xl bg-[#FAFAF9] p-8">
              <div className="flex items-center gap-3 mb-5">
                <FiTruck size={17} className="text-[#2A8EA2]" />
                <h3 className="text-base font-bold text-gray-800">자가용 이용</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li>서해안고속도로 → 광천IC → 보령 방면</li>
                <li>보령대천IC → 원산도 방향</li>
                <li>원산안면대교(연륙교) → 원산도</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-[#FAFAF9] p-8">
              <div className="flex items-center gap-3 mb-5">
                <FiNavigation size={17} className="text-[#2A8EA2]" />
                <h3 className="text-base font-bold text-gray-800">대중교통 이용</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li>서울 → 보령 버스터미널 (고속버스 약 2시간)</li>
                <li>보령 터미널 → 원산도 (버스 이용)</li>
                <li>예약 시 픽업 서비스 문의 가능</li>
              </ul>
            </div>
          </div>
          <p className="flex items-center gap-2 text-sm text-gray-400">
            <FiMapPin size={14} className="text-[#2A8EA2]" />
            충청남도 보령시 오천면 원산도리
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
