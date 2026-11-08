const form = document.querySelector('#scrape-form');
const input = document.querySelector('#city-input');
const button = document.querySelector('#scrape-button');
const status = document.querySelector('#status');
const savedLink = document.querySelector('#saved-link');
const source = document.querySelector('#source-link');
function message(text, error = false) {
  status.textContent = text;
  status.hidden = !text;
  status.classList.toggle('error', error);
}
function setCity(city) {
  input.value = city;
  savedLink.href = `/property_list/${encodeURIComponent(city)}/`;
  savedLink.hidden = !city.trim();
  const url = new URL(`https://www.99acres.com/search/property/buy/${encodeURIComponent(city)}`);
  url.search = new URLSearchParams({ keyword: city, preference: 'S', area_unit: '1', res_com: 'R' });
  source.querySelector('a').href = url;
}
input.addEventListener('input', () => setCity(input.value));
async function api(city, method = 'GET') {
  const response = await fetch(`/api/properties${method === 'GET' ? `?city=${encodeURIComponent(city)}` : ''}`, {
    method, headers: { 'Content-Type': 'application/json' },
    ...(method === 'POST' ? { body: JSON.stringify({ city }) } : {}),
  });
  let data;
  try { data = await response.json(); } catch { throw new Error('The property service is unavailable. Please try again shortly.'); }
  if (!response.ok) throw new Error(data.error || 'The request failed. Please try again.');
  return data;
}
function render(data) {
  document.querySelector('#search-panel').hidden = true;
  document.querySelector('#results').hidden = false;
  document.querySelector('#results-city').textContent = data.city;
  document.title = `Properties in ${data.city} · Property Web Scraper`;
  const tbody = document.querySelector('#property-rows');
  tbody.replaceChildren();
  for (const property of data.properties) {
    const row = document.createElement('tr');
    for (const key of ['projectName', 'locality', 'priceRange', 'area', 'propertyType', 'city']) {
      const cell = document.createElement('td');
      cell.textContent = property[key] || '—';
      row.append(cell);
    }
    const cell = document.createElement('td');
    try {
      const url = new URL(property.url);
      if (url.protocol === 'https:' && ['99acres.com', 'www.99acres.com'].includes(url.hostname)) {
        const link = document.createElement('a');
        link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Link ↗';
        cell.append(link);
      }
    } catch { cell.textContent = '—'; }
    row.append(cell); tbody.append(row);
  }
  document.querySelector('#result-count').textContent = `${data.properties.length} saved ${data.properties.length === 1 ? 'property' : 'properties'} in ${data.city}`;
  document.querySelector('#empty').hidden = data.properties.length > 0;
  source.hidden = false;
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const city = input.value.trim();
  setCity(city); button.disabled = true; input.disabled = true; button.textContent = 'Scraping…';
  message('Retrieving properties… This can take up to 20 seconds.');
  try {
    const data = await api(city, 'POST');
    history.pushState({}, '', `/property_list/${encodeURIComponent(data.city)}/`);
    render(data); message('Properties retrieved and saved.');
  } catch (error) { message(error.message, true); source.hidden = false; }
  finally { button.disabled = false; input.disabled = false; button.textContent = 'Scrape'; }
});
async function loadRoute() {
  const match = location.pathname.match(/^\/property_list\/([^/]+)\/?$/);
  if (!match) {
    document.querySelector('#results').hidden = true;
    document.querySelector('#search-panel').hidden = false;
    source.hidden = true; message(''); return;
  }
  let city;
  try { city = decodeURIComponent(match[1]); } catch { message('The city URL is invalid.', true); return; }
  setCity(city); message('Loading saved properties…');
  try { render(await api(city)); message(''); }
  catch (error) { message(error.message, true); }
}
window.addEventListener('popstate', loadRoute);
loadRoute();
