const Cards = require('../models/cards');

const {
  isObjectIdValid,
  SUCCESS_CODE_200,
} = require('../scripts/utils/utils');

const {
  NotFoundError,
  RequestError,
  AuthorizationError,
} = require('../scripts/utils/errors');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (!cards.length) {
        return res.status(SUCCESS_CODE_200).send([]);
      }
      return res.status(SUCCESS_CODE_200).send(cards);
    })
    .catch((err) => next(new NotFoundError('Карточки не найдены')));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => next(new RequestError('Введены неверные данные')));
};

// eslint-disable-next-line consistent-return
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  if (!isObjectIdValid(cardId)) {
    throw new RequestError(`Передан некорректный id (${cardId}) карточки для ее удаления`);
  }

  Cards.findById(cardId)
    .orFail(() => {
      throw new NotFoundError(`Передан несуществующий id (${cardId}) карточки`);
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      const cardOwnerId = JSON.stringify(card.owner._id);
      const currentUserId = `"${req.user._id}"`;

      if (cardOwnerId !== currentUserId) {
        throw new AuthorizationError('Нет прав на удаление этой карты');
      }

      Cards.deleteOne({ _id: cardId })
        .orFail(() => {
          throw new Error();
        })
        .populate(['owner', 'likes'])
        .then((deletedCard) => res.status(SUCCESS_CODE_200).send(deletedCard))
        .catch(next);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  console.log(req.headers);

  if (!isObjectIdValid(cardId)) {
    throw new RequestError('Переданы некорректные данные для постановки/снятии лайка');
  }
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

  if (!isObjectIdValid(cardId)) {
    throw new RequestError('Переданы некорректные данные для постановки/снятии лайка');
  }

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
