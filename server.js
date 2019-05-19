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

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
// app.use('/api/profiles', profiles);
// app.use('/api/kalori', kalori);
// app.use('/api/history_makanan', history_makanan);
app.use('/api/makanan', makanan);

// Port config
const port = process.env.PORT || 5000;

// Use port
app.listen(port, () => console.log(`Server running on port ${port}`));
