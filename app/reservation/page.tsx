import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import { FiCheck, FiArrowRight } from "react-icons/fi";

const pricingData = [
  {
    type: "스탠다드",
    typeEn: "Standard",
    size: "37평형",
    guests: "최대 6인",
    weekday: "200,000",
    weekend: "300,000",
    peak: "350,000",
    highlight: false,
  },
  {
    type: "프리미엄",
    typeEn: "Premium",
    size: "45평형",
    guests: "최대 8인",
    weekday: "280,000",
    weekend: "380,000",
    peak: "430,000",
    highlight: true,
  },
  {
    type: "패밀리",
    typeEn: "Family",
    size: "60평형",
    guests: "최대 15인",
    weekday: "400,000",
    weekend: "550,000",
    peak: "650,000",
    highlight: false,
  },
];

const steps = [
  { step: "01", title: "날짜 선택", desc: "원하시는 체크인·체크아웃 날짜와 객실 유형을 선택하세요." },
  { step: "02", title: "예약 확인", desc: "선택한 객실의 가격과 정책을 확인한 후 예약 신청을 해주세요." },
  { step: "03", title: "예약금 결제", desc: "예약금(총 금액의 30%)을 결제하시면 예약이 확정됩니다." },
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
        <Image
          src="/객실(B-type)/KakaoTalk_20260702_114035977_01.jpg"
          alt="예약안내"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-4 text-white/90">
            Reservation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">예약안내</h1>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">
              Room Rates
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              객실 요금
            </h2>
            <p className="text-sm text-gray-400">
              기준 2인 요금 / 추가 인원 1인당 30,000원
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {pricingData.map((p) => (
              <div
                key={p.type}
                className={`btn-pop rounded-3xl shadow-sm hover:shadow-2xl transition-shadow duration-500 ${
                  p.highlight ? "bg-[#111] text-white" : "bg-[#FAFAF9]"
                }`}
              >
                <div className="p-8">
                  <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-1.5">
                    {p.typeEn}
                  </p>
                  <h3 className={`text-lg font-bold mb-1 ${p.highlight ? "text-white" : "text-gray-900"}`}>
                    {p.type}
                  </h3>
                  <p className={`text-sm mb-8 ${p.highlight ? "text-white/35" : "text-gray-400"}`}>
                    {p.size} · {p.guests}
                  </p>

                  <div className="space-y-3">
                    {[
                      { label: "주중 (일~목)", value: p.weekday },
                      { label: "주말 (금·토)", value: p.weekend },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-baseline">
                        <span className={`text-sm ${p.highlight ? "text-white/40" : "text-gray-400"}`}>
                          {item.label}
                        </span>
                        <span className={`text-sm font-semibold ${p.highlight ? "text-white/70" : "text-gray-700"}`}>
                          {item.value}원
                        </span>
                      </div>
                    ))}
                    <div className={`border-t pt-3 flex justify-between items-baseline ${p.highlight ? "border-white/10" : "border-gray-200"}`}>
                      <span className={`text-sm ${p.highlight ? "text-white/40" : "text-gray-400"}`}>
                        성수기
                      </span>
                      <span className={`text-base ${p.highlight ? "text-[#2A8EA2]" : "text-gray-900"} font-bold`}>
                        {p.peak}원
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/booking"
                    className={`btn-pop flex items-center justify-center gap-2 w-full mt-8 py-3 rounded-full text-sm font-semibold transition-colors ${
                      p.highlight
                        ? "bg-[#2A8EA2] text-white hover:opacity-90"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    예약하기 <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 text-right">
            * 위 금액은 참고 금액이며 실제 요금은 예약 시 확인 부탁드립니다
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">
              How to Book
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              예약 방법
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="rounded-2xl bg-[#FAFAF9] p-7">
                <p className="text-sm text-[#2A8EA2] font-bold mb-4">
                  {s.step}
                </p>
                <h3 className="text-base font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cancellation */}
      <section className="py-20 px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">
              Cancellation Policy
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              취소 및 환불 정책
            </h2>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 bg-[#FAFAF9]">
              <div className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">취소 시점</div>
              <div className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">환불 금액</div>
            </div>
            {cancelPolicy.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 border-t border-gray-100 ${
                  item.refund === "환불 불가" ? "bg-red-50/40" : "bg-white"
                }`}
              >
                <div className="px-6 py-4 text-sm text-gray-600">{item.timing}</div>
                <div className={`px-6 py-4 text-sm font-medium flex items-center gap-2 ${
                  item.refund === "환불 불가"
                    ? "text-red-500"
                    : item.safe
                    ? "text-green-600"
                    : "text-gray-700"
                }`}>
                  {item.safe && <FiCheck size={13} />}
                  {item.refund}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            * 성수기(7~8월, 연휴)는 별도 취소 정책이 적용될 수 있습니다 &nbsp;·&nbsp; 노쇼 시 환불 불가
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-[#FAFAF9] p-10">
          <div>
            <p className="text-xs font-semibold text-[#2A8EA2] uppercase tracking-wide mb-2">
              Ready to Book?
            </p>
            <p className="text-xl font-bold text-gray-900">지금 바로 예약하세요</p>
          </div>
          <Link
            href="/booking"
            className="btn-pop text-sm font-semibold rounded-full px-8 py-3.5 bg-[#2A8EA2] text-white shadow-sm hover:shadow-lg transition-shadow"
          >
            실시간예약
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
