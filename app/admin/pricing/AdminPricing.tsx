'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiLogOut, FiCalendar, FiTag, FiSave, FiAlertCircle, FiCheckCircle, FiPlus, FiTrash2,
} from 'react-icons/fi';

type RoomType = 'a' | 'b' | 'c';

interface RoomTypePricing {
  weekday: number;
  weekend: number;
  peak: number;
  normal: number;
}

interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

type SalePeriod = 'weekday' | 'weekend' | 'peak';

interface SaleInfo {
  label: string;
  percent: number;
  enabled: boolean;
}

interface PricingData {
  rooms: Record<RoomType, RoomTypePricing>;
  extras: ExtraOption[];
  sale: Record<SalePeriod, SaleInfo>;
}

interface PeakPeriod {
  id: string;
  label: string;
  recurring: boolean; // true: start/end are "MM-DD" and repeat every year. false: "YYYY-MM-DD".
  start: string;
  end: string;
}

const ROOM_LABELS: Record<RoomType, string> = {
  a: '프리미엄 A타입',
  b: '프리미엄 B타입',
  c: '스탠다드 C타입',
};

const ROOM_FIELDS: { key: keyof RoomTypePricing; label: string }[] = [
  { key: 'weekday', label: '주중' },
  { key: 'weekend', label: '주말' },
  { key: 'peak', label: '성수기' },
  { key: 'normal', label: '정상가' },
];

const SALE_PERIODS: { key: SalePeriod; label: string }[] = [
  { key: 'weekday', label: '주중' },
  { key: 'weekend', label: '주말' },
  { key: 'peak', label: '성수기' },
];

function newExtraId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `extra_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function NumberField({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        min={0}
        step={1000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full pl-3 pr-8 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">원</span>
    </div>
  );
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Picks a month/day ("MM-DD") for periods that repeat every year.
function MonthDayPicker({ value, onChange }: { value: string; onChange: (md: string) => void }) {
  const month = Number(value.slice(0, 2)) || 1;
  const daysInMonth = new Date(2000, month, 0).getDate(); // 2000 is a leap year, so Feb offers 29
  const day = Math.min(Number(value.slice(3, 5)) || 1, daysInMonth);

  function emit(m: number, d: number) {
    const clamped = Math.min(d, new Date(2000, m, 0).getDate());
    onChange(`${String(m).padStart(2, '0')}-${String(clamped).padStart(2, '0')}`);
  }

  const selectCls = 'px-2 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A8EA2] transition-colors';
  return (
    <div className="flex items-center gap-1">
      <select value={month} onChange={(e) => emit(Number(e.target.value), day)} className={selectCls}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{m}월</option>
        ))}
      </select>
      <select value={day} onChange={(e) => emit(month, Number(e.target.value))} className={selectCls}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}일</option>
        ))}
      </select>
    </div>
  );
}

export default function AdminPricing() {
  const router = useRouter();

  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [peakPeriods, setPeakPeriods] = useState<PeakPeriod[] | null>(null);
  const [peakLoading, setPeakLoading] = useState(true);
  const [peakSaving, setPeakSaving] = useState(false);
  const [peakError, setPeakError] = useState('');
  const [peakSaved, setPeakSaved] = useState(false);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const fetchPricing = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/pricing');
      if (!res.ok) throw new Error();
      setPricing(await res.json());
    } catch {
      setError('요금 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  useEffect(() => {
    fetch('/api/admin/peak-periods')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setPeakPeriods)
      .catch(() => setPeakError('성수기 기간을 불러오지 못했습니다.'))
      .finally(() => setPeakLoading(false));
  }, []);

  function patchPeak(id: string, patch: Partial<PeakPeriod>) {
    setPeakPeriods((prev) => (prev ? prev.map((p) => (p.id === id ? { ...p, ...patch } : p)) : prev));
    setPeakSaved(false);
  }

  // Switching type keeps the dates: "2027-02-06" <-> "02-06".
  function changePeakType(p: PeakPeriod, recurring: boolean) {
    if (p.recurring === recurring) return;
    const year = new Date().getFullYear();
    patchPeak(p.id, {
      recurring,
      start: recurring ? p.start.slice(5) : `${year}-${p.start}`,
      end: recurring ? p.end.slice(5) : `${year}-${p.end}`,
    });
  }

  function addPeakPeriod() {
    const today = todayStr();
    setPeakPeriods((prev) => [...(prev ?? []), { id: newExtraId(), label: '', recurring: false, start: today, end: today }]);
    setPeakSaved(false);
  }

  function removePeakPeriod(id: string) {
    setPeakPeriods((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    setPeakSaved(false);
  }

  async function savePeakPeriods() {
    if (!peakPeriods) return;
    for (const p of peakPeriods) {
      if (!p.label.trim()) {
        setPeakError('성수기 기간의 이름을 입력해주세요.');
        return;
      }
      if (!p.recurring && (!p.start || !p.end)) {
        setPeakError(`"${p.label}" 기간의 날짜를 선택해주세요.`);
        return;
      }
      if (!p.recurring && p.end < p.start) {
        setPeakError(`"${p.label}" 기간의 종료일이 시작일보다 빠릅니다.`);
        return;
      }
    }
    setPeakSaving(true);
    setPeakError('');
    setPeakSaved(false);
    try {
      const res = await fetch('/api/admin/peak-periods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(peakPeriods),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '저장에 실패했습니다.');
      setPeakPeriods(data);
      setPeakSaved(true);
    } catch (e) {
      setPeakError(e instanceof Error ? e.message : '저장에 실패했습니다.');
    } finally {
      setPeakSaving(false);
    }
  }

  function updateRoom(type: RoomType, key: keyof RoomTypePricing, value: number) {
    setPricing((prev) => (prev ? { ...prev, rooms: { ...prev.rooms, [type]: { ...prev.rooms[type], [key]: value } } } : prev));
    setSaved(false);
  }

  function updateSale(period: SalePeriod, field: keyof SaleInfo, value: string | number | boolean) {
    setPricing((prev) => (prev ? { ...prev, sale: { ...prev.sale, [period]: { ...prev.sale[period], [field]: value } } } : prev));
    setSaved(false);
  }

  function updateExtraLabel(id: string, label: string) {
    setPricing((prev) => (prev ? { ...prev, extras: prev.extras.map((e) => (e.id === id ? { ...e, label } : e)) } : prev));
    setSaved(false);
  }

  function updateExtraPrice(id: string, price: number) {
    setPricing((prev) => (prev ? { ...prev, extras: prev.extras.map((e) => (e.id === id ? { ...e, price } : e)) } : prev));
    setSaved(false);
  }

  function addExtra() {
    setPricing((prev) => (prev ? { ...prev, extras: [...prev.extras, { id: newExtraId(), label: '', price: 0 }] } : prev));
    setSaved(false);
  }

  function removeExtra(id: string) {
    setPricing((prev) => (prev ? { ...prev, extras: prev.extras.filter((e) => e.id !== id) } : prev));
    setSaved(false);
  }

  async function save() {
    if (!pricing) return;
    if (pricing.extras.some((e) => !e.label.trim())) {
      setError('유료 옵션의 이름을 입력해주세요.');
      return;
    }
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? '저장에 실패했습니다.');
      setPricing(data);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 bg-[#1C2B3A] text-white">
        <div className="px-6 py-7">
          <p className="text-xs text-white/40 tracking-widest uppercase">Pool Villa</p>
          <h1 className="text-lg font-bold mt-1">관리자</h1>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm font-semibold transition-colors"
          >
            <FiCalendar /> 예약 관리
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm">
            <FiTag /> 요금 관리
          </div>
        </nav>
        <div className="px-3 pb-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm transition-colors"
          >
            <FiLogOut /> 로그아웃
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-60 min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">요금 관리</h2>
            <p className="text-xs text-gray-400 hidden sm:block">객실 요금, 유료 옵션 가격, 성수기 기간을 수정하세요</p>
          </div>
          <button
            onClick={logout}
            className="md:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <FiLogOut /> 로그아웃
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">
              <FiAlertCircle /> {error}
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-2xl px-4 py-3">
              <FiCheckCircle /> 저장되었습니다.
            </div>
          )}

          {loading || !pricing ? (
            <div className="text-center py-20 text-gray-400">불러오는 중…</div>
          ) : (
            <>
              {/* Room rates */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-6">
                <h3 className="text-sm font-bold text-gray-800">객실 요금</h3>
                {(['a', 'b', 'c'] as RoomType[]).map((type) => (
                  <div key={type}>
                    <p className="text-xs font-semibold text-[#2A8EA2] mb-2">{ROOM_LABELS[type]}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {ROOM_FIELDS.map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-xs text-gray-400 mb-1">{label}</label>
                          <NumberField value={pricing.rooms[type][key]} onChange={(v) => updateRoom(type, key, v)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sale labels */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">세일 표시</h3>
                  <p className="text-xs text-gray-400 mt-1">예약안내 페이지 객실 요금에 표시되는 세일 문구입니다. (예: 오픈기념 40%세일)</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SALE_PERIODS.map(({ key, label }) => {
                    const enabled = pricing.sale[key].enabled;
                    return (
                      <div key={key} className={`rounded-xl border p-3 space-y-2 transition-colors ${enabled ? "border-gray-100" : "border-gray-100 bg-gray-50/60"}`}>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-semibold ${enabled ? "text-[#2A8EA2]" : "text-gray-400"}`}>{label}</p>
                          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => updateSale(key, 'enabled', e.target.checked)}
                              className="w-3.5 h-3.5 rounded accent-[#2A8EA2] cursor-pointer"
                            />
                            활성화
                          </label>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">세일 이름</label>
                          <input
                            type="text"
                            placeholder="예: 오픈기념"
                            value={pricing.sale[key].label}
                            disabled={!enabled}
                            onChange={(e) => updateSale(key, 'label', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">할인율</label>
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={pricing.sale[key].percent}
                              disabled={!enabled}
                              onChange={(e) => updateSale(key, 'percent', Number(e.target.value))}
                              className="w-full pl-3 pr-7 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extras */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">유료 옵션</h3>
                  <button
                    onClick={addExtra}
                    className="btn-pop flex items-center gap-1.5 text-xs font-semibold text-[#2A8EA2] hover:text-[#1E7A8D] transition-colors"
                  >
                    <FiPlus /> 옵션 추가
                  </button>
                </div>
                {pricing.extras.length === 0 ? (
                  <p className="text-sm text-gray-400 py-2">등록된 유료 옵션이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {pricing.extras.map((extra) => (
                      <div key={extra.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="옵션 이름"
                          value={extra.label}
                          onChange={(e) => updateExtraLabel(extra.id, e.target.value)}
                          className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors"
                        />
                        <div className="w-32 shrink-0">
                          <NumberField value={extra.price} onChange={(v) => updateExtraPrice(extra.id, v)} />
                        </div>
                        <button
                          onClick={() => removeExtra(extra.id)}
                          className="btn-pop shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="옵션 삭제"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="btn-pop flex items-center gap-2 rounded-full px-6 py-3 bg-[#2A8EA2] text-white text-sm font-semibold shadow-sm hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                <FiSave /> {saving ? '저장 중…' : '저장하기'}
              </button>

              {/* 성수기 기간 */}
              <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">성수기 기간</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      여기에 등록된 기간이 예약 캘린더의 &quot;성&quot; 표시와 성수기 요금에 그대로 적용됩니다. 기본값(공휴일·여름 성수기·연말, 2027~2030년 설날·추석 연휴)이 미리 들어 있으며 모두 수정·삭제할 수 있습니다.
                    </p>
                    <ul className="text-xs text-gray-400 mt-2 space-y-0.5 leading-relaxed">
                      <li>· <span className="font-semibold text-gray-500">매년 반복</span>: 월·일만 지정하면 매년 같은 날짜에 적용 (예: 여름 성수기 7/26~8/5)</li>
                      <li>· <span className="font-semibold text-gray-500">특정 기간</span>: 연도까지 지정해 그 기간에만 적용 (설날·추석처럼 해마다 날짜가 바뀌는 연휴)</li>
                      <li>· 설날·추석은 음력이라 2031년 이후는 해당 연도에 직접 추가해주세요.</li>
                    </ul>
                  </div>
                  <button
                    onClick={addPeakPeriod}
                    className="btn-pop shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#2A8EA2] hover:text-[#1E7A8D] transition-colors"
                  >
                    <FiPlus /> 기간 추가
                  </button>
                </div>

                {peakError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">
                    <FiAlertCircle /> {peakError}
                  </div>
                )}
                {peakSaved && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-2xl px-4 py-3">
                    <FiCheckCircle /> 저장되었습니다.
                  </div>
                )}

                {peakLoading || !peakPeriods ? (
                  <p className="text-sm text-gray-400 py-2">불러오는 중…</p>
                ) : peakPeriods.length === 0 ? (
                  <p className="text-sm text-gray-400 py-2">등록된 성수기 기간이 없습니다.</p>
                ) : (
                  <div className="space-y-3">
                    {peakPeriods.map((p) => {
                      const past = !p.recurring && !!p.end && p.end < todayStr();
                      const dateCls = 'px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A8EA2] transition-colors';
                      return (
                        <div key={p.id} className={`flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 p-3 ${past ? 'bg-gray-50/60' : ''}`}>
                          <input
                            type="text"
                            placeholder="기간 이름 (예: 여름 성수기)"
                            value={p.label}
                            onChange={(e) => patchPeak(p.id, { label: e.target.value })}
                            className="flex-1 min-w-35 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors"
                          />
                          <select
                            value={p.recurring ? 'recurring' : 'once'}
                            onChange={(e) => changePeakType(p, e.target.value === 'recurring')}
                            className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#2A8EA2] transition-colors"
                          >
                            <option value="recurring">매년 반복</option>
                            <option value="once">특정 기간</option>
                          </select>
                          {p.recurring ? (
                            <>
                              <MonthDayPicker value={p.start} onChange={(md) => patchPeak(p.id, { start: md })} />
                              <span className="text-gray-300">~</span>
                              <MonthDayPicker value={p.end} onChange={(md) => patchPeak(p.id, { end: md })} />
                            </>
                          ) : (
                            <>
                              <input type="date" value={p.start} onChange={(e) => patchPeak(p.id, { start: e.target.value })} className={dateCls} />
                              <span className="text-gray-300">~</span>
                              <input type="date" value={p.end} min={p.start} onChange={(e) => patchPeak(p.id, { end: e.target.value })} className={dateCls} />
                            </>
                          )}
                          {past && <span className="text-xs text-gray-400 shrink-0">지난 기간</span>}
                          <button
                            onClick={() => removePeakPeriod(p.id)}
                            className="btn-pop shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="기간 삭제"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={savePeakPeriods}
                  disabled={peakSaving || peakLoading}
                  className="btn-pop flex items-center gap-2 rounded-full px-6 py-3 bg-[#2A8EA2] text-white text-sm font-semibold shadow-sm hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  <FiSave /> {peakSaving ? '저장 중…' : '저장하기'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
