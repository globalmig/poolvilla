import { SolapiMessageService } from 'solapi';
import type { Booking } from './bookings';
import { krw } from './pricing';

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

  const lines = [
    `[예약 문의] ${booking.guestName}님`,
    `연락처: ${booking.phone}`,
    booking.email ? `이메일: ${booking.email}` : null,
    `객실: ${booking.roomId}`,
    `기간: ${booking.checkIn} ~ ${booking.checkOut}`,
    `인원: ${booking.guests}명`,
    booking.extras.length > 0
      ? `유료 옵션: ${booking.extras.map((e) => e.label).join(', ')} (+${krw(booking.extrasTotal)})`
      : null,
    `총 금액: ${krw(booking.totalPrice)}`,
    booking.notes ? `요청사항: ${booking.notes}` : null,
  ].filter((line): line is string => line !== null);

  const text = `${lines.join('\n')}\n\n확인 후 계좌번호 안내 부탁드립니다.`;

  try {
    await service.send({ to, from, text });
  } catch (err) {
    console.error('Solapi SMS 발송 실패:', err);
  }
}
