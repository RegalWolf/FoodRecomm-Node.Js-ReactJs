const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateTambahMakanan = require('../../validation/tambahMakanan');
const validateRekomendasiMakanan = require('../../validation/rekomendasi_makanan');
const validatePencarianMakanan = require('../../validation/pencarianMakanan');

// @routes GET api/makanan/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Makanan is works' }
));

// @routes GET api/rekomendasi/makanan
// @Desc Returning makanan
// @Access Private
router.get('/rekomendasi/all', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const { errors, isValid } = validateRekomendasiMakanan(req.query);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM makanan JOIN prioritas USING(prioritas) ' +
      'WHERE makanan_id NOT IN (SELECT makanan_id FROM makanan_tidak_disukai WHERE pengguna_id = ?) ' +
      'AND makanan_id NOT IN (SELECT makanan_id FROM history_makanan WHERE pengguna_id = ? AND DATE(tanggal) = CURDATE() - INTERVAL 1 DAY) ' +
      'AND kalori BETWEEN 0 AND ? ' +
      'AND prioritas != "Dihindari" ' +
      'AND kode_kategori LIKE "P%" ' +
      'ORDER BY tingkat_prioritas, kalori',
      [req.user.pengguna_id, req.user.pengguna_id, req.query.kalori_max])
      .then(makanan => {
        if (makanan[0].length < 1) {
          errors.rekomendasi_makanan = 'Rekomendasi makanan tidak tersedia';
          return res.status(404).json(errors);
        }

        res.json(makanan[0]);
      })
      .catch(err => {
        res.status(404).json(err);
      });
    }
);

// @routes GET api/makanan/rekomendasi/kategori
// @Desc Returning makanan kategori
// @Access Private
router.get('/rekomendasi/kategori/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const { errors, isValid } = validateRekomendasiMakanan(req.query);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (!req.query.kode_kategori) {
      errors.kode_kategori = "Kode_kategori makanan tidak boleh kosong";
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM kategori WHERE kode_kategori LIKE ?', [req.query.kode_kategori])
      .then(kategori => {
        if (kategori[0].length < 1) {
          errors.kode_kategori = "Kode kategori makanan tidak ditemukan";
          return res.status(404).json(errors);
        }

        db.execute('SELECT * FROM makanan JOIN prioritas USING(prioritas) ' +
          'WHERE makanan_id NOT IN (SELECT makanan_id FROM makanan_tidak_disukai WHERE pengguna_id = ?) ' +
          'AND makanan_id NOT IN (SELECT makanan_id FROM history_makanan WHERE pengguna_id = ? AND DATE(tanggal) = CURDATE() - INTERVAL 1 DAY) ' +
          'AND kalori BETWEEN 0 AND ? ' +
          'AND prioritas != "Dihindari" ' +
          'AND kode_kategori LIKE ? ' +
          'ORDER BY tingkat_prioritas, kalori',
          [req.user.pengguna_id, req.user.pengguna_id, req.query.kalori_max, req.query.kode_kategori])
          .then(makanan => {
            if (makanan[0].length < 1) {
              errors.rekomendasi_makanan = 'Rekomendasi makanan tidak tersedia';
              return res.status(404).json(errors);
            }

            res.json(makanan[0]);
          })
          .catch(err => {
            res.status(404).json(err);
          });
      })
      .catch(err => {
        res.status(404).json(err);
      });
    }
);

// @routes GET api/makanan/search
// @Desc Returning makanan
// @Access Private
router.get('/search/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const { isValid, errors } = validatePencarianMakanan(req.query);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM makanan WHERE nama LIKE ?', ["%" + req.query.nama + "%"])
      .then(makanan => {
        if (makanan[0].length < 1) {
          errors.makanan = 'Makanan tidak ditemukan';
          return res.status(404).json(errors);
        }

        res.json(makanan[0]);
      })
      .catch(err => {
        res.status(404).json(err);
      })
  }
);

// @routes GET api/makanan/all
// @Desc Returning all makanan
// @Access Private
router.get('/all', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

    db.execute('SELECT * FROM makanan')
      .then(makanan => {
        if (makanan[0].length < 1) {
          errors.makanan = 'Makanan tidak tersedia';
          return res.status(404).json(errors);
        }

        res.json(makanan[0]);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @routes GET api/makanan/kategori/all
// @Desc Returning all makanan
// @Access Private
router.get('/kategori/all', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

    db.execute('SELECT * FROM makanan WHERE kode_kategori LIKE "P%" ORDER BY RAND()')
      .then(makanan => {
        if (makanan[0].length < 1) {
          errors.makanan = 'Makanan tidak tersedia';
          return res.status(404).json(errors);
        }

        res.json(makanan[0]);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @routes GET api/makanan/kategori
// @Desc Returning kategori makanan
// @Access Private
router.get('/kategori/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

    if (!req.query.kode_kategori) {
      errors.kode_kategori = "Kode_kategori makanan tidak boleh kosong";
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM kategori WHERE kode_kategori LIKE ?', [req.query.kode_kategori])
      .then(kategori => {
        if (kategori[0].length < 1) {
          errors.kode_kategori = "Kode kategori makanan tidak ditemukan";
          return res.status(404).json(errors);
        }

        db.execute('SELECT * FROM makanan WHERE kode_kategori LIKE ? ORDER BY RAND()', [req.query.kode_kategori])
          .then(makanan => {
            if (makanan[0].length < 1) {
              errors.makanan = 'Makanan tidak tersedia';
              return res.status(404).json(errors);
            }

            res.json(makanan[0]);
          })
          .catch(err => {
            res.status(404).json(err);
          });
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @routes GET api/makanan/prioritas
// @Desc Returning prioritas makanan
// @Access Private
router.get('/prioritas/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

    if (!req.query.prioritas) {
      errors.prioritas = "prioritas makanan tidak boleh kosong";
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM prioritas WHERE prioritas LIKE ?', [req.query.prioritas])
      .then(prioritas => {
        if (prioritas[0].length < 1) {
          errors.prioritas = "Prioritas makanan tidak ditemukan";
          return res.status(404).json(errors);
        }

        db.execute('SELECT * FROM makanan WHERE prioritas LIKE ? AND kode_kategori LIKE "P%" ORDER BY RAND()', [req.query.prioritas])
          .then(makanan => {
            if (makanan[0].length < 1) {
              errors.makanan = 'Makanan tidak tersedia';
              return res.status(404).json(errors);
            }

            res.json(makanan[0]);
          })
          .catch(err => {
            res.status(404).json(err);
          });
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @routes POST api/makanan
// @Desc Save some makanan
// @Access Private
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid, makanan } = validateTambahMakanan(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM kategori WHERE kode_kategori = ?', [req.body.kategori])
      .then(kategori => {
        if (kategori[0].length < 1) {
          errors.kategori = "Kategori tidak tersedia";
          return res.status(404).json(errors);
        }

        db.execute('SELECT * FROM prioritas WHERE prioritas = ?', [req.body.prioritas])
          .then(prioritas => {
            if (prioritas[0].length < 1) {
              errors.prioritas = "Prioritas tidak tersedia";
              return res.status(404).json(errors);
            }

            // Save makanan to database
            db.execute(
              'INSERT INTO makanan (nama, kalori, protein, lemak, karbohidrat, ' +
              'kalsium, fosfor, zat_besi, vit_a, vit_b1, vit_c, kode_kategori, prioritas) ' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [
                req.body.nama, req.body.kalori, makanan.protein, makanan.lemak, makanan.karbohidrat, 
                makanan.kalsium, makanan.fosfor, makanan.zat_besi, makanan.vit_a, makanan.vit_b1, 
                makanan.vit_c, req.body.kategori, prioritas[0][0].prioritas
              ])
              .then(() => {
                res.json({
                  success: "Success menyimpan makanan"
                })
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes POST api/makanan/update?makanan_id=1
// @Desc Update some makanan
// @Access Private
router.post('/update', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    db.execute('SELECT * FROM makanan WHERE makanan_id = ?', [req.query.makanan_id])
      .then(data => {
        if (data[0].length < 1) {
          errors.makanan_id = 'Makanan tidak ditemukan';
          return res.status(400).json(errors);
        }

        const { errors, isValid, makanan } = validateTambahMakanan(req.body);

        // Check validation
        if (!isValid) {
          return res.status(400).json(errors);
        }

        if (!req.query.makanan_id) {
          errors.makanan_id = 'Query makanan id tidak boleh kosong';
          return res.status(400).json(errors);
        }

        db.execute('SELECT * FROM kategori WHERE kode_kategori = ?', [req.body.kategori])
          .then(kategori => {
            if (kategori[0].length < 1) {
              errors.kategori = "Kategori tidak tersedia";
              return res.status(404).json(errors);
            }

            db.execute('SELECT * FROM prioritas WHERE prioritas = ?', [req.body.prioritas])
              .then(prioritas => {
                if (prioritas[0].length < 1) {
                  errors.prioritas = "Prioritas tidak tersedia";
                  return res.status(404).json(errors);
                }

                // Update makanan in database
                db.execute('UPDATE makanan SET nama = ?, kalori = ?, protein = ?, lemak = ?, karbohidrat = ?, '+
                  'kalsium = ?, fosfor = ?, zat_besi = ?, vit_a =?, vit_b1 = ?, vit_c = ?, kode_kategori = ?, ' +
                  'prioritas = ? WHERE makanan_id = ?',
                  [
                    req.body.nama, req.body.kalori, makanan.protein, makanan.lemak, makanan.karbohidrat, 
                    makanan.kalsium, makanan.fosfor, makanan.zat_besi, makanan.vit_a, makanan.vit_b1, 
                    makanan.vit_c, req.body.kategori, prioritas[0][0].prioritas, req.query.makanan_id
                  ])
                  .then(() => {
                    res.json({
                      success: 'Sukses mengubah makanan'
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

// @routes DELETE api/makanan
// @Desc DELETE some makanan
// @Access Private
router.delete('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

		// Check validation
    if (!req.query.makanan_id) {
      errors.makanan_id = 'Makanan id tidak boleh kosong';
      return res.status(400).json(errors);
    }

    db.execute('SELECT * FROM makanan WHERE makanan_id = ?', [req.query.makanan_id])
      .then(result => {
        if (result[0].length < 1) {
          errors.makanan_id = 'Makanan tidak ditemukan';
          return res.status(404).json(errors);
        }

        // Delete makanan
        db.execute('DELETE FROM makanan WHERE makanan_id = ?', 
          [req.query.makanan_id])
          .then(() => {
            res.json({
              success: 'Success menghapus makanan',
            });
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
