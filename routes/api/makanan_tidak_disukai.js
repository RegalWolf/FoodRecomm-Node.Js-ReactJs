const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateTidakMakananDisukaiInput = require('../../validation/makanan_tidak_disukai');

// @routes GET api/history_makanan/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Makanan tidak disukai is works' }
));

// @routes GET api/makanan_tidak_disukai
// @Desc Returning current users makanan tidak disukai
// @Access Private
router.get('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    const errors = {};

		db.execute(
			'SELECT makanan.* FROM makanan_tidak_disukai JOIN makanan USING(makanan_id) WHERE pengguna_id = ?', 
			[req.user.pengguna_id])
			.then(makanan => {
				if (makanan[0].length < 1) {
					errors.noMakanan = 'Tidak ada makanan yang tidak disukai';
					return res.status(404).json(errors);
				}

				res.json(makanan[0]);
			})
			.catch(err => {
				res.status(404).json(err);
			});
  }
);

// @routes POST api/makanan_tidak_disukai
// @Desc Save some makanan tidak disukai
// @Access Private
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid } = validateTidakMakananDisukaiInput(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Save makanan to database
    db.execute('INSERT INTO makanan_tidak_disukai (pengguna_id, makanan_id) VALUES (?, ?)',
      [req.user.pengguna_id, req.body.makanan_id])
      .then(() => {
        res.json({
          success: "Success menyimpan makanan tidak disukai"
        })
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes DELETE api/makanan_tidak_disukai
// @Desc DELETE makanan tidak disukai
// @Access Private
router.delete('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

		// Check validation
    if (!req.query.makanan_id) {
      errors.makanan_id = 'Makanan_id tidak boleh kosong';
      return res.status(400).json(errors);
    }

    db.execute('SELECT makanan_id FROM makanan_tidak_disukai WHERE makanan_id = ?', [req.query.makanan_id])
      .then(result => {
        if (result[0].length < 1) {
          errors.makanan = 'Makanan tidak ditemukan';
          return res.status(404).json(errors);
        }

        // Delete makanan disukai
        db.execute('DELETE FROM makanan_tidak_disukai WHERE pengguna_id = ? && makanan_id = ?', 
          [req.user.pengguna_id, req.query.makanan_id])
          .then(() => {
            res.json({
              success: 'Success menghapus makanan tidak disukai',
            });
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
