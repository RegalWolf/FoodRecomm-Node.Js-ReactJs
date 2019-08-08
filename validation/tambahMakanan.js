const Validator = require('validator');
const isEmpty = require('./isEmpty');

const tambahMakananValidation = data => {
  let errors = {};
  let makanan = {};

  data.nama = !isEmpty(data.nama) ? data.nama : '';
  data.kalori = !isEmpty(data.kalori) ? data.kalori : '';
  data.protein = !isEmpty(data.protein) ? data.protein : '';
  data.lemak = !isEmpty(data.lemak) ? data.lemak : '';
  data.karbohidrat = !isEmpty(data.karbohidrat) ? data.karbohidrat : '';
  data.kalsium = !isEmpty(data.kalsium) ? data.kalsium : '';
  data.fosfor = !isEmpty(data.fosfor) ? data.fosfor : '';
  data.zat_besi = !isEmpty(data.zat_besi) ? data.zat_besi : '';
  data.vit_a = !isEmpty(data.vit_a) ? data.vit_a : '';
  data.vit_b1 = !isEmpty(data.vit_b1) ? data.vit_b1 : '';
  data.vit_c = !isEmpty(data.vit_c) ? data.vit_c : '';
  data.kategori = !isEmpty(data.kategori) ? data.kategori : '';
  data.prioritas = !isEmpty(data.prioritas) ? data.prioritas : '';

  makanan.protein = !isEmpty(data.protein) ? data.protein : null;
  makanan.lemak = !isEmpty(data.lemak) ? data.lemak : null;
  makanan.karbohidrat = !isEmpty(data.karbohidrat) ? data.karbohidrat : null;
  makanan.kalsium = !isEmpty(data.kalsium) ? data.kalsium : null;
  makanan.fosfor = !isEmpty(data.fosfor) ? data.fosfor : null;
  makanan.zat_besi = !isEmpty(data.zat_besi) ? data.zat_besi : null;
  makanan.vit_a = !isEmpty(data.vit_a) ? data.vit_a : null;
  makanan.vit_b1 = !isEmpty(data.vit_b1) ? data.vit_b1 : null;
  makanan.vit_c = !isEmpty(data.vit_c) ? data.vit_c : null;

  if (!Validator.isLength(data.nama, { min: 1, max: 50 })) {
    errors.nama = 'Nama maksimal berjumlah 50 karakter';
  }

  if (Validator.isEmpty(data.nama)) {
    errors.nama = 'Nama makanan tidak boleh kosong';
  }

  if (!Number(data.kalori)) {
    errors.kalori = 'Kalori harus bernilai angka';
  }

  if (Validator.isEmpty(data.kalori)) {
    errors.kalori = 'Kalori tidak boleh kosong';
  }

  if (!Validator.isEmpty(data.protein)) {
    if (!Number(data.protein)) {
      errors.protein = 'Protein harus bernilai angka';
    }
  }

  if (!Validator.isEmpty(data.lemak)) {
    if (!Number(data.lemak)) {
      errors.lemak = 'Lemak harus bernilai angka';
    }
  }

  if (!Validator.isEmpty(data.karbohidrat)) {
    if (!Number(data.karbohidrat)) {
      errors.karbohidrat = 'Karbohidrat harus bernilai angka';
    }
  }

  if (!Validator.isEmpty(data.kalsium)) {
    if (!Number(data.kalsium)) {
      errors.kalsium = 'Kalsium harus bernilai angka';
    }
  }
  
  if (!Validator.isEmpty(data.fosfor)) {
    if (!Number(data.fosfor)) {
      errors.fosfor = 'Fosfor harus bernilai angka';
    }
  }

  if (!Validator.isEmpty(data.zat_besi)) {
    if (!Number(data.zat_besi)) {
      errors.zat_besi = 'Zat Besi harus bernilai angka';
    }
  }

  if (!Validator.isEmpty(data.vit_a)) {
    if (!Number(data.vit_a)) {
      errors.vit_a = 'Vitamin A harus bernilai angka';
    }
  }

  if (!Validator.isEmpty(data.vit_b1)) {
    if (!Number(data.vit_b1)) {
      errors.vit_b1 = 'Vitamin B1 harus bernilai angka';
    }
  }

  if (!Validator.isEmpty(data.vit_c)) {
    if (!Number(data.vit_c)) {
      errors.vit_c = 'Vitamin C harus bernilai angka';
    }
  }

  if (Validator.isEmpty(data.kategori)) {
    errors.kategori = 'Kategori makanan tidak boleh kosong';
  }

  if (Validator.isEmpty(data.prioritas)) {
    errors.prioritas = 'Prioritas makanan tidak boleh kosong';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    makanan
  };
};

module.exports = tambahMakananValidation;