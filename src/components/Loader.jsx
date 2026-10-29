import { Spinner } from 'react-bootstrap';

export default function Loader({ label = 'Загрузка…' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-3" role="status">
      <Spinner animation="border" size="sm" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
