const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getAllCards);

cards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(4),
    link: Joi.string().required().uri(),
  }).unknown(true),
}), createCard);

cards.delete('/cards/:cardId', deleteCard);

cards.put('/cards/:cardId/likes', likeCard);

cards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cards;
