'use strict';
const express = require('express');
const app = express();
const router = express.Router();
const request = require('request');




// router.get('/bookdetails', (req, res) => {
//   res.render('singlebookdetails');
// });

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


module.exports = router;