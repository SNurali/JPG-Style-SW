# 🤖 Инструкция для AI агента - Деплой JPG Style SmartWash

## Быстрый старт для агента

Если ты AI агент (например, Антигравити) и хочешь развернуть проект на VPS, следуй этим инструкциям.

---

## 📋 Что нужно знать

### Информация о сервере
```
IP адрес (WireGuard):  172.16.252.32
Внешний IP:            195.158.24.137
SSH User:              yoyo
Проект:                /home/yoyo/jpg-style-smartwash/
ОС:                    Ubuntu (Docker + Nginx установлены)
```

### Доступные скрипты

| Скрипт | Назначение |
|--------|-----------|
| `quick-deploy.sh` | Интерактивный деплой (рекомендуется для агента) |
| `deploy.sh` | Продвинутый деплой с логами и откатом |
| `setup-production.sh` | Первичная настройка production окружения |

---

## 🚀 Способ 1: Интерактивный деплой (РЕКОМЕНДУЕТСЯ)

```bash
# На локальной машине
./quick-deploy.sh 172.16.252.32 yoyo

# Выбрать режим:
# 1) Первичная настройка (первый раз)
# 2) Обновление и деплой (уже установлено)
# 3) Только обновление кода
# 4) Проверка статуса
# 5) Просмотр логов
```

**Преимущества:**
- Интерактивный выбор режима
- Автоматическая проверка SSH доступа
- Красивый вывод с цветами
- Проверка здоровья сервисов

---

## 🔧 Способ 2: Прямое подключение и деплой

### Шаг 1: Подключиться к серверу
```bash
ssh yoyo@172.16.252.32
```

### Шаг 2: Первичная настройка (если первый раз)
```bash
cd /home/yoyo
git clone https://github.com/SNurali/JPG-Style-SW.git jpg-style-smartwash
cd jpg-style-smartwash
sudo bash setup-production.sh
```

### Шаг 3: Обновление и деплой (если уже установлено)
```bash
cd /home/yoyo/jpg-style-smartwash
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
sleep 30
docker compose -f docker-compose.prod.yml ps
```

---

## ✅ Проверка после деплоя

```bash
# Frontend
curl http://195.158.24.137:3000

# API
curl http://195.158.24.137:4000/health

# PostgreSQL
docker exec smartwash_postgres psql -U smartwash -d smartwash_db -c "SELECT 1"

# Redis
docker exec smartwash_redis redis-cli ping

# Все контейнеры
docker compose -f docker-compose.prod.yml ps
```

**Ожидаемый результат:**
```
NAME                 STATUS
smartwash_web        Up (healthy)
smartwash_api        Up (healthy)
smartwash_postgres   Up (healthy)
smartwash_redis      Up (healthy)
```

---

## 🔍 Мониторинг и логирование

### Просмотр логов
```bash
# Все логи
docker compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
docker compose -f docker-compose.prod.yml logs -f api
docker compose -f docker-compose.prod.yml logs -f web

# Последние 100 строк
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

### Использование ресурсов
```bash
docker stats smartwash_web smartwash_api smartwash_postgres smartwash_redis
```

### Статус контейнеров
```bash
docker compose -f docker-compose.prod.yml ps
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

### Откат на предыдущую версию
```bash
cd /home/yoyo/jpg-style-smartwash

# Посмотреть историю
git log --oneline -5

# Откатить
git reset --hard <commit_hash>

# Пересобрать
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Информация о портах

| Порт | Сервис | Статус |
|------|--------|--------|
| 3000 | Frontend | ✅ SmartWash |
| 4000 | API | ✅ SmartWash |
| 5432 | PostgreSQL | ✅ SmartWash |
| 6379 | Redis | ✅ SmartWash |

---

## 🔐 Безопасность

### Переменные окружения
- Все секреты хранятся в `.env.prod`
- Пароли генерируются автоматически через `openssl`
- Файл `.env.prod` не в git (в `.gitignore`)

### SSH доступ
- Используется SSH ключ для подключения
- Пароли не используются

### Docker
- Контейнеры запускаются с ограничениями ресурсов
- Healthchecks для автоматического перезапуска
- Volumes для персистентных данных

---

## 📚 Полная документация

Для более подробной информации смотри:
- `DEPLOYMENT_GUIDE_FULL.md` - полное руководство (15+ страниц)
- `DEPLOYMENT_CHECKLIST.md` - чек-лист перед деплоем
- `DEPLOY_README.md` - быстрый старт
- `AI_AGENT_DEPLOYMENT_PROMPT.md` - промт для AI агента

---

## 🎯 Типичный сценарий для агента

```bash
# 1. Проверить SSH доступ
ssh yoyo@172.16.252.32 "echo 'SSH OK'"

# 2. Клонировать репозиторий (если первый раз)
ssh yoyo@172.16.252.32 "cd /home/yoyo && git clone https://github.com/SNurali/JPG-Style-SW.git jpg-style-smartwash"

# 3. Запустить первичную настройку
ssh yoyo@172.16.252.32 "cd /home/yoyo/jpg-style-smartwash && sudo bash setup-production.sh"

# 4. Проверить статус
ssh yoyo@172.16.252.32 "docker compose -f /home/yoyo/jpg-style-smartwash/docker-compose.prod.yml ps"

# 5. Проверить здоровье сервисов
ssh yoyo@172.16.252.32 "curl -s http://localhost:3000 > /dev/null && echo 'Frontend OK' || echo 'Frontend FAIL'"
ssh yoyo@172.16.252.32 "curl -s http://localhost:4000/health > /dev/null && echo 'API OK' || echo 'API FAIL'"
```

---

## 💡 Советы для агента

1. **Всегда проверяй SSH доступ перед деплоем**
   ```bash
   ssh -o ConnectTimeout=5 yoyo@172.16.252.32 "echo 'OK'"
   ```

2. **Используй `set -e` в bash скриптах** - остановит выполнение при ошибке

3. **Проверяй логи после деплоя**
   ```bash
   docker compose -f docker-compose.prod.yml logs --tail=50
   ```

4. **Жди 30 секунд после запуска контейнеров**
   ```bash
   sleep 30
   ```

5. **Всегда проверяй здоровье сервисов**
   ```bash
   docker compose -f docker-compose.prod.yml ps
   ```

6. **Сохраняй логи для отладки**
   ```bash
   docker compose -f docker-compose.prod.yml logs > deployment.log
   ```

---

## 📞 Контакты

- **GitHub:** https://github.com/SNurali/JPG-Style-SW
- **Issues:** https://github.com/SNurali/JPG-Style-SW/issues
- **Email:** support@jpgstyle.com

---

**Версия:** 1.0  
**Дата:** 2026-03-30  
**Статус:** ✅ Готово к использованию
