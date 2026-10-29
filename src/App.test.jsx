import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import partsReducer from './features/parts/partsSlice';
import App from './App';

afterEach(() => vi.unstubAllGlobals());

const json = (body) => ({ ok: true, status: 200, json: async () => body });

describe('App', () => {
  it('артикул -> производители -> предложения с аналогами', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url) => {
      if (url.includes('brand=')) {
        return json({ goods: [{
          brand: 'MEYLE', number: 'S', name: 'Рычаги', goodsID: '1',
          warehouses: [{ code: 'МС2', id: 'w', price: 1000, stock: 20 }],
          analogues: [{ brand: 'Marco', number: 'M', name: 'Комплект', goodsID: '2',
            warehouses: [{ code: 'ПТ4', id: 'w2', price: 500, stock: 3 }] }],
        }] });
      }
      return json({ goods: [{ brand: 'MEYLE' }, { brand: 'ZEN' }] });
    }));

    const store = configureStore({ reducer: { parts: partsReducer } });
    render(<Provider store={store}><App /></Provider>);

    await userEvent.type(screen.getByLabelText('Артикул запчасти'), '7160500039S{Enter}');
    await userEvent.click(await screen.findByRole('button', { name: 'MEYLE' }));

    expect(await screen.findByText('Комплект')).toBeInTheDocument();
    expect(screen.getByText('Аналог')).toBeInTheDocument();
    expect(screen.getByText('20 шт.')).toBeInTheDocument();
    expect(screen.getByText('3 шт.')).toBeInTheDocument();
  });

  it('показывает ошибку и «ничего не найдено»', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('x')));
    const store = configureStore({ reducer: { parts: partsReducer } });
    render(<Provider store={store}><App /></Provider>);
    await userEvent.type(screen.getByLabelText('Артикул запчасти'), 'abc{Enter}');
    expect(await screen.findByText(/Нет связи с сервером/)).toBeInTheDocument();
  });
});
