import { d1 } from './d1';

export interface PeakPeriod {
  id: string;
  label: string;
  recurring: boolean; // true: start/end are "MM-DD" and repeat every year. false: start/end are "YYYY-MM-DD".
  start: string;
  end: string;
}

// Defaults inserted once (see SEED_VERSION). After that the admin owns every row — edit or delete freely.
// 설날/추석 are lunar, so their solar dates are listed per year (verified against 한국천문연구원 월력요항 based sources).
const SEED_VERSION = '1';

const DEFAULT_PEAK_PERIODS: PeakPeriod[] = [
  { id: 'new-year', label: '신정', recurring: true, start: '01-01', end: '01-01' },
  { id: 'samil', label: '삼일절', recurring: true, start: '03-01', end: '03-01' },
  { id: 'children', label: '어린이날', recurring: true, start: '05-05', end: '05-05' },
  { id: 'memorial', label: '현충일', recurring: true, start: '06-06', end: '06-06' },
  { id: 'summer-peak', label: '여름 성수기', recurring: true, start: '07-26', end: '08-05' },
  { id: 'liberation', label: '광복절', recurring: true, start: '08-15', end: '08-15' },
  { id: 'foundation', label: '개천절', recurring: true, start: '10-03', end: '10-03' },
  { id: 'hangul', label: '한글날', recurring: true, start: '10-09', end: '10-09' },
  { id: 'christmas', label: '성탄절', recurring: true, start: '12-25', end: '12-25' },
  { id: 'year-end', label: '연말', recurring: true, start: '12-31', end: '12-31' },

  { id: '2026-foundation-sub', label: '2026 개천절 대체공휴일', recurring: false, start: '2026-10-05', end: '2026-10-05' },
  { id: '2027-seollal', label: '2027 설날 연휴', recurring: false, start: '2027-02-06', end: '2027-02-09' },
  { id: '2027-chuseok', label: '2027 추석 연휴', recurring: false, start: '2027-09-14', end: '2027-09-16' },
  { id: '2028-seollal', label: '2028 설날 연휴', recurring: false, start: '2028-01-26', end: '2028-01-28' },
  { id: '2028-chuseok', label: '2028 추석 연휴', recurring: false, start: '2028-10-02', end: '2028-10-05' },
  { id: '2029-seollal', label: '2029 설날 연휴', recurring: false, start: '2029-02-12', end: '2029-02-14' },
  { id: '2029-chuseok', label: '2029 추석 연휴', recurring: false, start: '2029-09-21', end: '2029-09-24' },
  { id: '2030-seollal', label: '2030 설날 연휴', recurring: false, start: '2030-02-02', end: '2030-02-05' },
  { id: '2030-chuseok', label: '2030 추석 연휴', recurring: false, start: '2030-09-11', end: '2030-09-13' },
];

interface PeakPeriodRow {
  id: string;
  label: string;
  recurring: number;
  start_value: string;
  end_value: string;
}

function rowToPeriod(r: PeakPeriodRow): PeakPeriod {
  return { id: r.id, label: r.label, recurring: !!r.recurring, start: r.start_value, end: r.end_value };
}

// Tables are created on first use — this repo has no migration tooling for D1.
let schemaPromise: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = initSchema().catch((e) => {
      schemaPromise = null;
      throw e;
    });
  }
  return schemaPromise;
}

async function initSchema(): Promise<void> {
  await Promise.all([
    d1(
      `CREATE TABLE IF NOT EXISTS peak_periods (id TEXT PRIMARY KEY, label TEXT, recurring INTEGER, start_value TEXT, end_value TEXT)`
    ),
    d1(`CREATE TABLE IF NOT EXISTS peak_settings (key TEXT PRIMARY KEY, value TEXT)`),
  ]);

  const { results } = await d1<{ value: string }>("SELECT value FROM peak_settings WHERE key = 'seed_version'");
  if (results[0]) return;

  // INSERT OR IGNORE keeps any row that already exists (e.g. edited by the admin before this seed ran).
  await Promise.all(
    DEFAULT_PEAK_PERIODS.map((p) =>
      d1(
        'INSERT OR IGNORE INTO peak_periods (id, label, recurring, start_value, end_value) VALUES (?, ?, ?, ?, ?)',
        [p.id, p.label, p.recurring ? 1 : 0, p.start, p.end]
      )
    )
  );
  await d1("INSERT OR IGNORE INTO peak_settings (key, value) VALUES ('seed_version', ?)", [SEED_VERSION]);
}

export async function readPeakPeriods(): Promise<PeakPeriod[]> {
  await ensureSchema();
  const { results } = await d1<PeakPeriodRow>(
    'SELECT id, label, recurring, start_value, end_value FROM peak_periods ORDER BY recurring DESC, start_value, id'
  );
  return results.map(rowToPeriod);
}

// Upserts changed rows and deletes removed ones (rather than delete-all + insert) so a concurrent
// price calculation never sees an empty table mid-save.
export async function writePeakPeriods(periods: PeakPeriod[]): Promise<void> {
  const existing = await readPeakPeriods();
  const existingById = new Map(existing.map((p) => [p.id, p]));
  const keep = new Set(periods.map((p) => p.id));

  const changed = periods.filter((p) => {
    const e = existingById.get(p.id);
    return !e || e.label !== p.label || e.recurring !== p.recurring || e.start !== p.start || e.end !== p.end;
  });
  const removed = existing.filter((p) => !keep.has(p.id));

  await Promise.all([
    ...changed.map((p) =>
      d1(
        `INSERT INTO peak_periods (id, label, recurring, start_value, end_value) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET label = excluded.label, recurring = excluded.recurring,
           start_value = excluded.start_value, end_value = excluded.end_value`,
        [p.id, p.label, p.recurring ? 1 : 0, p.start, p.end]
      )
    ),
    ...removed.map((p) => d1('DELETE FROM peak_periods WHERE id = ?', [p.id])),
  ]);
}

function inRecurringRange(md: string, start: string, end: string): boolean {
  // start > end means the range wraps over New Year (e.g. 12-20 ~ 01-05)
  return start <= end ? md >= start && md <= end : md >= start || md <= end;
}

export function isPeakDate(dateStr: string, periods: PeakPeriod[]): boolean {
  const md = dateStr.slice(5);
  return periods.some((p) =>
    p.recurring ? inRecurringRange(md, p.start, p.end) : dateStr >= p.start && dateStr <= p.end
  );
}
