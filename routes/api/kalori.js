const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');

// @routes GET api/kalori/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Kalori is works' }
));

// @routes GET api/kalori
// @Desc Returning current users kalori
// @Access Private
router.get('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const errors = {};

		db.execute(
			'SELECT * FROM kalori WHERE user_id = ? && DATE(tanggal) = CURDATE()', 
			[req.user.id])
			.then(kalori => {
				if (kalori[0].length < 1) {
					errors.nokalori = 'Tidak ada data kalori untuk pengguna ini';
					return res.status(404).json(errors);
				}

				res.json(kalori[0][0]);
			})
			.catch(err => {
				res.status(404).json(err);
			});
  }
);

module.exports = router;
