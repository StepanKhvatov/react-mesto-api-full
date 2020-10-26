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

users.patch('/users/me', updateAvatarValidation, updateAvatar);

users.get('/users/me', getUserByIdValidation, getUserById);

module.exports = users;
