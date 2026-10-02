// FMCSA carrier lookup (Vercel function): GET /api/fmcsa?q=<DOT, MC or company name>
// 1) FMCSA Company Census open data (data.transportation.gov) — no key needed. DOT + name search.
// 2) FMCSA QCMobile API — optional, adds MC-number search. Set FMCSA_WEBKEY (server-side) to enable.
//    Get a WebKey at https://mobile.fmcsa.dot.gov/QCDevsite/ (login.gov account).
const BASE = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';
const CENSUS = 'https://data.transportation.gov/resource/az4n-8mr2.json';

export function fromCensus(r) {
  const n = (v) => (v === undefined || v === null || v === '' ? null : Number(v));
  return {
    legalName: r.legal_name || '', dbaName: r.dba_name || '', dotNumber: String(r.dot_number || ''),
    city: r.phy_city || '', state: r.phy_state || '', powerUnits: n(r.power_units), drivers: n(r.total_drivers),
    allowedToOperate: r.status_code === 'A',
  };
}

export async function census(q) {
  const params = new URLSearchParams({ $limit: '10', $select: 'dot_number,legal_name,dba_name,phy_city,phy_state,power_units,total_drivers,status_code' });
  if (/^\d{1,8}$/.test(q)) params.set('dot_number', q);
  else { params.set('$q', q); params.set('$where', "status_code='A'"); }
  const headers = { Accept: 'application/json' };
  if (process.env.SOCRATA_APP_TOKEN) headers['X-App-Token'] = process.env.SOCRATA_APP_TOKEN;
  const res = await fetch(`${CENSUS}?${params}`, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Census ${res.status}`);
  const rows = await res.json();
  return Array.isArray(rows) ? rows.map(fromCensus).filter((r) => r.dotNumber) : [];
}
const json = (status, body, cache = 'no-store') =>
  Response.json(body, { status, headers: { 'Cache-Control': cache } });

function pick(c) {
  if (!c || typeof c !== 'object') return null;
  const n = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
  return {
    legalName: c.legalName || '',
    dbaName: c.dbaName || '',
    dotNumber: String(c.dotNumber ?? ''),
    city: c.phyCity || '',
    state: c.phyState || '',
    powerUnits: n(c.totalPowerUnits),
    drivers: n(c.totalDrivers),
    allowedToOperate: c.allowedToOperate === 'Y',
  };
}

function carriersFrom(data) {
  const content = data?.content;
  if (!content) return [];
  const list = Array.isArray(content) ? content : [content];
  return list.map((x) => pick(x?.carrier ?? x)).filter((x) => x && x.dotNumber);
}

async function get(path, key) {
  const url = `${BASE}/${path}${path.includes('?') ? '&' : '?'}webKey=${encodeURIComponent(key)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`FMCSA ${res.status}`);
  return carriersFrom(await res.json());
}

export default {
  async fetch(request) {
    if (request.method !== 'GET') return json(405, { error: 'Method not allowed.' });
    const q = (new URL(request.url).searchParams.get('q') || '').trim();
    if (q.length < 2 || q.length > 80 || /[<>{}\\]/.test(q)) return json(400, { error: 'Enter a DOT number, MC number or company name.' });

    const key = process.env.FMCSA_WEBKEY;
    const mcOnly = q.match(/^(?:mc|mx|ff)[\s#-]*(\d{1,8})$/i);
    if (!key) {
      if (mcOnly) return json(200, { results: [], note: 'MC search is not available. Search by USDOT number or company name.' });
      try { return json(200, { results: await census(q), source: 'census' }, 'public, max-age=3600'); }
      catch { return json(502, { error: 'FMCSA did not respond. Try again or enter your DOT number manually.', fallback: true }); }
    }

    try {
      let results = [];
      const mc = q.match(/^(?:mc|mx|ff)[\s#-]*(\d{1,8})$/i);
      if (mc) {
        results = await get(`docket-number/${mc[1]}/`, key);
      } else if (/^\d{1,8}$/.test(q)) {
        // A bare number can be a DOT or an MC number: try both.
        const [byDot, byMc] = await Promise.all([
          get(q, key).catch(() => []),
          get(`docket-number/${q}/`, key).catch(() => []),
        ]);
        results = [...byDot, ...byMc];
      } else {
        results = await get(`name/${encodeURIComponent(q)}?start=0&size=10`, key);
      }
      if (!results.length && !mcOnly) results = await census(q).catch(() => []);
      const seen = new Set();
      results = results.filter((r) => !seen.has(r.dotNumber) && seen.add(r.dotNumber)).slice(0, 10);
      return json(200, { results }, 'public, max-age=3600');
    } catch {
      return json(502, { error: 'FMCSA did not respond. Try again or enter your DOT number manually.', fallback: true });
    }
  },
};
