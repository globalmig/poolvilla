import { NextRequest } from 'next/server';
import { updateBooking, deleteBooking } from '@/lib/bookings';

const ALLOWED_FIELDS = ['status', 'notes', 'guestName', 'phone', 'email'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const update: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) update[key] = body[key];
  }

  const updated = await updateBooking(id, update);
  if (!updated) {
    return Response.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deleteBooking(id);

  if (!deleted) {
    return Response.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 });
  }

  return Response.json({ success: true });
}
