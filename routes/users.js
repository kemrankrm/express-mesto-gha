const usersRouter = require('express').Router();

const {
  getUsers, getProfile, editProfile, editAvatar, getCurrentProfile,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getCurrentProfile);

usersRouter.get('/:id', getProfile);

usersRouter.patch('/me', editProfile);

usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
