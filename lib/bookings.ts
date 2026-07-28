import { d1 } from './d1';
import { readPricing, effectiveRoomPrice, type SalePeriod } from './pricing';

export type RoomType = 'a' | 'b' | 'c';

export interface BookingExtra {
  id: string;
  label: string;
  price: number;
}

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
  extras: BookingExtra[];
  extrasTotal: number;
  totalPrice: number;
  createdAt: string;
}

interface BookingRow {
  id: string;
  guest_name: string;
  phone: string;
  email: string;
  room_type: RoomType;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: Booking['status'];
  notes: string;
  extras: string;
  extras_total: number;
  total_price: number;
  created_at: string;
}

function rowToBooking(r: BookingRow): Booking {
  return {
    id: r.id,
    guestName: r.guest_name,
    phone: r.phone,
    email: r.email,
    roomType: r.room_type,
    roomId: r.room_id,
    checkIn: r.check_in,
    checkOut: r.check_out,
    guests: r.guests,
    status: r.status,
    notes: r.notes,
    extras: r.extras ? JSON.parse(r.extras) : [],
    extrasTotal: r.extras_total,
    totalPrice: r.total_price,
    createdAt: r.created_at,
  };
}

export async function readBookings(): Promise<Booking[]> {
  const { results } = await d1<BookingRow>('SELECT * FROM bookings ORDER BY created_at DESC');
  return results.map(rowToBooking);
}

export async function insertBooking(booking: Booking): Promise<void> {
  await d1(
    `INSERT INTO bookings (id, guest_name, phone, email, room_type, room_id, check_in, check_out, guests, status, notes, extras, extras_total, total_price, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      booking.id, booking.guestName, booking.phone, booking.email, booking.roomType, booking.roomId,
      booking.checkIn, booking.checkOut, booking.guests, booking.status, booking.notes,
      JSON.stringify(booking.extras), booking.extrasTotal, booking.totalPrice, booking.createdAt,
    ]
  );
}

const UPDATABLE_FIELDS: Record<string, string> = {
  status: 'status',
  notes: 'notes',
  guestName: 'guest_name',
  phone: 'phone',
  email: 'email',
};

export async function updateBooking(id: string, fields: Record<string, unknown>): Promise<Booking | null> {
  const sets: string[] = [];
  const params: unknown[] = [];
  for (const [key, column] of Object.entries(UPDATABLE_FIELDS)) {
    if (key in fields) {
      sets.push(`${column} = ?`);
      params.push(fields[key]);
    }
  }

  if (sets.length > 0) {
    params.push(id);
    await d1(`UPDATE bookings SET ${sets.join(', ')} WHERE id = ?`, params);
  }

  const { results } = await d1<BookingRow>('SELECT * FROM bookings WHERE id = ?', [id]);
  return results[0] ? rowToBooking(results[0]) : null;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const { meta } = await d1('DELETE FROM bookings WHERE id = ?', [id]);
  return meta.changes > 0;
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

export async function calculateTotal(roomType: RoomType, checkIn: string, checkOut: string): Promise<number> {
  const pricing = await readPricing();
  let total = 0;
  const cur = new Date(checkIn);
  const end = new Date(checkOut);
  while (cur < end) {
    const dateStr = cur.toISOString().split('T')[0];
    const period: SalePeriod = isPeakDate(dateStr) ? 'peak' : isWeekend(dateStr) ? 'weekend' : 'weekday';
    total += effectiveRoomPrice(pricing, roomType, period);
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
