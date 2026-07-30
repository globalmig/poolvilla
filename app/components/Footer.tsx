import Link from "next/link";
import { FiInstagram, FiYoutube } from "react-icons/fi";

const navLinks = [
  { href: "/rooms", label: "객실소개" },
  { href: "/special", label: "Special" },
  { href: "/travel", label: "주변관광" },
  { href: "/gallery", label: "여행갤러리" },
  { href: "/guide", label: "이용안내" },
  { href: "/reservation", label: "예약안내" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-10">
        <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-lg font-bold tracking-tight mb-4">참좋은 원산도</p>
            <p className="text-sm text-white/40 leading-relaxed">대표자: 김영민</p>
            <p className="text-sm text-white/40 leading-relaxed mb-6">이메일: elect9@naver.com</p>
            <p className="text-sm text-white/40 leading-relaxed">사업자등록번호: 859-64-00651</p>

            <p className="text-sm text-white/40 leading-relaxed mb-6">
              충남 보령시 오천면 원산도 4길 39-23
              <br />
              체크인 15:00 &nbsp;·&nbsp; 체크아웃 11:00
            </p>

            <p className="text-sm text-white/40 leading-relaxed mb-6">
              <span className="font-semibold text-white/60">문의</span>
            </p>
            {/* <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/60 hover:bg-white hover:text-gray-900 transition-colors">
                <FiInstagram size={16} />
              </a>
              <a href="#" aria-label="YouTube" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/60 hover:bg-white hover:text-gray-900 transition-colors">
                <FiYoutube size={16} />
              </a>
            </div> */}
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wide mb-4">Quick Menu</p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wide mb-4">Reservation</p>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              실시간 예약 및 문의는
              <br />
              아래 버튼을 이용해 주세요
            </p>
            <Link href="/booking" className="btn-pop inline-block text-sm font-semibold rounded-full px-5 py-2.5 bg-[#2A8EA2] text-white hover:opacity-90 transition-opacity">
              실시간예약
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <p className="text-xs text-white/25">© 2026 서해풀빌라. All rights reserved.</p>
          <a href="https://www.weasley-market.com/homepage-development" target="_blank" rel="noopener noreferrer" className="text-xs text-white/20">
            made by <span className="text-white/50">GlobalMig</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
