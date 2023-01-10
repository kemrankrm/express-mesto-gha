const SUCCESS_CODE_200 = 200;
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;

const returnError = (err, res) => {
  if (err.name) {
    return;
  }

  return res.status(500).send({ message: 'Что-то пошло не так' });
};

module.exports = {
  SUCCESS_CODE_200,
  ERROR_CODE_400,
  ERROR_CODE_404,
};
