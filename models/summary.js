const mongoose = require('mongoose');


const SummarySchema = new mongoose.Schema({
    summary: {
        type: String
    },
    bookID: {
        type: String
    }
});

const Summary = mongoose.model('summary', SummarySchema);

module.exports = Summary;