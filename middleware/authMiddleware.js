const jwt = require('../utils/jwt');
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn('🛑 Нет заголовка авторизации');
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    logger.warn('🛑 Токен не найден в заголовке Authorization');
    return res.sendStatus(401);
  }

  try {
    const payload = jwt.verifyAccessToken(token);
    req.user = payload;
    logger.info(`✅ Авторизация успешна: user_id=${payload.id}`);
    next();
  } catch (err) {
    logger.warn(`❌ Недействительный токен: ${err.message}`);
    return res.status(403).json({ message: 'Недействительный токен' });
  }
};

