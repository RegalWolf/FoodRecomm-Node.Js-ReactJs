const Validator = require('validator');
const isEmpty = require('./isEmpty');

const loginValidation = data => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  errors.email = null;
  errors.password = null;

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email tidak valid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email tidak boleh kosong';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password tidak boleh kosong';
  }

  return {
    errors,
    isValid: (isEmpty(errors.email) && isEmpty(errors.password))
  };
};

module.exports = loginValidation;