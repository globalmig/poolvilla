"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FiChevronDown } from "react-icons/fi";

const heroImages = [
  "/스파풀(A,B,C공통)/KakaoTalk_20260702_113804103.jpg",
  "/객실(A-type)/KakaoTalk_20260702_113958589.jpg",
  "/객실(B-type)/KakaoTalk_20260702_114035977.jpg",
  "/주변관광지(원산안면대교)/KakaoTalk_20260702_114417167.jpg",
  "/객실(C-type)/KakaoTalk_20260702_114144440.jpg",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((p) => (p + 1) % heroImages.length),
      5000
    );
    return () => clearInterval(t);
  }, []);

  // Drag-to-swipe: only advances the slide while the mouse button is held
  // down and dragged. Pointer capture guarantees drag-end fires even if the
  // cursor leaves the section before the button is released.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const SWIPE_THRESHOLD = 80; // px of cumulative drag movement to advance a slide
    let accumX = 0;
    let dragging = false;
    let pointerId: number | null = null;

    const handlePointerDown = (e: PointerEvent) => {
      dragging = true;
      accumX = 0;
      pointerId = e.pointerId;
      section.setPointerCapture(e.pointerId);
      section.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      accumX += e.movementX;
      if (accumX > SWIPE_THRESHOLD) {
        setCurrent((p) => (p + 1) % heroImages.length);
        accumX = 0;
      } else if (accumX < -SWIPE_THRESHOLD) {
        setCurrent((p) => (p - 1 + heroImages.length) % heroImages.length);
        accumX = 0;
      }
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      accumX = 0;
      if (pointerId !== null) {
        try { section.releasePointerCapture(pointerId); } catch { /* already released */ }
      }
      pointerId = null;
      section.style.cursor = "grab";
    };

    section.style.cursor = "grab";
    section.addEventListener("pointerdown", handlePointerDown);
    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerup", endDrag);
    section.addEventListener("pointercancel", endDrag);
    return () => {
      section.removeEventListener("pointerdown", handlePointerDown);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerup", endDrag);
      section.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden select-none">
      {/* Image slideshow */}
      <div className="absolute inset-0 scale-105">
        {heroImages.map((src, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`원산도풀빌라 ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
              unoptimized
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
        <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-xs md:text-sm font-semibold mb-7 text-white/90">
          Boryeong · Wonsando · Pool Villa
        </span>
        <h1 className="text-[2.6rem] md:text-[4.5rem] lg:text-[5.5rem] font-bold tracking-tight leading-[0.95] mb-5">
          원산도의 특별한 쉼
        </h1>
        <p className="text-base md:text-lg font-medium mb-10 text-white/75">
          프라이빗 풀빌라 &nbsp;·&nbsp; 실내 온수수영장 &nbsp;·&nbsp; 스파&nbsp;&amp;&nbsp;사우나
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/rooms"
            className="btn-pop rounded-full text-sm md:text-base px-7 py-3.5 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300"
          >
            객실 보기
          </Link>
          <Link
            href="/booking"
            className="btn-pop rounded-full text-sm md:text-base px-7 py-3.5 font-semibold shadow-lg transition-colors duration-300"
            style={{ backgroundColor: "#2A8EA2", color: "#fff" }}
          >
            예약하기
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/50">
        <FiChevronDown size={18} className="animate-bounce" />
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === current ? "w-7 bg-white" : "w-2 bg-white/40"
            }`}
            aria-label={`슬라이드 ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
