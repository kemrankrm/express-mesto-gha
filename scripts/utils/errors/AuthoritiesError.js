class AuthoritiesError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.export = {
  AuthoritiesError,
};
