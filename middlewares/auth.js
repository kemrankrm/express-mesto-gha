const jwt = require('jsonwebtoken');
// const { ERROR_CODE_401 } = require('../scripts/utils/utils');
const { AuthorizationError } = require('../scripts/utils/errors');

const handleAuthError = () => {
  throw new AuthorizationError('Необходима авторизация');
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
};
