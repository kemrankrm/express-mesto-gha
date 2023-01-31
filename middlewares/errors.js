// eslint-disable-next-line no-unused-vars
module.exports.catchErrors = (err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const { statusCode = 500, message } = err;

  return res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : err.message,
    });
};
