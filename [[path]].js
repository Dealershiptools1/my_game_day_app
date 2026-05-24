const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  const url = new URL(context.request.url);
  // Strip leading /api/ to get the downstream path
  const path = url.pathname.replace(/^\/api\/?/, '');
  const target = `https://data.ncaa.com/casablanca/${path}`;

  try {
    const res = await fetch(target, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
}
