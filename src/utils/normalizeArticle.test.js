import { describe, it, expect } from 'vitest';
import { normalizeArticle } from './normalizeArticle';

describe('normalizeArticle', () => {
  it('удаляет пробелы по краям', () => {
    expect(normalizeArticle('  OC90  ')).toBe('OC90');
  });

  it('пустая строка возвращает пустую строку', () => {
    expect(normalizeArticle('')).toBe('');
  });

  it('null возвращает пустую строку', () => {
    expect(normalizeArticle(null)).toBe('');
  });

  it('undefined возвращает пустую строку', () => {
    expect(normalizeArticle(undefined)).toBe('');
  });
});