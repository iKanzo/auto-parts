// В dev запросы идут через прокси Vite, на Vercel — через rewrite (см. vercel.json).
// Адрес со слэшем на конце — как в спецификации сервиса.
const API_URL = '/api/hs/hsprice/';

// Тестовый ключ из описания сервиса. Свой ключ задаётся в .env: VITE_API_KEY=...
const API_KEY = import.meta.env.VITE_API_KEY || '00000000-0000-0000-0000-000000000001';

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const API_ERRORS = {
  'Empty key!': 'Не указан ключ API.',
  'Invalid key client!': 'Неверный ключ API.',
  'Empty number goods!': 'Не указан артикул.',
  'Request quota exceeded!': 'Превышен лимит запросов к API. Попробуйте позже.',
};

// Спецсимволы (#, &, /, пробел и т.д.) кодируются стандартным encodeURIComponent.
function buildUrl(params) {
  const query = Object.entries({ key: API_KEY, ...params })
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join('&');
  return `${API_URL}?${query}`;
}

// Общий запрос: превращает сетевые сбои, HTTP-ошибки и {error} в ApiError.
async function request(params) {
  let response;
  try {
    response = await fetch(buildUrl(params));
  } catch {
    throw new ApiError('Нет связи с сервером. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    throw new ApiError(`Ошибка сервера (HTTP ${response.status}).`, response.status);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Сервер вернул некорректный ответ.');
  }

  if (data?.error) {
    const text = Array.isArray(data.error) ? data.error.join(', ') : String(data.error);
    throw new ApiError(API_ERRORS[text] || text);
  }

  // Если товар не найден, сервис возвращает массив с одной пустой структурой — отсекаем её.
  return (data?.goods ?? []).filter((item) => item?.brand);
}

/**
 * Этап 1. Производители, выпускающие деталь с этим артикулом.
 */
export async function getBrands(article) {
  const goods = await request({ number: article });

  const names = [...new Set(goods.map((item) => item.brand))];
  return names.map((name) => ({ id: name, name }));
}

// Позиция API -> строка таблицы. Каждый склад — отдельная запись stocks.
function toOffer(item, isAnalogue) {
  return {
    id: item.goodsID || `${item.brand}-${item.number}`,
    name: item.name,
    brand: item.brand,
    article: item.number,
    isAnalogue,
    stocks: (item.warehouses ?? []).map((w, index) => ({
      id: w.id ?? index,
      warehouse: w.code || 'Склад',
      price: w.price,
      quantity: w.stock,
    })),
  };
}

/**
 * Этап 2. Искомая деталь выбранного производителя + её аналоги.
 */
export async function getOffers(article, brand) {
  const goods = await request({ number: article, brand, analogues: 'on', info: 'on' });

  return goods.flatMap((item) => [
    toOffer(item, false),
    ...(item.analogues ?? []).filter((a) => a?.brand).map((a) => toOffer(a, true)),
  ]);
}
