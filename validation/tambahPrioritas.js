const Validator = require('validator');
const isEmpty = require('./isEmpty');

const tambahMakananValidation = data => {
  let errors = {};

  data.prioritas = !isEmpty(data.prioritas) ? data.prioritas : '';
  data.tingkat_prioritas = !isEmpty(data.tingkat_prioritas) ? data.tingkat_prioritas : '';
  data.deskripsi = !isEmpty(data.deskripsi) ? data.deskripsi : '';

  if (!Validator.isLength(data.prioritas, { min: 1, max: 15 })) {
    errors.prioritas = 'Prioritas maksimal berjumlah 15 karakter';
  }
  
  if (Validator.isEmpty(data.prioritas)) {
    errors.prioritas = 'Prioritas tidak boleh kosong';
  }

  if (!Validator.isEmpty(data.tingkat_prioritas)) {
    if (!Number(data.tingkat_prioritas)) {
      errors.tingkat_prioritas = 'Tingkat prioritas harus bernilai angka';
    }
  } else {
    if (Validator.isEmpty(data.tingkat_prioritas)) {
      errors.tingkat_prioritas = 'Tingkat prioritas tidak boleh kosong';
    }
  }

  if (!Validator.isEmpty(data.deskripsi)) {
    if (!Validator.isLength(data.deskripsi, { min: 1, max: 100 })) {
      errors.deskripsi = 'Deskripsi maksimal berjumlah 100 karakter';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = tambahMakananValidation;