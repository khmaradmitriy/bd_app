module.exports = {
  tableName: 'price_items',
  fields: {
    id: 'INT AUTO_INCREMENT PRIMARY KEY',
    name: 'VARCHAR(255) NOT NULL',
    unit: 'VARCHAR(50)',
    price: 'DECIMAL(10,2)',
    category: 'VARCHAR(100)',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};