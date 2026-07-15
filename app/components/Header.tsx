"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/rooms", label: "객실소개" },
  { href: "/special", label: "Special" },
  { href: "/travel", label: "주변관광" },
  { href: "/gallery", label: "여행갤러리" },
  { href: "/guide", label: "이용안내" },
  { href: "/reservation", label: "예약안내" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const transparent = isHome && !scrolled;

  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`text-base font-bold tracking-tight transition-colors duration-300 ${
            transparent ? "text-white" : "text-gray-900"
          }`}
        >
          서해스파풀빌라
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                transparent
                  ? `text-white/90 hover:bg-white/15 ${pathname === link.href ? "bg-white/15" : ""}`
                  : `text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${pathname === link.href ? "bg-gray-100 text-gray-900" : ""}`
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/booking"
            className={`btn-pop rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors duration-300 ${
              transparent
                ? "bg-white text-gray-900 hover:bg-white/90"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            실시간예약
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`lg:hidden transition-colors duration-300 ${
            transparent ? "text-white" : "text-gray-800"
          }`}
          aria-label="메뉴"
        >
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ${
          menuOpen ? "max-h-96" : "max-h-0"
        } bg-white border-b border-gray-100`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-8 py-3.5 text-gray-700 text-sm font-medium border-b border-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/booking"
          className="block px-8 py-3.5 text-[#2A8EA2] text-sm font-bold"
          onClick={() => setMenuOpen(false)}
        >
          실시간예약 →
        </Link>
      </div>
    </header>
  );
}
