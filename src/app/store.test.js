import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import partsReducer from '../features/parts/partsSlice';

describe('store', () => {
  it('состояние запускается в исходном виде', () => {
    const store = configureStore({
      reducer: {
        parts: partsReducer,
      },
    });

    const state = store.getState();

    expect(state.parts).toEqual({
      article: '',
      brands: [],
      selectedBrand: null,
      offers: [],
      brandsStatus: 'idle',
      offersStatus: 'idle',
      brandsError: null,
      offersError: null,
      brandsRequestId: null,
      offersRequestId: null,
    });
  });
});