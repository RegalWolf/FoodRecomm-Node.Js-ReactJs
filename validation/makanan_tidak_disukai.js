const Validator = require('validator');
const isEmpty = require('./isEmpty');

const makananTidakDisukaiValildation = data => {
  let errors = {
    makanan_id: null
  };

  data.makanan_id = !isEmpty(data.makanan_id) ? data.makanan_id : '';

  if (Validator.isEmpty(data.makanan_id)) {
    errors.makanan_id = 'Makanan_id tidak boleh kosong';
  }

  return {
    errors,
    isValid: (isEmpty(errors.makanan_id))
  };
};

module.exports = makananTidakDisukaiValildation;