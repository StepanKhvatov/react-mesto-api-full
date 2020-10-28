require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const BadRequestError = require('../errors/BadRequestError(400)');
const NotFoundError = require('../errors/NotFoundError(404)');
const UnauthorizedError = require('../errors/UnauthorizedError(401)');
const ConflictError = require('../errors/ConflictError(409)');

const { JWT_SECRET = 'secret-key' } = process.env;

const getAllUsers = (req, res, next) => { // Метод, возвращающий всех пользователей
  UserSchema.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res, next) => { // Метод создания пользователя
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return UserSchema.findOne({ email })
    .then((sameUser) => {
      if (sameUser) {
        throw new ConflictError('Пользователь с таким email уже есть');
      }

      return bcrypt.hash(password, 10)
        .then((hash) => UserSchema.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => {
          res.send({
            data: {
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            },
          });
        })
        .catch(next);
    })
    .catch(next);
};

const getUserById = (req, res, next) => { // поиск по id, находящимся в req.user._id
  UserSchema.findById(req.user._id)// req.params.userId было до изменений
    .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

const updateUser = (req, res, next) => { // метод, возвращающий обновленного пользователя
  const { name, about } = req.body;

  UserSchema.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); })
    .then((user) => {
      try {
        res.send({ data: user });
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new BadRequestError('Ошибка валидации обновления пользователя');
        }
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => { // метод, возвращающий обновленный аватар
  const { avatar } = req.body;

  UserSchema.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => { throw new NotFoundError('Нет пользователя с таким id'); })
    .then((user) => {
      try {
        res.send({ data: user.avatar });
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new BadRequestError('Ошибка валидации обновления пользователя');
        }
      }
    })
    .catch(next);
};

const login = (req, res, next) => { // Авторицзация пользователя
  const { email, password } = req.body;

  return UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${JWT_SECRET}`, { expiresIn: '7d' });
      try {
        res.send({ token });
      } catch (error) {
        throw UnauthorizedError('Необходима авторизация');
      }
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
