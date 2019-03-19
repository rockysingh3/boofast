const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// initiain express
const app = express();


// Passport config
require('./config/passport')(passport);
// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('I made it'))
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

    // setting up ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');


// BodyParser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// passport middleware
// always put it after express session
app.use(passport.initialize());
app.use(passport.session());


// connect flsh
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error_msg');
    next();
});


// rendering all the Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/book', require('./routes/books'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));