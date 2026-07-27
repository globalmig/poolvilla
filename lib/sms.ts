import { SolapiMessageService } from 'solapi';
import type { Booking } from './bookings';

let cachedService: SolapiMessageService | null = null;

function getService(): SolapiMessageService | null {
  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  if (!apiKey || !apiSecret) return null;

  if (!cachedService) {
    cachedService = new SolapiMessageService(apiKey, apiSecret);
  }
  return cachedService;
}

// 새 예약 문의가 들어오면 관리자에게 SMS로 알림
export async function sendInquirySms(booking: Booking): Promise<void> {
  const service = getService();
  const from = process.env.SOLAPI_SENDER_PHONE;
  const to = process.env.SOLAPI_ADMIN_PHONE;
  if (!service || !from || !to) return;

  const text =
    `[예약 문의] ${booking.guestName}님\n` +
    `연락처: ${booking.phone}\n` +
    `객실: ${booking.roomId}\n` +
    `기간: ${booking.checkIn} ~ ${booking.checkOut}\n` +
    `인원: ${booking.guests}명`;

  try {
    await service.send({ to, from, text });
  } catch (err) {
    console.error('Solapi SMS 발송 실패:', err);
  }
}
