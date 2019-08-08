const Validator = require('validator');
const isEmpty = require('./isEmpty');

const pencarianMakananValidation = data => {
  let errors = {
    nama: null
  };

  data.nama = !isEmpty(data.nama) ? data.nama : '';

  if (Validator.isEmpty(data.nama)) {
    errors.nama = 'Pencarian makanan tidak boleh kosong';
  }

  return {
    errors,
    isValid: isEmpty(errors.nama)
  };
};

module.exports = pencarianMakananValidation;