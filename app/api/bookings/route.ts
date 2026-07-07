import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import {
  readBookings, writeBookings,
  getBookedRooms, ROOM_ID_TO_TYPE,
  calculateTotal,
} from '@/lib/bookings';

export async function GET() {
  return Response.json(readBookings());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { guestName, phone, email, roomId, checkIn, checkOut, guests, notes } = body;

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

  const bookings = readBookings();
  const bookedRooms = getBookedRooms(bookings, checkIn, checkOut);

  if (bookedRooms.has(roomId)) {
    return Response.json(
      { error: `${roomId}은(는) 해당 기간에 이미 예약되어 있습니다.` },
      { status: 409 }
    );
  }

  const totalPrice = calculateTotal(roomType, checkIn, checkOut);

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
    totalPrice,
    createdAt: new Date().toISOString(),
  };

  bookings.push(newBooking);
  writeBookings(bookings);

  return Response.json(newBooking, { status: 201 });
}
