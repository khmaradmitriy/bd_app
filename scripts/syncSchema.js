require('dotenv').config();
const db = require('../config/db');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Загружаем все схемы
const schemaDir = path.join(__dirname, '../schema');
const schemaFiles = fs.readdirSync(schemaDir).filter(file => file.endsWith('.js'));

const loadSchemas = () =>
  schemaFiles.map(file => require(path.join(schemaDir, file)));

const normalizeType = (type) => type.toUpperCase().replace(/\s+/g, ' ').trim();

const checkAndSyncTable = async ({ tableName, fields }) => {
  try {
    const [tables] = await db.query(`SHOW TABLES LIKE ?`, [tableName]);

    if (tables.length === 0) {
      logger.warn(`📦 Таблица "${tableName}" не найдена. Создаю...`);
      const columns = Object.entries(fields)
        .map(([name, type]) => `\`${name}\` ${type}`)
        .join(', ');

      await db.query(`CREATE TABLE \`${tableName}\` (${columns})`);
      logger.info(`✅ Таблица "${tableName}" успешно создана.`);
      return;
    }

    logger.info(`🔍 Проверяю структуру таблицы "${tableName}"...`);
    const [columns] = await db.query(`SHOW COLUMNS FROM \`${tableName}\``);
    const existingColumns = columns.reduce((acc, col) => {
      acc[col.Field] = {
        type: normalizeType(col.Type),
        raw: col
      };
      return acc;
    }, {});

    for (const [field, definedType] of Object.entries(fields)) {
      const normalizedDefinedType = normalizeType(definedType);
      if (!existingColumns.hasOwnProperty(field)) {
        logger.warn(`➕ Поле "${field}" отсутствует. Добавляю...`);
        await db.query(`ALTER TABLE \`${tableName}\` ADD \`${field}\` ${definedType}`);
        logger.info(`✅ Добавлено поле "${field}" в таблицу "${tableName}"`);
      } else {
        const existingType = existingColumns[field].type;
        if (
          existingType !== normalizedDefinedType &&
          !normalizedDefinedType.includes('PRIMARY KEY')
        ) {
          logger.warn(`✏️ Тип поля "${field}" отличается (ожидается ${normalizedDefinedType}, найдено ${existingType}). Обновляю...`);
          await db.query(`ALTER TABLE \`${tableName}\` MODIFY \`${field}\` ${definedType}`);
          logger.info(`🔁 Поле "${field}" обновлено до типа ${definedType}`);
        } else {
          logger.info(`✔️ Поле "${field}" соответствует.`);
        }
      }
    }

    logger.info(`✅ Таблица "${tableName}" в актуальном состоянии.`);
  } catch (err) {
    logger.error(`❌ Ошибка проверки таблицы "${tableName}": ${err.message}`);
    console.error(err.stack);
  }
};

(async () => {
  const schemas = loadSchemas();

  for (const schema of schemas) {
    await checkAndSyncTable(schema);
  }

  process.exit();
})();
