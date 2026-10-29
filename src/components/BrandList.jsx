import { Button } from 'react-bootstrap';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

export default function BrandList({
  brands = [],
  selectedBrandId = null,
  status = 'succeeded',
  error = null,
  onSelect,
  onRetry,
}) {
  if (status === 'idle') return null;
  if (status === 'loading') return <Loader label="Загрузка производителей…" />;
  if (status === 'failed') return <ErrorMessage message={error} onRetry={onRetry} />;
  if (brands.length === 0) {
    return <EmptyState message="Производители по этому артикулу не найдены. Проверьте артикул и попробуйте ещё раз." />;
  }

  return (
    <div className="d-flex flex-wrap gap-2" role="group" aria-label="Производители">
      {brands.map((brand) => {
        const isSelected = brand.id === selectedBrandId;
        return (
          <Button
            key={brand.id}
            variant={isSelected ? 'primary' : 'outline-secondary'}
            aria-pressed={isSelected}
            onClick={() => onSelect?.(brand)}
          >
            {brand.name}
          </Button>
        );
      })}
    </div>
  );
}
