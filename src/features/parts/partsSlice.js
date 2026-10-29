import { createSlice } from '@reduxjs/toolkit';
import { fetchBrands, fetchOffers } from './partsThunks';

const initialState = {
  article: '',
  brands: [],
  selectedBrand: null,
  offers: [],

  brandsStatus: 'idle', // idle | loading | succeeded | failed
  offersStatus: 'idle',

  brandsError: null,
  offersError: null,

  // id последнего запущенного запроса. Ответ с другим id считается устаревшим.
  brandsRequestId: null,
  offersRequestId: null,
};

function resetResults(state) {
  state.brands = [];
  state.selectedBrand = null;
  state.offers = [];
  state.brandsStatus = 'idle';
  state.offersStatus = 'idle';
  state.brandsError = null;
  state.offersError = null;
  // Сброс id делает ответы всех запросов в полёте устаревшими.
  state.brandsRequestId = null;
  state.offersRequestId = null;
}

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    // Вызывается при каждом изменении артикула (без запроса).
    // Пустая строка возвращает состояние к начальному.
    articleChanged(state, action) {
      if (state.article === action.payload) return;
      resetResults(state);
      state.article = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        resetResults(state);
        state.article = action.meta.arg;
        state.brandsStatus = 'loading';
        state.brandsRequestId = action.meta.requestId;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (state.brandsRequestId !== action.meta.requestId) return;
        state.brands = action.payload;
        state.brandsStatus = 'succeeded';
        state.brandsRequestId = null;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (state.brandsRequestId !== action.meta.requestId) return;
        state.brandsError = action.payload ?? action.error.message;
        state.brandsStatus = 'failed';
        state.brandsRequestId = null;
      })
      .addCase(fetchOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand;
        state.offers = [];
        state.offersError = null;
        state.offersStatus = 'loading';
        state.offersRequestId = action.meta.requestId;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (state.offersRequestId !== action.meta.requestId) return;
        state.offers = action.payload;
        state.offersStatus = 'succeeded';
        state.offersRequestId = null;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (state.offersRequestId !== action.meta.requestId) return;
        state.offersError = action.payload ?? action.error.message;
        state.offersStatus = 'failed';
        state.offersRequestId = null;
      });
  },
});

export const { articleChanged } = partsSlice.actions;
export default partsSlice.reducer;
