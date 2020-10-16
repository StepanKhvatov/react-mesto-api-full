const CardSchema = require('../models/card');

const getAllCards = (req, res) => { // Метод, возвращающий массив всех карточек
  CardSchema.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

const createCard = (req, res) => { // метод создания новой карточки
  const { name, link } = req.body;

  CardSchema.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
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

const deleteCard = (req, res) => { // метод удаления карточки
  CardSchema.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.message === 'NotValid') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

const likeCard = (req, res) => { // Постановка лайка карточке
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.message === 'NotValid') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

const dislikeCard = (req, res) => { // Удаление лайка карточки
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValid'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.message === 'NotValid') {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
