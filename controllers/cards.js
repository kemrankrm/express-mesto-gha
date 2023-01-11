const Cards = require('../models/cards');
const {
  returnError, isObjectIdValid, ERROR_CODE_400, ERROR_CODE_404,
} = require('../scripts/utils/utils');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!cards.length) {
        return res.status(200).send('Карты в коллекции базы данных нет :(');
      }
      return res.status(200).send(cards);
    })
    .catch((err) => returnError(err, 'user', res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => returnError(err, 'card', res));
};

// eslint-disable-next-line consistent-return
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!isObjectIdValid(cardId)) {
    return res.status(ERROR_CODE_400).send({ message: `Передан некорректный id (${cardId}) карточки для ее удаления` });
  }

  Cards.findByIdAndDelete(cardId)
    .orFail(() => {
      res.status(ERROR_CODE_404).send({ message: `Передан несуществующий id (${cardId}) карточки` });
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => returnError(err, 'card', res, cardId));
};

// eslint-disable-next-line consistent-return
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  if (!isObjectIdValid(cardId)) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
  }
  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_CODE_404).send({ message: `Передан несуществующий id (${cardId}) карточки` });
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => returnError(err, 'card', res, cardId));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  if (!isObjectIdValid(cardId)) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
  }

  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(ERROR_CODE_404).send({ message: `Передан несуществующий id (${cardId}) карточки` });
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => returnError(err, 'card', res, cardId));
};
