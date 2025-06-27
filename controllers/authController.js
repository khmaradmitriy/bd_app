const db = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const jwtUtil = require('../utils/jwt');

exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    // Проверка на существующий email
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Такой email уже зарегистрирован' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Добавляем пользователя
    await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    logger.info(`✅ Зарегистрирован новый пользователь: ${email}`);
    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (err) {
    logger.error(`❌ Ошибка при регистрации: ${err.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  logger.info(`🔑 Попытка входа: ${email}`);

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      logger.warn(`❌ Вход: пользователь не найден — ${email}`);
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`❌ Вход: неверный пароль — ${email}`);
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const accessToken = jwtUtil.generateAccessToken({ id: user.id });
    const refreshToken = jwtUtil.generateRefreshToken({ id: user.id });

    await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, user.id]);

    logger.info(`✅ Вход выполнен: user_id=${user.id}, email=${email}`);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // true в продакшене
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken });
  } catch (err) {
    logger.error(`🔥 Ошибка входа для ${email}: ${err.message}`);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    logger.warn('🚫 Refresh: отсутствует refresh token');
    return res.status(401).json({ message: 'Нет токена' });
  }

  try {
    const payload = jwtUtil.verifyRefreshToken(refreshToken);
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [payload.id]);
    const user = rows[0];

    if (!user || user.refresh_token !== refreshToken) {
      logger.warn(`🚫 Refresh: токен не совпадает для user_id=${payload.id}`);
      return res.status(403).json({ message: 'Недействительный токен' });
    }

    const newAccessToken = jwtUtil.generateAccessToken({ id: user.id });
    const newRefreshToken = jwtUtil.generateRefreshToken({ id: user.id });

    await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [newRefreshToken, user.id]);

    logger.info(`🔁 Обновлён токен: user_id=${user.id}`);

    res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken: newAccessToken });
  } catch (err) {
    logger.error(`❌ Refresh: ошибка верификации токена — ${err.message}`);
    res.status(403).json({ message: 'Недействительный токен' });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    logger.info('🚪 Logout: без токена — завершено');
    return res.sendStatus(204);
  }

  try {
    const payload = jwtUtil.verifyRefreshToken(refreshToken);
    await db.query('UPDATE users SET refresh_token = NULL WHERE id = ?', [payload.id]);
    logger.info(`🚪 Logout: пользователь вышел — user_id=${payload.id}`);
  } catch (err) {
    logger.warn('🚪 Logout: не удалось верифицировать refresh token');
  }

  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
  res.sendStatus(204);
};