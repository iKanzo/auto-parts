import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBrands, getOffers } from '../../services/partsApi';

const BRANDS_ERROR = 'Не удалось получить список производителей. Попробуйте ещё раз.';
const OFFERS_ERROR = 'Не удалось получить предложения. Попробуйте ещё раз.';

export const fetchBrands = createAsyncThunk(
  'parts/fetchBrands',
  async (article, { rejectWithValue }) => {
    try {
      return await getBrands(article);
    } catch (error) {
      return rejectWithValue(error?.message || BRANDS_ERROR);
    }
  },
  {
    // Не повторяем запрос, если по этому артикулу он уже идёт или выполнен.
    // После ошибки (failed) повторный запрос разрешён.
    condition: (article, { getState }) => {
      const { article: current, brandsStatus } = getState().parts;
      return !(current === article && (brandsStatus === 'loading' || brandsStatus === 'succeeded'));
    },
  },
);

export const fetchOffers = createAsyncThunk(
  'parts/fetchOffers',
  async ({ article, brand }, { rejectWithValue }) => {
    try {
      return await getOffers(article, brand.id);
    } catch (error) {
      return rejectWithValue(error?.message || OFFERS_ERROR);
    }
  },
  {
    // Предложения запрашиваются только для текущего артикула.
    condition: ({ article }, { getState }) => getState().parts.article === article,
  },
);
