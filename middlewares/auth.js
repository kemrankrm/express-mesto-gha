const jwt = require('jsonwebtoken');

const { AuthorizationError } = require('../scripts/utils/errors/AuthorizationError');

const handleAuthError = () => new AuthorizationError('Необходима авторизация');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(handleAuthError());
  }

  const token = extractBearerToken(authorization);

  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(handleAuthError());
  }

  req.user = payload;

  next();
};

module.exports = {

  auth,

};
