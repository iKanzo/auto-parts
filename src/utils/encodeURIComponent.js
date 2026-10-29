/**
 * Безопасное URL-кодирование строки для использования в GET-запросах.
 *
 * Спецсимволы заменяются их %-кодировкой:
 *   space (пробел) → '%20'
 *   # → '%23'
 *   & → '%26'
 *   ? → '%3F'
 *   = → '%3D'
 *
 * @param {string} str - строка для кодирования
 * @returns {string} закодированная строка
 */
export function encodeURIComponent(str = '') {
  return String(str)
    .replace(/ /g, '%20')
    .replace(/#/g, '%23')
    .replace(/&/g, '%26')
    .replace(/\?/g, '%3F')
    .replace(/=/g, '%3D');
}