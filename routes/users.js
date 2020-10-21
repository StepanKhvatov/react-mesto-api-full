const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', getAllUsers);

users.get('/users/:userId', getUserById);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(4),
    about: Joi.string().required().min(4),
  }),
}), updateUser);

users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
