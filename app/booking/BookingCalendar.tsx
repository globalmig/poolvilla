"use client";

import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiUser, FiPhone, FiMail, FiMessageSquare, FiUsers, FiCheckCircle, FiAlertCircle, FiCheck } from "react-icons/fi";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomType = "a" | "b" | "c";
type Step = "room" | "calendar" | "form" | "success";

interface AvailMap {
  [date: string]: { booked: number; total: number; status: string };
}

// ─── Room definitions (must match lib/bookings.ts) ────────────────────────────

const ROOM_TYPES: RoomType[] = ["a", "b", "c"];

const ROOMS_BY_TYPE: Record<RoomType, string[]> = {
  a: ["프리미엄 201", "프리미엄 301", "프리미엄 401"],
  b: ["프리미엄 202", "프리미엄 302", "프리미엄 402"],
  c: ["스탠다드 201", "스탠다드 301", "스탠다드 401"],
};

const ROOM_INFO: Record<RoomType, { name: string; typeLabel: string; size: string; maxGuests: number }> = {
  a: { name: "프리미엄", typeLabel: "A타입", size: "37평형", maxGuests: 8 },
  b: { name: "프리미엄", typeLabel: "B타입", size: "37평형", maxGuests: 8 },
  c: { name: "스탠다드", typeLabel: "C타입", size: "37평형", maxGuests: 6 },
};

type RoomPrices = Record<RoomType, { weekday: number; weekend: number; peak: number; normal: number }>;

// Fallback shown before /api/pricing responds — kept in sync with lib/pricing.ts DEFAULT_PRICING
const DEFAULT_ROOM_PRICES: RoomPrices = {
  a: { weekday: 149000, weekend: 199000, peak: 199000, normal: 570000 },
  b: { weekday: 149000, weekend: 199000, peak: 199000, normal: 570000 },
  c: { weekday: 119000, weekend: 169000, peak: 169000, normal: 528000 },
};

function getRoomType(roomId: string): RoomType {
  for (const [t, ids] of Object.entries(ROOMS_BY_TYPE)) {
    if (ids.includes(roomId)) return t as RoomType;
  }
  return "a";
}

function roomDisplay(roomId: string | null): string {
  if (!roomId) return "";
  const num = roomId.split(" ")[1];
  const info = ROOM_INFO[getRoomType(roomId)];
  return `${info.name} ${num}호 (${info.typeLabel})`;
}

// ─── Extra options ────────────────────────────────────────────────────────────

interface Extra {
  id: string;
  label: string;
  desc: string;
  price: number;
}

// Fallback shown before /api/pricing responds — kept in sync with lib/pricing.ts DEFAULT_PRICING
const DEFAULT_EXTRAS: Extra[] = [
  { id: "balconyGrill", label: "실내 바베큐 (발코니 양면그릴)", desc: "20,000원", price: 20000 },
  { id: "charcoalBbq", label: "숯불바베큐", desc: "30,000원", price: 30000 },
  { id: "spaSauna", label: "스위밍스파&온탕스파", desc: "100,000원", price: 100000 },
  { id: "car", label: "전기차 충전", desc: "별도 문의 및 현장결제", price: 0 },
];

interface PricingExtra {
  id: string;
  label: string;
  price: number;
}

function buildExtras(extras: PricingExtra[]): Extra[] {
  return [
    ...extras.map((e) => ({
      id: e.id,
      label: e.label,
      desc: e.price > 0 ? `${e.price.toLocaleString("ko-KR")}원` : "무료",
      price: e.price,
    })),
    { id: "car", label: "전기차 충전", desc: "별도 문의 및 현장결제", price: 0 },
  ];
}

// ─── Calendar / date helpers ──────────────────────────────────────────────────

const KO_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const KO_MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const PEAK_MD = new Set([
  "01-01",
  "01-27",
  "01-28",
  "01-29",
  "01-30",
  "03-01",
  "05-05",
  "06-06",
  "07-26",
  "07-27",
  "07-28",
  "07-29",
  "07-30",
  "07-31",
  "08-01",
  "08-02",
  "08-03",
  "08-04",
  "08-05",
  "08-15",
  "10-03",
  "10-06",
  "10-07",
  "10-08",
  "10-09",
  "12-25",
  "12-31",
]);

function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

function fmtKR(dateStr: string): string {
  const [y, m, dd] = dateStr.split("-");
  return `${y}년 ${parseInt(m)}월 ${parseInt(dd)}일`;
}

function krw(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

function isPeak(dateStr: string): boolean {
  return PEAK_MD.has(dateStr.slice(5));
}
function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr).getDay();
  return d === 5 || d === 6;
}

function nightlyRate(prices: RoomPrices, roomType: RoomType, dateStr: string): number {
  const p = prices[roomType];
  return isPeak(dateStr) ? p.peak : isWeekend(dateStr) ? p.weekend : p.weekday;
}

function calcTotal(prices: RoomPrices, roomType: RoomType, checkIn: Date, checkOut: Date): number {
  let sum = 0;
  const cur = new Date(checkIn);
  while (cur < checkOut) {
    sum += nightlyRate(prices, roomType, fmt(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return sum;
}

function calendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = Array(first).fill(null);
  for (let d = 1; d <= count; d++) days.push(new Date(year, month, d));
  return days;
}

function sameDay(a: Date, b: Date) {
  return fmt(a) === fmt(b);
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { key: "room", label: "객실 선택" },
  { key: "calendar", label: "날짜 선택" },
  { key: "form", label: "정보 입력" },
] as const;

function StepBar({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-10 select-none">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.key} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${done ? "bg-[#2A8EA2] text-white" : active ? "bg-[#2A8EA2] text-white ring-4 ring-[#2A8EA2]/20" : "bg-gray-100 text-gray-400"}`}
              >
                {done ? <FiCheck /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap transition-colors
                  ${active ? "text-[#2A8EA2]" : done ? "text-gray-500" : "text-gray-300"}`}
              >
                {s.label}
              </span>
            </div>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-16 md:w-24 h-px mx-2 mb-5 transition-colors
                  ${i < currentIdx ? "bg-[#2A8EA2]" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingCalendar() {
  const todayStart = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  const [viewDate, setViewDate] = useState(() => new Date(todayStart.getFullYear(), todayStart.getMonth(), 1));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [avail, setAvail] = useState<AvailMap>({});
  const [step, setStep] = useState<Step>("room");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({ guestName: "", phone: "", email: "", guests: "2", notes: "" });
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [roomPrices, setRoomPrices] = useState<RoomPrices>(DEFAULT_ROOM_PRICES);
  const [extras, setExtras] = useState<Extra[]>(DEFAULT_EXTRAS);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        setRoomPrices(data.rooms);
        setExtras(buildExtras(data.extras));
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

  function toggleExtra(id: string) {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const extrasTotal = extras.filter((e) => selectedExtras.has(e.id)).reduce((s, e) => s + e.price, 0);
  const spaExtra = extras.find((e) => e.id === "spaSauna");
  const spaFeeLabel = krw(spaExtra?.price ?? 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // ── Fetch day availability for the selected room ──

  const fetchAvail = useCallback(async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 2, 0);
      const res = await fetch(`/api/availability?start=${fmt(start)}&end=${fmt(end)}&roomId=${encodeURIComponent(selectedRoom)}`);
      setAvail(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [year, month, selectedRoom]);

  useEffect(() => {
    fetchAvail();
  }, [fetchAvail]);

  // ── Calendar logic ──

  function dateStatus(d: Date): "past" | "available" | "unavailable" {
    if (d < todayStart) return "past";
    return (avail[fmt(d)]?.status as "available" | "unavailable") ?? "available";
  }

  function inRange(d: Date): boolean {
    if (!checkIn) return false;
    const end = checkOut ?? hover;
    if (!end) return false;
    const [lo, hi] = checkIn < end ? [checkIn, end] : [end, checkIn];
    return d > lo && d < hi;
  }

  // Does every night between start and end (exclusive of end) stay available?
  function rangeAvailable(start: Date, end: Date): boolean {
    const cur = new Date(start);
    while (cur < end) {
      if (dateStatus(cur) === "unavailable") return false;
      cur.setDate(cur.getDate() + 1);
    }
    return true;
  }

  function handleDayClick(d: Date) {
    const s = dateStatus(d);
    if (s === "past" || s === "unavailable") return;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d);
      setCheckOut(null);
    } else if (sameDay(d, checkIn)) {
      setCheckIn(null);
    } else if (d < checkIn) {
      setCheckIn(d);
      setCheckOut(null);
    } else if (!rangeAvailable(checkIn, d)) {
      // Range would cross a night this room is already booked — start over from here
      setCheckIn(d);
      setCheckOut(null);
    } else {
      setCheckOut(d);
    }
  }

  function chooseRoom(roomId: string) {
    setSelectedRoom(roomId);
    setCheckIn(null);
    setCheckOut(null);
    setStep("calendar");
  }

  function backToRoom() {
    setStep("room");
    setCheckIn(null);
    setCheckOut(null);
  }

  // ── Pricing ──

  const selectedType = selectedRoom ? getRoomType(selectedRoom) : null;
  const roomInfo = selectedType ? ROOM_INFO[selectedType] : null;
  const maxGuests = roomInfo ? roomInfo.maxGuests : 15;
  const nights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000) : 0;
  const roomTotal = checkIn && checkOut && selectedType ? calcTotal(roomPrices, selectedType, checkIn, checkOut) : 0;
  const total = roomTotal + extrasTotal;

  // ── Submit ──

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkIn || !checkOut || !selectedRoom) return;
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guests: Number(form.guests),
          roomId: selectedRoom,
          checkIn: fmt(checkIn),
          checkOut: fmt(checkOut),
          extras: Array.from(selectedExtras),
          extrasTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error ?? "오류가 발생했습니다.");
        return;
      }
      setStep("success");
    } catch {
      setApiError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setCheckIn(null);
    setCheckOut(null);
    setSelectedRoom(null);
    setStep("room");
    setForm({ guestName: "", phone: "", email: "", guests: "2", notes: "" });
    setSelectedExtras(new Set());
    setAgreedToTerms(false);
    setApiError("");
  }

  const days = calendarDays(year, month);

  // ══════════════════════════════════════════════════════════════════════════════
  // Render: Success
  // ══════════════════════════════════════════════════════════════════════════════
  if (step === "success") {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-6">
        <FiCheckCircle className="mx-auto text-5xl text-green-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">예약 신청이 완료되었습니다</h2>
        <p className="text-gray-500 mb-2">입력하신 연락처로 예약 확정 안내를 드릴 예정입니다.</p>

        <div className="rounded-3xl bg-[#FAFAF9] p-6 text-left mb-8 text-sm text-gray-600 space-y-1.5">
          <div>
            <span className="font-semibold text-gray-800">객실:</span> {roomDisplay(selectedRoom)}
          </div>
          <div>
            <span className="font-semibold text-gray-800">체크인:</span> {fmtKR(fmt(checkIn!))}
          </div>
          <div>
            <span className="font-semibold text-gray-800">체크아웃:</span> {fmtKR(fmt(checkOut!))}
          </div>
          {selectedExtras.size > 0 && (
            <div>
              <span className="font-semibold text-gray-800">추가 옵션:</span>{" "}
              {extras.filter((e) => selectedExtras.has(e.id))
                .map((e) => e.label)
                .join(", ")}
            </div>
          )}
          <div className="pt-1 border-t border-gray-200">
            <span className="font-semibold text-gray-800">총 금액:</span> <span className="font-bold text-[#2A8EA2]">{krw(total)}</span>
          </div>
        </div>
        <button onClick={reset} className="btn-pop rounded-full px-8 py-3 bg-[#2A8EA2] text-white font-semibold shadow-sm hover:shadow-lg transition-shadow">
          새 예약하기
        </button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Render: Room selection (step 1)
  // ══════════════════════════════════════════════════════════════════════════════
  if (step === "room") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <StepBar current="room" />
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8 text-center">객실을 선택하세요</h3>

        <div className="space-y-8">
          {ROOM_TYPES.map((type) => {
            const info = ROOM_INFO[type];
            const rooms = ROOMS_BY_TYPE[type];
            const prices = roomPrices[type];
            return (
              <div key={type}>
                <div className="flex items-baseline justify-between mb-3 flex-wrap gap-1">
                  <span className="text-base font-bold text-gray-900">
                    {info.name} <span className="text-gray-400 font-normal text-sm">({info.typeLabel})</span>
                  </span>
                  <span className="text-sm text-gray-400">
                    {info.size} · 최대 {info.maxGuests}인
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {rooms.map((roomId) => (
                    <button key={roomId} onClick={() => chooseRoom(roomId)} className="btn-pop rounded-2xl border-2 border-gray-100 hover:border-[#2A8EA2] px-4 py-4 text-left transition-colors">
                      <span className="block text-sm font-semibold text-gray-800">{roomId.split(" ")[1]}호</span>
                      <span className="block text-xs text-gray-400 mt-0.5">{info.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">객실을 선택하면 해당 객실의 예약 가능한 날짜를 확인할 수 있습니다.</p>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Render: Form (step 3)
  // ══════════════════════════════════════════════════════════════════════════════
  if (step === "form") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <StepBar current="form" />
        <button onClick={() => setStep("calendar")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <FiChevronLeft /> 날짜 다시 선택
        </button>

        {/* Summary */}
        <div className="rounded-3xl bg-[#1C2B3A] text-white p-6 mb-8 shadow-sm">
          <p className="text-[#2A8EA2] text-xs font-semibold tracking-wide uppercase mb-3">예약 요약</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-white/50">객실</span>
              <br />
              <strong>{roomDisplay(selectedRoom)}</strong>
            </div>
            <div>
              <span className="text-white/50">인원</span>
              <br />
              <strong>{form.guests}명</strong>
            </div>
            <div>
              <span className="text-white/50">체크인</span>
              <br />
              <strong>{fmtKR(fmt(checkIn!))}</strong>
            </div>
            <div>
              <span className="text-white/50">체크아웃</span>
              <br />
              <strong>{fmtKR(fmt(checkOut!))}</strong>
            </div>
          </div>
          <div className="border-t border-white/20 mt-4 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">객실 {nights}박</span>
              <span>{krw(roomTotal)}</span>
            </div>
            {extrasTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-white/60">추가 옵션</span>
                <span>+{krw(extrasTotal)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t border-white/10">
              <span>합계</span>
              <span className="text-[#2A8EA2]">{krw(total)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">예약자 정보</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FiUser className="inline mr-1.5" />
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="홍길동"
              value={form.guestName}
              onChange={(e) => setForm((f) => ({ ...f, guestName: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FiPhone className="inline mr-1.5" />
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FiMail className="inline mr-1.5" />
              이메일 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FiUsers className="inline mr-1.5" />
              인원 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.guests}
              onChange={(e) => setForm((f) => ({ ...f, guests: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors bg-white"
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}명
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">기준 인원 초과 시 1인당 30,000원/박 추가 · 성인·아동·유아·영유아 모두 인원수에 포함 · 최대 인원 초과 시 펜션으로 문의</p>
          </div>

          {/* ── 수영장 안내 ── */}
          {spaExtra && (
            <div className="rounded-2xl bg-[#2A8EA2]/5 border border-[#2A8EA2]/15 px-5 py-4 space-y-1">
              <p className="text-sm font-semibold text-[#2A8EA2]">개별 수영장 이용 안내</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                스위밍스파&온탕스파 이용요금 <span className="font-semibold text-gray-700">{spaFeeLabel}/박</span> — 현장결제
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">객실 이용 시 미온수 이용 필수 · 냉수 이용 불가</p>
            </div>
          )}

          {/* ── 추가 옵션 ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              추가 옵션 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            {extras.map((extra) => {
              const on = selectedExtras.has(extra.id);
              return (
                <button
                  key={extra.id}
                  type="button"
                  onClick={() => toggleExtra(extra.id)}
                  className={`w-full text-left rounded-2xl mb-2 border-2 px-5 py-4 transition-all ${on ? "border-[#2A8EA2] bg-[#2A8EA2]/5" : "border-gray-100 hover:border-gray-300 "}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${on ? "text-[#2A8EA2]" : "text-gray-800"}`}>{extra.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{extra.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${on ? "bg-[#2A8EA2]" : "bg-gray-100"}`}>
                      {on && <FiCheck className="text-white text-xs" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FiMessageSquare className="inline mr-1.5" />
              요청사항 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <textarea
              rows={3}
              placeholder="특별한 요청사항이 있으시면 입력해주세요."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors resize-none"
            />
          </div>

          {apiError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3">
              <FiAlertCircle /> {apiError}
            </div>
          )}

          <p className="text-xs text-gray-400 leading-relaxed">예약 신청 후 100% 입금 확인 시 예약이 확정됩니다.</p>

          {/* ── 약관 동의 ── */}
          <div className={`flex items-center justify-between rounded-2xl px-5 py-4 border transition-colors ${agreedToTerms ? "bg-[#2A8EA2]/5 border-[#2A8EA2]/20" : "bg-gray-50 border-gray-100"}`}>
            <div>
              <p className="text-sm font-medium text-gray-800">개인정보 수집·이용 및 예약 약관</p>
              <p className={`text-xs mt-0.5 ${agreedToTerms ? "text-[#2A8EA2]" : "text-gray-400"}`}>{agreedToTerms ? "동의 완료" : "예약 진행을 위해 동의가 필요합니다"}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors shrink-0 ${agreedToTerms ? "bg-[#2A8EA2] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {agreedToTerms ? "✓ 동의완료" : "내용 확인 · 동의"}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting || !agreedToTerms}
            className="btn-pop w-full py-4 rounded-full bg-[#2A8EA2] text-white font-bold text-base shadow-sm hover:shadow-lg transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "처리 중..." : "예약 신청하기"}
          </button>
        </form>

        {/* ── 약관 모달 ── */}
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">개인정보 수집·이용 및 예약 약관</h2>
                <button type="button" onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-700 text-lg leading-none">
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto px-6 py-5 space-y-6 text-sm text-gray-600 leading-relaxed">
                <section>
                  <h3 className="font-bold text-gray-800 mb-2">1. 개인정보 수집·이용 동의</h3>
                  <div className="rounded-xl border border-gray-100 overflow-hidden text-xs">
                    {[
                      ["수집 항목", "이름, 연락처, 이메일"],
                      ["수집 목적", "예약 확인 및 서비스 제공, 예약 안내 연락"],
                      ["보유 기간", "예약 종료 후 1년"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex border-b border-gray-100 last:border-0">
                        <div className="w-24 shrink-0 bg-gray-50 px-3 py-2.5 font-medium text-gray-700">{k}</div>
                        <div className="px-3 py-2.5 text-gray-500">{v}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">수집된 개인정보는 제3자에게 제공되지 않으며, 보유 기간 만료 후 즉시 파기됩니다.</p>
                </section>

                <section>
                  <h3 className="font-bold text-gray-800 mb-2">2. 결제</h3>
                  <ul className="space-y-1.5 text-gray-500">
                    <li>· 총 금액의 100%입금 확인 후 예약이 확정됩니다.</li>
                    <li>· 추가요금은 체크인 당일 현장에서 계좌이체로 납부해 주세요.</li>
                    {spaExtra && <li>· 개별 수영장 스위밍스파&온탕스파 이용요금({spaFeeLabel}/박)은 현장에서 별도 결제합니다.</li>}
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold text-gray-800 mb-2">3. 취소 및 환불 정책</h3>
                  <div className="rounded-xl border border-gray-100 overflow-hidden text-xs">
                    {[
                      ["입실 7일 전 이전", "100% 환불"],
                      ["입실 5~6일 전", "80% 환불"],
                      ["입실 3~4일 전", "50% 환불"],
                      ["입실 1~2일 전", "30% 환불"],
                      ["입실 당일", "환불 불가"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex border-b border-gray-100 last:border-0">
                        <div className="w-32 shrink-0 bg-gray-50 px-3 py-2.5 font-medium text-gray-700">{k}</div>
                        <div className="px-3 py-2.5 text-gray-500">{v}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">성수기(7~8월, 연휴)는 별도 취소 정책이 적용될 수 있습니다. 노쇼 시 환불 불가.</p>
                </section>

                <section>
                  <h3 className="font-bold text-gray-800 mb-2">4. 이용 안내</h3>
                  <ul className="space-y-1.5 text-gray-500">
                    <li>· 체크인 15:00 / 체크아웃 11:00</li>
                    <li>· 인원 추가요금: 기준 인원 초과 시 1인당 30,000원/박 (성인·아동·유아·영유아 모두 포함)</li>
                    <li>· 최대 인원 초과 시 입실이 불가합니다.</li>
                    <li>· 반려동물 동반 불가</li>
                    <li>· 외부 음식 반입 가능 / 실내 흡연 불가</li>
                  </ul>
                </section>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="flex-1 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAgreedToTerms(true);
                    setShowTermsModal(false);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#2A8EA2] text-white text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  동의합니다
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // Render: Calendar (step 2 — dates for the already-chosen room)
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <StepBar current="calendar" />
      <button onClick={backToRoom} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <FiChevronLeft /> 객실 다시 선택
      </button>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        {/* ── Left: Calendar ─────────────────────────────────────────────────── */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            날짜 선택 <span className="normal-case font-normal text-gray-400">· {roomDisplay(selectedRoom)}</span>
          </h3>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="btn-pop w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAF9] hover:bg-gray-100 hover:text-[#2A8EA2] transition-colors"
            >
              <FiChevronLeft />
            </button>
            <span className="font-bold text-gray-900 text-lg">
              {year}년 {KO_MONTHS[month]}
              {loading && <span className="ml-2 text-xs text-gray-400 font-normal">로딩 중…</span>}
            </span>
            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="btn-pop w-10 h-10 flex items-center justify-center rounded-full bg-[#FAFAF9] hover:bg-gray-100 hover:text-[#2A8EA2] transition-colors"
            >
              <FiChevronRight />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {KO_DAYS.map((d, i) => (
                <div
                  key={d}
                  className={`text-center text-xs font-semibold py-2.5 ${i < 6 ? "border-r border-gray-200" : ""} ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-500"}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days — gap-px + bg-gray-200 creates 1px grid lines */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {days.map((d, i) => {
                if (!d) return <div key={`e-${i}`} className="bg-white h-14" />;
                const s = dateStatus(d);
                const isCI = checkIn && sameDay(d, checkIn);
                const isCO = checkOut && sameDay(d, checkOut);
                const isEnd = isCI || isCO;
                const ranged = inRange(d);
                const pk = isPeak(fmt(d));
                const wk = isWeekend(fmt(d));
                const sun = d.getDay() === 0;
                const sat = d.getDay() === 6;

                let bg = "bg-white";
                let textCls = "";
                if (s === "past") textCls = "text-gray-300 cursor-not-allowed";
                else if (s === "unavailable") textCls = "text-gray-300 line-through cursor-not-allowed";
                else if (isEnd) {
                  bg = "bg-[#2A8EA2]";
                  textCls = "text-white font-bold cursor-pointer";
                } else if (ranged) {
                  bg = "bg-[#2A8EA2]/10";
                  textCls = "text-gray-800 cursor-pointer";
                } else textCls = `cursor-pointer hover:bg-gray-50 ${sun ? "text-red-400" : sat ? "text-blue-400" : "text-gray-800"}`;

                return (
                  <div
                    key={fmt(d)}
                    className={`relative h-14 flex flex-col items-center justify-center text-sm select-none transition-colors ${bg} ${textCls}`}
                    onClick={() => handleDayClick(d)}
                    onMouseEnter={() => checkIn && !checkOut && setHover(d)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <span>{d.getDate()}</span>
                    {pk && s !== "past" && s !== "unavailable" && <span className="absolute top-1 right-1 text-[7px] text-[#2A8EA2] font-bold leading-none">성</span>}
                    {!pk && wk && s !== "past" && s !== "unavailable" && <span className="absolute top-1 right-1 text-[7px] text-blue-300 font-bold leading-none">주</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#2A8EA2] inline-block rounded-full" />
              선택
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-white border border-gray-300 inline-block rounded-full" />
              예약 가능
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-gray-100 inline-block rounded-full" />
              예약 불가
            </span>
            <span className="flex items-center gap-1.5 ml-auto">
              <span className="text-[#2A8EA2] font-bold text-[9px]">성</span>성수기
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-blue-300 font-bold text-[9px]">주</span>주말
            </span>
          </div>

          {/* Hint */}
          <p className="mt-4 text-sm text-gray-400">
            {!checkIn ? "체크인 날짜를 선택하세요." : !checkOut ? "체크아웃 날짜를 선택하세요." : `${fmtKR(fmt(checkIn))} → ${fmtKR(fmt(checkOut))}  (${nights}박)`}
          </p>
        </div>

        {/* ── Right: Summary + CTA ────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#FAFAF9] p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">선택한 객실</p>
            <p className="text-base font-bold text-gray-900 flex items-center gap-1.5">
              <FiCheck className="text-[#2A8EA2]" /> {roomDisplay(selectedRoom)}
            </p>
          </div>

          {/* Booking summary + CTA */}
          {checkIn && checkOut && (
            <div className="rounded-3xl bg-[#1C2B3A] p-5 text-white shadow-sm">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-white/60">체크인</span>
                  <span>{fmtKR(fmt(checkIn))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">체크아웃</span>
                  <span>{fmtKR(fmt(checkOut))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">숙박</span>
                  <span>{nights}박</span>
                </div>
                <div className="border-t border-white/20 pt-2 flex justify-between font-bold text-base">
                  <span>합계</span>
                  <span className="text-[#2A8EA2]">{krw(roomTotal)}</span>
                </div>
              </div>
              <button onClick={() => setStep("form")} className="btn-pop w-full py-3 rounded-full bg-[#2A8EA2] text-white font-bold shadow-sm hover:shadow-lg transition-shadow">
                예약 신청하기
              </button>
            </div>
          )}

          {/* Price quick ref for this room type */}
          {selectedType && (
            <div className="text-xs text-gray-500 space-y-1.5 rounded-2xl bg-[#FAFAF9] p-4">
              <p className="font-semibold text-gray-700 mb-2">
                {ROOM_INFO[selectedType].name} ({ROOM_INFO[selectedType].typeLabel}) 요금
              </p>
              <div className="flex justify-between">
                <span>평형</span>
                <span className="text-gray-400">{ROOM_INFO[selectedType].size}</span>
              </div>
              <div className="flex justify-between">
                <span>기준 인원</span>
                <span className="text-gray-400">최대 {ROOM_INFO[selectedType].maxGuests}인</span>
              </div>
              <div className="flex justify-between">
                <span>평일</span>
                <span className="text-gray-400">{krw(roomPrices[selectedType].weekday)}</span>
              </div>
              <div className="flex justify-between">
                <span>주말</span>
                <span className="text-gray-400">{krw(roomPrices[selectedType].weekend)}</span>
              </div>
              <div className="flex justify-between">
                <span>성수기</span>
                <span className="text-gray-400">{krw(roomPrices[selectedType].peak)}</span>
              </div>
              <div className="flex justify-between">
                <span>정상가</span>
                <span className="text-gray-400">{krw(roomPrices[selectedType].normal)}</span>
              </div>
              <p className="pt-1 text-gray-400">· 체크인 15:00 / 체크아웃 11:00</p>
              <p className="text-gray-400">· 100% 입금 후 확정</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
