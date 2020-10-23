const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', getAllUsers);

users.get('/users/:userId', getUserById);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(4),
    about: Joi.string().required().min(4),
  }).unknown(true),
}), updateUser);

users.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(4),
  }).unknown(true),
}), updateAvatar);

users.get('/users/me', getUserById);

module.exports = users;
