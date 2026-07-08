'use client';

import { Fragment, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiLogOut, FiRefreshCw, FiCheck, FiTrash2,
  FiSearch, FiCalendar, FiUsers, FiDollarSign, FiClock, FiAlertCircle,
} from 'react-icons/fi';

interface Booking {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  roomType: 'a' | 'b' | 'c';
  roomId: string;   // e.g. '프리미엄 201'
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  totalPrice: number;
  createdAt: string;
}

type Filter = 'all' | 'pending' | 'confirmed' | 'cancelled';

const ROOM_LABELS: Record<string, string> = {
  a: '프리미엄 (A타입)',
  b: '프리미엄 (B타입)',
  c: '스탠다드 (C타입)',
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending:   { label: '대기중',  cls: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: '확정',    cls: 'bg-green-100  text-green-700'  },
  cancelled: { label: '취소',    cls: 'bg-gray-100   text-gray-500'   },
};

function krw(n: number) {
  return n.toLocaleString('ko-KR') + '원';
}

function fmtDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${y}.${m}.${d}`;
}

function fmtCreated(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function nights(checkIn: string, checkOut: string) {
  return Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  // ── Data ──

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data.sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      setActionError('예약 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function updateStatus(id: string, status: string) {
    setActionError('');
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as Booking['status'] } : b));
    } catch {
      setActionError('상태 변경에 실패했습니다.');
    }
  }

  async function deleteBooking(id: string) {
    setActionError('');
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setBookings(prev => prev.filter(b => b.id !== id));
      setConfirmDelete(null);
    } catch {
      setActionError('삭제에 실패했습니다.');
    }
  }

  // ── Derived ──

  const filtered = bookings.filter(b => {
    const matchFilter = filter === 'all' || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.guestName.includes(q) || b.phone.includes(q) || b.email.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue:   bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 bg-[#1C2B3A] text-white">
        <div className="px-6 py-7">
          <p className="text-xs text-white/40 tracking-widest uppercase">Pool Villa</p>
          <h1 className="text-lg font-bold mt-1">관리자</h1>
        </div>
        <nav className="flex-1 px-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm">
            <FiCalendar /> 예약 관리
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
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">예약 관리</h2>
            <p className="text-xs text-gray-400 hidden sm:block">전체 예약 현황을 확인하고 관리하세요</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchBookings}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              새로고침
            </button>
            <button
              onClick={logout}
              className="md:hidden flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FiLogOut /> 로그아웃
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FiCalendar,    label: '전체 예약',  value: stats.total,              cls: 'text-gray-700' },
            { icon: FiClock,       label: '대기중',      value: stats.pending,            cls: 'text-yellow-600' },
            { icon: FiCheck,       label: '확정',        value: stats.confirmed,          cls: 'text-green-600' },
            { icon: FiDollarSign,  label: '확정 매출',   value: krw(stats.revenue),       cls: 'text-[#2A8EA2]' },
          ].map(({ icon: Icon, label, value, cls }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Icon /> {label}
              </div>
              <p className={`text-2xl font-bold ${cls}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {actionError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">
            <FiAlertCircle /> {actionError}
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Filter tabs */}
            <div className="flex gap-1 flex-wrap">
              {(['all', 'pending', 'confirmed', 'cancelled'] as Filter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-[#1C2B3A] text-white'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {f === 'all' ? `전체 (${stats.total})` :
                   f === 'pending' ? `대기 (${stats.pending})` :
                   f === 'confirmed' ? `확정 (${stats.confirmed})` :
                   `취소 (${stats.cancelled})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative sm:ml-auto">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="이름 · 연락처 검색"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#2A8EA2] transition-colors w-56"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-gray-400">불러오는 중…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              {search ? '검색 결과가 없습니다.' : '예약 내역이 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    {['신청일', '예약자', '연락처', '객실', '체크인', '체크아웃', '박', '인원', '금액', '상태', '관리'].map(h => (
                      <th key={h} className="px-4 py-3 font-semibold text-gray-500 text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => {
                    const statusInfo = STATUS_LABEL[b.status];
                    const isDeleting = confirmDelete === b.id;
                    const noteOpen = expandedNote === b.id;
                    return (
                      <Fragment key={b.id}>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmtCreated(b.createdAt)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                          {b.guestName}
                          {b.notes && (
                            <button
                              onClick={() => setExpandedNote(noteOpen ? null : b.id)}
                              className={`ml-1 text-[10px] px-1 rounded border transition-colors ${
                                noteOpen
                                  ? 'bg-[#2A8EA2] text-white border-[#2A8EA2]'
                                  : 'text-[#2A8EA2] border-[#2A8EA2] hover:bg-[#2A8EA2]/10'
                              }`}
                            >
                              메모
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          <a href={`tel:${b.phone}`} className="hover:text-[#2A8EA2] transition-colors">{b.phone}</a>
                          {b.email && <div className="text-xs text-gray-400">{b.email}</div>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-gray-700">{b.roomId || ROOM_LABELS[b.roomType]}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">{fmtDate(b.checkIn)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">{fmtDate(b.checkOut)}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{nights(b.checkIn, b.checkOut)}</td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          <FiUsers className="inline mr-0.5 text-gray-400" />{b.guests}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-800">{krw(b.totalPrice)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                            className={`text-xs font-semibold rounded-full pl-2.5 pr-6 py-1 border-0 outline-none cursor-pointer appearance-none bg-no-repeat ${statusInfo.cls}`}
                            style={{
                              backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23888'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
                              backgroundPosition: "right 6px center",
                              backgroundSize: "12px",
                            }}
                          >
                            <option value="pending">대기중</option>
                            <option value="confirmed">확정</option>
                            <option value="cancelled">취소</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          {isDeleting ? (
                            <div className="flex items-center gap-1 whitespace-nowrap">
                              <span className="text-xs text-red-500">삭제?</span>
                              <button
                                onClick={() => deleteBooking(b.id)}
                                className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                확인
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(b.id)}
                              title="삭제"
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-400 rounded hover:bg-red-100 hover:text-red-500 transition-colors"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          )}
                        </td>
                      </tr>
                      {noteOpen && (
                        <tr className="bg-[#2A8EA2]/5">
                          <td colSpan={11} className="px-4 py-3 text-sm text-gray-600">
                            <span className="font-semibold text-gray-700 mr-2">요청사항:</span>
                            {b.notes}
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-center text-gray-300 pb-4">
          Pool Villa Admin · 관리자 전용 페이지
        </p>
        </div>
      </div>
    </div>
  );
}
