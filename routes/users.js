const users = require('express').Router();

const {
  updateUserValidation,
  updateAvatarValidation,
  getUserByIdValidation,
} = require('../celebrateValidation/users');

const {
  getAllUsers,
  getUserById,
  getUserByPayloadId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/users/me', getUserByPayloadId);

users.get('/users', getAllUsers);

users.get('/users/:id', getUserByIdValidation, getUserById);

users.patch('/users/me', updateUserValidation, updateUser);

users.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = users;
