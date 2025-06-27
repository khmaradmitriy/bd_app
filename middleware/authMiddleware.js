const jwt = require('../utils/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Недействительный токен' });
  }
};
