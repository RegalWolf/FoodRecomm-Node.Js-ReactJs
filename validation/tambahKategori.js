const Validator = require('validator');
const isEmpty = require('./isEmpty');

const tambahKategoriValidation = data => {
  let errors = {};

  data.kode_kategori = !isEmpty(data.kode_kategori) ? data.kode_kategori : '';
  data.nama_kategori = !isEmpty(data.nama_kategori) ? data.nama_kategori : '';
  data.deskripsi = !isEmpty(data.deskripsi) ? data.deskripsi : '';

  if (!Validator.isLength(data.kode_kategori, { min: 2, max: 2 })) {
    errors.kode_kategori = 'Kode kategori harus 2 karakter';
  }

  if (Validator.isEmpty(data.kode_kategori)) {
    errors.kode_kategori = 'Kode kategori tidak boleh kosong';
  }

  if (!Validator.isLength(data.nama_kategori, { min: 1, max: 50 })) {
    errors.nama_kategori = 'Nama kategori maksimal 50 karakter';
  }

  if (Validator.isEmpty(data.nama_kategori)) {
    errors.nama_kategori = 'Nama Kategori tidak boleh kosong';
  }

  if (!Validator.isEmpty(data.deskripsi)) {
    if (!Validator.isLength(data.deskripsi, { min: 1, max: 200 })) {
      errors.deskripsi = 'Deskripsi kategori maksimal 200 karakter';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = tambahKategoriValidation;