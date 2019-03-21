const express = require('express');
const request = require('request');
const router = express.Router();
const axios = require('axios');
const { ensureAutheticated } = require('../config/auth');
// router.get('/bookResults', (req, res) => {
//     res.render('bookResults');
// });



// renders a list of books user searched for
router.post('/bookResults', ensureAutheticated, (req, res) => {


        const searchText = req.query.searchForBook;
        const URL =   `https://www.googleapis.com/books/v1/volumes?q=${searchText}&maxResults=40&orderBy=relevance`;

        
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
      res.render('summaries', { isAuth:isAuth });
  });


module.exports = router;