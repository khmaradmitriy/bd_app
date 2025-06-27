require('dotenv').config();
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;
const USERS_COUNT = 10;
const DELAY_MS = 300;

const delay = ms => new Promise(res => setTimeout(res, ms));

// 📁 Создаём logs/ если не существует
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 🕒 Генерируем уникальное имя лог-файла
const timestamp = new Date().toISOString()
  .replace(/T/, '_')        // замена "T" на "_"
  .replace(/:/g, '-')        // замена ":" на "-"
  .replace(/\..+/, '');      // убираем миллисекунды

const logFilePath = path.join(logsDir, `test-register_${timestamp}.log`);
fs.writeFileSync(logFilePath, `🧪 Тест регистрации: ${new Date().toLocaleString()}\n\n`);

const users = Array.from({ length: USERS_COUNT }).map(() => ({
  username: faker.internet.username(),
  email: faker.internet.email(),
  password: faker.internet.password(10, true),
}));

const run = async () => {
  logger.info('🚀 Запуск тестовой регистрации пользователей...');

  for (const user of users) {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, user);
      const msg = `✅ ${user.email} зарегистрирован: ${res.data.message}`;
      logger.info(msg);
      fs.appendFileSync(logFilePath, msg + '\n');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      const msg = `❌ ${user.email} ошибка: ${errMsg}`;
      logger.warn(msg);
      fs.appendFileSync(logFilePath, msg + '\n');
    }

    await delay(DELAY_MS);
  }

  logger.info(`🏁 Тест завершён. Лог сохранён в: ${logFilePath}`);
  fs.appendFileSync(logFilePath, `\n🏁 Тест завершён\n`);
};

run();
