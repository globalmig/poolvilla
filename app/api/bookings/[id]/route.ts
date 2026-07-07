import { NextRequest } from 'next/server';
import { readBookings, writeBookings } from '@/lib/bookings';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return Response.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 });
  }

  // Only allow updating safe fields
  const allowed = ['status', 'notes', 'guestName', 'phone', 'email'];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  bookings[index] = { ...bookings[index], ...update };
  writeBookings(bookings);

  return Response.json(bookings[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return Response.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 });
  }

  bookings.splice(index, 1);
  writeBookings(bookings);

  return Response.json({ success: true });
}
