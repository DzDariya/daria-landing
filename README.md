# Дарья Иванова — дизайнер без шаблонов

Лендинг студии дизайна интерьера. Верстка на HTML/CSS/JS без сборщиков.

## Состав сайта

- `index.html` — разметка и тексты
- `styles.css` — стили, адаптив, анимации
- `script.js` — галереи, мобильное меню, форма заявки
- `assets/` — оптимизированные изображения (WebP) и логотип
- `server.mjs` — локальный сервер и отправка заявок в Telegram
- `config.json` — токен бота и chat ID (**не загружать в GitHub**)
- `.gitignore` — исключает секреты и исходники из репозитория

## Запуск локально

```bash
node server.mjs
```

Откройте http://localhost:3000

## Внимание

`config.json` содержит токен Telegram-бота. Если загрузить его в публичный репозиторий, ботом сможет пользоваться кто угодно. Файл добавлен в `.gitignore`.

GitHub Pages умеет отдавать только статические файлы — `server.mjs` там не запустится, и форма не будет отправлять заявки.

## Публикация на Netlify

1. Загрузите в репозиторий: `index.html`, `styles.css`, `script.js`, `assets/`, `netlify.toml`, `netlify/functions/request.mjs`, `.gitignore`, `README.md`.
2. В Netlify: **Add new site → Import an existing project** → выберите репозиторий `daria-landing`. Настройки возьмутся из `netlify.toml`.
3. В **Site settings → Environment variables** добавьте:
   - `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather
   - `TELEGRAM_CHAT_ID` — ваш chat ID
4. Нажмите **Deploy**. Готово: форма будет отправлять заявки в Telegram через `/.netlify/functions/request`.

Секреты хранятся в переменных окружения Netlify, а не в коде. `config.json` нужен только для локального запуска.
