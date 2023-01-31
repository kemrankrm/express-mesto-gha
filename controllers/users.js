const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const { CollectionEmptyError } = require('../scripts/components/CollectionEmptyError');

const {
  SUCCESS_CODE_200,
  isObjectIdValid,
} = require('../scripts/utils/utils');
const { RequestError, NotFoundError, AuthorizationError } = require('../scripts/utils/errors');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .orFail(() => {
      throw new CollectionEmptyError();
    })
    .then((users) => {
      if (!users.length) {
        return res.status(SUCCESS_CODE_200).send([]);
      }
      return res.status(SUCCESS_CODE_200).send(users);
    })
    .catch(() => next(new NotFoundError('Not Found')));
};

module.exports.createUser = (req, res, next) => {
  console.log('Creat USER WORKED WELL');

  const {
    name, about, avatar, email, password,
  } = req.body;

  Users.findOne({ email })
    .then((user) => {
      console.log('USER', user);
      if (!user) {
        return bcrypt.hash(password, 10)
          .then((hash) => Users.create({
            name, about, avatar, email, password: hash,
          }))
          .then((user) => res.status(SUCCESS_CODE_200).send(user))
          .catch(() => next(new RequestError('Неккоректный запрос')));
      }

      const err = new Error('Такой email уже зарегистрирован');
      err.statusCode = 409;

      throw err;
    })
    .catch((err) => res.status(err.statusCode).send({ message: err.message }));
};

// eslint-disable-next-line consistent-return
module.exports.getProfile = (req, res, next) => {
  const { id } = req.params;
  if (!isObjectIdValid(id)) {
    throw new RequestError(`Передан невалидный ID пользователя ${id}`);
  }

  Users.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
      return res.status(SUCCESS_CODE_200).send(user);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.editProfile = (req, res, next) => {
  console.log('EDIT PROFILE WORKED');
  if (!isObjectIdValid(req.user._id)) {
    throw new RequestError('Некорректные данные');
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
      throw new NotFoundError('User is not found');
    })
    .then((user) => {
      res.status(SUCCESS_CODE_200).send(user);
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
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
      throw new NotFoundError('User не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      res
        .status(SUCCESS_CODE_200)
        .send({
          token: jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' }),
        });
    })
    .catch(next);
};

module.exports.getCurrentProfile = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Ошибка авторизации');
      }

      return res.status(SUCCESS_CODE_200).send(user);
    })
    .catch(next);
};
