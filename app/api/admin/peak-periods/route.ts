import { NextRequest } from 'next/server';
import { readPeakPeriods, writePeakPeriods, type PeakPeriod } from '@/lib/peakPeriods';

function isAdmin(request: NextRequest): boolean {
  return request.cookies.get('admin_auth')?.value === '1';
}

function isValidMd(v: string): boolean {
  if (!/^\d{2}-\d{2}$/.test(v)) return false;
  const [m, d] = v.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  return d >= 1 && d <= new Date(2000, m, 0).getDate(); // 2000 is a leap year, so 02-29 is allowed
}

function isValidYmd(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const [y, m, d] = v.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function isValidPeakPeriod(v: unknown): v is PeakPeriod {
  if (!v || typeof v !== 'object') return false;
  const p = v as Record<string, unknown>;
  if (typeof p.id !== 'string' || !p.id.trim()) return false;
  if (typeof p.label !== 'string' || !p.label.trim()) return false;
  if (typeof p.recurring !== 'boolean') return false;
  if (typeof p.start !== 'string' || typeof p.end !== 'string') return false;
  if (p.recurring) return isValidMd(p.start) && isValidMd(p.end);
  return isValidYmd(p.start) && isValidYmd(p.end) && p.start <= p.end;
}

function isValidPeakPeriods(v: unknown): v is PeakPeriod[] {
  if (!Array.isArray(v)) return false;
  const ids = new Set<string>();
  for (const item of v) {
    if (!isValidPeakPeriod(item)) return false;
    if (ids.has(item.id)) return false;
    ids.add(item.id);
  }
  return true;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }
  return Response.json(await readPeakPeriods());
}

export async function PUT(request: NextRequest) {
  if (!isAdmin(request)) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();
  if (!isValidPeakPeriods(body)) {
    return Response.json({ error: '성수기 기간 형식이 올바르지 않습니다. 날짜와 종료일이 시작일보다 빠르지 않은지 확인해주세요.' }, { status: 400 });
  }

  await writePeakPeriods(body);
  return Response.json(await readPeakPeriods());
}
