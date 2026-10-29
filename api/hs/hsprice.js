// Прокси для Vercel: страница открыта по https, а API Favorit Parts работает по http без CORS.
// Запрос /api/hs/hsprice?... пересылается на http://api.favorit-parts.ru/hs/hsprice/?...
const TARGET = 'http://api.favorit-parts.ru/hs/hsprice/';

export default async function handler(req, res) {
  const query = new URL(req.url, 'http://localhost').search;

  try {
    const upstream = await fetch(TARGET + query);
    const body = await upstream.text();
    res
      .status(upstream.status)
      .setHeader('Content-Type', 'application/json; charset=utf-8')
      .send(body);
  } catch {
    res.status(502).json({ error: 'API Favorit Parts недоступен' });
  }
}
