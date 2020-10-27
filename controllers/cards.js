const CardSchema = require('../models/card');
const NotFoundError = require('../errors/NotFoundError(404)');
const ForbiddenError = require('../errors/ForbiddenError(403)');

const getAllCards = (req, res, next) => { // Метод, возвращающий массив всех карточек
  CardSchema.find({})
    .orFail(() => { throw new NotFoundError('Ошибка загрузки карточек. Карточки не найдены'); })
    .then((cards) => {
      res.send({ data: cards.reverse() });
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
      res.send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => { // метод удаления карточки
  CardSchema.findOne({ _id: req.params.cardId })
    .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); })
    .then((card) => {
      if (`${card.owner}` !== `${req.user._id}`) { // ага, при сравнении id использовать шаблонные строки
        throw new ForbiddenError('У вас не прав для удаления карточки');
      }
      CardSchema.findByIdAndRemove(req.params.cardId)
        .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); })
        .then((deletedCard) => {
          res.send({ data: deletedCard });
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => { // Постановка лайка карточке
  CardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); })
    .then((card) => {
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
    .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); })
    .then((card) => {
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
