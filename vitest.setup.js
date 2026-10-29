import {vi} from 'vitest'
import '@testing-library/jest-dom/vitest'

// Подавляем только предупреждения React об act
const originalError = console.error

vi.spyOn(console, 'error').mockImplementation((...args) => {
  if (String(args[0]).includes('not wrapped in act')) {
    return
  }

  originalError(...args)
})

// Мок ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
