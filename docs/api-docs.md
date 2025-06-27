# 📘 Документация API

## 🔧 Общая информация

* 📍 Базовый URL: `http://localhost:6666`
* 📦 Формат: JSON
* 📑 Кодировка: UTF-8
* 📁 Заголовок `Content-Type: application/json` обязателен

## 🔐 Аутентификация JWT

* Все защищённые маршруты требуют `accessToken` в заголовке:

  ```http
  Authorization: Bearer <accessToken>
  ```
* При входе и обновлении токена также устанавливается `refreshToken` в Cookie

---

## 🔽 Эндпоинты

### 📥 Регистрация пользователя

`POST /api/auth/register`

#### 🔸 Тело запроса

```json
{
  "username": "ИванИванов",
  "email": "ivan@example.com",
  "password": "MySecurePassword123"
}
```

#### 🔹 Ответ

* `201 Created`

```json
{
  "message": "Регистрация успешна"
}
```

* `400 Bad Request`

```json
{
  "message": "Такой email уже зарегистрирован"
}
```

---

### 🔐 Вход (Login)

`POST /api/auth/login`

#### 🔸 Тело запроса

```json
{
  "email": "ivan@example.com",
  "password": "MySecurePassword123"
}
```

#### 🔹 Ответ

* `200 OK`

```json
{
  "accessToken": "...jwt..."
}
```

* Устанавливает `refreshToken` в `HttpOnly` cookie

* `401 Unauthorized`

```json
{
  "message": "Неверный пароль"
}
```

---

### ♻️ Обновление access токена

`POST /api/auth/refresh`

🔸 Без тела запроса. Используется cookie с `refreshToken`.

#### 🔹 Ответ

```json
{
  "accessToken": "...новый jwt..."
}
```

* `401/403` — если токен отсутствует или недействителен

---

### 🚪 Выход (Logout)

`POST /api/auth/logout`

#### 🔹 Ответ

* `204 No Content` — сессия завершена, токен сброшен

---

## 📑 Ошибки

| Код | Значение              | Описание                          |
| --- | --------------------- | --------------------------------- |
| 400 | Bad Request           | Неверный формат или поля          |
| 401 | Unauthorized          | Нет доступа / неправильный пароль |
| 403 | Forbidden             | Токен недействителен              |
| 500 | Internal Server Error | Внутренняя ошибка сервера         |

---

## 🔄 Пример последовательности

1. `POST /register` — зарегистрировать пользователя
2. `POST /login` — получить `accessToken` и `refreshToken`
3. Использовать `accessToken` для доступа к API
4. При истечении `accessToken`, вызвать `/refresh`
5. При выходе — `/logout`

---

## 🛠 Дополнительно

* JWT генерируются через `jsonwebtoken`
* refresh токены хранятся в БД (поле `refresh_token`)
* Пароли хешируются через `bcryptjs`
* Логирование — `pino`

---

## 🧪 Тестирование

* Рекомендуется использовать **Postman** или **curl**
* Также доступен скрипт `testRegister.js` для генерации тестовых пользователей

---

## 📎 Версия

**Текущая версия:** `1.0.0`

> Документация обновлена: 2025-06-27
