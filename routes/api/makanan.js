const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateGetMakanan = require('../../validation/getMakanan');

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
    const { errors, isValid } = validateGetMakanan(req.query);
    
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let offset = 0;

    if (req.query.page > 1) {
      offset = (req.query.page - 1) * 10
    }

    if (req.query.kalori_max) {
      db.execute('SELECT * FROM makanan WHERE kalori BETWEEN 0 AND ? ORDER BY kalori DESC LIMIT ? OFFSET ?',
        [req.query.kalori_max, req.query.limit, offset])
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
    }
  }
);

module.exports = router;
