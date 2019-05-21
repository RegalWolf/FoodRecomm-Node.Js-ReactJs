const Validator = require('validator');
const isEmpty = require('./isEmpty');

const registerValidation = data => {
  let errors = {};

  errors.nama = null;
  errors.username = null;
  errors.password = null;

  data.nama = !isEmpty(data.nama) ? data.nama : '';
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isLength(data.nama, { min: 2, max: 50 })) {
    errors.nama = 'Nama harus 2 sampai 50 karakter';
  }

  if (Validator.isEmpty(data.nama)) {
    errors.nama = 'Nama tidak boleh kosong';
  }

  if (!Validator.isLength(data.username, { min: 6, max: 30 })) {
    errors.username = 'Username harus 6 sampai 30 karakter';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username tidak boleh kosong';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password harus 6 sampai 30 karakter';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password tidak boleh kosong';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = registerValidation;