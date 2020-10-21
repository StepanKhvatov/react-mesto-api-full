require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, errors, Joi } = require('celebrate');
const cors = require('cors');
const NotFoundError = require('./errors/NotFoundError.js');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signup', celebrate({ // регистрация пользователя
  body: Joi.object().keys({
    name: Joi.string().required().min(4),
    about: Joi.string().required().min(4),
    avatar: Joi.string().required().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.post('/signin', celebrate({ // авторизация пользователя
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

app.use(auth);

app.use(users);

app.use(cards);

app.use(() => { // Ошибка 500
  throw new NotFoundError({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

app.use(limiter);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => res.status(err.status || 500).send({ message: err.message}));

app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
});
