const Users = require('../models/users');
const { CollectionEmptyError } = require('../scripts/components/CollectionEmptyError');

const {
  SUCCESS_CODE_200,
  returnError, ERROR_CODE_400, ERROR_CODE_404, isObjectIdValid,
} = require('../scripts/utils/utils');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .orFail(() => {
      throw new CollectionEmptyError();
    })
    .then((users) => {
      if (!users.length) {
        return res.status(400).send(users);
      }
      return res.status(SUCCESS_CODE_200).send(users);
    })
    .catch((err) => res.status(404).send(err));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  Users.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => returnError(err, 'user', res));
};

// eslint-disable-next-line consistent-return
module.exports.getProfile = (req, res) => {
  const { id } = req.params;

  if (!isObjectIdValid(id)) {
    return res.status(ERROR_CODE_400).send({ message: `Передан невалидный ID пользователя ${id}` });
  }

  Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_404).send({ message: `Пользователь по указанному id:${id} не найден` });
      }
      return res.status(SUCCESS_CODE_200).send(user);
    })
    .catch((err) => returnError(err, 'user', res));
};

// eslint-disable-next-line consistent-return
module.exports.editProfile = (req, res) => {
  if (!isObjectIdValid(req.user._id)) {
    return res.status(ERROR_CODE_400).res.send({ message: 'User не найден' });
  }

  Users.findByIdAndUpdate(
    { _id: req.user._id },
    {
      name: req.body.name || '',
      about: req.body.about || '',
    },
    {
      runValidators: true,
      new: true,
    },
  )
    .orFail(() => {
      throw new Error('User is not found');
    })
    .then((user) => {
      res.status(SUCCESS_CODE_200).send(user);
    })
    .catch((err) => returnError(err, 'profile', res, req.user._id));
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar || '' },
    {
      runValidators: true,
      new: true,
    },
  )
    .orFail(() => {
      throw new Error();
    })
    .then((user) => res.send(user))
    .catch((err) => returnError(err, 'avatar', res, req.user._id));
};
