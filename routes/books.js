const express = require('express');
const request = require('request');
const router = express.Router();
const axios = require('axios');
const { ensureAutheticated } = require('../config/auth');
// router.get('/bookResults', (req, res) => {
//     res.render('bookResults');
// });

const getJsonData = async (url) => {
    try {
        return await axios.get(url)
    }catch (err) {
        console.log(err);
    }
}


router.post('/bookResults', ensureAutheticated, (req, res) => {


        const searchText = req.query.searchForBook;
        const URL =   `https://www.googleapis.com/books/v1/volumes?q=${searchText}&maxResults=40&orderBy=relevance`;
        // const data = getJsonData(URL)
        //                     .then((response) => JSON.parse(response))
        //                     .then((json) => json);
        //                     .catch(err => console.log(err));

        
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