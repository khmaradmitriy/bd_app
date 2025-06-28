require('dotenv').config();
const axios = require('axios');
const logger = require('../utils/logger');

// Указать accessToken вручную (или получать программно, если нужно)
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTc1MTA5MDgzNiwiZXhwIjoxNzUxMDkxNzM2fQ.WBdxf8TV8Lq_-w6YsZz0IZqqiSHUox5BjedGmH4q9nc';

const items = [
  // --- Материалы ---
  { name: "Кабель ВВГ-П 1x1.5 мм²", unit: "м", price: 18, category: "Электро-материалы" },
  { name: "Кабель ВВГнг 3x2.5 мм²", unit: "м", price: 45, category: "Электро-материалы" },
  { name: "Гофра ПВХ D25 мм (с протяжкой)", unit: "м", price: 10, category: "Электро-материалы" },
  { name: "Кабель-канал 40×16 мм (ПВХ)", unit: "м", price: 35, category: "Электро-материалы" },
  { name: "Металлорукав D32 мм", unit: "м", price: 90, category: "Электро-материалы" },
  { name: "Розетка Schneider Blanca 1-мест.", unit: "шт", price: 120, category: "Электро-установочные" },
  { name: "Выключатель одноклавишный Legrand", unit: "шт", price: 145, category: "Электро-установочные" },

  // --- Работы ---
  { name: "Монтаж розетки в бетон", unit: "шт", price: 250, category: "Электромонтажные работы" },
  { name: "Монтаж выключателя", unit: "шт", price: 230, category: "Электромонтажные работы" },
  { name: "Прокладка кабеля ВВГ-П 1x1.5", unit: "м", price: 40, category: "Электромонтажные работы" },
  { name: "Установка распаечной коробки", unit: "шт", price: 150, category: "Электромонтажные работы" },
  { name: "Штробление под кабель", unit: "м", price: 120, category: "Электромонтажные работы" },
  { name: "Монтаж автоматов в щит", unit: "шт", price: 200, category: "Электромонтажные работы" },
  { name: "Подключение УЗО", unit: "шт", price: 350, category: "Электромонтажные работы" },
];

const importItems = async () => {
  for (const item of items) {
    try {
      const response = await axios.post(
        `http://localhost:${process.env.PORT || 6666}/api/price`,
        item,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      logger.info(`✅ Успешно добавлено: ${item.name}`);
    } catch (err) {
      logger.error(`❌ Ошибка при добавлении "${item.name}": ${err.response?.data?.message || err.message}`);
    }
  }

  console.log('🏁 Импорт завершён.');
};

importItems();
