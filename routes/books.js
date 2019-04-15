const express = require('express');
const request = require('request');
const router = express.Router();
const { ensureAutheticated } = require('../config/auth');
const fs = require('fs');
const url = require('url');
const User = require('../models/user');
const Summary = require('../models/summary');
const fetch = require('node-fetch');
// router.get('/bookResults', (req, res) => {
//     res.render('bookResults');
// });



/* Global var to store the _id of a single book user clicks on
   This var is shared amonge routes as the user navigates the site 
*/
let currentBookID;


/*  This route renders a list of books user searched for
    Once the data is fetched its rendered to bookResults.ejs as an object    
*/
router.post('/bookResults', ensureAutheticated, (req, res) => {


    const searchText = req.query.searchForBook;
    const URL = 'https://www.googleapis.com/books/v1/volumes?q=' + searchText + '&maxResults=40&orderBy=relevance';


    // request(URL, (err, response, body) => {
    //     if (!err && response.statusCode == 200) {
    //         let bookdata = JSON.parse(body);
    //         res.render('bookResults', { books: bookdata });
    //     } else {
    //         console.log(err);
    //     }
    // });
    // convert the [object] at title to JSON
    fetch(URL)
            .then((res) => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                res.render('bookResults', { books: data });
            })
            .catch(err => console.log(err));
});



// reders a single books user clicked on
router.get('/bookdetails/:id', (req, res) => {
    //console.log(`req is : ${req.body.ID}`);
    //let id = req.params.id;
    currentBookID = req.params.id;
    //making a call to google books api with a ID of one book 
    const URL = 'https://www.googleapis.com/books/v1/volumes/' + currentBookID;


        fetch(URL)
            .then((res) => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                res.render('singlebookdetails', { bookdata: data });
            })
            .catch(err => console.log(err));

    // request(URL, (err, response, body) => {
    //     if (!err && response.statusCode == 200) {
    //         let bookdata = JSON.parse(body);
    //         //console.log(bookdata)
    //         res.render('singlebookdetails', { bookdata: bookdata });
    //     } else {
    //         //console.log(`error ${err}`);
    //     }
    // })

});


router.get('/summary', (req, res) => {
    let isAuth = req.isAuthenticated();
    res.render('summaries', { isAuth: isAuth, currentBookID: currentBookID });
});





router.post('/summary', (req, res) => {
    // Stringify the object
    let data = JSON.stringify(req.body);
    let currentUser = req.user;



    JSON.parse(data, (key) => {

        let sum = new Summary({ summary: key, bookID: currentBookID });
        currentUser.summary.push(sum);
    });

    currentUser.markModified('currentUser.summary');
    // save the updated user
    currentUser.save()
        .then(() => console.log('saved user'))
        //.then(() => res.redirect('/'))
        .catch(() => console.log('Couldnt save the user'))
});


// all the bookshelf routes
router.get('/bookshelf', ensureAutheticated, (req, res) => {
    let isAuth = req.isAuthenticated();
    res.render('bookshelf', { isAuth: isAuth });
})


module.exports = router;