const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');

// @routes GET api/makanan/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Makanan is works' }
));

// @routes GET api/makanan
// @Desc Returning makanan
// @Access Private
router.get('/search/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

    if (req.query.kalori_max) {
      if (req.query.limit == null) {
        errors.limit = 'Limit tidak boleh kosong';
        return res.status(400).json(errors);
      }

      db.execute('SELECT * FROM makanan WHERE kategori = "PF" AND kalori BETWEEN 0 AND ? ORDER BY RAND() LIMIT ?;',
        [req.query.kalori_max, req.query.limit])
        .then(makanan => {
          if (makanan[0].length < 1) {
            errors.noMakanan = 'Makanan tidak tersedia';
            return res.status(404).json(errors);
          }

          res.json(makanan[0]);
        })
        .catch(err => {
          res.status(404).json(err);
        });
    } else if (req.query.nama) {
      db.execute('SELECT * FROM makanan WHERE nama LIKE ?', ["%" + req.query.nama + "%"])
        .then(makanan => {
          if (makanan[0].length < 1) {
            errors.noMakanan = 'Makanan tidak ditemukan';
            return res.status(404).json(errors);
          }

          res.json(makanan[0]);
        })
        .catch(err => {
          res.status(404).json(err);
        })
    } else {
      errors.pencarian = 'kalori_max atau nama harus diisi';
      errors.kalori_max = 'kalori_max harus di isi';
      errors.nama = 'nama harus di isi';
      return res.status(404).json(errors);
    }
  }
);

module.exports = router;
