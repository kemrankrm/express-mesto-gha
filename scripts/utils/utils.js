const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const SUCCESS_CODE_200 = 200;
const ERROR_CODE_401 = 401;
const PERIOD_MINUTES_10 = 600000;

const isObjectIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

const apiLimiter = rateLimit({
  windowMs: PERIOD_MINUTES_10,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  SUCCESS_CODE_200,
  ERROR_CODE_401,
  PERIOD_MINUTES_10,
  isObjectIdValid,
  apiLimiter,
};
