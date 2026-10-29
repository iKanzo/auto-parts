# Поиск автозапчастей

React-приложение для поиска автомобильных запчастей и аналогов по артикулу.

Пользователь вводит артикул, получает список производителей, выбирает нужного и видит предложения с ценами и наличием по складам.

### Demo
https://parts-search.vercel.app (ссылка после деплоя)

## Технологии

- React 19 + Vite 8
- Redux Toolkit + React-Redux
- Bootstrap 5
- JavaScript (без TypeScript)

## Развертывание

### Vercel (рекомендуется)

```bash
npm install -g vercel
vercel
```

Или через GitHub:
1. Прикрепите репозиторий к Vercel
2. Подтвердите конфигурацию (Vercel определит Vite проект)
3. Deploy! Ссылка будет доступна сразу

### Локальное развитие

```bash
npm install          # установить зависимости
npm run dev          # запустить dev-сервер (http://localhost:5173)
npm run build        # production-сборка в dist/
npm run preview      # показать собранную версию
```

### Тесты

```bash
npm run test:run
```

## Архитектура

```
src/
├── app/store.js                       Redux store
├── features/parts/
│   ├── partsSlice.js                  Состояние поиска, защита от устаревших ответов
│   ├── partsThunks.js                 Async actions (fetchBrands, fetchOffers)
│   └── partsSelectors.js              Селекторы
├── services/
│   └── partsApi.js                    API layer (Favorit Parts API)
├── utils/
│   └── normalizeArticle.js            Валидация артикула
└── components/
    ├── SearchForm.jsx                 Форма поиска с debounce
    ├── BrandList.jsx                  Список производителей
    ├── OffersTable.jsx                Таблица предложений
    ├── Loader.jsx                     Индикатор загрузки
    ├── ErrorMessage.jsx               Сообщения об ошибках
    └── EmptyState.jsx                 Пустые состояния
```

**Ключевые фичи:**
- Debounce search (400мс)
- Protection from stale responses (requestId tracking)
- Чистая архитектура (feature-slices pattern)
- Production-ready build

## API

Сервис «Проценка» Favorit Parts (`http://api.favorit-parts.ru/hs/hsprice/`, описание — `wsprice.pdf`):

- `getBrands(article)` — запрос только с номером детали, из ответа берутся уникальные производители;
- `getOffers(article, brand)` — запрос с `brand` и `analogues=on`: искомая деталь + аналоги, у каждой позиции цена и остаток по складам.

Ключ задаётся в `.env` (`VITE_API_KEY`, см. `.env.example`); без него используется тестовый ключ из PDF.
API работает по http и без CORS, поэтому запросы идут на `/api/...`: в dev это прокси Vite (`vite.config.js`), на Vercel — rewrite (`vercel.json`).

## Требования

- Node.js 20.19+ или 22.12+
- npm 10+