const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const secretOrKey = require('./../config/keys').secretOrKey;
const db = require('../config/database');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      db.execute('SELECT * FROM pengguna WHERE pengguna_id = ?', [jwt_payload.id])
        .then(user => {
          if (user[0].length < 1) {
            return done(null, false);
          }

          return done(null, user[0][0]);
        })
        .catch(err => console.log(err));
    })
  );
};