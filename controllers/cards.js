const Cards = require('../models/cards');

const {
  SUCCESS_CODE_200,
  SUCCESS_CODE_201,
} = require('../scripts/utils/utils');

const { AuthoritiesError } = require('../scripts/utils/errors/AuthoritiesError');
const { NotFoundError } = require('../scripts/utils/errors/NotFoundError');
const { RequestError } = require('../scripts/utils/errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(SUCCESS_CODE_200).send(cards))
    .catch(() => next(new Error('Что-то пошло не так')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(SUCCESS_CODE_201).send(card))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return new RequestError('Введены неверные данные');
      }
      next(err);
    });
};

// eslint-disable-next-line consistent-return
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Cards.findById(cardId)
    .orFail(() => {
      throw new NotFoundError(`Передан несуществующий id (${cardId}) карточки`);
    })
    .then((card) => {
      const cardOwnerId = card.owner.toString();
      const currentUserId = `${req.user._id}`;

      if (cardOwnerId !== currentUserId) {
        throw new AuthoritiesError('Нет прав на удаление этой карты');
      }

      Cards.deleteOne({ _id: cardId })
        .populate(['owner', 'likes'])
        .then((deletedCard) => res.status(SUCCESS_CODE_200).send(deletedCard))
        .catch(next);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(`Передан несуществующий id (${cardId}) карточки`);
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(`Передан несуществующий id (${cardId}) карточки`);
    })
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};
