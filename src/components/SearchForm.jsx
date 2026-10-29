import { useEffect, useRef, useState } from 'react';
import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { normalizeArticle } from '../utils/normalizeArticle';

export const SEARCH_DEBOUNCE_MS = 400;

/*
 * onChange(article) — сразу при каждом изменении (артикул уже без пробелов по краям);
 * onSearch(article) — через SEARCH_DEBOUNCE_MS после последнего изменения
 * или сразу по Enter. Для пустого ввода поиск не запускается.
 */
export default function SearchForm({ defaultValue = '', isLoading = false, onChange, onSearch }) {
  const [value, setValue] = useState(defaultValue);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const article = normalizeArticle(value);
  const isInvalid = value.length > 0 && article === '';

  const handleChange = (event) => {
    const nextValue = event.target.value;
    const nextArticle = normalizeArticle(nextValue);
    setValue(nextValue);
    clearTimeout(timerRef.current);
    onChange?.(nextArticle);
    if (nextArticle) {
      timerRef.current = setTimeout(() => onSearch?.(nextArticle), SEARCH_DEBOUNCE_MS);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearTimeout(timerRef.current);
    if (article) onSearch?.(article);
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Form.Group controlId="article-input">
        <Form.Label>Артикул запчасти</Form.Label>
        <InputGroup hasValidation>
          <Form.Control
            type="search"
            value={value}
            onChange={handleChange}
            placeholder="Например, OC90"
            autoComplete="off"
            isInvalid={isInvalid}
            aria-describedby="article-help"
          />
          {isLoading && (
            <InputGroup.Text>
              <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Идёт поиск</span>
              </Spinner>
            </InputGroup.Text>
          )}
          <Form.Control.Feedback type="invalid">
            Введите артикул: строка не может состоять только из пробелов.
          </Form.Control.Feedback>
        </InputGroup>
        <Form.Text id="article-help" muted>
          Поиск запускается автоматически после ввода, либо по Enter.
        </Form.Text>
      </Form.Group>
    </Form>
  );
}
