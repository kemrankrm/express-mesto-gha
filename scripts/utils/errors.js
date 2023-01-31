// eslint-disable-next-line max-classes-per-file
class AuthoritiesError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class RequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = {
  AuthoritiesError,
  NotFoundError,
  AuthorizationError,
  RequestError,
};
