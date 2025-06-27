const app = require('./app');
const logger = require('./utils/logger');
const db = require('./config/db'); // 👈 Добавляем импорт подключения к БД

const port = process.env.PORT || 5000;

(async () => {
  try {
    await db.query('SELECT 1'); // 👈 Пробуем подключиться к БД
    logger.info('✅ Подключение к MySQL установлено');
    
    app.listen(port, () => {
      logger.info(`🚀 Сервер запущен на http://localhost:${port}`);
    });
  } catch (err) {
    logger.error(`❌ Не удалось подключиться к БД: ${err.message}`);
    process.exit(1); // Останавливаем запуск сервера
  }
})();