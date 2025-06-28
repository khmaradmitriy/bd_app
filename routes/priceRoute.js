const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceItemsController');
const auth = require('../middleware/authMiddleware')

// Защищаем все маршруты:
router.use(auth);

// Получить все позиции прайса
router.get('/', priceController.getAll);

// Получить одну позицию по ID
router.get('/:id', priceController.getById);

// Создать новую позицию
router.post('/', priceController.create);

// Обновить существующую позицию
router.put('/:id', priceController.update);

// Удалить позицию
router.delete('/:id', priceController.remove);

module.exports = router;
