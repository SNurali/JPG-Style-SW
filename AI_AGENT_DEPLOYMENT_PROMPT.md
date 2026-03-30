# Промт для AI агента - Деплой JPG Style SmartWash на VPS

## Задача
Подключиться к VPS серверу и развернуть проект JPG Style SmartWash с использованием подготовленных скриптов и конфигурации.

## Информация о сервере
- **IP адрес (WireGuard):** 172.16.252.32
- **Внешний IP:** 195.158.24.137
- **SSH User:** yoyo
- **Проект на сервере:** /home/yoyo/jpg-style-smartwash/
- **OS:** Ubuntu (Docker + Nginx установлены)
- **Репозиторий:** https://github.com/SNurali/JPG-Style-SW.git

## Шаги деплоя

### 1. Подключение к серверу
```bash
# Включить WireGuard VPN (если нужно)
sudo wg-quick up wg0

# SSH на сервер
ssh yoyo@172.16.252.32
```

### 2. Первичная настройка (если первый раз)
```bash
cd /home/yoyo
git clone https://github.com/SNurali/JPG-Style-SW.git jpg-style-smartwash
cd jpg-style-smartwash

# Запустить скрипт первичной настройки
sudo bash setup-production.sh
```

### 3. Обновление и деплой (если уже установлено)
```bash
cd /home/yoyo/jpg-style-smartwash

# Обновить код
git pull origin main

# Пересобрать и запустить контейнеры
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Ждать запуска (30 сек)
sleep 30

# Проверить статус
docker compose -f docker-compose.prod.yml ps
```

### 4. Проверка здоровья
```bash
# Frontend
curl -s http://localhost:3000 | head -5

# API
curl -s http://localhost:4000/health

# PostgreSQL
docker exec smartwash_postgres psql -U smartwash -d smartwash_db -c "SELECT 1"

# Redis
docker exec smartwash_redis redis-cli ping

# Все контейнеры
docker compose -f docker-compose.prod.yml ps
```

## Файлы конфигурации на сервере

После клонирования репозитория, на сервере должны быть:

```
/home/yoyo/jpg-style-smartwash/
├── docker-compose.prod.yml      # Production конфиг Docker
├── .env.prod                     # Переменные окружения (создаётся автоматически)
├── setup-production.sh           # Скрипт первичной настройки
├── deploy.sh                     # Скрипт для ручного деплоя
├── apps/
│   ├── web/Dockerfile
│   ├── api/Dockerfile
│   └── admin/Dockerfile
└── DEPLOYMENT_GUIDE_FULL.md      # Полное руководство
```

## Переменные окружения (.env.prod)

Скрипт `setup-production.sh` автоматически создаст `.env.prod` с:
- Безопасными паролями для БД (сгенерированные через openssl)
- JWT секретами
- Правильными портами (3000 для web, 4000 для API)
- Правильными хостами для Docker сервисов

## Порты на сервере

| Порт | Сервис | Статус |
|------|--------|--------|
| 80 | Nginx | Общий |
| 443 | Nginx SSL | Общий |
| 3000 | Frontend | ✅ SmartWash |
| 4000 | API | ✅ SmartWash |
| 5432 | PostgreSQL | ✅ SmartWash |
| 6379 | Redis | ✅ SmartWash |

## Что проверить после деплоя

1. ✅ Все контейнеры запущены и здоровы
2. ✅ Frontend доступен на http://195.158.24.137:3000
3. ✅ API доступен на http://195.158.24.137:4000
4. ✅ PostgreSQL работает
5. ✅ Redis работает
6. ✅ Нет ошибок в логах

## Команды для мониторинга

```bash
# Логи всех сервисов
docker compose -f docker-compose.prod.yml logs -f

# Логи конкретного сервиса
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web

# Использование ресурсов
docker stats smartwash_web smartwash_api smartwash_postgres smartwash_redis

# Статус контейнеров
docker compose -f docker-compose.prod.yml ps
```

## Откат (если что-то пошло не так)

```bash
cd /home/yoyo/jpg-style-smartwash

# Посмотреть историю коммитов
git log --oneline -5

# Откатить на предыдущий коммит
git reset --hard <commit_hash>

# Пересобрать контейнеры
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

## Результат

После успешного деплоя:
- Frontend работает на http://195.158.24.137:3000
- API работает на http://195.158.24.137:4000
- PostgreSQL доступна на localhost:5432
- Redis доступен на localhost:6379
- Все контейнеры здоровы и автоматически перезагружаются при сбое

## Документация

Полная документация доступна в файлах:
- `DEPLOYMENT_GUIDE_FULL.md` - полное руководство
- `DEPLOYMENT_CHECKLIST.md` - чек-лист перед деплоем
- `DEPLOY_README.md` - быстрый старт
