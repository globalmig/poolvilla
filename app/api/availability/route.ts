import { NextRequest } from 'next/server';
import { readBookings, ALL_ROOM_IDS, ROOMS_BY_TYPE, RoomType } from '@/lib/bookings';

const TOTAL = ALL_ROOM_IDS.length; // 11

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const startStr  = searchParams.get('start');
  const endStr    = searchParams.get('end');
  const roomId    = searchParams.get('roomId');
  const roomType  = searchParams.get('roomType') as RoomType | null;

  if (!startStr || !endStr) {
    return Response.json({ error: 'start and end required' }, { status: 400 });
  }

  const bookings = (await readBookings()).filter((b) => b.status !== 'cancelled');
  const result: Record<string, { booked: number; total: number; status: string }> = {};

  const cur = new Date(startStr);
  const end = new Date(endStr);

  const roomIdsForType = roomType ? ROOMS_BY_TYPE[roomType] : null;

  while (cur <= end) {
    const dateStr = cur.toISOString().split('T')[0];

    if (roomIdsForType) {
      // Room-type mode: unavailable only once every room of this type is booked that night
      const totalForType = roomIdsForType.length;
      const bookedCount = bookings.filter((b) => {
        return roomIdsForType.includes(b.roomId) && new Date(b.checkIn) <= cur && cur < new Date(b.checkOut);
      }).length;

      result[dateStr] = {
        booked: bookedCount,
        total: totalForType,
        status: bookedCount >= totalForType ? 'unavailable' : 'available',
      };
    } else if (roomId) {
      // Single-room mode: status is just available/unavailable for that room
      const isBooked = bookings.some((b) => {
        return b.roomId === roomId && new Date(b.checkIn) <= cur && cur < new Date(b.checkOut);
      });
      result[dateStr] = { booked: isBooked ? 1 : 0, total: 1, status: isBooked ? 'unavailable' : 'available' };
    } else {
      // Count how many individual rooms are booked on this date
      const bookedCount = bookings.filter((b) => {
        return new Date(b.checkIn) <= cur && cur < new Date(b.checkOut);
      }).length;

      let status = 'available';
      if (bookedCount >= TOTAL)     status = 'unavailable';
      else if (bookedCount >= TOTAL - 2) status = 'limited';

      result[dateStr] = { booked: bookedCount, total: TOTAL, status };
    }

    cur.setDate(cur.getDate() + 1);
  }

  return Response.json(result);
}
