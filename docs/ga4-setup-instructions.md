# Google Analytics 4 + Search Console — smartwash.uz

## Статус разработки

| Компонент | Статус |
|-----------|--------|
| GA4 скрипт в layout.tsx | Готов, читает `NEXT_PUBLIC_GA_ID` |
| lib/analytics.ts | Готов — view_item, add_to_cart, begin_checkout, purchase |
| ProductPageClient.tsx | view_item + add_to_cart добавлены |
| checkout/page.tsx | begin_checkout + purchase добавлены |
| robots.ts | sitemap URL корректный (`https://smartwash.uz/sitemap.xml`) |
| sitemap.ts | URL корректный (base = `https://smartwash.uz`) |
| Search Console верификация | НЕТ — нужно добавить |

---

## Шаг 1 — Создать GA4 Property (руками Нурали)

1. Открыть https://analytics.google.com/
2. Войти в Google-аккаунт (тот же, что для Play Console)
3. Админ (шестерёнка слева внизу) → **Создать ресурс** (Create Property)
4. Заполнить:
   - Имя ресурса: `JPG Style SmartWash`
   - Часовой пояс: `Tashkent (GMT+5)`
   - Валюта: `Uzbekistani Som (UZS)`
5. Выбрать бизнес-параметры (отрасль: Retail, размер: Small)
6. Цель: Generate leads, Sell products online
7. Создать → выбрать платформу: **Веб**
8. Настройка потока данных:
   - URL сайта: `https://smartwash.uz`
   - Имя потока: `SmartWash Web`
9. **Скопировать Measurement ID** — будет вида `G-XXXXXXXXXX`

---

## Шаг 2 — Добавить Measurement ID в проект

### 2.1 Файл окружения

Создать (или дополнить) файл:

```
~/jpg-style-smartwash/apps/web/.env.local
```

Добавить строку:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Заменить `G-XXXXXXXXXX` на реальный Measurement ID из Шага 1.

### 2.2 Production (.env.production)

Для Docker/Cloudflare deployment добавить переменную в окружение контейнера:

```yaml
# docker-compose.prod.yml — сервис web
environment:
  - NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Или задать в Cloudflare Pages/Workers environment variables.

---

## Шаг 3 — Добавить Search Console верификацию

### 3.1 Зарегистрировать сайт

1. Открыть https://search.google.com/search-console
2. Нажать **Добавить ресурс** → выбрать **Префикс URL**
3. Ввести: `https://smartwash.uz`
4. Выбрать способ верификации: **HTML-тег**

Google покажет тег вида:

```html
<meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXX" />
```

### 3.2 Добавить тег в код

Открыть файл:

```
~/jpg-style-smartwash/apps/web/app/layout.tsx
```

В блок `export const metadata: Metadata` добавить поле `verification`:

```typescript
export const metadata: Metadata = {
  // ... существующие поля ...
  verification: {
    google: 'XXXXXXXXXXXXXXXXXXXXXX',  // ← вставить content из Шага 3.1
  },
};
```

Пример после добавления (строка ~13):

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://smartwash.uz'),
  title: {
    default: 'JPG Style SmartWash — Профессиональная автохимия премиум-класса | Ташкент',
    template: '%s | JPG Style SmartWash',
  },
  verification: {
    google: 'XXXXXXXXXXXXXXXXXXXXXX',  // ← ваш код
  },
  // ... остальное без изменений ...
};
```

Next.js App Router автоматически рендерит `<meta name="google-site-verification">` из поля `verification.google`.

### 3.3 Деплой и подтверждение

1. Закоммитить и задеплоить изменения
2. Вернуться в Search Console → нажать **Подтвердить**
3. Если верификация не проходит сразу — подождать 5–10 минут (Cloudflare кэш)

---

## Шаг 4 — Настроить GA4 E-commerce события

### Какие события уже встроены

| Событие | Где | Когда |
|---------|-----|-------|
| `page_view` | layout.tsx (автоматически) | Каждый переход между страницами |
| `view_item` | ProductPageClient.tsx | Открытие страницы товара |
| `add_to_cart` | ProductPageClient.tsx | Нажатие «В корзину» или «Купить сейчас» |
| `begin_checkout` | checkout/page.tsx | Переход на страницу оформления заказа |
| `purchase` | checkout/page.tsx | Успешное оформление заказа |

### Какие события включить в GA4 (Enhanced Measurement)

В GA4 Админ → Потоки данных → SmartWash Web → Настройки расширенных измерений:

Убедиться что включены:
- [x] Просмотры страниц (page_view)
- [x] Прокрутка (scroll)
- [x] Исходящие клики (outbound_click)
- [x] Поиск по сайту (site_search) — если есть поиск на сайте
- [x] Взаимодействие с формами (form_interaction)

### Какие события настроить вручную в GA4

Все кастомные e-commerce события (view_item, add_to_cart, begin_checkout, purchase) GA4 распознаёт автоматически — они входят в стандартный e-commerce набор GA4. **Отдельная регистрация не нужна.**

Через 24–48 часов после первого посещения с реальными событиями они появятся в отчётах:
- Монетизация → Электронная торговля → Покупки
- Монетизация → Электронная торговля → Просмотр товара и т.д.

---

## Шаг 5 — Проверить работу

### 5.1 Realtime

1. Открыть сайт smartwash.uz в браузере
2. В GA4: Отчёты → Реальное время (Realtime)
3. Должен появиться 1 активный пользователь
4. Кликнуть на товар → в событиях должен появиться `view_item`
5. Добавить в корзину → `add_to_cart`
6. Перейти к оформлению → `begin_checkout`

### 5.2 Google Tag Assistant

1. Открыть https://tagassistant.google.com/
2. Ввести `https://smartwash.uz`
3. Проверить что GA4 тег загружается и отправляет hits

### 5.3 Search Console

После верификации:
1. Отправить sitemap: Файлы Sitemap → Добавить → `https://smartwash.uz/sitemap.xml`
2. Через 2–7 дней появятся данные об индексации и поисковых запросах

---

## Структура файлов (изменения)

```
~/jpg-style-smartwash/apps/web/
  .env.local                          ← ДОБАВИТЬ (NEXT_PUBLIC_GA_ID)
  app/
    layout.tsx                        ← ИЗМЕНЁН (Script + GA4)
    sitemap.ts                        ← OK (URL корректный)
    robots.ts                         ← OK (sitemap URL корректный)
    checkout/
      page.tsx                        ← ИЗМЕНЁН (begin_checkout + purchase)
    products/[slug]/
      ProductPageClient.tsx           ← ИЗМЕНЁН (view_item + add_to_cart)
  lib/
    analytics.ts                      ← НОВЫЙ ФАЙЛ (утилиты GA4)
```

---

## Troubleshooting

**GA4 не показывает данные:**
- Проверить что `NEXT_PUBLIC_GA_ID` задан (Next.js подставляет только `NEXT_PUBLIC_*` переменные в клиентский бандл)
- Проверить что значение не пустое (`echo $NEXT_PUBLIC_GA_ID` в контейнере)
- Проверить AdBlock — отключить его для тестирования

**Search Console не верифицирует:**
- Убедиться что `verification.google` в metadata содержит ТОЛЬКО значение `content` (без `<meta>` тега целиком)
- Cloudflare кэш может задерживать — Purge Cache в Cloudflare Dashboard

**E-commerce отчёты пустые:**
- GA4 собирает e-commerce данные в отчётах с задержкой 24–48 часов
- Проверить через Realtime → Events что события летят
- Включить debug mode: в URL добавить `?gtm_debug=true` — события покажутся в GA4 DebugView
