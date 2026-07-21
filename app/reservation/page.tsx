import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import { FiCheck, FiArrowRight } from "react-icons/fi";

const pricingData = [
  {
    type: "A타입",
    weekday: "149,000원 (오픈기념40%세일)",
    weekend: "199,000원 (오픈기념30%세일)",
    peak: "199,000원 (오픈기념30%세일)",
    normal: "570,000원",
    highlight: false,
  },
  {
    type: "B타입",
    weekday: "149,000원 (오픈기념40%세일)",
    weekend: "199,000원 (오픈기념30%세일)",
    peak: "199,000원 (오픈기념30%세일)",
    normal: "570,000원",
    highlight: true,
  },
  {
    type: "C타입",
    weekday: "119,000원 (오픈기념40%세일)",
    weekend: "169,000원 (오픈기념30%세일)",
    peak: "169,000원 (오픈기념30%세일)",
    normal: "528,000원",
    highlight: false,
  },
];

const steps = [
  { step: "01", title: "날짜 선택", desc: "원하시는 체크인·체크아웃 날짜와 객실 유형을 선택하세요." },
  { step: "02", title: "예약 확인", desc: "선택한 객실의 가격과 정책을 확인한 후 예약 신청을 해주세요." },
  { step: "03", title: "결제", desc: "총 금액의 100%를 계좌이체하시면 예약이 확정됩니다." },
  { step: "04", title: "입실", desc: "체크인 당일 15:00 이후 입실하시면 됩니다." },
];

const cancelPolicy = [
  { timing: "입실 7일 전 이전", refund: "100% 환불", safe: true },
  { timing: "입실 5~6일 전", refund: "80% 환불", safe: true },
  { timing: "입실 3~4일 전", refund: "50% 환불", safe: false },
  { timing: "입실 1~2일 전", refund: "30% 환불", safe: false },
  { timing: "입실 당일", refund: "환불 불가", safe: false },
];

export default function ReservationPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "45vh" }}>
        <Image src="/객실(B-type)/KakaoTalk_20260702_114035977_01.jpg" alt="예약안내" fill className="object-cover brightness-110 saturate-[1.1]" unoptimized priority />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.5)]">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-4 text-white/90">Reservation</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">예약안내</h1>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">Room Rates</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">객실 요금</h2>
            <p className="text-sm text-gray-400">기준 2인 요금 / 추가 인원 1인당 30,000원</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {pricingData.map((p) => (
              <div
                key={p.type}
                className={`btn-pop relative rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-500 ${
                  p.highlight ? "bg-white border-2 border-[#2A8EA2]" : "bg-[#FAFAF9] border-2 border-transparent"
                }`}
              >
                {p.highlight && <span className="absolute -top-3 left-8 rounded-full bg-[#2A8EA2] text-white text-xs font-semibold px-3 py-1">인기</span>}
                <div className="p-8">
                  <h3 className="text-lg font-bold mb-8 text-gray-900">{p.type}</h3>

                  <div className="space-y-3">
                    {[
                      { label: "주중 (일~목)", value: p.weekday },
                      { label: "주말 (금·토)", value: p.weekend },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-baseline">
                        <span className="text-sm text-gray-400">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                      <span className="text-sm text-gray-400">성수기</span>
                      <span className={`text-base font-bold ${p.highlight ? "text-[#2A8EA2]" : "text-gray-900"}`}>{p.peak}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                      <span className="text-sm text-gray-400">정상가</span>
                      <span className={`text-base font-bold`}>{p.normal}</span>
                    </div>
                  </div>

                  <Link
                    href="/booking"
                    className={`btn-pop flex items-center justify-center gap-2 w-full mt-8 py-3 rounded-full text-sm font-semibold transition-colors ${
                      p.highlight ? "bg-[#2A8EA2] text-white hover:opacity-90" : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    예약하기 <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 text-right">* 위 금액은 참고 금액이며 실제 요금은 예약 시 확인 부탁드립니다</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">How to Book</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">예약 방법</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="rounded-2xl bg-[#FAFAF9] p-7">
                <p className="text-sm text-[#2A8EA2] font-bold mb-4">{s.step}</p>
                <h3 className="text-base font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cancellation */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">Cancellation Policy</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">취소 및 환불 정책</h2>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-[1.2fr_1fr] bg-[#FAFAF9]">
              <div className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">취소 시점</div>
              <div className="px-4 sm:px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">환불 금액</div>
            </div>
            {cancelPolicy.map((item, i) => (
              <div key={i} className={`grid grid-cols-[1.2fr_1fr] border-t border-gray-100 ${item.refund === "환불 불가" ? "bg-red-50/40" : "bg-white"}`}>
                <div className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{item.timing}</div>
                <div
                  className={`px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap ${
                    item.refund === "환불 불가" ? "text-red-500" : item.safe ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  {item.safe && <FiCheck size={13} className="shrink-0" />}
                  {item.refund}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">* 성수기(7~8월, 연휴)는 별도 취소 정책이 적용될 수 있습니다 &nbsp;·&nbsp; 노쇼 시 환불 불가</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-[#FAFAF9] p-6 sm:p-10 text-center md:text-left">
          <div>
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-2">Ready to Book?</p>
            <p className="text-xl font-bold text-gray-900">지금 바로 예약하세요</p>
          </div>
          <Link
            href="/booking"
            className="btn-pop text-sm font-semibold rounded-full px-8 py-3.5 bg-[#2A8EA2] text-white shadow-sm hover:shadow-lg transition-shadow whitespace-nowrap text-center w-full sm:w-auto"
          >
            실시간예약
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
