const express = require('express');
const request = require('request');
const router = express.Router();

// router.get('/bookResults', (req, res) => {
//     res.render('bookResults');
// });


router.post('/bookResults', (req, res) => {


    const searchText = req.query.searchForBook;
        // making call to google books api with a search word
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


module.exports = router;