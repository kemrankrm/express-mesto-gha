const SUCCESS_CODE_200 = 200;
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

const returnError = (err, schema, res, id) => {
  console.log('ERROR FUNCTION PROCESSED ===', err);

  if (err.name === 'ValidationError') {
    switch (schema) {
      case 'user':
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные в методы создания пользователя' });
      case 'card':
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные в методы создания карточки' });
      case 'avatar':
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные в методы обновления аватара' });
      case 'profile':
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные в методы обновления профиля' });

      default:
        return res.status(ERROR_CODE_400).send({ message: 'Validation Error' });
    }
  } else if (err.name === 'CastError') {
    return res.status(ERROR_CODE_404).send({
      message: schema === 'card'
        ? `Карточка c указанным id ${id || '(Не удается отобразить ID)'} не найдена`
        : `Пользователь c id: ${id || '(Не удается отобразить ID)'} не найден`,
    });
  } else if (err.name === 'CollectionEmpty') {
    return res.status(ERROR_CODE_404).send({ message: err.message });
  }

  return res.status(ERROR_CODE_500).send('Что-то пошло не так...');
};

module.exports = {
  SUCCESS_CODE_200,
  ERROR_CODE_400,
  ERROR_CODE_404,
  returnError,
};
