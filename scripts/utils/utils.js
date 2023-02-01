const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const SUCCESS_CODE_200 = 200;
const SUCCESS_CODE_201 = 201;
const ERROR_CODE_401 = 401;
const PERIOD_MINUTES_10 = 600000;

// eslint-disable-next-line prefer-regex-literals
const urlRegexPattern = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);

// const uniqueErrorMessage = '';

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

const apiLimiter = rateLimit({
  windowMs: PERIOD_MINUTES_10,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  SUCCESS_CODE_200,
  SUCCESS_CODE_201,
  ERROR_CODE_401,
  urlRegexPattern,
  PERIOD_MINUTES_10,
  isObjectIdValid,
  apiLimiter,
};
