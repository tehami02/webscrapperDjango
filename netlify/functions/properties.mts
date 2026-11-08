import type { Config } from '@netlify/functions';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { properties } from '../../db/schema.js';
import { normalizeCity, scrapeCity, SourceError } from '../../lib/scraper.js';

export default async (request: Request) => {
  const headers = { 'Cache-Control': 'no-store' };
  if (!['GET', 'POST'].includes(request.method)) return Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { ...headers, Allow: 'GET, POST' } });
  if (request.method === 'POST' && request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403, headers });
  let city: string;
  try {
    const input = request.method === 'POST' ? (await request.json()).city : new URL(request.url).searchParams.get('city');
    city = normalizeCity(input);
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Invalid city.' }, { status: 400, headers }); }
  try {
    const db = getDb();
    if (request.method === 'POST') {
      // Reuse recent results to avoid repeatedly requesting the same source.
      const recent = await db.select().from(properties).where(eq(properties.city, city)).orderBy(desc(properties.scrapedAt)).limit(1);
      if (!recent[0] || Date.now() - recent[0].scrapedAt.getTime() > 60000) {
        const rows = await scrapeCity(city);
        await db.transaction(async tx => {
          for (const row of rows) await tx.insert(properties).values(row).onConflictDoUpdate({ target: [properties.city, properties.url], set: { ...row, scrapedAt: new Date() } });
        });
      }
    }
    const rows = await db.select().from(properties).where(eq(properties.city, city)).orderBy(desc(properties.scrapedAt)).limit(500);
    return Response.json({ city, properties: rows }, { headers });
  } catch (error) {
    if (error instanceof SourceError) return Response.json({ error: error.message }, { status: 502, headers });
    return Response.json({ error: 'Saved properties are temporarily unavailable. Please try again shortly.' }, { status: 503, headers });
  }
};
export const config: Config = { path: '/api/properties' };
