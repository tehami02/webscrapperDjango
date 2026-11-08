import { load } from 'cheerio';

export type Property = { projectName: string; locality: string; priceRange: string; area: string; propertyType: string; city: string; url: string };
export class SourceError extends Error {}

export function normalizeCity(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Enter a city name.');
  const city = value.trim().replace(/\s+/g, ' ').toLowerCase();
  if (city.length < 2 || city.length > 80 || !/^[\p{L}\p{M} .'-]+$/u.test(city)) throw new Error('Enter a valid city name (2–80 letters).');
  return city;
}
export function sourceUrl(city: string) {
  const url = new URL(`https://www.99acres.com/search/property/buy/${encodeURIComponent(city)}`);
  url.search = new URLSearchParams({ keyword: city, preference: 'S', area_unit: '1', res_com: 'R' }).toString();
  return url.href;
}
function safeUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, 'https://www.99acres.com');
    return url.protocol === 'https:' && (url.hostname === '99acres.com' || url.hostname === 'www.99acres.com') ? url.href : null;
  } catch { return null; }
}
export function parseProperties(html: string, city: string): Property[] {
  const $ = load(html);
  const rows = new Map<string, Property>();
  $('[class*="projectTuple__cardWrap"]').each((_, element) => {
    const card = $(element);
    const link = card.find('a[class*="projectTuple__projectName"]').first();
    const url = safeUrl(link.attr('href'));
    const projectName = link.text().trim();
    if (!url || !projectName) return;
    rows.set(url, { projectName, url, city,
      locality: card.find('[class*="projectTuple__subHeadingWrap"]').first().text().trim(),
      priceRange: card.find('[class*="configurationCards__srpPriceHeading"]').first().text().trim(),
      area: card.find('[class*="configurationCards__cardAreaSubHeadingOne"]').first().text().trim(),
      propertyType: card.find('[class*="configurationCards__configBandLabel"]').map((_, el) => $(el).text().trim()).get().join(', '),
    });
  });
  // Some source pages expose listings only as structured data.
  function visit(node: any, depth = 0) {
    if (!node || typeof node !== 'object' || depth > 30 || rows.size >= 100) return;
    if (Array.isArray(node)) { node.forEach(value => visit(value, depth + 1)); return; }
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    if (types.some((type: string) => ['Apartment', 'House', 'Residence', 'Product', 'RealEstateListing'].includes(type))) {
      const url = safeUrl(node.url);
      if (url && typeof node.name === 'string' && !rows.has(url)) {
        const offer = Array.isArray(node.offers) ? node.offers[0] : node.offers;
        const address = node.address;
        rows.set(url, { projectName: node.name, url, city,
          locality: typeof address === 'string' ? address : [address?.streetAddress, address?.addressLocality].filter(Boolean).join(', '),
          priceRange: offer?.price != null ? `${offer.priceCurrency || 'INR'} ${offer.price}` : '',
          area: node.floorSize?.value != null ? `${node.floorSize.value} ${node.floorSize.unitText || ''}`.trim() : '',
          propertyType: types.filter(Boolean).join(', '),
        });
      }
    }
    Object.values(node).forEach(value => visit(value, depth + 1));
  }
  $('script[type="application/ld+json"]').each((_, el) => { try { visit(JSON.parse($(el).text())); } catch { /* Ignore malformed source metadata. */ } });
  return [...rows.values()].slice(0, 100);
}
export async function scrapeCity(city: string): Promise<Property[]> {
  let response: Response;
  try {
    response = await fetch(sourceUrl(city), { signal: AbortSignal.timeout(20000), headers: { Accept: 'text/html', 'User-Agent': '99Scraper/1.0' } });
  } catch { throw new SourceError('99acres could not be reached within 20 seconds. Please try again later.'); }
  if (!response.ok) throw new SourceError(`99acres refused the request (HTTP ${response.status}). No listings were saved. You can view previously saved properties or open 99acres directly.`);
  const html = await response.text();
  const rows = parseProperties(html, city);
  if (!rows.length) throw new SourceError('99acres returned no readable listings. It may require browser verification or its page format may have changed. No listings were saved.');
  return rows;
}
