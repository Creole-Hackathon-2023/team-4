const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let pendingBooking = new Schema({
    user_id: {
        type: String,
    },
    type: String,
    ground_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ground' },
    is_confirm: { type: Boolean, required: false, default: false },
    amount: Number,
    cancelled: { type: Boolean, required: false, default: false },
    date: String,
    slot: String,
    // end_time: { type: Date },
    created_date: { type: Date, default: Date.now },
    updated_date: Date,
}, { collection: 'pendingBooking' });

module.exports = mongoose.model('pendingBooking', pendingBooking);