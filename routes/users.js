const usersRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getProfile, editProfile, editAvatar, getCurrentProfile,
} = require('../controllers/users');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getCurrentProfile);

usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24),
  }),
}), getProfile);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), editProfile);

usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
