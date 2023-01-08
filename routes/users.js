const usersRouter = require('express').Router();

const {
  getUsers, createUser, getProfile, editProfile, editAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getProfile);

usersRouter.post('/', createUser);

usersRouter.patch('/me', editProfile);

usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
