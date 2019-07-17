const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Routes config
const users = require('./routes/api/user'); 
const profiles = require('./routes/api/profile'); 
const kalori = require('./routes/api/kalori'); 
const history_makanan = require('./routes/api/history_makanan'); 
const makanan = require('./routes/api/makanan'); 
const makanan_disukai = require('./routes/api/makanan_disukai'); 
const makanan_tidak_disukai = require('./routes/api/makanan_tidak_disukai');

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.get('/', (req, res) => {
  res.send({ app: 'Ready' });
});
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/kalori', kalori);
app.use('/api/history_makanan', history_makanan);
app.use('/api/makanan', makanan);
app.use('/api/makanan_disukai', makanan_disukai);
app.use('/api/makanan_tidak_disukai', makanan_tidak_disukai);

// Port config
const port = process.env.PORT || 5000;

// Use port
app.listen(port, () => console.log(`Server running on port ${port}`));
