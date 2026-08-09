# HANDOFF — добить Google OAuth для «Входа через Google» (SmartWash)

**Статус:** клиентская авторизация собрана (ветка `feat/customer-auth`, коммит 6c1fd2b, не задеплоена). Email/пароль + кабинет работают. Осталось добыть Google OAuth-ключ + задеплоить.

## Контекст после перезапуска Claude Code

- В `~/.claude.json` УБРАН флаг `--headless` у Playwright MCP → браузер агентов теперь **видимый** (был невидимый — Нурали не мог войти на хэндофф-логине). Применяется после рестарта.

## Задача RICK ROSS (после рестарта, видимый браузер)

Создать **Google OAuth 2.0 Client (Web application)** в Google Cloud Console (аккаунт snurali1986@gmail.com):

1. Открыть console.cloud.google.com → войти (ХЭНДОФФ: пароль/2FA — руки Нурали, браузер теперь видно).
2. Создать проект «SmartWash».
3. APIs & Services → OAuth consent screen → External → имя «SmartWash», support email snurali1986@gmail.com.
4. Credentials → Create Credentials → OAuth client ID → **Web application** «SmartWash Web».
5. **Authorized JavaScript origins:** `https://smartwash.uz`, `https://www.smartwash.uz`, `http://localhost:3010`
6. **Authorized redirect URIs:** `https://smartwash.uz`, `https://www.smartwash.uz`
7. Получить Client ID + Secret.

## Куда сохранить ключи

**Файл:** `~/jpg-style-smartwash/.env.google` (уже создан, 600, в .gitignore):

```
GOOGLE_CLIENT_ID=<сюда>
GOOGLE_CLIENT_SECRET=<сюда>
```

Client ID — не секрет (можно в чат). Secret — только в файл.

## После получения ключей (деплой — делает оркестратор/50 CENT)

Ветка `feat/customer-auth` на сервер 172.16.252.32 (Docker, /home/yoyo/jpg-style-smartwash):

1. Подтянуть ветку, `npm install`.
2. В прод-`.env`: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`; для web build — `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (= тот же Client ID, build-time!).
3. Пересобрать docker-образы **api + web**, поднять. Миграция `customers` применится сама (runMigrations при старте API).
4. Проверить: /register, /login, /account, кнопка Google на smartwash.uz.
