const { celebrate, Joi } = require('celebrate');
const BadRequestError = require('../errors/BadRequestError(400)');

module.exports.createCardValidation = celebrate({ // создание карточки
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri().regex(/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
    owner: Joi.string().hex()
      .error(() => new BadRequestError('Некорректный id пользователя')),
  }),
});

module.exports.deleteCardValidation = celebrate({ // удаление карточки
  params: Joi.object().keys({
    cardId: Joi.string().hex()
      .error(() => new BadRequestError('Некорректный id карточки')),
  }),
});

module.exports.likeCardValidation = celebrate({ // лайк карточки
  params: Joi.object().keys({
    cardId: Joi.string().hex()
      .error(() => new BadRequestError('Некорректный id карточки')),
  }),
});
