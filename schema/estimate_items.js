module.exports = {
  tableName: 'estimate_items',
  fields: {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    estimate_id: 'INT NOT NULL',
    price_item_id: 'INT',
    name: 'VARCHAR(255) NOT NULL',
    unit: 'VARCHAR(50)',
    quantity: 'DECIMAL(10,2)',
    unit_price: 'DECIMAL(10,2)',
    markup_percent: 'DECIMAL(5,2) DEFAULT 0',
    final_price: 'DECIMAL(10,2)',
    total: 'DECIMAL(10,2)'
  }
};