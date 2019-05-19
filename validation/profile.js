const Validator = require('validator');
const isEmpty = require('./isEmpty');

const registerValidation = data => {
  let errors = {};

  data.jenis_kelamin = !isEmpty(data.jenis_kelamin) ? data.jenis_kelamin : '';
  data.usia = !isEmpty(data.usia) ? data.usia : '';
  data.tinggi_badan = !isEmpty(data.tinggi_badan) ? data.tinggi_badan : '';
  data.berat_badan = !isEmpty(data.berat_badan) ? data.berat_badan : '';
  data.tingkat_aktivitas = !isEmpty(data.tingkat_aktivitas) ? data.tingkat_aktivitas : '';

  if (Validator.isEmpty(data.jenis_kelamin)) {
    errors.jenis_kelamin = 'Jenis kelamin tidak boleh kosong';
  }

  if (Validator.isEmpty(data.usia)) {
    errors.usia = 'Usia tidak boleh kosong';
  }

  if (Validator.isEmpty(data.tinggi_badan)) {
    errors.tinggi_badan = 'Tinggi badan tidak boleh kosong';
  }

  if (Validator.isEmpty(data.berat_badan)) {
    errors.berat_badan = 'Berat badan tidak boleh kosong';
  }

  if (Validator.isEmpty(data.tingkat_aktivitas)) {
    errors.tingkat_aktivitas = 'Tingkat aktivitas tidak boleh kosong';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = registerValidation;