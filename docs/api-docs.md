# 📘 API Документация

## 🔧 Общая информация

- **Базовый URL:** `http://localhost:6666`  
- **Формат:** JSON  
- **Кодировка:** UTF-8  
- **Заголовок:** `Content-Type: application/json` (обязателен)

## 🔐 Аутентификация

Все защищённые маршруты требуют JWT `accessToken` в заголовке:

```http
Authorization: Bearer <accessToken>
При входе и обновлении токена также устанавливается refreshToken в HttpOnly cookie.

🧾 Эндпоинты
📥 Регистрация пользователя
POST /api/auth/register

🔸 Тело запроса
json
Копировать
Редактировать
{
  "username": "ИванИванов",
  "email": "ivan@example.com",
  "password": "MySecurePassword123"
}
🔹 Ответы
201 Created

json
Копировать
Редактировать
{
  "message": "Регистрация успешна"
}
400 Bad Request

json
Копировать
Редактировать
{
  "message": "Такой email уже зарегистрирован"
}
🔐 Вход (Login)
POST /api/auth/login

🔸 Тело запроса
json
Копировать
Редактировать
{
  "email": "ivan@example.com",
  "password": "MySecurePassword123"
}
🔹 Ответы
200 OK

json
Копировать
Редактировать
{
  "accessToken": "...jwt..."
}
Также устанавливается refreshToken в HttpOnly cookie.

401 Unauthorized

json
Копировать
Редактировать
{
  "message": "Неверный пароль"
}
♻️ Обновление access токена
POST /api/auth/refresh

🔸 Тело запроса
Без тела. Используется refreshToken из cookie.

🔹 Ответы
200 OK

json
Копировать
Редактировать
{
  "accessToken": "...новый jwt..."
}
401 / 403 — токен отсутствует или недействителен

🚪 Выход (Logout)
POST /api/auth/logout

🔹 Ответ
204 No Content — токены удалены, сессия завершена

📦 Получить все позиции прайса
GET /api/price

🔹 Ответ
json
Копировать
Редактировать
[
  {
    "id": 1,
    "name": "Кабель NYM 3x2.5",
    "unit": "м",
    "price": 45,
    "category": "материалы"
  },
  {
    "id": 2,
    "name": "Установка розетки",
    "unit": "шт",
    "price": 250,
    "category": "работы"
  }
]
➕ Добавить позицию
POST /api/price

🔸 Тело запроса
json
Копировать
Редактировать
{
  "name": "Установка светильника",
  "unit": "шт",
  "price": 400,
  "category": "работы"
}
🔹 Ответ
json
Копировать
Редактировать
{
  "id": 3,
  "name": "Установка светильника",
  "unit": "шт",
  "price": 400,
  "category": "работы"
}
✏️ Обновить позицию
PUT /api/price/:id

🔸 Тело запроса
json
Копировать
Редактировать
{
  "name": "Монтаж гофры",
  "unit": "м",
  "price": 20,
  "category": "работы"
}
🔹 Ответ
json
Копировать
Редактировать
{
  "message": "Обновлено"
}
🧹 Удалить позицию
DELETE /api/price/:id

🔹 Ответ
json
Копировать
Редактировать
{
  "message": "Удалено"
}
❗ Ошибки
Код	Название	Описание
400	Bad Request	Неверный формат запроса или поля
401	Unauthorized	Неверный пароль или нет доступа
403	Forbidden	Токен недействителен
500	Internal Server Error	Внутренняя ошибка сервера

🔄 Пример последовательности использования
POST /api/auth/register — регистрация пользователя

POST /api/auth/login — получение accessToken и refreshToken

Использование accessToken для доступа к защищённым маршрутам

Обновление accessToken через POST /api/auth/refresh

Выход через POST /api/auth/logout


📦 Получить все позиции прайса
GET /api/price

Ответ:

json
Копировать
Редактировать
[
  {
    "id": 1,
    "name": "Кабель NYM 3x2.5",
    "unit": "м",
    "price": 45,
    "category": "материалы"
  },
  {
    "id": 2,
    "name": "Установка розетки",
    "unit": "шт",
    "price": 250,
    "category": "работы"
  }
]
➕ Добавить позицию
POST /api/price

Тело запроса:

json
Копировать
Редактировать
{
  "name": "Установка светильника",
  "unit": "шт",
  "price": 400,
  "category": "работы"
}
Ответ:

json
Копировать
Редактировать
{
  "id": 3,
  "name": "Установка светильника",
  "unit": "шт",
  "price": 400,
  "category": "работы"
}
🧹 Удалить позицию
DELETE /api/price/:id

Ответ:

json
Копировать
Редактировать
{
  "message": "Удалено"
}
✏️ Обновить позицию
PUT /api/price/:id

Тело запроса:

json
Копировать
Редактировать
{
  "name": "Монтаж гофры",
  "unit": "м",
  "price": 20,
  "category": "работы"
}
Ответ:

json
Копировать
Редактировать
{
  "message": "Обновлено"
}


🛠 Технические детали
JWT: генерируются через jsonwebtoken

Refresh токены: хранятся в БД (refresh_token)

Пароли: хешируются с использованием bcryptjs

Логирование: через pino

🧪 Тестирование
Рекомендуется использовать Postman или curl

В наличии скрипт: testRegister.js — для генерации тестовых пользователей

📎 Версия
Текущая версия: 1.0.0
Обновлено: 2025-06-27