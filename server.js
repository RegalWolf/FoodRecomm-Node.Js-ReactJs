const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

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
const admins = require('./routes/api/admin'); 
const kategori = require('./routes/api/kategori'); 
const prioritas = require('./routes/api/prioritas'); 

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Enable Cors Origin
app.use(cors());

// Use routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/kalori', kalori);
app.use('/api/history_makanan', history_makanan);
app.use('/api/makanan', makanan);
app.use('/api/makanan_disukai', makanan_disukai);
app.use('/api/makanan_tidak_disukai', makanan_tidak_disukai);
app.use('/api/admin', admins);
app.use('/api/kategori', kategori);
app.use('/api/prioritas', prioritas);

// Server static asset if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Port config
const port = process.env.PORT || 5000;

// Use port
app.listen(port, () => console.log(`Server running on port ${port}`));
