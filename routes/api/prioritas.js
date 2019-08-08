const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateTambahPrioritas = require('../../validation/tambahPrioritas');

// @routes GET api/prioritas/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Prioritas is works' }
));

// @routes GET api/prioritas/all
// @Desc Returning all prioritas
// @Access Private
router.get('/all', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

    db.execute('SELECT * FROM prioritas')
      .then(prioritas => {
        if (prioritas[0].length < 1) {
          errors.prioritas = 'Prioritas tidak tersedia';
          return res.status(404).json(errors);
        }

        res.json(prioritas[0]);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @routes POST api/prioritas
// @Desc Save some prioritas
// @Access Private
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid } = validateTambahPrioritas(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM prioritas WHERE prioritas = ?', [req.body.prioritas])
      .then(prioritas => {
        if (prioritas[0].length > 0) {
          errors.prioritas = "Prioritas sudah digunakan";
          return res.status(400).json(errors);
        }

        db.execute('SELECT * FROM prioritas WHERE tingkat_prioritas = ?', [req.body.tingkat_prioritas])
          .then(tingkat_prioritas => {
            if (tingkat_prioritas[0].length > 0) {
              errors.tingkat_prioritas = "Tingkat prioritas sudah digunakan";
              return res.status(400).json(errors);
            }

            // Save prioritas to database
            db.execute('INSERT INTO prioritas (prioritas, tingkat_prioritas, deskripsi) VALUES (?, ?, ?)',
              [req.body.prioritas, req.body.tingkat_prioritas, req.body.deskripsi])
              .then(() => {
                res.json({
                  success: 'Success menyimpan prioritas'
                })
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes POST api/prioritas/update?prioritas=AA
// @Desc Update some prioritas
// @Access Private
router.post('/update', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid } = validateTambahPrioritas(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (!req.query.prioritas) {
      errors.prioritas = 'Query prioritas tidak boleh kosong';
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM prioritas WHERE prioritas = ?', [req.query.prioritas])
      .then(data => {
        if (data[0].length < 1) {
          errors.prioritas = 'Prioritas tidak ditemukan';
          return res.status(400).json(errors);
        }

        db.execute('SELECT * FROM prioritas WHERE prioritas = ? && prioritas != ?', 
          [req.body.prioritas, req.query.prioritas])
          .then(prioritas => {
            if (prioritas[0].length > 0) {
              errors.prioritas = "Prioritas sudah digunakan";
              return res.status(400).json(errors);
            }

            db.execute('SELECT * FROM prioritas WHERE tingkat_prioritas = ? && tingkat_prioritas != (SELECT tingkat_prioritas FROM prioritas WHERE prioritas = ?)', 
              [req.body.tingkat_prioritas, req.query.prioritas])
              .then(tingkat_prioritas => {
                if (tingkat_prioritas[0].length > 0) {
                  errors.tingkat_prioritas = "Tingkat prioritas sudah digunakan";
                  return res.status(400).json(errors);
                }

                // Update prioritas in database
                db.execute('UPDATE prioritas SET prioritas = ?, tingkat_prioritas = ?, deskripsi = ? WHERE prioritas = ?',
                  [req.body.prioritas, req.body.tingkat_prioritas, req.body.deskripsi, req.query.prioritas])
                  .then(() => {
                    res.json({
                      success: 'Sukses mengubah prioritas'
                    })
                  })
                  .catch(err => res.status(404).json(err));
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes DELETE api/prioritas
// @Desc DELETE some prioritas
// @Access Private
router.delete('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

		// Check validation
    if (!req.query.prioritas) {
      errors.prioritas = 'Prioritas tidak boleh kosong';
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM prioritas WHERE prioritas = ?', [req.query.prioritas])
      .then(result => {
        if (result[0].length < 1) {
          errors.prioritas = 'Prioritas tidak ditemukan';
          return res.status(404).json(errors);
        }

        // Delete prioritas
        db.execute('DELETE FROM prioritas WHERE prioritas = ?', 
          [req.query.prioritas])
          .then(() => {
            res.json({
              success: 'Success menghapus prioritas',
            });
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
