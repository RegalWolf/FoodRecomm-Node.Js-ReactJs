const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Load database config
const db = require('../../config/database');
// Load input validation
const validateRegisterInput = require('../../validation/register');
// Load input validation
const validateLoginInput = require('../../validation/login');
// Load secretOrKey
const secretOrKey = require('../../config/keys').secretOrKey;

// @routes GET api/users/test
// @Access public
router.get('/test', (req, res) => res.json(
  { message: 'Users is works' }
));

// @routes POST api/users/register
// @Desc Register user
// @Access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  db.execute('SELECT * FROM pengguna WHERE username = ?', [req.body.username])
    .then(user => {
      if (user[0].length > 0) {
        errors.username = 'Username sudah digunakan';
        return res.status(404).json(errors);
      }

      const newUser = {
        nama: req.body.nama,
        username: req.body.username,
        password: req.body.password
      };

      bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;

        newUser.password = hash;
      
        db.execute(
          'INSERT INTO pengguna (nama, username, password) VALUES (?, ?, ?)',
          [newUser.nama, newUser.username, newUser.password])
          .then(() => res.json(
            { register: 'Register sukses' }
          ))
          .catch(() => res.status(404).json(
            { register: 'Register gagal' }
          ));
      });
    })
    .catch(err => res.status(404).json({err}));
});

// @routes POST api/users/login
// @Desc Login user
// @Access public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  db.execute('SELECT * FROM pengguna WHERE username = ?', [username])
    .then(user => {
      if (user[0].length < 1) {
        errors.username = 'Username tidak terdaftar';
        return res.status(404).json(errors);
      }

      const password2 = user[0][0].password;

      bcrypt.compare(password, password2)
        .then(isMatch => {
          console.log(isMatch);
          if (!isMatch) {
            errors.password = 'Password salah';
            return res.status(400).json(errors);
          }

          const payload = {
            id: user[0][0].id,
            nama: user[0][0].nama
          };

          console.log(payload);

          jwt.sign(payload, secretOrKey, { expiresIn: 2628002 }, (err, token) => {
            res.json({
              success: 'Login success',
              token: `Bearer ${token}`
            });
          });
        })
        .catch(err => res.status(404).json(err));
    })
    .catch(err => res.status(404).json({err}));
});

module.exports = router;
