const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateAdminLoginInput = require('../../validation/adminLogin');
// Load secretOrKey
const secretOrKey = require('../../config/keys').secretOrKey;

// @routes GET api/admin/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Admin is works' }
));

// @routes POST api/admin/login
// @Desc Login user
// @Access public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateAdminLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  db.execute('SELECT * FROM admin WHERE username = ?', [username])
    .then(admin => {
      if (admin[0].length < 1) {
        errors.username = 'Username tidak terdaftar';
        return res.status(404).json(errors);
      }

      const password2 = admin[0][0].password;

      if (password !== password2) {
        errors.password = 'Password tidak sesuai';
        return res.status(404).json(errors);
      }

      const payload = {
        id: admin[0][0].admin_id,
        nama: admin[0][0].nama
      };

      jwt.sign(payload, secretOrKey, {}, (err, token) => {
        res.json({
          success: 'Login success',
          token: `Bearer ${token}`
        });
      });
    })
    .catch(err => res.status(404).json({err}));
});

module.exports = router;
