const Users = require('../models/users');

const {
  SUCCESS_CODE_200,
  ERROR_CODE_400,
  ERROR_CODE_404
} = require('../utils/utils')

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => {
      if (users > 10) {
        return res.status(ERROR_CODE_404).send({ message: 'Users are not found' });
      }
      res.status(SUCCESS_CODE_200).send(users)
      
    })
    .catch((err) => res.send(err));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  Users.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => res.send(err));
};

module.exports.getProfile = (req, res) => {
  const { id } = req.params;

  Users.findById(id)
    .then((user) => { res.send(user); })
    .catch((err) => res.send(err));
};

module.exports.editProfile = (req, res) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.send(`Updated user profile ${user}`))
    .catch((err) => res.send(err));
};
