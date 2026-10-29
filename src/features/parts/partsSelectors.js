import { createSelector } from '@reduxjs/toolkit';

const selectParts = (state) => state.parts;

export const selectArticle = (state) => state.parts.article;

export const selectBrandsView = createSelector([selectParts], (parts) => ({
  items: parts.brands,
  status: parts.brandsStatus,
  error: parts.brandsError,
  selectedBrand: parts.selectedBrand,
}));

export const selectOffersView = createSelector([selectParts], (parts) => ({
  items: parts.offers,
  status: parts.offersStatus,
  error: parts.offersError,
}));
