const Validator = require('validator');
const isEmpty = require('./isEmpty');

const makananValildation = data => {
  let errors = {
    nama: null,
    kalori: null
  };

  data.nama = !isEmpty(data.nama) ? data.nama : '';
  data.kalori = !isEmpty(data.kalori) ? data.kalori : '';

  if (Validator.isEmpty(data.nama)) {
    errors.nama = 'Nama tidak boleh kosong';
  }

  if (Validator.isEmpty(data.kalori)) {
    errors.kalori = 'Kalori tidak boleh kosong';
  }

  return {
    errors,
    isValid: (isEmpty(errors.nama) && isEmpty(errors.kalori))
  };
};

module.exports = makananValildation;