const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let sport = new Schema({
    name: String,
    created_date: { type: Date, default: Date.now },
    updated_date: Date,
}, { collection: 'sport' });

module.exports = mongoose.model('sport', sport);