const db = require('../config/db');
const logger = require('../utils/logger');

// Получить все позиции прайса
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM price_items');
    res.json(rows);
  } catch (err) {
    logger.error(`❌ Ошибка при получении прайса: ${err.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Получить одну позицию по ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM price_items WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Позиция не найдена' });
    res.json(rows[0]);
  } catch (err) {
    logger.error(`❌ Ошибка получения позиции: ${err.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Создать новую позицию
exports.create = async (req, res) => {
  const { name, unit, price, category } = req.body;
  if (!name || price == null) return res.status(400).json({ message: 'Имя и цена обязательны' });

  try {
    const [result] = await db.query(
      'INSERT INTO price_items (name, unit, price, category) VALUES (?, ?, ?, ?)',
      [name, unit, price, category]
    );
    logger.info(`✅ Добавлена позиция в прайс: ${name}`);
    res.status(201).json({ id: result.insertId, name, unit, price, category });
  } catch (err) {
    logger.error(`❌ Ошибка добавления позиции: ${err.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить позицию
exports.update = async (req, res) => {
  const { name, unit, price, category } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE price_items SET name = ?, unit = ?, price = ?, category = ? WHERE id = ?',
      [name, unit, price, category, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Позиция не найдена' });
    logger.info(`✏️ Обновлена позиция ID=${req.params.id}`);
    res.json({ id: req.params.id, name, unit, price, category });
  } catch (err) {
    logger.error(`❌ Ошибка обновления позиции: ${err.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Удалить позицию
exports.remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM price_items WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Позиция не найдена' });
    logger.info(`🗑️ Удалена позиция ID=${req.params.id}`);
    res.sendStatus(204);
  } catch (err) {
    logger.error(`❌ Ошибка удаления позиции: ${err.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
