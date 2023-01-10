const Cards = require('../models/cards');
const { returnError } = require('../scripts/utils/utils');

module.exports.getCards = (req, res) => {
  Cards.find({})
    // .populate('user') // TODO: НЕ СМОГ ОТКЛЮЧИТЬ STRICT-POPULATE
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

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndDelete(cardId)
    .then((item) => res.send(`Card ${item} deleted`))
    .catch((err) => returnError(err, 'card', res, cardId));
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => returnError(err, 'card', res, cardId));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => returnError(err, 'card', res, cardId));
};
