const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

// app.use(bodyParser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6381ebf1cd56009ab19414a7',
  };
  next();
});

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.send('SERVER EXPRESS-MESTO HAS BEEN SUCCESFULLY STARTED');
});

app.listen(PORT, () => {
  console.log('SERVER RUNS ON PORT', PORT);
});
