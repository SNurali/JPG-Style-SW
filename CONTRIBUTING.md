# Contributing Guide

Спасибо за интерес к JPG Style SmartWash! Этот гайд поможет вам начать разработку.

## Требования

- Node.js 20+
- npm 10+
- Docker & Docker Compose (для локальной разработки)
- Git

## Установка

```bash
# Клонируем репозиторий
git clone <repository-url>
cd jpg-style-smartwash

# Устанавливаем зависимости
npm install

# Копируем .env файл
cp .env.example .env

# Запускаем Docker контейнеры
cd docker
docker-compose up -d
```

## Разработка

### Запуск приложений

```bash
# Запуск всех приложений одновременно
npm run dev

# Или отдельно
npm run dev:web    # Frontend (http://localhost:3000)
npm run dev:admin  # Admin panel (http://localhost:3001)
npm run dev:api    # API (http://localhost:4000)
```

### Линтинг и форматирование

```bash
# Проверка кода
npm run lint

# Автоисправление ошибок
npm run lint:fix

# Форматирование кода
npm run format

# Проверка форматирования
npm run format:check
```

### Тестирование

```bash
# Unit тесты
npm run test

# Unit тесты в режиме watch
npm run test:watch

# Покрытие кода
npm run test:coverage

# E2E тесты
npm run e2e

# E2E тесты в UI режиме
npm run e2e:ui
```

## Структура проекта

```
jpg-style-smartwash/
├── apps/
│   ├── web/        # Next.js customer store
│   ├── admin/      # Next.js admin panel
│   └── api/        # Express API
├── packages/
│   └── shared/     # Shared types, schemas, utils
├── docker/         # Docker конфигурация
├── e2e/            # E2E тесты
└── .github/
    └── workflows/  # CI/CD pipelines
```

## Коммиты

Используем conventional commits:

```
type: краткое описание

Более подробное описание если нужно.

Fixes #123
```

Типы коммитов:
- `feat:` новая функция
- `fix:` исправление ошибки
- `docs:` документация
- `style:` форматирование кода
- `refactor:` рефакторинг
- `test:` добавление тестов
- `chore:` обновление зависимостей

## Pre-commit хуки

Перед коммитом автоматически запускаются:
- ESLint
- Prettier
- Проверка типов

Если хук не прошёл, исправьте ошибки и попробуйте снова.

## Pull Requests

1. Создайте ветку от `develop`: `git checkout -b feature/my-feature`
2. Сделайте изменения и коммиты
3. Запустите тесты: `npm run test && npm run e2e`
4. Создайте PR с описанием изменений
5. Дождитесь review и CI/CD проверок

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=your-secret-key
```

## Troubleshooting

### Ошибка при установке зависимостей

```bash
# Очистите кэш npm
npm cache clean --force

# Удалите node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Переустановите
npm install
```

### Docker контейнеры не запускаются

```bash
# Проверьте статус
docker-compose ps

# Посмотрите логи
docker-compose logs -f api

# Перезагрузите контейнеры
docker-compose restart
```

### Порты уже заняты

Измените порты в `docker-compose.yml` или `.env`:

```bash
# Убейте процесс на порту
lsof -ti:3000 | xargs kill -9
```

## Контакты

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: support@jpgstyle.com

Спасибо за вклад! 🚀
