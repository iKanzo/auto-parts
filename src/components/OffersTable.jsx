import { Badge, Table } from 'react-bootstrap';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

const NO_DATA = 'Нет данных';

const currencyOptions = { style: 'currency', currency: 'RUB' };
const wholePriceFormatter = new Intl.NumberFormat('ru-RU', { ...currencyOptions, maximumFractionDigits: 0 });
const fractionalPriceFormatter = new Intl.NumberFormat('ru-RU', currencyOptions);

function formatPrice(price) {
  if (!Number.isFinite(price)) return NO_DATA;
  return (Number.isInteger(price) ? wholePriceFormatter : fractionalPriceFormatter).format(price);
}
const formatQuantity = (quantity) => (Number.isFinite(quantity) ? `${quantity} шт.` : NO_DATA);

export default function OffersTable({ offers = [], status = 'succeeded', error = null, onRetry }) {
  if (status === 'idle') {
    return <EmptyState message="Выберите производителя, чтобы увидеть предложения." />;
  }
  if (status === 'loading') return <Loader label="Загрузка предложений…" />;
  if (status === 'failed') return <ErrorMessage message={error} onRetry={onRetry} />;
  if (offers.length === 0) {
    return <EmptyState message="Для выбранного производителя предложений не найдено." />;
  }

  return (
    <Table responsive hover className="offers-table align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">Наименование</th>
          <th scope="col" className="d-none d-md-table-cell">Производитель</th>
          <th scope="col" className="d-none d-md-table-cell">Артикул</th>
          <th scope="col">Склад</th>
          <th scope="col" className="text-end">Цена</th>
          <th scope="col" className="text-end">Наличие</th>
        </tr>
      </thead>
      <tbody>
        {offers.map((offer) => {
          // Каждая складская позиция — отдельная строка: цена и остаток
          // всегда относятся к одному и тому же складу.
          const stocks = offer.stocks?.length ? offer.stocks : [null];
          return stocks.map((stock, index) => (
            <tr
              key={`${offer.id}-${index}`}
              className={index === 0 ? 'offer-start' : undefined}
            >
              {index === 0 && (
                <>
                  <th scope="rowgroup" rowSpan={stocks.length} className="fw-semibold">
                    {offer.name}
                    {offer.isAnalogue && <Badge bg="info" className="ms-2">Аналог</Badge>}
                    <div className="d-md-none small fw-normal text-secondary">
                      {offer.brand}
                      {offer.article ? `, арт. ${offer.article}` : ''}
                    </div>
                  </th>
                  <td rowSpan={stocks.length} className="d-none d-md-table-cell">{offer.brand}</td>
                  <td rowSpan={stocks.length} className="d-none d-md-table-cell">{offer.article || NO_DATA}</td>
                </>
              )}
              <td>{stock?.warehouse ?? '—'}</td>
              <td className="text-end text-nowrap">{stock ? formatPrice(stock.price) : '—'}</td>
              <td className="text-end text-nowrap">{stock ? formatQuantity(stock.quantity) : 'Нет в наличии'}</td>
            </tr>
          ));
        })}
      </tbody>
    </Table>
  );
}
