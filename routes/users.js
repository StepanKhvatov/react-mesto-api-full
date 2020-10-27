const users = require('express').Router();

const {
  updateUserValidation,
  updateAvatarValidation,
  getUserByIdValidation,
} = require('../celebrateValidation/users');

const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', getAllUsers);

users.patch('/users/me', updateUserValidation, updateUser);

users.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

users.get('/users/me', getUserByIdValidation, getUserById); // поиск по id, находящимся в req.user._id

module.exports = users;
