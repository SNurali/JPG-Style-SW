# 🚀 JPG Style SmartWash — Deployment Guide

## Информация о сервере

| Параметр | Значение |
|----------|----------|
| **Внешний IP** | `195.158.24.137` |
| **WireGuard IP** | `172.16.252.32` |
| **SSH User** | `yoyo` |
| **OS** | Ubuntu (Docker + Nginx установлены) |
| **Репозиторий** | https://github.com/SNurali/JPG-Style-SW.git |

---

## ⚠️ СУЩЕСТВУЮЩИЙ ПРОЕКТ НА СЕРВЕРЕ

На этом сервере уже работает **NODIR_HDD_FIXER** (RECOVERY.UZ):

| Ресурс | NODIR_HDD_FIXER (занято) | SmartWash (наш) |
|--------|--------------------------|-----------------|
| **Директория** | `/home/yoyo/nodir_hdd_fixer/` | `/home/yoyo/jpg-style-smartwash/` |
| **Web порт** | 3003 | **3010** |
| **API порт** | 3004 | **3011** |
| **PostgreSQL** | 5436 (внешний) / 5432 (внутренний) | **5437** (внешний) / 5432 (внутренний) |
| **Redis** | 6380 (внешний) / 6379 (внутренний) | **6381** (внешний) / 6379 (внутренний) |
| **Docker Prefix** | `hdd_fixer_*` | `smartwash_*` |
| **Nginx** | `/etc/nginx/sites-available/hdd-fixer` | `/etc/nginx/sites-available/smartwash` |

> **ВАЖНО:** Не трогать порты 3003, 3004, 5436, 6380 — они заняты NODIR_HDD_FIXER!

---

## 📦 Структура деплоя

```
/home/yoyo/jpg-style-smartwash/
├── apps/
│   ├── api/          # NestJS Backend (порт 3011)
│   ├── web/          # Next.js Frontend (порт 3010)
│   └── admin/        # Admin panel
├── packages/shared/  # Shared types
├── docker-compose.prod.yml
├── .env.prod
└── start.sh
```

---

## 🔧 Шаг 1: Подключение к серверу

```bash
# 1. Включить WireGuard VPN
sudo wg-quick up wg0

# 2. SSH на сервер
ssh yoyo@172.16.252.32

# 3. Переключиться на root (при необходимости)
sudo su
```

---

## 📥 Шаг 2: Клонирование проекта

```bash
cd /home/yoyo
git clone https://github.com/SNurali/JPG-Style-SW.git jpg-style-smartwash
cd jpg-style-smartwash
```

---

## ⚙️ Шаг 3: Создание .env.prod

```bash
cat > .env.prod << 'EOF'
# ─── Database ───
DB_HOST=smartwash_postgres
DB_PORT=5432
DB_USERNAME=smartwash
DB_PASSWORD=SmartWash_Pr0d_2026!
DB_DATABASE=smartwash_db

# ─── Redis ───
REDIS_HOST=smartwash_redis
REDIS_PORT=6379

# ─── JWT ───
JWT_SECRET=CHANGE_ME_smartwash_jwt_secret_32chars
JWT_REFRESH_SECRET=CHANGE_ME_smartwash_refresh_secret_32

# ─── API ───
APP_PORT=3011
CORS_ORIGINS=http://localhost:3010,http://195.158.24.137:3010

# ─── Web ───
WEB_PORT=3010
NEXT_PUBLIC_API_URL=http://195.158.24.137:3011/api
API_INTERNAL_URL=http://smartwash_api:3011/api

# ─── Uploads ───
UPLOADS_DIR=/app/uploads

# ─── Telegram Bot ───
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE

# ─── Environment ───
NODE_ENV=production
EOF
```

**Сгенерировать безопасные секреты:**
```bash
# JWT_SECRET
openssl rand -base64 32

# JWT_REFRESH_SECRET
openssl rand -base64 32

# DB_PASSWORD
openssl rand -base64 24
```

---

## 🐳 Шаг 4: Создание docker-compose.prod.yml

```bash
cat > docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  # ─── PostgreSQL ───
  postgres:
    image: postgres:16-alpine
    container_name: smartwash_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    ports:
      - "5437:5432"
    volumes:
      - smartwash_pgdata:/var/lib/postgresql/data
    networks:
      - smartwash_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_DATABASE}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─── Redis ───
  redis:
    image: redis:7-alpine
    container_name: smartwash_redis
    restart: always
    ports:
      - "6381:6379"
    volumes:
      - smartwash_redisdata:/data
    networks:
      - smartwash_net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─── API (NestJS) ───
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: smartwash_api
    restart: always
    env_file: .env.prod
    ports:
      - "3011:3011"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - smartwash_uploads:/app/uploads
    networks:
      - smartwash_net

  # ─── Web (Next.js) ───
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: smartwash_web
    restart: always
    env_file: .env.prod
    ports:
      - "3010:3010"
    depends_on:
      - api
    networks:
      - smartwash_net

volumes:
  smartwash_pgdata:
  smartwash_redisdata:
  smartwash_uploads:

networks:
  smartwash_net:
    driver: bridge
EOF
```

---

## 🏗️ Шаг 5: Сборка и запуск

```bash
cd /home/yoyo/jpg-style-smartwash

# Собрать и запустить все контейнеры
docker compose -f docker-compose.prod.yml up -d --build

# Проверить статус
docker compose -f docker-compose.prod.yml ps

# Проверить логи
docker compose -f docker-compose.prod.yml logs -f
```

---

## 🌐 Шаг 6: Настройка Nginx (опционально)

```bash
sudo tee /etc/nginx/sites-available/smartwash << 'EOF'
server {
    listen 80;
    server_name smartwash.uz www.smartwash.uz;

    # Frontend
    location / {
        proxy_pass http://localhost:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
EOF

# Активировать сайт
sudo ln -sf /etc/nginx/sites-available/smartwash /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## ✅ Шаг 7: Проверка

```bash
# Проверить что NODIR_HDD_FIXER всё ещё работает!
curl -s http://localhost:3003 | head -5   # ← должен отвечать
curl -s http://localhost:3004/v1/health    # ← должен быть ok

# Проверить SmartWash
curl -s http://localhost:3010 | head -5   # ← наш frontend
curl -s http://localhost:3011/api/health   # ← наш API

# Проверить все контейнеры
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## 🔄 Обновление (после git push)

```bash
cd /home/yoyo/jpg-style-smartwash

# Получить обновления
git pull origin main

# Пересобрать и перезапустить
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Проверить логи
docker compose -f docker-compose.prod.yml logs -f --tail=50
```

---

## 🛑 Откат

```bash
cd /home/yoyo/jpg-style-smartwash

# Остановить SmartWash (не затрагивает NODIR_HDD_FIXER!)
docker compose -f docker-compose.prod.yml down

# Откатить код
git log --oneline -5
git reset --hard <commit_hash>

# Пересобрать
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Мониторинг

```bash
# Логи SmartWash
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f api

# Проверка ресурсов
docker stats smartwash_web smartwash_api smartwash_postgres smartwash_redis

# Проверка PostgreSQL
docker exec smartwash_postgres psql -U smartwash -d smartwash_db -c "SELECT 1"

# Проверка Redis
docker exec smartwash_redis redis-cli ping
```

---

## 🗂️ Карта портов сервера (полная)

| Порт | Сервис | Проект |
|------|--------|--------|
| 80 | Nginx | Общий |
| 443 | Nginx SSL | Общий |
| 3003 | Web Frontend | NODIR_HDD_FIXER ⛔ |
| 3004 | API Backend | NODIR_HDD_FIXER ⛔ |
| 3010 | Web Frontend | **SmartWash** ✅ |
| 3011 | API Backend | **SmartWash** ✅ |
| 5436 | PostgreSQL | NODIR_HDD_FIXER ⛔ |
| 5437 | PostgreSQL | **SmartWash** ✅ |
| 6380 | Redis | NODIR_HDD_FIXER ⛔ |
| 6381 | Redis | **SmartWash** ✅ |

---

## 📞 Контакты

- **GitHub:** https://github.com/SNurali/JPG-Style-SW
- **Разработчик:** @SNurali
- **Telegram:** @JPGSTYLE_SMARTWASH
