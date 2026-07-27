import { NextRequest } from 'next/server';
import { readPricing, writePricing, type PricingData, type RoomType, type SalePeriod } from '@/lib/pricing';

function isAdmin(request: NextRequest): boolean {
  return request.cookies.get('admin_auth')?.value === '1';
}

function isValidRoom(v: unknown): v is PricingData['rooms']['a'] {
  if (!v || typeof v !== 'object') return false;
  const r = v as Record<string, unknown>;
  return (['weekday', 'weekend', 'peak', 'normal'] as const).every(
    (k) => typeof r[k] === 'number' && Number.isFinite(r[k]) && (r[k] as number) >= 0
  );
}

function isValidExtras(v: unknown): v is PricingData['extras'] {
  if (!Array.isArray(v)) return false;
  const ids = new Set<string>();
  for (const item of v) {
    if (!item || typeof item !== 'object') return false;
    const e = item as Record<string, unknown>;
    if (typeof e.id !== 'string' || !e.id.trim()) return false;
    if (typeof e.label !== 'string' || !e.label.trim()) return false;
    if (typeof e.price !== 'number' || !Number.isFinite(e.price) || e.price < 0) return false;
    if (ids.has(e.id)) return false;
    ids.add(e.id);
  }
  return true;
}

function isValidSaleInfo(v: unknown): v is PricingData['sale']['weekday'] {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.label === 'string' &&
    typeof s.percent === 'number' && Number.isFinite(s.percent) && s.percent >= 0 && s.percent <= 100 &&
    typeof s.enabled === 'boolean'
  );
}

function isValidSale(v: unknown): v is PricingData['sale'] {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return (['weekday', 'weekend', 'peak'] as SalePeriod[]).every((p) => isValidSaleInfo(s[p]));
}

function isValidPricing(v: unknown): v is PricingData {
  if (!v || typeof v !== 'object') return false;
  const p = v as Record<string, unknown>;
  const rooms = p.rooms as Record<string, unknown> | undefined;
  if (!rooms) return false;
  const roomsOk = (['a', 'b', 'c'] as RoomType[]).every((t) => isValidRoom(rooms[t]));
  return roomsOk && isValidExtras(p.extras) && isValidSale(p.sale);
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }
  return Response.json(await readPricing());
}

export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();
  if (!isValidPricing(body)) {
    return Response.json({ error: '요금 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  await writePricing(body);
  return Response.json(body);
}
