const { celebrate, Joi } = require('celebrate');

module.exports.signUpValidation = celebrate({
  body: Joi.object().keys({
    // name: Joi.string().required().min(2).max(30),
    // about: Joi.string().required().min(2).max(30),  // вставка значений по умолчанию
    // eslint-disable-next-line max-len
    // avatar: Joi.string().required().uri().regex(/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

module.exports.signInValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});
