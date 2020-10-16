const UserSchema = require('../models/user');

const getAllUsers = (req, res) => { // Метод, возвращающий всех пользователей
  UserSchema.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

const createUser = (req, res) => { // Метод создания пользователя
  const { name, about, avatar } = req.body;

  UserSchema.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(
      (error) => {
        if (error.name === 'ValidationError') {
          res.status(400).send({ message: error.message });
        } else {
          res.status(500).send({ message: error.message });
        }
      },
    );
};

const getUserById = (req, res) => { // Метод, возвращающий пользователя по id
  UserSchema.findById(req.params.userId)
    .orFail(new Error('NotValid'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.message === 'NotValid') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

const updateUser = (req, res) => { // метод, возвращающий обновленного пользователя
  const { name, about } = req.body;

  UserSchema.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new Error('NotValid'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.message === 'NotValid') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

const updateAvatar = (req, res) => { // метод, возвращающий обновленный аватар
  const { avatar } = req.body;

  UserSchema.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValid'))
    .then((user) => res.send({ data: user.avatar }))
    .catch((error) => {
      if (error.message === 'NotValid') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
