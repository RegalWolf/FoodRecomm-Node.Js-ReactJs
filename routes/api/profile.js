const express = require('express');
const passport = require('passport');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateProfileInput = require('../../validation/profile');

// @routes GET api/profiles/test
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
			'SELECT * FROM profile WHERE profile_id = ?', 
			[req.user.pengguna_id])
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
		case 'Sangat ringan':
			nilai_aktivitas = 1.30;
			break;
		case 'Ringan':
			nilai_aktivitas = 1.65;
			break;
		case 'Sedang':
			nilai_aktivitas = 1.76;
			break;
		case 'Berat':
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
		case (IMT >= 27):
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
		case 'Sangat Ringan':
			nilai_aktivitas = 1.30;
			break;
		case 'Ringan':
			nilai_aktivitas = 1.55;
			break;
		case 'Sedang':
			nilai_aktivitas = 1.70;
			break;
		case 'Berat':
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

const deteksiKondisiTubuh = (beratBadan, tinggiBadan) => {
	let kondisi_tubuh = "Normal";

	const IMT = beratBadan / ((tinggiBadan / 100) * (tinggiBadan / 100));

	switch (true) {
		case (IMT < 17):
			kondisi_tubuh = "Sangat Kurus";
			break;
		case (IMT >= 17 && IMT < 18.5):
				kondisi_tubuh = "Kurus";
				break;
		case (IMT >= 25 && IMT < 27):
				kondisi_tubuh = "Gemuk";
				break;
		case (IMT >= 27):
				kondisi_tubuh = "Diabetes";
				break;
	}

	return kondisi_tubuh;
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

		const kondisi_tubuh = deteksiKondisiTubuh(req.body.berat_badan, req.body.tinggi_badan);

		db.execute(
			'SELECT * FROM profile WHERE profile_id = ?', 
			[req.user.pengguna_id])
			.then(profile => {
				if (profile[0].length > 0) {
					// Update profile
					db.execute('UPDATE profile SET jenis_kelamin = ?, usia = ?, berat_badan = ?, tinggi_badan = ?, tingkat_aktivitas = ? WHERE profile_id = ?',
						[req.body.jenis_kelamin, req.body.usia, req.body.berat_badan, 
							req.body.tinggi_badan, req.body.tingkat_aktivitas, req.user.pengguna_id])
						.then(() => {
							const d = new Date();
							const now =
									d.getFullYear() + "/" + 
									("00" + (d.getMonth() + 1)).slice(-2) + "/" + 
									("00" + d.getDate()).slice(-2) + " " + 
									("00" + d.getHours()).slice(-2) + ":" + 
									("00" + d.getMinutes()).slice(-2) + ":" + 
									("00" + d.getSeconds()).slice(-2);
							// Update kalori
							db.execute('UPDATE history_kalori SET kalori_dibutuhkan = ?, kondisi_tubuh = ?, tanggal = ? WHERE pengguna_id = ? && DATE(tanggal) = CURDATE()',
								[kebutuhan_kalori, kondisi_tubuh, now, req.user.pengguna_id])
								.then(() => {
									res.json({
										profile: 'Success mengubah profile',
										kalori: 'Success mengubah kalori'
									})
								})
								.catch(err => res.status(404).json(err));
						})
						.catch(err => res.status(404).json(err));
				} else {
					// Create profile
					db.execute(
						'INSERT INTO profile (jenis_kelamin, usia, tinggi_badan, berat_badan, tingkat_aktivitas, profile_id) VALUES (?, ?, ?, ?, ?, ?)',
						[req.body.jenis_kelamin, req.body.usia, req.body.tinggi_badan, 
							req.body.berat_badan, req.body.tingkat_aktivitas, req.user.pengguna_id])
						.then(() => {
							// Create kalori
							const d = new Date();
							const now =
									d.getFullYear() + "/" + 
									("00" + (d.getMonth() + 1)).slice(-2) + "/" + 
									("00" + d.getDate()).slice(-2) + " " + 
									("00" + d.getHours()).slice(-2) + ":" + 
									("00" + d.getMinutes()).slice(-2) + ":" + 
									("00" + d.getSeconds()).slice(-2);

							db.execute('INSERT INTO history_kalori (kalori_dibutuhkan, kondisi_tubuh, tanggal, pengguna_id) VALUES (?, ?, ?, ?)',
								[kebutuhan_kalori, kondisi_tubuh, now, req.user.pengguna_id])
								.then(() => {
									res.json({
										profile: 'Success menyimpan profile',
										kalori: 'Success menyimpan kalori'
									})
								})
								.catch(err => res.status(404).json(err));
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
