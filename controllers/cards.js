const CardSchema = require('../models/card');
const BadRequestError = require('../errors/BadRequestError(400)');
const NotFoundError = require('../errors/NotFoundError(404)');

const getAllCards = (req, res, next) => { // Метод, возвращающий массив всех карточек
  CardSchema.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => { // метод создания новой карточки
  const { name, link } = req.body;

  CardSchema.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Ошибка валидации карточки');
      }
      res.send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => { // метод удаления карточки
  CardSchema.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }

      res.send({ data: card });
    })
    .catch(next);
};

const likeCard = (req, res, next) => { // Постановка лайка карточке
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => { // Удаление лайка карточки
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }

      res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
