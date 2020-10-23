require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
  } catch (err) {
    throw new UnauthorizedError({ message: 'Необходима авторизация' }); // Ошибка 401
  }

  req.user = payload;

  next();
};
