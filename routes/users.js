const usersRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getProfile, editProfile, editAvatar, getCurrentProfile,
} = require('../controllers/users');
const { urlRegexPattern } = require('../scripts/utils/utils');

usersRouter.get('/', getUsers);

usersRouter.get('/me', getCurrentProfile);

usersRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getProfile);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).unknown(true),
}), editProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegexPattern),
  }),
}), editAvatar);

module.exports = usersRouter;
