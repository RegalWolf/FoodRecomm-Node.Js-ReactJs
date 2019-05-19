const Validator = require('validator');
const isEmpty = require('./isEmpty');

const loginValidation = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username tidak boleh kosong';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password tidak boleh kosong';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = loginValidation;