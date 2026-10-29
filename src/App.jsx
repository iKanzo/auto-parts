import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from './components/SearchForm';
import BrandList from './components/BrandList';
import OffersTable from './components/OffersTable';
import { articleChanged } from './features/parts/partsSlice';
import { fetchBrands, fetchOffers } from './features/parts/partsThunks';
import {
  selectArticle,
  selectBrandsView,
  selectOffersView,
} from './features/parts/partsSelectors';

export default function App() {
  const dispatch = useDispatch();
  const article = useSelector(selectArticle);
  const brands = useSelector(selectBrandsView);
  const offers = useSelector(selectOffersView);

  const selectedBrand = brands.selectedBrand;
  const hasBrands = brands.status === 'succeeded' && brands.items.length > 0;

  const loadOffers = (brand) => dispatch(fetchOffers({ article, brand }));

  return (
    <Container as="main" className="app py-4">
      <h1 className="h2 mb-4">Поиск автозапчастей</h1>

      <SearchForm
        isLoading={brands.status === 'loading'}
        onChange={(value) => dispatch(articleChanged(value))}
        onSearch={(value) => dispatch(fetchBrands(value))}
      />

      {brands.status !== 'idle' && (
        <section className="mt-4" aria-labelledby="brands-heading">
          <h2 id="brands-heading" className="h5 mb-3">Производители</h2>
          <BrandList
            brands={brands.items}
            selectedBrandId={selectedBrand?.id ?? null}
            status={brands.status}
            error={brands.error}
            onSelect={loadOffers}
            onRetry={() => dispatch(fetchBrands(article))}
          />
        </section>
      )}

      {hasBrands && (
        <section className="mt-4" aria-labelledby="offers-heading">
          <h2 id="offers-heading" className="h5 mb-3">
            {selectedBrand ? `Предложения: ${selectedBrand.name}` : 'Предложения'}
          </h2>
          <OffersTable
            offers={offers.items}
            status={offers.status}
            error={offers.error}
            onRetry={() => selectedBrand && loadOffers(selectedBrand)}
          />
        </section>
      )}
    </Container>
  );
}
