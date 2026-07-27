import { NextRequest } from 'next/server';
import { readBookings, getBookedRooms } from '@/lib/bookings';

// GET /api/rooms/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
// Returns: string[] — roomIds already booked for the period
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const checkIn  = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  if (!checkIn || !checkOut) {
    return Response.json({ error: 'checkIn and checkOut required' }, { status: 400 });
  }

  const bookings = await readBookings();
  const booked   = getBookedRooms(bookings, checkIn, checkOut);

  return Response.json([...booked]);
}
