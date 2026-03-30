# 🚀 Деплой JPG Style SmartWash

Быстрый гайд по развёртыванию проекта на VPS сервер.

## ⚡ Быстрый старт

### Вариант 1: Автоматический деплой (рекомендуется)

```bash
# На локальной машине
git push origin main

# GitHub Actions автоматически:
# 1. Запустит тесты
# 2. Подключится к серверу
# 3. Обновит код
# 4. Пересоберёт контейнеры
# 5. Проверит здоровье сервисов
```

**Требуется:** Добавить секреты в GitHub (см. ниже)

### Вариант 2: Ручной деплой через скрипт

```bash
# На локальной машине
./deploy.sh deploy 172.16.252.32 yoyo
```

### Вариант 3: Полная ручная настройка

```bash
# На сервере (первый раз)
sudo bash setup-production.sh

# Или вручную
ssh yoyo@172.16.252.32
cd /home/yoyo/jpg-style-smartwash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🔐 Настройка GitHub Actions

### Шаг 1: Сгенерировать SSH ключ

```bash
ssh-keygen -t ed25519 -f ~/.ssh/deploy_key -N ""
```

### Шаг 2: Добавить публичный ключ на сервер

```bash
ssh-copy-id -i ~/.ssh/deploy_key.pub yoyo@172.16.252.32
```

### Шаг 3: Добавить секреты в GitHub

Перейти в **Settings → Secrets and variables → Actions** и добавить:

| Название | Значение |
|----------|----------|
| `VPS_IP` | `172.16.252.32` |
| `VPS_USER` | `yoyo` |
| `VPS_SSH_KEY` | Содержимое `~/.ssh/deploy_key` |

---

## 📦 Структура файлов деплоя

```
├── deploy.sh                      # Скрипт для ручного деплоя
├── setup-production.sh            # Скрипт первичной настройки
├── docker-compose.prod.yml        # Production конфиг Docker
├── DEPLOYMENT_GUIDE_FULL.md       # Полное руководство
├── DEPLOY_SMARTWASH.md            # Оригинальная инструкция
└── .github/workflows/
    └── deploy.yml                 # GitHub Actions workflow
```

---

## 🛠️ Полезные команды

### Деплой

```bash
# Автоматический деплой
./deploy.sh deploy 172.16.252.32 yoyo

# Просмотр логов
./deploy.sh logs 172.16.252.32 yoyo api
./deploy.sh logs 172.16.252.32 yoyo web

# Проверка статуса
./deploy.sh status 172.16.252.32 yoyo

# Откат на предыдущую версию
./deploy.sh rollback 172.16.252.32 yoyo
```

### На сервере

```bash
# Статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Логи
docker compose -f docker-compose.prod.yml logs -f api

# Перезагрузка
docker compose -f docker-compose.prod.yml restart

# Остановка
docker compose -f docker-compose.prod.yml down

# Пересборка
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Информация о сервере

| Параметр | Значение |
|----------|----------|
| **IP адрес** | `195.158.24.137` |
| **WireGuard IP** | `172.16.252.32` |
| **SSH User** | `yoyo` |
| **Frontend** | http://195.158.24.137:3000 |
| **API** | http://195.158.24.137:4000 |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |

---

## 🔍 Мониторинг

### Проверка здоровья

```bash
# Frontend
curl http://195.158.24.137:3000

# API
curl http://195.158.24.137:4000/health

# PostgreSQL
docker exec smartwash_postgres psql -U smartwash -d smartwash_db -c "SELECT 1"

# Redis
docker exec smartwash_redis redis-cli ping
```

### Использование ресурсов

```bash
docker stats smartwash_web smartwash_api smartwash_postgres smartwash_redis
```

---

## 🆘 Troubleshooting

### Контейнеры не запускаются

```bash
# Проверить логи
docker compose -f docker-compose.prod.yml logs

# Пересобрать
docker compose -f docker-compose.prod.yml up -d --build

# Очистить и пересобрать
docker system prune -a
docker compose -f docker-compose.prod.yml up -d --build
```

### Ошибка подключения к БД

```bash
# Перезагрузить PostgreSQL
docker compose -f docker-compose.prod.yml restart postgres

# Проверить логи БД
docker compose -f docker-compose.prod.yml logs postgres
```

### Недостаточно места

```bash
# Очистить Docker
docker system prune -a --volumes

# Проверить место
df -h
```

---

## 📚 Документация

- **Полное руководство:** [DEPLOYMENT_GUIDE_FULL.md](./DEPLOYMENT_GUIDE_FULL.md)
- **Оригинальная инструкция:** [DEPLOY_SMARTWASH.md](./DEPLOY_SMARTWASH.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🔄 Процесс обновления

### Автоматический (рекомендуется)

```bash
git add .
git commit -m "feat: new feature"
git push origin main
# GitHub Actions автоматически развернёт изменения
```

### Ручной

```bash
ssh yoyo@172.16.252.32
cd /home/yoyo/jpg-style-smartwash
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📞 Контакты

- **GitHub:** https://github.com/SNurali/JPG-Style-SW
- **Issues:** https://github.com/SNurali/JPG-Style-SW/issues
- **Email:** support@jpgstyle.com

---

**Последнее обновление:** 2026-03-30
