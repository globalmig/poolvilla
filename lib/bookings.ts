import fs from 'fs';
import path from 'path';

export type RoomType = 'a' | 'b' | 'c';

export interface Booking {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  roomType: RoomType;
  roomId: string;   // e.g. '프리미엄 201'
  checkIn: string;  // 'YYYY-MM-DD'
  checkOut: string; // 'YYYY-MM-DD'
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes: string;
  totalPrice: number;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'bookings.json');

export function readBookings(): Booking[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function writeBookings(bookings: Booking[]): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
}

// ─── Individual rooms ──────────────────────────────────────────────────────────

export const ROOMS_BY_TYPE: Record<RoomType, string[]> = {
  a: ['프리미엄 201', '프리미엄 301', '프리미엄 401'],
  b: ['프리미엄 202', '프리미엄 302', '프리미엄 402'],
  c: ['스탠다드 201', '스탠다드 301', '스탠다드 401'],
};

// Map roomId → roomType
export const ROOM_ID_TO_TYPE: Record<string, RoomType> = Object.fromEntries(
  (Object.entries(ROOMS_BY_TYPE) as [RoomType, string[]][]).flatMap(
    ([type, ids]) => ids.map((id) => [id, type])
  )
);

export const ALL_ROOM_IDS = Object.values(ROOMS_BY_TYPE).flat();

// ─── Room metadata ─────────────────────────────────────────────────────────────

export const ROOM_INFO: Record<RoomType, { name: string; typeLabel: string; size: string; maxGuests: number }> = {
  a: { name: '프리미엄', typeLabel: 'A타입', size: '37평형', maxGuests: 8 },
  b: { name: '프리미엄', typeLabel: 'B타입', size: '37평형', maxGuests: 8 },
  c: { name: '스탠다드', typeLabel: 'C타입', size: '37평형', maxGuests: 6 },
};

export const ROOM_PRICES: Record<RoomType, { weekday: number; weekend: number; peak: number }> = {
  a: { weekday: 280000, weekend: 380000, peak: 450000 },
  b: { weekday: 280000, weekend: 380000, peak: 450000 },
  c: { weekday: 200000, weekend: 300000, peak: 350000 },
};

// ─── Pricing helpers ───────────────────────────────────────────────────────────

const PEAK_MD = new Set([
  '01-01','01-27','01-28','01-29','01-30',
  '03-01','05-05','06-06',
  '07-26','07-27','07-28','07-29','07-30','07-31',
  '08-01','08-02','08-03','08-04','08-05','08-15',
  '10-03','10-06','10-07','10-08','10-09',
  '12-25','12-31',
]);

export function isPeakDate(dateStr: string): boolean {
  return PEAK_MD.has(dateStr.slice(5));
}

export function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr).getDay();
  return day === 5 || day === 6;
}

export function nightlyRate(roomType: RoomType, dateStr: string): number {
  const prices = ROOM_PRICES[roomType];
  if (isPeakDate(dateStr)) return prices.peak;
  if (isWeekend(dateStr)) return prices.weekend;
  return prices.weekday;
}

export function calculateTotal(roomType: RoomType, checkIn: string, checkOut: string): number {
  let total = 0;
  const cur = new Date(checkIn);
  const end = new Date(checkOut);
  while (cur < end) {
    total += nightlyRate(roomType, cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return total;
}

// Returns set of roomIds that are already booked for the given date range
export function getBookedRooms(
  bookings: Booking[],
  checkIn: string,
  checkOut: string
): Set<string> {
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  const booked = new Set<string>();
  for (const b of bookings) {
    if (b.status === 'cancelled') continue;
    if (new Date(b.checkIn) < co && new Date(b.checkOut) > ci) {
      booked.add(b.roomId);
    }
  }
  return booked;
}
