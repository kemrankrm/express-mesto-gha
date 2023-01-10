class CollectionEmptyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CollectionEmpty';
    this.statusCode = 400;
  }
}

module.exports = {
  CollectionEmptyError,
};
