const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const DATABASE_ID = process.env.D1_DATABASE_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;

export interface D1Meta {
  changes: number;
  last_row_id: number;
}

interface D1ApiResponse<T> {
  success: boolean;
  errors: { message: string }[];
  result: { results: T[]; success: boolean; meta: D1Meta }[];
}

// Server-side only — queries Cloudflare D1 over its HTTP API (non-Worker integration).
export async function d1<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<{ results: T[]; meta: D1Meta }> {
  const res = await fetch(D1_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  });

  const json = (await res.json()) as D1ApiResponse<T>;
  if (!res.ok || !json.success) {
    throw new Error(json.errors?.[0]?.message ?? `D1 query failed (${res.status})`);
  }

  const first = json.result[0];
  return { results: first?.results ?? [], meta: first?.meta ?? { changes: 0, last_row_id: 0 } };
}
