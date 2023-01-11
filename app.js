const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '63bd375965bc0202152c0e6f',
  };
  next();
});

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('*', (req, res) => {
  res.status(404).send({ message: '404 Not found' });
});

app.get('/', (req, res) => {
  res.send('SERVER EXPRESS-MESTO HAS BEEN SUCCESFULLY STARTED');
});

app.listen(PORT, () => {
  console.log('SERVER RUNS ON PORT', PORT);
});
