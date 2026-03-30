# ✅ Чек-лист деплоя JPG Style SmartWash

## 📋 Перед деплоем

### Локальная подготовка
- [ ] Все изменения закоммичены
- [ ] Тесты проходят: `npm run test`
- [ ] Линтинг чист: `npm run lint`
- [ ] Нет ошибок типов: `npm run build:api && npm run build:web`
- [ ] Версия обновлена в `package.json`
- [ ] CHANGELOG обновлён

### Код готов
- [ ] Нет console.log в production коде
- [ ] Нет TODO комментариев
- [ ] Все переменные окружения задокументированы
- [ ] Миграции БД готовы (если нужны)
- [ ] Нет hardcoded значений

### Безопасность
- [ ] Нет секретов в коде
- [ ] `.env.prod` не в git
- [ ] SSH ключи сгенерированы
- [ ] GitHub секреты добавлены
- [ ] Пароли БД сильные

---

## 🚀 Процесс деплоя

### Вариант 1: Автоматический (GitHub Actions)

```bash
# 1. Убедиться что всё готово (см. выше)
# 2. Запушить в main
git push origin main

# 3. Проверить статус в GitHub Actions
# Settings → Actions → Deploy to VPS

# 4. Дождаться завершения
# ✓ Lint passed
# ✓ Tests passed
# ✓ Build successful
# ✓ Deploy successful
```

**Время:** ~5-10 минут

### Вариант 2: Ручной деплой

```bash
# 1. Подключиться к серверу
ssh yoyo@172.16.252.32

# 2. Перейти в директорию проекта
cd /home/yoyo/jpg-style-smartwash

# 3. Обновить код
git pull origin main

# 4. Проверить .env.prod
cat .env.prod | head -5

# 5. Остановить старые контейнеры
docker compose -f docker-compose.prod.yml down

# 6. Пересобрать и запустить
docker compose -f docker-compose.prod.yml up -d --build

# 7. Ждать запуска (30 сек)
sleep 30

# 8. Проверить статус
docker compose -f docker-compose.prod.yml ps
```

**Время:** ~3-5 минут

---

## ✔️ Проверка после деплоя

### Здоровье сервисов

```bash
# Frontend
curl -s http://195.158.24.137:3000 | head -5
# Ожидаем: HTML страницу

# API
curl -s http://195.158.24.137:4000/health
# Ожидаем: {"status":"ok"}

# PostgreSQL
docker exec smartwash_postgres psql -U smartwash -d smartwash_db -c "SELECT 1"
# Ожидаем: (1 row)

# Redis
docker exec smartwash_redis redis-cli ping
# Ожидаем: PONG
```

### Статус контейнеров

```bash
docker compose -f docker-compose.prod.yml ps

# Ожидаем:
# NAME                 STATUS
# smartwash_web        Up (healthy)
# smartwash_api        Up (healthy)
# smartwash_postgres   Up (healthy)
# smartwash_redis      Up (healthy)
```

### Логи

```bash
# Проверить нет ошибок
docker compose -f docker-compose.prod.yml logs --tail=50

# Проверить конкретный сервис
docker compose -f docker-compose.prod.yml logs api | grep -i error
```

### Функциональность

- [ ] Главная страница загружается
- [ ] API отвечает на запросы
- [ ] Авторизация работает
- [ ] Создание заказов работает
- [ ] Загрузка файлов работает
- [ ] Нет ошибок в консоли браузера

---

## 🔄 Откат (если что-то пошло не так)

### Быстрый откат

```bash
# На сервере
cd /home/yoyo/jpg-style-smartwash

# Посмотреть историю
git log --oneline -5

# Откатить на предыдущий коммит
git reset --hard HEAD~1

# Пересобрать
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Откат через скрипт

```bash
./deploy.sh rollback 172.16.252.32 yoyo
```

### Восстановление БД

```bash
# Если есть бэкап
docker exec -i smartwash_postgres psql -U smartwash smartwash_db < backup.sql

# Если нет - перезагрузить контейнер
docker compose -f docker-compose.prod.yml restart postgres
```

---

## 📊 Мониторинг после деплоя

### Первые 5 минут

```bash
# Смотреть логи в реальном времени
docker compose -f docker-compose.prod.yml logs -f

# В отдельном терминале - проверить ресурсы
watch -n 1 'docker stats --no-stream'
```

### Первый час

- [ ] Нет критических ошибок в логах
- [ ] CPU использование < 50%
- [ ] Память использование < 70%
- [ ] Нет утечек памяти
- [ ] Все запросы обрабатываются

### Первый день

- [ ] Нет ошибок в логах
- [ ] Производительность стабильна
- [ ] Пользователи не жалуются
- [ ] Метрики в норме

---

## 🆘 Если что-то пошло не так

### Контейнер не запускается

```bash
# 1. Проверить логи
docker compose -f docker-compose.prod.yml logs api

# 2. Проверить .env.prod
cat .env.prod

# 3. Пересобрать
docker compose -f docker-compose.prod.yml up -d --build api

# 4. Если не помогло - откатить
git reset --hard HEAD~1
docker compose -f docker-compose.prod.yml up -d --build
```

### Ошибка подключения к БД

```bash
# 1. Проверить PostgreSQL
docker compose -f docker-compose.prod.yml ps postgres

# 2. Проверить логи БД
docker compose -f docker-compose.prod.yml logs postgres

# 3. Перезагрузить БД
docker compose -f docker-compose.prod.yml restart postgres

# 4. Проверить переменные окружения
docker exec smartwash_api env | grep DB_
```

### Высокое использование ресурсов

```bash
# 1. Проверить какой контейнер жрёт ресурсы
docker stats

# 2. Проверить логи
docker compose -f docker-compose.prod.yml logs <container>

# 3. Перезагрузить контейнер
docker compose -f docker-compose.prod.yml restart <container>

# 4. Если не помогло - откатить
git reset --hard HEAD~1
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📝 Документирование

После успешного деплоя:

- [ ] Обновить CHANGELOG
- [ ] Создать GitHub Release
- [ ] Отправить уведомление команде
- [ ] Задокументировать любые проблемы
- [ ] Обновить документацию если нужно

---

## 🎯 Финальная проверка

```bash
# Все ли работает?
echo "Frontend: $(curl -s -o /dev/null -w '%{http_code}' http://195.158.24.137:3000)"
echo "API: $(curl -s -o /dev/null -w '%{http_code}' http://195.158.24.137:4000/health)"
echo "DB: $(docker exec smartwash_postgres psql -U smartwash -d smartwash_db -c 'SELECT 1' 2>&1 | grep -c '1 row')"
echo "Redis: $(docker exec smartwash_redis redis-cli ping)"

# Все контейнеры здоровы?
docker compose -f docker-compose.prod.yml ps | grep -c "Up (healthy)"
```

---

## 📞 Контакты для помощи

- **GitHub Issues:** https://github.com/SNurali/JPG-Style-SW/issues
- **Slack:** #smartwash-deployment
- **Email:** devops@jpgstyle.com

---

**Дата последнего обновления:** 2026-03-30
**Версия:** 1.0
