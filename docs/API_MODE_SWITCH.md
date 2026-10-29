# Переключение между моковым и API режимом

## Обзор

Приложение поддерживает два режима работы с данными:
1. **Моковый режим** (по умолчанию) - использует демо-данные из `src/services/mockData.js`
2. **Реальный API** - работает через Favorit Parts `http://api.favorit-parts.ru/hs/hsprice`

## Как переключиться

### Вариант 1: Создать файл `.env`

1. Создайте файл `.env` в корне проекта (рядом с `package.json`)
2. Добавьте одну строку:
   ```
   VITE_USE_REAL_API=true
   ```
3. **Перезапустите dev-сервер**: `npm run dev`

### Вариант 2: Изменить `.env.example` и скопировать

1. Откройте `.env.example`
2. Измените строку `VITE_USE_REAL_API=false` на `true`
3. Скопируйте файл в `.env`: `cp .env.example .env`
4. Перезапустите сервер

### По умолчанию

По умолчанию используется моковый режим (VITE_USE_REAL_API=false). Это безопасно, так как не требует внешнего API.

## Реализация

### Структура кода

- **`src/services/partsApi.js`** - основной сервис с двумя реализациями:
  - `getBrands(article)` - для поиска производителей
  - `getOffers(article, brandId)` - для получения предложений

- **`src/utils/apiMode.js`** - определяет текущий режим:
  ```javascript
  export const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';
  ```

- **`src/utils/encodeURIComponent.js`** - утилита для безопасного URL-кодирования спецсимволов

### Конвертация данных

Реальное API возвращает данные в формате, отличном от внутреннего приложения:

**Формат API:**
```json
{
  "goods": [
    {
      "brand": "MAHLE",
      "number": "OC90",
      "name": "Фильтр масляный",
      "count": 20,
      "warehouses": [
        {
          "code": "МС2",
          "id": "12345",
          "own": true,
          "price": 540.00,
          "stock": 12,
          "notRefund": false
        }
      ]
    }
  ]
}
```

**Формат приложения:**
```javascript
{
  id: '12345',
  brand: 'MAHLE',
  brandId: 'mahle',
  name: 'Фильтр масляный',
  stock: 12,
  price: 540.00,
  warehouse: 'МС2',
  own: true,
  notRefund: false
}
```

### Обработка ошибок

Реализация обрабатывает:
- HTTP ошибки (404, 500 и т.д.)
- Ошибки от API (например, "Invalid key client!")
- Пустой ответ (товар не найден)

### P.S.

Пока что примерный API-ключ задан в коде для тестирования. В реальном проекте:
1. Получите реальный ключ на portal.favorit-parts.ru
2. Замените `const API_KEY = '...'` на:
   ```javascript
   const API_KEY = import.meta.env.VITE_API_KEY;
   ```
3. Добавьте в `.env` строку: `VITE_API_KEY=ваш-реальный-ключ`