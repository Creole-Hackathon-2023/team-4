const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ground = new Schema({
    name: String,
    sport_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'sport' },
    address: String,
    details: { type: String },
    photo: { type: String },
    created_date: { type: Date, default: Date.now },
    updated_date: Date,
}, { collection: 'ground' });

module.exports = mongoose.model('ground', ground);