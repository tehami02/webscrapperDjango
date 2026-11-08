import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCity, sourceUrl, parseProperties } from '../lib/scraper.js';

test('normalizes cities and rejects malformed input', () => {
  assert.equal(normalizeCity('  New   Delhi  '), 'new delhi');
  assert.equal(normalizeCity('मुंबई'), 'मुंबई');
  for (const value of [null, '', 'a', '../pune', '<script>', 'a'.repeat(81)]) assert.throws(() => normalizeCity(value));
  assert.equal(new URL(sourceUrl('new delhi')).searchParams.get('keyword'), 'new delhi');
});
test('parses original cards with missing optional fields and deduplicates URLs', () => {
  const card = '<div class="projectTuple__cardWrap"><a class="projectTuple__projectName projectTuple__pdWrap20 ellipsis" href="/sample-project">Project</a><span class="configurationCards__srpPriceHeading">₹ 80 L</span></div>';
  const rows = parseProperties(card + card, 'pune');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].priceRange, '₹ 80 L');
  assert.equal(rows[0].area, '');
  assert.equal(rows[0].city, 'pune');
});
test('parses structured listings and ignores unsafe URLs and invalid metadata', () => {
  const html = `<script type="application/ld+json">invalid</script><script type="application/ld+json">${JSON.stringify({ '@graph': [
    { '@type': 'Apartment', name: 'Test listing', url: '/listing', offers: { price: 123, priceCurrency: 'INR' } },
    { '@type': 'Apartment', name: 'Unsafe', url: 'javascript:alert(1)' },
    { '@type': 'Apartment', name: 'Other host', url: 'https://example.com/listing' },
  ] })}</script>`;
  const rows = parseProperties(html, 'pune');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].priceRange, 'INR 123');
  assert.deepEqual(parseProperties('<h1>Access Denied</h1>', 'pune'), []);
});
