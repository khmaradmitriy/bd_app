# 🛡️ Auth API Server

Node.js-приложение для регистрации, авторизации и работы с JWT + Refresh токенами.

## 🚀 Возможности

* Регистрация пользователей
* Аутентификация через email и пароль
* Генерация access/refresh токенов
* Обновление access токена
* Выход пользователя (удаление refresh токена)
* Логирование через `pino`
* Автосинхронизация структуры БД

## 📦 Стек

* Node.js + Express
* MySQL + mysql2/promise
* JWT (`jsonwebtoken`)
* Хеширование: `bcryptjs`
* Логирование: `pino`, `pino-pretty`
* Генерация фейковых данных: `@faker-js/faker`

## ⚙️ Установка

```bash
npm install
```

Создай `.env` на основе `.env.example`:

```env
PORT=6666
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
JWT_SECRET=...    # Обязательно для генерации токенов
REFRESH_SECRET=... # Отдельно от основного
```

## 🧪 Скрипты

```bash
npm run dev            # Запуск сервера с логами
npm run sync:schema    # Синхронизация схемы БД
npm run test:register  # Генерация тестовых пользователей
npm run release        # Автообновление версии + changelog
```

## 📘 API-документация

Полная документация всех эндпоинтов:

🔗 [docs/api-docs.md](docs/api-docs.md)

## 🧱 Структура

```
server/
├── config/         # Настройки БД
├── controllers/    # authController.js
├── middleware/     # authMiddleware.js (будет позже)
├── routes/         # auth.js
├── schema/         # Схемы таблиц
├── scripts/        # testRegister, syncSchema
├── utils/          # logger.js, jwt.js
├── .env
├── package.json
```

## 📌 Версия

**Текущая:** 1.0.0

## 🧠 Автор

khmaradmitriy (и ты 🙂)

---

> Документация и проект находятся в активной разработке. Следи за обновлениями!


## Версия: 1.1.0

### Что нового:
- Добавлены материалы и работы по электромонтажу
- Защита API-маршрутов через JWT
- Улучшена регистрация/логин/refresh токены
- Импорт позиций в прайс из скрипта