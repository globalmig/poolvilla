"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface ImageSliderProps {
  images: string[];
  alt: string;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  showArrows?: boolean;
}

export default function ImageSlider({
  images,
  alt,
  autoPlay = true,
  interval = 4000,
  className = "",
  showArrows = true,
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((p) => (p + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(next, interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, next]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`${alt} ${idx + 1}`}
            fill
            className="object-cover"
            priority={idx === 0}
            unoptimized
          />
        </div>
      ))}

      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="btn-pop absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg flex items-center justify-center text-xl font-medium"
            aria-label="이전"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="btn-pop absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg flex items-center justify-center text-xl font-medium"
            aria-label="다음"
          >
            ›
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
              aria-label={`슬라이드 ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
