# PathVoyager

Путеводитель по путешествиям на Next.js с админ-панелью для управления статьями.

## Как запустить

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных PostgreSQL

Создайте базу данных PostgreSQL и настройте переменные окружения. Создайте файл `.env` в корне проекта:

```env
# Подключение к PostgreSQL
DATABASE_URL=postgres://user:password@localhost:5432/pathvoyager
# или используйте отдельные переменные:
# PGHOST=localhost
# PGPORT=5432
# PGUSER=postgres
# PGPASSWORD=postgres
# PGDATABASE=pathvoyager

# CORS настройки (разрешенные источники для API)
CORS_ORIGIN=http://localhost:3000

# URL бэкенд-сервера
API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Порт бэкенд-сервера (опционально, по умолчанию 4000)
PORT=4000
```

### 3. Запуск бэкенд-сервера

В отдельном терминале запустите Express-сервер:

```bash
npm run server
```

Сервер автоматически создаст таблицу `articles` при первом запуске. Сервер будет доступен на `http://localhost:4000`.

### 4. Запуск Next.js приложения

В другом терминале запустите фронтенд:

```bash
npm run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

### 5. Использование админ-панели

Откройте [http://localhost:3000/admin](http://localhost:3000/admin) для создания и управления статьями.

**Формат контента:**
- `# Заголовок` — создает заголовок блока
- `- пункт списка` — создает элемент списка
- `> Цитата — Автор` — создает цитату с автором
- `[[banner]]` — вставляет баннер в текст
- Обычный текст — создает параграф

## Структура проекта

- `src/app/` — страницы Next.js (App Router)
- `src/widgets/` — виджеты (header, footer, секции)
- `src/entities/` — сущности (посты, категории, авторы)
- `src/shared/` — общие компоненты и утилиты
- `server/` — Express-бэкенд с API для статей
- `public/` — статические файлы (изображения)

## API Endpoints

- `GET /api/articles` — получить список всех статей
- `GET /api/articles/:slug` — получить статью по слагу
- `POST /api/articles` — создать/обновить статью (upsert по слагу)
- `GET /health` — проверка здоровья сервера

## Скрипты

- `npm run dev` — запуск Next.js в режиме разработки
- `npm run server` — запуск Express-бэкенда
- `npm run build` — сборка Next.js приложения
- `npm run start` — запуск production-версии Next.js
- `npm run lint` — проверка кода линтером
