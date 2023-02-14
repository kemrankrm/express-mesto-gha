const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { apiLimiter, urlRegexPattern } = require('./scripts/utils/utils');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { catchErrors } = require('./middlewares/errors');
const { NotFoundError } = require('./scripts/utils/errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

app.use('/api/', apiLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegexPattern),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('*', (req, res, next) => next(new NotFoundError('404 Not found')));

app.get('/', (req, res) => {
  res.send('SERVER EXPRESS-MESTO HAS BEEN SUCCESSFULLY STARTED');
});

app.use(errorLogger);

app.use(errors());

app.use(catchErrors);

app.listen(PORT, () => {
  console.log('SERVER RUNS ON PORT', PORT);
});
