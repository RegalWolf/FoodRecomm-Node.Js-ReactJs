const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateProfileInput = require('../../validation/profile');

// @routes GET api/users/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Profiles is works' }
));

// @routes GET api/profiles
// @Desc Returning current users profile
// @Access Private
router.get('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const errors = {};

		db.execute(
			'SELECT pengguna.nama, profile.* FROM pengguna JOIN profile ON pengguna.id = profile.user_id WHERE user_id = ?', 
			[req.user.id])
			.then(profile => {
				if (profile[0].length < 1) {
					errors.noprofile = 'Tidak ada profile untuk pengguna ini';
					return res.status(404).json(errors);
				}

				res.json(profile[0][0]);
			})
			.catch(err => {
				res.status(404).json(err);
			});
  }
);

// Function hitung kalori pria
const hitungKaloriPria = (beratBadan, tinggiBadan, usia, tingkatAktivitas) => {
	// Hitung AMB
	const AMB = 66 + (13.7 * parseInt(beratBadan)) + (5 * parseInt(tinggiBadan)) - (6.8 * usia);

	// Hitung kebutuhan energi
	let nilai_aktivitas = 0;
	switch (tingkatAktivitas) {
		case 'sangat ringan':
			nilai_aktivitas = 1.30;
			break;
		case 'ringan':
			nilai_aktivitas = 1.65;
			break;
		case 'sedang':
			nilai_aktivitas = 1.76;
			break;
		case 'berat':
			nilai_aktivitas = 2.10;
			break;
	}
	let kebutuhan_energi = nilai_aktivitas * AMB;

	// Hitung IMT
	const IMT = beratBadan / ((tinggiBadan / 100) * (tinggiBadan / 100));
	switch (true) {
		case (IMT < 18.5):
			kebutuhan_energi += 500;
			break;
		case (IMT >= 25):
			kebutuhan_energi -= 500;
			break;
	}

	return kebutuhan_energi;
}

// Function hitung kalori perempuan
const hitungKaloriPerempuan = (beratBadan, tinggiBadan, usia, tingkatAktivitas) => {
	// Hitung AMB
	const AMB = 655 + (9.6 * parseInt(beratBadan)) + (1.8 * parseInt(tinggiBadan)) - (4.7 * usia);

	// Hitung kebutuhan energi
	let nilai_aktivitas = 0;
	switch (tingkatAktivitas) {
		case 'sangat ringan':
			nilai_aktivitas = 1.30;
			break;
		case 'ringan':
			nilai_aktivitas = 1.55;
			break;
		case 'sedang':
			nilai_aktivitas = 1.70;
			break;
		case 'berat':
			nilai_aktivitas = 2.00;
			break;
	}
	let kebutuhan_energi = nilai_aktivitas * AMB;

	// Hitung IMT
	const IMT = beratBadan / ((tinggiBadan / 100) * (tinggiBadan / 100));
	switch (true) {
		case (IMT < 18.5):
			kebutuhan_energi += 500;
			break;
		case (IMT >= 25):
			kebutuhan_energi -= 500;
			break;
	}

	return kebutuhan_energi;
}

// @routes POST api/profiles
// @Desc Create and update user profile
// @Access Private
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

		db.execute(
			'SELECT * FROM profile WHERE user_id = ?', 
			[req.user.id])
			.then(profile => {
				if (profile[0].length > 0) {
					// Update profile
					db.execute('UPDATE profile SET jenis_kelamin = ?, usia = ?, berat_badan = ?, tinggi_badan = ?, tingkat_aktivitas = ? WHERE user_id = ?',
						[req.body.jenis_kelamin, req.body.usia, req.body.berat_badan, 
							req.body.tinggi_badan, req.body.tingkat_aktivitas, req.user.id])
						.then(profile => {
							// Inisialisasi
							let kebutuhan_kalori = 0;

							// Hitung kalori yang dibutuhkan
							if (req.body.jenis_kelamin === 'L') { // Jika laki-laki
								// Memanggil function hitung kalori pria
								kebutuhan_kalori = hitungKaloriPria(req.body.berat_badan, 
									req.body.tinggi_badan, req.body.usia, req.body.tingkat_aktivitas);
							} else { // Jika perempuan
								// Memanggil function hitung kalori perempuan
								kebutuhan_kalori = hitungKaloriPerempuan(req.body.berat_badan, 
									req.body.tinggi_badan, req.body.usia, req.body.tingkat_aktivitas);
							}

							// Save to database
							db.execute('SELECT * FROM kalori where user_id = ?', [req.user.id])
								.then(kalori => {
									if (kalori[0].length > 0) { // Jika data kalori sudah ada
										// Update kalori
										db.execute('UPDATE kalori SET kalori_dibutuhkan = ? WHERE user_id = ?',
											[kebutuhan_kalori, req.user.id])
											.then(() => {
												res.json({
													profile: 'Success mengubah profile',
													kalori: 'Success mengubah kalori'
												})
											})
											.catch(err => res.status(404).json(err));
									} else { // Jika data kalori belum ada
										// Create kalori
										db.execute('INSERT INTO kalori (kalori_dibutuhkan, user_id) VALUES (?, ?)',
											[kebutuhan_kalori, req.user.id])
											.then(() => {
												res.json({
													profile: 'Success mengubah profile',
													kalori: 'Success menyimpan kalori'
												})
											})
											.catch(err => res.status(404).json(err));
									}
								})
								.catch(err => res.status(404).json(err));
						})
						.catch(err => res.status(404).json(err));
				} else {
					// Create profile
					db.execute(
						'INSERT INTO profile (jenis_kelamin, usia, tinggi_badan, berat_badan, tingkat_aktivitas, user_id) VALUES (?, ?, ?, ?, ?, ?)',
						[req.body.jenis_kelamin, req.body.usia, req.body.tinggi_badan, 
							req.body.berat_badan, req.body.tingkat_aktivitas, req.user.id])
						.then(profile => {
							// Inisialisasi
							let kebutuhan_kalori = 0;

							// Hitung kalori yang dibutuhkan
							if (req.body.jenis_kelamin === 'L') { // Jika laki-laki
								// Memanggil function hitung kalori pria
								kebutuhan_kalori = hitungKaloriPria(req.body.berat_badan, 
									req.body.tinggi_badan, req.body.usia, req.body.tingkat_aktivitas);
							} else { // Jika perempuan
								// Memanggil function hitung kalori perempuan
								kebutuhan_kalori = hitungKaloriPerempuan(req.body.berat_badan, 
									req.body.tinggi_badan, req.body.usia, req.body.tingkat_aktivitas);
							}

							// Save to database
							db.execute('SELECT * FROM kalori where user_id = ?', [req.user.id])
							.then(kalori => {
								if (kalori[0].length > 0) { // Jika data kalori sudah ada
									// Update kalori
									db.execute('UPDATE kalori SET kalori_dibutuhkan = ? WHERE user_id = ?',
										[kebutuhan_kalori, req.user.id])
										.then(() => {
											res.json({
												profile: 'Success menyimpan profile',
												kalori: 'Success mengubah kalori'
											})
										})
										.catch(err => res.status(404).json(err));
								} else { // Jika data kalori belum ada
									// Create kalori
									db.execute('INSERT INTO kalori (kalori_dibutuhkan, user_id) VALUES (?, ?)',
										[kebutuhan_kalori, req.user.id])
										.then(() => {
											res.json({
												profile: 'Success menyimpan profile',
												kalori: 'Success menyimpan kalori'
											})
										})
										.catch(err => res.status(404).json(err));
								}
							})
							.catch(err => res.status(404).json(err));

							res.json({ success: 'Success menyimpan profile' })
						})
						.catch(err => res.status(404).json(err));
				}
			})
			.catch(err => {
				res.status(404).json(err);
			});
  }
);

module.exports = router;
