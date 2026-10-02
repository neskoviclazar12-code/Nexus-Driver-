// FMCSA carrier lookup (Vercel function): GET /api/fmcsa?q=<DOT, MC or company name>
// Uses the free FMCSA QCMobile API. Set FMCSA_WEBKEY in Vercel (server-side only).
// Get a WebKey at https://mobile.fmcsa.dot.gov/QCDevsite/ (login.gov account).
const BASE = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';
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
    if (!key) return json(503, { error: 'FMCSA search is not connected yet.', fallback: true });

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
      const seen = new Set();
      results = results.filter((r) => !seen.has(r.dotNumber) && seen.add(r.dotNumber)).slice(0, 10);
      return json(200, { results }, 'public, max-age=3600');
    } catch {
      return json(502, { error: 'FMCSA did not respond. Try again or enter your DOT number manually.', fallback: true });
    }
  },
};
