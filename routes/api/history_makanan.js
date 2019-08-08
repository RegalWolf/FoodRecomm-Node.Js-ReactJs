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
    
    if (req.query.tanggal == null) {
      errors.tanggal = 'Tanggal harus diisi';
      return res.status(400).json(errors);
    }

		db.execute(
			'SELECT * FROM makanan JOIN history_makanan USING(makanan_id) WHERE pengguna_id = ? AND DATE(tanggal) = ?', 
			[req.user.pengguna_id, req.query.tanggal])
			.then(makanan => {
				if (makanan[0].length < 1) {
					errors.nokalori = 'Tidak ada makanan yang tersimpan pada tanggal ini';
					return res.status(404).json(errors);
				}

				res.json(makanan[0]);
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

    const d = new Date();
    const now =
        d.getFullYear() + "/" + 
        ("00" + (d.getMonth() + 1)).slice(-2) + "/" + 
        ("00" + d.getDate()).slice(-2) + " " + 
        ("00" + d.getHours()).slice(-2) + ":" + 
        ("00" + d.getMinutes()).slice(-2) + ":" + 
        ("00" + d.getSeconds()).slice(-2);

    db.execute('SELECT * FROM makanan WHERE makanan_id = ?', [req.body.makanan_id])
      .then(makanan => {
        if (makanan[0].length < 1) {
          errors.makanan_id = 'Makanan tidak tersedia';
          return res.status(400).json(errors);
        }

        const totalKalori = (req.body.jumlah / 100) * makanan[0][0].kalori;

        // Save makanan to database
        db.execute('INSERT INTO history_makanan (pengguna_id, makanan_id, tanggal, jumlah, total_kalori) VALUES (?, ?, ?, ?, ?)',
          [req.user.pengguna_id, req.body.makanan_id, now, req.body.jumlah, totalKalori])
          .then(result => {
            // Update data kalori dikonsumsi
            db.execute(
              'UPDATE history_kalori SET kalori_dikonsumsi = kalori_dikonsumsi + ? WHERE pengguna_id = ? AND DATE_FORMAT(tanggal, "%d %m %Y") = DATE_FORMAT(NOW(), "%d %m %Y")',
              [totalKalori, req.user.pengguna_id])
              .then(() => {
                res.json({
                  makanan: 'Success menyimpan makanan',
                  kalori: 'Success menambah kalori yang dikonsumsi'
                });
              })
              .catch(err => res.status(404).json(err));
          })
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @routes DELETE api/history_makanan
// @Desc DELETE history makanan
// @Access Private
// router.delete('/',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     const errors = {};

// 		// Check validation
//     if (!req.query.id) {
//       errors.id = 'Id tidak boleh kosong';
//       return res.status(400).json(errors);
//     }

//     db.execute('SELECT kalori FROM history_makanan WHERE history_kalori_id = ?', [req.query.id])
//       .then(result => {
//         if (result[0].length < 1) {
//           errors.makanan = 'Makanan tidak ditemukan';
//           return res.status(404).json(errors);
//         }

//         // Update data kalori dikonsumsi
//         db.execute(
//           'UPDATE history_kalori SET kalori_dikonsumsi = kalori_dikonsumsi - ? WHERE pengguna_id = ? AND DATE_FORMAT(tanggal, "%d %m %Y") = (SELECT DATE_FORMAT(tanggal, "%d %m %Y") FROM history_makanan WHERE history_makanan_id = ?)',
//           [result[0][0].kalori, req.user.pengguna_id, req.query.id])
//           .then(result2 => {
//             db.execute('DELETE FROM history_makanan WHERE id = ?', [req.query.id])
//               .then(() => {
//                 res.json({
//                   makanan: 'Success menghapus makanan',
//                   kalori: 'Success mengurangi kalori yang dikonsumsi'
//                 });
//               })
//               .catch(err => res.status(404).json(err));
//           })
//           .catch(err => res.status(404).json(err));
//       })
//       .catch(err => res.status(404).json(err));
//   });

module.exports = router;
