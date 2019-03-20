const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


const User = require('../models/user');

// Login Page
router.get('/login', (req, res) => res.render('login'));


// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle, handles form data
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields, make sure none of them are empty
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    // Check password length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    // if there are errors send them over to register.ejs
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2 
        })
    }else{
            User.findOne({ email: email })
                .then(user => {
                    if(user) {
                        // User exists
                        errors.push({ msg: 'Email is already registered' });
                        res.render('register', {
                            errors,
                            name,
                            email,
                            password,
                            password2 
                        })
                    }else {
                        const newUser = new User({
                            name,
                            email,
                            password
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if(err) throw err;
                                // store the hash in password
                                newUser.password = hash;
                                // save the new user
                                newUser.save()
                                    // if succes then redirect
                                    .then(user => {
                                        req.flash('success_msg', 'You are now registered');
                                        res.redirect('/user/login');
                                    })
                                    .catch(err => console.log(err));
                            })
                        })
                    }
                });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
})

module.exports = router;