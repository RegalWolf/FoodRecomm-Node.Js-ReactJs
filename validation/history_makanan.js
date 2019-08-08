const Validator = require('validator');
const isEmpty = require('./isEmpty');

const historyMakananValidation = data => {
  let errors = {};

  data.makanan_id = !isEmpty(data.makanan_id) ? data.makanan_id : '';
  data.jumlah = !isEmpty(data.jumlah) ? data.jumlah : '';

  if (!Validator.isEmpty(data.makanan_id)) {
    if (!Number(data.makanan_id)) {
      errors.makanan_id = 'Makanan id harus bernilai angka (gram)';
    }
  } else {
    errors.makanan_id = 'Makanan id tidak boleh kosong';
  }

  if (!Validator.isEmpty(data.jumlah)) {
    if (!Number(data.jumlah)) {
      errors.jumlah = 'Jumlah makanan harus bernilai angka (gram)';
    }
  } else {
    errors.jumlah = 'Jumlah makanan tidak boleh kosong';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = historyMakananValidation;