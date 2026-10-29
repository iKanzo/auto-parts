// Убирает пробелы по краям. Внутренние символы и регистр не меняются.
export function normalizeArticle(value) {
  return typeof value === 'string' ? value.trim() : '';
}
