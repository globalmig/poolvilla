import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import BookingCalendar from "./BookingCalendar";
import { FiPhone, FiMessageCircle, FiMapPin } from "react-icons/fi";

export default function BookingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "40vh" }}>
        <Image src="/스파풀(A,B,C공통)/KakaoTalk_20260702_113804103_03.jpg" alt="실시간예약" fill className="object-cover brightness-110 saturate-[1.1]" unoptimized priority />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.5)]">
          <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-4 text-white/90">Online Reservation</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">실시간 예약</h1>
        </div>
      </section>

      {/* Calendar Booking */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">Real-time Reservation</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">객실을 선택하고 예약하세요</h2>
          <p className="text-gray-500 text-sm">원하시는 객실을 먼저 선택한 후, 체크인·체크아웃 날짜를 골라주세요.</p>
        </div>
        <BookingCalendar />
      </section>

      {/* Contact cards */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center rounded-full bg-[#2A8EA2]/10 px-3.5 py-1.5 text-xs font-semibold text-[#1E7A8D] mb-4">Contact</span>
            <h2 className="text-xl font-bold text-gray-900">전화·카카오로도 문의하세요</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-3xl bg-[#1C2B3A] text-white p-8 text-center shadow-sm">
              <div className="text-3xl mb-4 flex justify-center">
                <FiPhone />
              </div>
              <h3 className="font-bold mb-2">전화 문의</h3>
              <p className="text-white/60 text-sm mb-5">
                평일 09:00 ~ 21:00
                <br />
                주말 · 공휴일 09:00 ~ 22:00
              </p>
              <a href="tel:010-0000-0000" className="btn-pop inline-block rounded-full px-6 py-2.5 bg-[#2A8EA2] text-white text-sm font-semibold shadow-sm hover:shadow-lg transition-shadow">
                전화하기
              </a>
            </div>

            <div className="rounded-3xl bg-[#FAFAF9] p-8 text-center shadow-sm">
              <div className="text-3xl mb-4 flex justify-center">
                <FiMessageCircle />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">카카오톡 문의</h3>
              <p className="text-gray-500 text-sm mb-5">
                카카오톡 채널로
                <br />
                편리하게 문의하세요
              </p>
              <a
                href="https://open.kakao.com/o/sEEOCmDi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pop inline-block rounded-full px-6 py-2.5 bg-[#FEE500] text-gray-900 text-sm font-semibold shadow-sm hover:shadow-lg transition-shadow"
              >
                카카오 채널
              </a>
            </div>

            <div className="rounded-3xl bg-[#FAFAF9] p-8 text-center shadow-sm">
              <div className="text-3xl mb-4 flex justify-center">
                <FiMapPin />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">위치</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                충청남도 보령시
                <br />
                오천면 원산도 4길 39-23
              </p>
              <Link
                href="/guide#access"
                className="btn-pop inline-block rounded-full px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-400 transition-colors"
              >
                오시는 길
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#FAFAF9] p-8">
          <h3 className="font-bold text-gray-900 mb-4">예약 안내 사항</h3>
          <ul className="space-y-2.5 text-sm text-gray-600">
            {["100% 입금 후 예약이 확정됩니다.", "추가 요금은 체크인 당일 현장 결제로 납부해 주세요.", "성수기 및 연휴 기간에는 별도 요금이 적용될 수 있습니다."].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="text-[#2A8EA2] shrink-0 mt-0.5">·</span>
                {t}
              </li>
            ))}
            <li className="flex items-start gap-2">
              <span className="text-[#2A8EA2] shrink-0 mt-0.5">·</span>
              취소 및 환불 정책은{" "}
              <Link href="/reservation" className="text-[#2A8EA2] font-semibold underline">
                예약안내
              </Link>{" "}
              페이지를 참조해 주세요.
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
