const Cards = require('../models/cards');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => {
      if (!cards.length) {
        throw new Error();
      } else {
        res.sendStatus(200);
        res.send(cards);
      }
    })
    .catch((err) => res.send(err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.send(err));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndDelete(cardId)
    .then((item) => res.send(`Card ${item} deleted`))
    .catch((err) => res.send(err));
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.send(err));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => res.send(err));
};
