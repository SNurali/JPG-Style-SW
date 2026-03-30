# 🚀 JPG Style SmartWash — Полное руководство по деплою

## 📋 Содержание

1. [Предварительные требования](#предварительные-требования)
2. [Первичный деплой](#первичный-деплой)
3. [Автоматический деплой через GitHub Actions](#автоматический-деплой-через-github-actions)
4. [Ручной деплой](#ручной-деплой)
5. [Мониторинг и обслуживание](#мониторинг-и-обслуживание)
6. [Откат и восстановление](#откат-и-восстановление)
7. [Troubleshooting](#troubleshooting)

---

## Предварительные требования

### На локальной машине

- Git
- SSH клиент
- WireGuard VPN (для подключения к серверу)

### На VPS сервере

- Ubuntu 20.04+
- Docker 20.10+
- Docker Compose 2.0+
- Nginx (опционально)
- Git

### Информация о сервере

| Параметр | Значение |
|----------|----------|
| **Внешний IP** | `195.158.24.137` |
| **WireGuard IP** | `172.16.252.32` |
| **SSH User** | `yoyo` |
| **Проект на сервере** | `/home/yoyo/jpg-style-smartwash/` |

---

## Первичный деплой

### Шаг 1: Подключение к серверу

```bash
# Включить WireGuard VPN
sudo wg-quick up wg0

# SSH на сервер
ssh yoyo@172.16.252.32

# Переключиться на root (если нужно)
sudo su
```

### Шаг 2: Клонирование проекта

```bash
cd /home/yoyo
git clone https://github.com/SNurali/JPG-Style-SW.git jpg-style-smartwash
cd jpg-style-smartwash
```

### Шаг 3: Создание .env.prod

```bash
cat > .env.prod << 'EOF'
# ─── Database ───
DB_HOST=smartwash_postgres
DB_PORT=5432
DB_USERNAME=smartwash
DB_PASSWORD=$(openssl rand -base64 24)
DB_DATABASE=smartwash_db

# ─── Redis ───
REDIS_HOST=smartwash_redis
REDIS_PORT=6379

# ─── JWT ───
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# ─── API ───
APP_PORT=4000
CORS_ORIGINS=http://localhost:3000,http://195.158.24.137:3000

# ─── Web ───
WEB_PORT=3000
NEXT_PUBLIC_API_URL=http://195.158.24.137:4000

# ─── Environment ───
NODE_ENV=production
LOG_LEVEL=info
EOF
```

### Шаг 4: Запуск контейнеров

```bash
# Собрать и запустить
docker compose -f docker-compose.prod.yml up -d --build

# Проверить статус
docker compose -f docker-compose.prod.yml ps

# Проверить логи
docker compose -f docker-compose.prod.yml logs -f
```

### Шаг 5: Проверка

```bash
# Frontend
curl -s http://localhost:3000 | head -5

# API
curl -s http://localhost:4000/health

# Все контейнеры
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## Автоматический деплой через GitHub Actions

### Шаг 1: Добавить SSH ключ на сервер

```bash
# На локальной машине, сгенерировать SSH ключ
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""

# Скопировать публичный ключ на сервер
ssh-copy-id -i ~/.ssh/deploy_key.pub yoyo@172.16.252.32
```

### Шаг 2: Добавить секреты в GitHub

Перейти в Settings → Secrets and variables → Actions и добавить:

```
VPS_IP = 172.16.252.32
VPS_USER = yoyo
VPS_SSH_KEY = (содержимое ~/.ssh/deploy_key)
```

### Шаг 3: Автоматический деплой

Теперь при каждом push в main ветку:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

GitHub Actions автоматически:
1. Запустит тесты и линтинг
2. Подключится к серверу
3. Обновит код
4. Пересоберёт контейнеры
5. Проверит здоровье сервисов

---

## Ручной деплой

### Использование deploy.sh скрипта

```bash
# Деплой
./deploy.sh deploy 172.16.252.32 yoyo

# Просмотр логов
./deploy.sh logs 172.16.252.32 yoyo api
./deploy.sh logs 172.16.252.32 yoyo web

# Проверка статуса
./deploy.sh status 172.16.252.32 yoyo

# Откат
./deploy.sh rollback 172.16.252.32 yoyo
```

### Ручные команды

```bash
# На сервере
cd /home/yoyo/jpg-style-smartwash

# Обновить код
git pull origin main

# Пересобрать контейнеры
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Проверить логи
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f api
```

---

## Мониторинг и обслуживание

### Проверка статуса

```bash
# Статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats smartwash_web smartwash_api smartwash_postgres smartwash_redis

# Проверка портов
curl -s http://localhost:3000 > /dev/null && echo "✓ Frontend"
curl -s http://localhost:4000/health > /dev/null && echo "✓ API"
```

### Логирование

```bash
# Логи всех сервисов
docker compose -f docker-compose.prod.yml logs -f

# Логи конкретного сервиса
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f postgres

# Последние 100 строк
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

### Резервная копия БД

```bash
# Создать бэкап
docker exec smartwash_postgres pg_dump -U smartwash smartwash_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из бэкапа
docker exec -i smartwash_postgres psql -U smartwash smartwash_db < backup_20260330_222813.sql
```

---

## Откат и восстановление

### Откат на предыдущую версию

```bash
cd /home/yoyo/jpg-style-smartwash

# Посмотреть историю коммитов
git log --oneline -10

# Откатить на конкретный коммит
git reset --hard <commit_hash>

# Пересобрать контейнеры
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Восстановление после сбоя

```bash
# Перезагрузить контейнеры
docker compose -f docker-compose.prod.yml restart

# Если контейнер не запускается
docker compose -f docker-compose.prod.yml logs api

# Пересобрать конкретный сервис
docker compose -f docker-compose.prod.yml up -d --build api

# Очистить и пересобрать всё
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

### Контейнеры не запускаются

```bash
# Проверить логи
docker compose -f docker-compose.prod.yml logs

# Проверить ошибки сборки
docker compose -f docker-compose.prod.yml build --no-cache

# Очистить и пересобрать
docker system prune -a
docker compose -f docker-compose.prod.yml up -d --build
```

### Ошибка подключения к БД

```bash
# Проверить статус PostgreSQL
docker compose -f docker-compose.prod.yml ps postgres

# Проверить логи БД
docker compose -f docker-compose.prod.yml logs postgres

# Перезагрузить БД
docker compose -f docker-compose.prod.yml restart postgres
```

### Ошибка Redis

```bash
# Проверить Redis
docker exec smartwash_redis redis-cli ping

# Перезагрузить Redis
docker compose -f docker-compose.prod.yml restart redis

# Очистить Redis
docker exec smartwash_redis redis-cli FLUSHALL
```

### Проблемы с портами

```bash
# Проверить какой процесс занимает порт
lsof -i :3000
lsof -i :4000

# Убить процесс
kill -9 <PID>

# Или изменить порты в docker-compose.prod.yml
```

### Недостаточно места на диске

```bash
# Проверить место
df -h

# Очистить Docker
docker system prune -a --volumes

# Удалить старые образы
docker image prune -a
```

---

## Карта портов

| Порт | Сервис | Статус |
|------|--------|--------|
| 80 | Nginx | Общий |
| 443 | Nginx SSL | Общий |
| 3000 | Frontend | ✅ SmartWash |
| 4000 | API | ✅ SmartWash |
| 5432 | PostgreSQL | ✅ SmartWash |
| 6379 | Redis | ✅ SmartWash |

---

## Полезные команды

```bash
# Просмотр переменных окружения контейнера
docker exec smartwash_api env | grep NODE_ENV

# Выполнить команду в контейнере
docker exec smartwash_api npm run db:seed

# Интерактивный shell в контейнере
docker exec -it smartwash_api sh

# Копировать файл из контейнера
docker cp smartwash_api:/app/dist/main.js ./

# Копировать файл в контейнер
docker cp ./file.txt smartwash_api:/app/
```

---

## Контакты и поддержка

- **GitHub:** https://github.com/SNurali/JPG-Style-SW
- **Issues:** https://github.com/SNurali/JPG-Style-SW/issues
- **Email:** support@jpgstyle.com

---

**Последнее обновление:** 2026-03-30
