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
		const errors = {
			noKalori: null
		};

		db.execute(
			'SELECT * FROM history_kalori WHERE pengguna_id = ? && tanggal = CURDATE()', 
			[req.user.pengguna_id])
			.then(kalori => {
				if (kalori[0].length < 1) {
					db.execute('SELECT * FROM history_kalori WHERE pengguna_id = ? ORDER BY tanggal DESC',
						[req.user.pengguna_id])
						.then(history_kalori => {
							const d = new Date();
							const now =
									d.getFullYear() + "-" + 
									("00" + (d.getMonth() + 1)).slice(-2) + "-" + 
									("00" + d.getDate()).slice(-2);
							db.execute(
								'INSERT INTO history_kalori (kalori_dibutuhkan, kondisi_tubuh, pengguna_id, tanggal) VALUES (?, ?, ?, ?)',
								[history_kalori[0][0].kalori_dibutuhkan, history_kalori[0][0].kondisi_tubuh, req.user.pengguna_id, now])
								.then(() => {
									db.execute(
										'SELECT * FROM history_kalori WHERE pengguna_id = ? && tanggal = CURDATE()', 
										[req.user.pengguna_id])
										.then(kalori2 => {
											if (kalori2[0].length < 1) {
												errors.noKalori = 'Tidak ada data kalori untuk pengguna ini';
												return res.status(404).json(errors);
											}

											const tgl = new Date(kalori2[0][0].tanggal);
											kalori2[0][0].tanggal = 
													tgl.getFullYear() + "-" + 
													("00" + (tgl.getMonth() + 1)).slice(-2) + "-" + 
													("00" + tgl.getDate()).slice(-2);

											res.json(kalori2[0][0]);
										})
										.catch(err => {
											res.status(404).json(err);
										});
								})
								.catch(err => res.status(404).json(err));
						})
						.catch(err => {
							res.status(404).json(err);
						});
				} else {
					const tgl = new Date(kalori[0][0].tanggal);
					kalori[0][0].tanggal = 
							tgl.getFullYear() + "-" + 
							("00" + (tgl.getMonth() + 1)).slice(-2) + "-" + 
							("00" + tgl.getDate()).slice(-2);

					res.json(kalori[0][0]);
				}
			})
			.catch(err => {
				res.status(404).json(err);
			});
  }
);


// @routes GET api/kalori/all
// @Desc Returning all users kalori
// @Access Private
router.get('/all',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const errors = {
			noKalori: null
		};

		db.execute(
			'SELECT * FROM history_kalori WHERE pengguna_id = ? ORDER BY tanggal DESC', [req.user.pengguna_id])
			.then(kalori => {
				if (kalori[0].length < 1) {
					errors.noKalori = 'Tidak ada data kalori untuk pengguna ini';
					return res.status(404).json(errors);
				}

				for (let i = 0; i < kalori[0].length; i++) {
					let tgl = new Date(kalori[0][i].tanggal);
					kalori[0][i].tanggal = 
							tgl.getFullYear() + "-" + 
							("00" + (tgl.getMonth() + 1)).slice(-2) + "-" + 
							("00" + tgl.getDate()).slice(-2);
				}

				res.json(kalori[0]);
			})
			.catch(err => {
				res.json(404).json(err);
			})
	});

module.exports = router;
