import { d1 } from './d1';

export type RoomType = 'a' | 'b' | 'c';

export interface RoomTypePricing {
  weekday: number;
  weekend: number;
  peak: number;
  normal: number;
}

export interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

export type SalePeriod = 'weekday' | 'weekend' | 'peak';

export interface SaleInfo {
  label: string;
  percent: number;
  enabled: boolean;
}

export interface PricingData {
  rooms: Record<RoomType, RoomTypePricing>;
  extras: ExtraOption[];
  sale: Record<SalePeriod, SaleInfo>;
}

export const DEFAULT_PRICING: PricingData = {
  rooms: {
    a: { weekday: 149000, weekend: 199000, peak: 199000, normal: 570000 },
    b: { weekday: 149000, weekend: 199000, peak: 199000, normal: 570000 },
    c: { weekday: 119000, weekend: 169000, peak: 169000, normal: 528000 },
  },
  extras: [
    { id: 'balconyGrill', label: '실내 바베큐 (발코니 양면그릴)', price: 20000 },
    { id: 'charcoalBbq', label: '숯불바베큐', price: 30000 },
    { id: 'spaSauna', label: '스위밍스파&온탕스파', price: 100000 },
  ],
  sale: {
    weekday: { label: '오픈기념', percent: 40, enabled: true },
    weekend: { label: '오픈기념', percent: 30, enabled: true },
    peak: { label: '오픈기념', percent: 30, enabled: true },
  },
};

interface RoomPricingRow {
  room_type: RoomType;
  weekday: number;
  weekend: number;
  peak: number;
  normal: number;
}

interface ExtraPricingRow {
  id: string;
  label: string;
  price: number;
}

interface SaleInfoRow {
  period: SalePeriod;
  label: string;
  percent: number;
  enabled: number;
}

export async function readPricing(): Promise<PricingData> {
  const [{ results: roomRows }, { results: extraRows }, { results: saleRows }] = await Promise.all([
    d1<RoomPricingRow>('SELECT room_type, weekday, weekend, peak, normal FROM room_pricing'),
    d1<ExtraPricingRow>('SELECT id, label, price FROM extras_pricing ORDER BY sort_order'),
    d1<SaleInfoRow>('SELECT period, label, percent, enabled FROM sale_info'),
  ]);

  if (roomRows.length === 0) return DEFAULT_PRICING;

  const rooms = Object.fromEntries(
    roomRows.map((r) => [r.room_type, { weekday: r.weekday, weekend: r.weekend, peak: r.peak, normal: r.normal }])
  ) as Record<RoomType, RoomTypePricing>;

  const saleByPeriod = Object.fromEntries(saleRows.map((s) => [s.period, { label: s.label, percent: s.percent, enabled: !!s.enabled }]));
  const sale: Record<SalePeriod, SaleInfo> = {
    weekday: saleByPeriod.weekday ?? DEFAULT_PRICING.sale.weekday,
    weekend: saleByPeriod.weekend ?? DEFAULT_PRICING.sale.weekend,
    peak: saleByPeriod.peak ?? DEFAULT_PRICING.sale.peak,
  };

  return {
    rooms,
    extras: extraRows.map((e) => ({ id: e.id, label: e.label, price: e.price })),
    sale,
  };
}

export async function writePricing(data: PricingData): Promise<void> {
  const roomTypes: RoomType[] = ['a', 'b', 'c'];
  await Promise.all(
    roomTypes.map((type) => {
      const r = data.rooms[type];
      return d1(
        `INSERT INTO room_pricing (room_type, weekday, weekend, peak, normal) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(room_type) DO UPDATE SET weekday = excluded.weekday, weekend = excluded.weekend, peak = excluded.peak, normal = excluded.normal`,
        [type, r.weekday, r.weekend, r.peak, r.normal]
      );
    })
  );

  await d1('DELETE FROM extras_pricing');
  await Promise.all(
    data.extras.map((e, i) => d1('INSERT INTO extras_pricing (id, label, price, sort_order) VALUES (?, ?, ?, ?)', [e.id, e.label, e.price, i]))
  );

  const salePeriods: SalePeriod[] = ['weekday', 'weekend', 'peak'];
  await Promise.all(
    salePeriods.map((period) => {
      const s = data.sale[period];
      return d1(
        `INSERT INTO sale_info (period, label, percent, enabled) VALUES (?, ?, ?, ?)
         ON CONFLICT(period) DO UPDATE SET label = excluded.label, percent = excluded.percent, enabled = excluded.enabled`,
        [period, s.label, s.percent, s.enabled ? 1 : 0]
      );
    })
  );
}

export function extraPrice(extras: ExtraOption[], id: string): number {
  return extras.find((e) => e.id === id)?.price ?? 0;
}

export function krw(n: number): string {
  return n.toLocaleString('ko-KR') + '원';
}
