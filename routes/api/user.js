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

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  };

  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = 'Password tidak sama';
    return res.status(400).json(errors);
  }

  db.execute('SELECT * FROM pengguna WHERE email = ?', [req.body.email])
    .then(user => {
      if (user[0].length > 0) {
        errors.email = 'Email sudah digunakan';
        return res.status(404).json(errors);
      }

      bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;

        newUser.password = hash;

        db.execute(
          'INSERT INTO pengguna (email, password) VALUES (?, ?)',
          [newUser.email, newUser.password])
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

  const email = req.body.email;
  const password = req.body.password;

  db.execute('SELECT * FROM pengguna WHERE email = ?', [email])
    .then(user => {
      if (user[0].length < 1) {
        errors.email = 'Email tidak terdaftar';
        return res.status(404).json(errors);
      }

      const password2 = user[0][0].password;

      bcrypt.compare(password, password2)
        .then(isMatch => {
          if (!isMatch) {
            errors.password = 'Password salah';
            return res.status(400).json(errors);
          }

          const payload = {
            id: user[0][0].pengguna_id
          };

          jwt.sign(payload, secretOrKey, {}, (err, token) => {
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
