const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateMakananInput = require('../../validation/history_makanan');

// @routes GET api/history_makanan/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'History makanan is works' }
));

// @routes GET api/history_makanan
// @Desc Returning current users history makanan
// @Access Private
router.get('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const errors = {};

		db.execute(
			'SELECT * FROM history_makanan WHERE user_id = ?', 
			[req.user.id])
			.then(makanan => {
				if (makanan[0].length < 1) {
					errors.nokalori = 'Tidak ada data makanan untuk pengguna ini';
					return res.status(404).json(errors);
				}

				res.json(makanan[0][0]);
			})
			.catch(err => {
				res.status(404).json(err);
			});
  }
);

// @routes POST api/history_makanan
// @Desc Save some history makanan
// @Access Private
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid } = validateMakananInput(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Save makanan to database
    db.execute('INSERT INTO history_makanan (nama, kalori, gambar, user_id) VALUES (?, ?, ?, ?)',
      [req.body.nama, req.body.kalori, req.body.gambar, req.user.id])
      .then(result => {
        // Update data kalori dikonsumsi
        db.execute(
          'UPDATE kalori SET kalori_dikonsumsi = kalori_dikonsumsi + ? WHERE user_id = ? AND DATE_FORMAT(tanggal, "%d %m %Y") = (SELECT DATE_FORMAT(tanggal, "%d %m %Y") FROM history_makanan WHERE id = ?)',
          [req.body.kalori, req.user.id, result[0].insertId])
          .then(() => {
            res.json({
              makanan: 'Success menyimpan makanan',
              kalori: 'Success menambah kalori yang dikonsumsi'
            });
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes DELETE api/history_makanan
// @Desc DELETE history makanan
// @Access Private
router.delete('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

		// Check validation
    if (!req.body.id) {
      errors.id = 'Id tidak boleh kosong';
      return res.status(400).json(errors);
    }

    db.execute('SELECT kalori FROM history_makanan WHERE id = ?', [req.body.id])
      .then(result => {
        if (result[0].length < 1) {
          errors.makanan = 'Makanan tidak ditemukan';
          return res.status(404).json(errors);
        }

        // Update data kalori dikonsumsi
        db.execute(
          'UPDATE kalori SET kalori_dikonsumsi = kalori_dikonsumsi - ? WHERE user_id = ? AND DATE_FORMAT(tanggal, "%d %m %Y") = (SELECT DATE_FORMAT(tanggal, "%d %m %Y") FROM history_makanan WHERE id = ?)',
          [result[0][0].kalori, req.user.id, req.body.id])
          .then(result2 => {
            console.log(result2);
            console.log(result[0][0].kalori);
            db.execute('DELETE FROM history_makanan WHERE id = ?', [req.body.id])
              .then(() => {
                res.json({
                  makanan: 'Success menghapus makanan',
                  kalori: 'Success mengurangi kalori yang dikonsumsi'
                });
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  });

module.exports = router;
