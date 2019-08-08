const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateTambahKategori = require('../../validation/tambahKategori');

// @routes GET api/makanan/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Kategori is works' }
));

// @routes GET api/kategori/all
// @Desc Returning all kategori
// @Access Private
router.get('/all', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

    db.execute('SELECT * FROM kategori')
      .then(kategori => {
        if (kategori[0].length < 1) {
          errors.kategori = 'Kategori tidak tersedia';
          return res.status(404).json(errors);
        }

        res.json(kategori[0]);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @routes POST api/kategori
// @Desc Save some kategori
// @Access Private
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid } = validateTambahKategori(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM kategori WHERE kode_kategori = ?', [req.body.kode_kategori])
      .then(kategori => {
        if (kategori[0].length > 0) {
          errors.kode_kategori = "Kode kategori sudah digunakan";
          return res.status(400).json(errors);
        }

        // Save kategori to database
        db.execute('INSERT INTO kategori (kode_kategori, nama_kategori, deskripsi) VALUES (?, ?, ?)',
          [req.body.kode_kategori, req.body.nama_kategori, req.body.deskripsi])
          .then(() => {
            res.json({
              success: 'Success menyimpan kategori'
            })
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes POST api/kategori/update?kategori=AA
// @Desc Update some kategori
// @Access Private
router.post('/update', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid } = validateTambahKategori(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (!req.query.kategori) {
      errors.kategori = 'Query kategori tidak boleh kosong';
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM kategori WHERE kode_kategori = ?', [req.query.kategori])
      .then(data => {
        if (data[0].length < 1) {
          errors.kategori = 'Kategori tidak ditemukan';
          return res.status(400).json(errors);
        }

        db.execute('SELECT * FROM kategori WHERE kode_kategori = ? && kode_kategori != ?', 
          [req.body.kode_kategori, req.query.kategori])
          .then(kategori => {
            if (kategori[0].length > 0) {
              errors.kode_kategori = "Kode kategori sudah digunakan";
              return res.status(400).json(errors);
            }

            // Update kategori in database
            db.execute('UPDATE kategori SET kode_kategori = ?, nama_kategori = ?, deskripsi = ? WHERE kode_kategori = ?',
              [req.body.kode_kategori, req.body.nama_kategori, req.body.deskripsi, req.query.kategori])
              .then(() => {
                res.json({
                  success: 'Sukses mengubah kategori'
                })
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes DELETE api/kategori
// @Desc DELETE some kategori
// @Access Private
router.delete('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

		// Check validation
    if (!req.query.kategori) {
      errors.kategori = 'Kode kategori tidak boleh kosong';
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM kategori WHERE kode_kategori = ?', [req.query.kategori])
      .then(result => {
        if (result[0].length < 1) {
          errors.kategori = 'Kategori tidak ditemukan';
          return res.status(404).json(errors);
        }

        // Delete kategori
        db.execute('DELETE FROM kategori WHERE kode_kategori = ?', 
          [req.query.kategori])
          .then(() => {
            res.json({
              success: 'Success menghapus kategori',
            });
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
