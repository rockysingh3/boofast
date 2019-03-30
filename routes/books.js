const express = require('express');
const request = require('request');
const router = express.Router();
const axios = require('axios');
const { ensureAutheticated } = require('../config/auth');
const fs = require('fs');
const url = require('url');
const User = require('../models/user');
// router.get('/bookResults', (req, res) => {
//     res.render('bookResults');
// });



// renders a list of books user searched for
router.post('/bookResults', ensureAutheticated, (req, res) => {


    const searchText = req.query.searchForBook;
    const URL = 'https://www.googleapis.com/books/v1/volumes?q=' + searchText + '&maxResults=40&orderBy=relevance';


    request(URL, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let bookdata = JSON.parse(body);
            res.render('bookResults', { books: bookdata });
        } else {
            console.log(err);
        }
    });
});



// reders a single books user clicked on
router.get('/bookdetails/:id', (req, res) => {
    //console.log(`req is : ${req.body.ID}`);
    let id = req.params.id;
    //making a call to google books api with a ID of one book 
    const URL = 'https://www.googleapis.com/books/v1/volumes/' + id;
    request(URL, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let bookdata = JSON.parse(body);
            res.render('singlebookdetails', { bookdata: bookdata });
        } else {
            console.log(err);
        }
    });
});


router.get('/summary', (req, res) => {
    let isAuth = req.isAuthenticated();
    res.render('summaries', { isAuth: isAuth });
});

router.post('/summary/image', (req, res) => {
    let body = '';
    let randomNum = Math.floor(Math.random()*1000);
    filePath = __dirname + '\\images\\' + randomNum + '.jpg';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        fs.appendFile(filePath, body, function () {
            res.send({
                "uploaded": true,
                "url": filePath
            });
            res.end();
        });
    });
});





router.post('/summary', (req, res) => {
    // Stringify the object
    let isAuthenticated = req.isAuthenticated();
    let data = JSON.stringify(req.body);
    let currentUser = req.user;
    //console.log(currentUser);
    //console.log('id');
    //console.log(currentUser._id);
    JSON.parse(data, (key) => {
        currentUser.summary.push(key);
    });
    // save the updated user
    currentUser.save()
        .then(() => console.log('saved user'))
        //.then(() => res.redirect('/'))
        .catch(() => console.log('Couldnt save the user'))
    //res.redirect('welcome');
    // now that i have the id use it to update summary 
    // key is what user wrote for the summary
    // JSON.parse(data, (key) => {
    //     //currentUser.summary = key;
    //     //doesn't work
    //     currentUser.update({ summary: key });
    // });

    // console.log('After updating the summary filed');

    // // doesn't get updated
    // console.log(currentUser);
    //console.log(typeOf(summary));
});


// all the bookshelf routes
router.get('/bookshelf', ensureAutheticated, (req, res) => {
    let isAuth = req.isAuthenticated();
    res.render('bookshelf', { isAuth: isAuth });
})


module.exports = router;