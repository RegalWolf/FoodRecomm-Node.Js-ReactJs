const Validator = require('validator');
const isEmpty = require('./isEmpty');

const makananValildation = data => {
  let errors = {};

  data.page = !isEmpty(data.page) ? data.page : '';
  data.limit = !isEmpty(data.limit) ? data.limit : '';

  if (Validator.isEmpty(data.page)) {
    errors.page = 'Page tidak boleh kosong';
  }

  if (Validator.isEmpty(data.limit)) {
    errors.limit = 'Limit tidak boleh kosong';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = makananValildation;