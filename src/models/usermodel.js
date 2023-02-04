const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    created_date: { type: Date, default: Date.now },
    updated_date: Date,
}, { collection: 'user' });

module.exports = mongoose.model('user', user);