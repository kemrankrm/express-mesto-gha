const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { apiLimiter } = require('./scripts/utils/utils');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { catchErrors } = require('./middlewares/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use('/api/', apiLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

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
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: '404 Not found' });
});

app.get('/', (req, res) => {
  res.send('SERVER EXPRESS-MESTO HAS BEEN SUCCESSFULLY STARTED');
});

app.use(errors());

app.use(catchErrors);

app.listen(PORT, () => {
  console.log('SERVER RUNS ON PORT', PORT);
});
