import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import {
  readBookings, insertBooking,
  getBookedRooms, ROOM_ID_TO_TYPE,
  calculateTotal,
} from '@/lib/bookings';
import { readPricing } from '@/lib/pricing';
import { sendInquirySms } from '@/lib/sms';

const NON_PRICING_EXTRAS: Record<string, { label: string; price: number }> = {
  car: { label: '전기차 충전', price: 0 },
};

export async function GET() {
  return Response.json(await readBookings());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { guestName, phone, email, roomId, checkIn, checkOut, guests, notes, extras } = body;

  if (!guestName || !phone || !roomId || !checkIn || !checkOut || !guests) {
    return Response.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
  }

  const roomType = ROOM_ID_TO_TYPE[roomId];
  if (!roomType) {
    return Response.json({ error: '올바르지 않은 객실입니다.' }, { status: 400 });
  }

  const checkInDate  = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (checkOutDate <= checkInDate) {
    return Response.json({ error: '체크아웃 날짜가 체크인 날짜보다 늦어야 합니다.' }, { status: 400 });
  }

  const bookings = await readBookings();
  const bookedRooms = getBookedRooms(bookings, checkIn, checkOut);

  if (bookedRooms.has(roomId)) {
    return Response.json(
      { error: `${roomId}은(는) 해당 기간에 이미 예약되어 있습니다.` },
      { status: 409 }
    );
  }

  const roomTotal = await calculateTotal(roomType, checkIn, checkOut);

  const pricing = await readPricing();
  const resolvedExtras: { id: string; label: string; price: number }[] = Array.isArray(extras)
    ? (extras as string[])
        .map((id) => {
          const found = pricing.extras.find((e) => e.id === id) ?? NON_PRICING_EXTRAS[id];
          return found ? { id, label: found.label, price: found.price } : null;
        })
        .filter((e): e is { id: string; label: string; price: number } => e !== null)
    : [];
  const extrasTotal = resolvedExtras.reduce((s, e) => s + e.price, 0);
  const totalPrice = roomTotal + extrasTotal;

  const newBooking = {
    id: randomUUID(),
    guestName: guestName.trim(),
    phone: phone.trim(),
    email: (email || '').trim(),
    roomType,
    roomId,
    checkIn,
    checkOut,
    guests: Number(guests),
    status: 'pending' as const,
    notes: (notes || '').trim(),
    extras: resolvedExtras,
    extrasTotal,
    totalPrice,
    createdAt: new Date().toISOString(),
  };

  await insertBooking(newBooking);

  await sendInquirySms(newBooking);

  return Response.json(newBooking, { status: 201 });
}
