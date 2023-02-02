const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { SUCCESS_CODE_200 } = require('../scripts/utils/utils');

const { NotFoundError } = require('../scripts/utils/errors/NotFoundError');
const { RegistrationError } = require('../scripts/utils/errors/RegistrationError');
const { RequestError } = require('../scripts/utils/errors/RequestError');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.status(SUCCESS_CODE_200).send(users))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const data = user;
      data.password = undefined;

      res.status(SUCCESS_CODE_200).send(data);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new RegistrationError('Такой email уже зарегистрирован'));
      }

      if (err.name === 'ValidationError') {
        return next(new RequestError('Введены неверные данные'));
      }

      return next(err);
    });
};

module.exports.getProfile = (req, res, next) => {
  const { id } = req.params;
  Users.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь по указанному id:${id} не найден`);
      }
      return res.status(SUCCESS_CODE_200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new RequestError('Неверные данные id'));
      }
      next(err);
    });
};

module.exports.editProfile = (req, res, next) => {
  Users.findByIdAndUpdate(
    { _id: req.user._id },
    {
      name: req.body.name,
      about: req.body.about,
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new RequestError('Формат данных неверный'));
      }
      next(err);
    });
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      runValidators: true,
      new: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('User не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new RequestError('Введен неверный URL картинки'));
      }

      next(err);
    });
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
        throw new NotFoundError('Ошибка авторизации');
      }

      return res.status(SUCCESS_CODE_200).send(user);
    })
    .catch(next);
};
