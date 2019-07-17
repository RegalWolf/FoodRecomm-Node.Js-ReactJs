const Validator = require('validator');
const isEmpty = require('./isEmpty');

const registerValidation = data => {
  let errors = {};

  errors.email = null;
  errors.password = null;
  errors.confirmPassword = null;

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email tidak valid';
  }

  if (!Validator.isLength(data.email, { min: 1, max: 60 })) {
    errors.email = 'Email maksimal 60 karakter';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email tidak boleh kosong';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password tidak boleh kosong';
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password tidak boleh kosong';
  }

  return {
    errors,
    isValid: (isEmpty(errors.email) && isEmpty(errors.password) && isEmpty(errors.confirmPassword))
  };
};

module.exports = registerValidation;