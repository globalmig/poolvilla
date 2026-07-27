import { readPricing } from '@/lib/pricing';

export async function GET() {
  return Response.json(await readPricing());
}
