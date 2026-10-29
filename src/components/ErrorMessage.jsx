import { Alert, Button } from 'react-bootstrap';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <Alert variant="danger" className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-0">
      <span>{message || 'Произошла ошибка. Попробуйте ещё раз.'}</span>
      {onRetry && (
        <Button variant="outline-danger" size="sm" onClick={onRetry}>
          Повторить запрос
        </Button>
      )}
    </Alert>
  );
}
