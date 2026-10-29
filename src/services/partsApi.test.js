import { describe, it, expect, vi, afterEach } from 'vitest';
import { getBrands, getOffers } from './partsApi';

const mockFetch = (body, { ok = true, status = 200 } = {}) => {
  const fn = vi.fn().mockResolvedValue({ ok, status, json: async () => body });
  vi.stubGlobal('fetch', fn);
  return fn;
};

afterEach(() => vi.unstubAllGlobals());

describe('getBrands', () => {
  it('передаёт key и number, без двойного кодирования', async () => {
    const fetchMock = mockFetch({ goods: [] });
    await getBrands('A B#1');
    const url = fetchMock.mock.calls[0][0];
    expect(url).toMatch(/^\/api\/hs\/hsprice\/\?key=[\w-]+&number=A%20B%231$/);
  });

  it('возвращает уникальных производителей', async () => {
    mockFetch({ goods: [{ brand: 'ZEN' }, { brand: 'NGK/NTK' }, { brand: 'ZEN' }] });
    expect(await getBrands('0189')).toEqual([
      { id: 'ZEN', name: 'ZEN' },
      { id: 'NGK/NTK', name: 'NGK/NTK' },
    ]);
  });

  it('пустая структура ("не найдено") даёт пустой список', async () => {
    mockFetch({ goods: [{}] });
    expect(await getBrands('xxx')).toEqual([]);
  });

  it('ошибка API превращается в ApiError', async () => {
    mockFetch({ error: 'Invalid key client!' });
    await expect(getBrands('1')).rejects.toThrow('Неверный ключ API.');
  });

  it('HTTP-ошибка и сбой сети', async () => {
    mockFetch({}, { ok: false, status: 500 });
    await expect(getBrands('1')).rejects.toThrow('HTTP 500');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(getBrands('1')).rejects.toThrow('Нет связи');
  });
});

describe('getOffers', () => {
  it('разбирает деталь и аналоги, кодирует бренд', async () => {
    const fetchMock = mockFetch({
      goods: [{
        brand: 'MEYLE', number: '7160500039/S', name: 'Рычаги', goodsID: 'g1',
        warehouses: [{ code: 'МС2', id: 'w1', price: 12533.62, stock: 20 }],
        analogues: [
          { brand: 'Marco', number: '53612/1', name: 'Комплект', goodsID: 'g2',
            warehouses: [{ code: 'ПТ4', id: 'w2', price: 8680.2, stock: 10 }] },
          { brand: 'MEYLE', number: '7160500039/SK', name: 'Рычаги 1', goodsID: 'g3', warehouses: [] },
        ],
      }],
    });

    const offers = await getOffers('7160500039S', 'NGK/NTK');
    expect(fetchMock.mock.calls[0][0]).toContain('brand=NGK%2FNTK&analogues=on&info=on');
    expect(offers).toHaveLength(3);
    expect(offers[0]).toMatchObject({ brand: 'MEYLE', isAnalogue: false });
    expect(offers[0].stocks[0]).toEqual({ id: 'w1', warehouse: 'МС2', price: 12533.62, quantity: 20 });
    expect(offers[1]).toMatchObject({ brand: 'Marco', isAnalogue: true });
    expect(offers[2].stocks).toEqual([]);
  });

  it('пустой ответ — пустой список', async () => {
    mockFetch({ goods: [{}] });
    expect(await getOffers('1', 'X')).toEqual([]);
  });
});
