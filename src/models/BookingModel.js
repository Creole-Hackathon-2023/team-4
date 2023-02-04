const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let booking = new Schema({
    user_id: [{
        type: String,
    }],
    type: String,
    ground_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ground' },
    amount: Number,
    cancelled: { type: Boolean, required: false, default: false },
    date: String,
    slot: String,
    // end_time: { type: Date },
    created_date: { type: Date, default: Date.now },
    updated_date: Date,
}, { collection: 'booking' });

module.exports = mongoose.model('booking', booking);