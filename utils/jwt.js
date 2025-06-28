// utils/jwt.js

const jwt = require('jsonwebtoken');
const logger = require('./logger');

// Генерация access токена (15 минут)
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Генерация refresh токена (7 дней)
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Проверка access токена с логами
const verifyAccessToken = (token) => {
  console.log('🔐 JWT_SECRET used to verify:', process.env.JWT_SECRET);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Access token valid:', payload);
    return payload;
  } catch (err) {
    console.error('❌ JWT verify error:', err.message);
    logger.warn(`❌ Access token verification failed: ${err.message}`);
    throw err;
  }
};

// Проверка refresh токена с логами
const verifyRefreshToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    logger.info(`🔁 Refresh token verified: user_id=${payload.id}`);
    return payload;
  } catch (err) {
    logger.warn(`❌ Refresh token verification failed: ${err.message}`);
    throw err;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
