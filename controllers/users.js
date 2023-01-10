const Users = require('../models/users');
const { CollectionEmptyError } = require('../scripts/components/CollectionEmptyError');

const {
  SUCCESS_CODE_200,
  returnError,
} = require('../scripts/utils/utils');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .orFail(() => {
      throw new CollectionEmptyError();
    })
    .then((users) => {
      if (!users.length) {
        return res.status(400).send({ message: 'Пользователей нет в базе данных' });
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

module.exports.getProfile = (req, res) => {
  const { id } = req.params;

  Users.findById(id)
    .then((user) => { res.send(user); })
    .catch((err) => returnError(err, 'user', res));
};

module.exports.editProfile = (req, res) => {
  const { name, about } = req.body;
  console.log(req.body);

  console.log('ID ===', req.user._id);

  Users.findByIdAndUpdate(
    req.user._id,
    {
      name: name || '',
      about: about || '',
    },
    {
      runValidators: true,
      new: true,
    },
  )
    .orFail(() => {
      throw new Error();
    })
    .then((user) => res.send(user))
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
    .then((user) => res.send(`Updated user profile ${user}`))
    .catch((err) => returnError(err, 'avatar', res, req.user._id));
};
