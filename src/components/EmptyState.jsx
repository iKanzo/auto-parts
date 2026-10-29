export default function EmptyState({ message }) {
  return (
    <p className="text-secondary border rounded bg-body-tertiary px-3 py-4 mb-0" role="status">
      {message}
    </p>
  );
}
