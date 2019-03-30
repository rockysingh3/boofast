const mongoose = require('mongoose');
const Schama = mongoose.Schama;

const FavbookSchama = new Schama({
    title: {
        type: String
    },
    id: {
        type: number
    }
});

const FavBook = mongoose.model('FavBook', FavbookSchama);

module.exports = FavBook;