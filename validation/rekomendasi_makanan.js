const Validator = require('validator');
const isEmpty = require('./isEmpty');

const rekomendasiMakananValildation = data => {
  let errors = {};

  data.kalori_max = !isEmpty(data.kalori_max) ? data.kalori_max : '';

  if (!Validator.isEmpty(data.kalori_max)) {
    if (!Number(data.kalori_max)) {
      errors.kalori_max = 'kalori_max harus bernilai angka';
    }
  } else {
    if (Validator.isEmpty(data.kalori_max)) {
      errors.kalori_max = 'kalori_max tidak boleh kosong';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = rekomendasiMakananValildation;