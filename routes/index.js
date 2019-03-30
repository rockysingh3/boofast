const express = require('express');
const router = express.Router(); 
const { ensureAutheticated } = require('../config/auth');

// Welcome page
router.get('/', (req,res) => {
    let isAuthenticated = req.isAuthenticated();
    //console.log(isAuthenticated);
    res.render('welcome', { isAuthenticated : isAuthenticated });
})

// Dashboard
router.get('/dashboard', ensureAutheticated, (req, res) => {
    res.render('dashboard');

    //req.body.ed
});


module.exports = router;