module.exports.catchErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err) {
    return res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }

  next();
};
