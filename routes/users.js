const users = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', getAllUsers);

users.get('/users/:userId', getUserById);

users.post('/users', createUser);

users.patch('/users/me', updateUser);

users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
