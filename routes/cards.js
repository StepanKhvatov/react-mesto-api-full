const cards = require('express').Router();

const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
} = require('../celebrateValidation/cards');

const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getAllCards);

cards.post('/cards', createCardValidation, createCard);

cards.delete('/cards/:cardId', deleteCardValidation, deleteCard);

cards.put('/cards/:cardId/likes', likeCardValidation, likeCard);

cards.delete('/cards/:cardId/likes', likeCardValidation, dislikeCard);

module.exports = cards;
