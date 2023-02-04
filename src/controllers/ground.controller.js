const sport = require('../models/sportTypeModel')
const ground = require('../models/groundModel');
const user = require('../models/usermodel')
const book = require('../models/BookingModel')
const pendingbook = require('../models/pendingBooking')
const { ObjectId } = require('mongodb'); // or ObjectID 
const { date } = require('joi');

async function singup(req, res) {
    const { email, password } = req.body
    const usernew = new user({ email, password })
    usernew.save(function (err, book) {
        if (err) return console.error(err);
        return res.status(200).json({
            status: "success",
            message: `Data successfully.`,
            data: book
        });
    });
}

async function login(req, res) {
    const { email, password } = req.body
    const userData = await user.findOne({ email, password })
    if (!userData) {
        return res.status(400).json({
            status: "err",
            message: `user not found`,
            data: {}
        });
    }
    return res.status(200).json({
        status: "success",
        message: `Data successfully.`,
        data: userData
    });
}

async function getSports(req, res) {
    const sports = await sport.aggregate([
        { $lookup: { from: "ground", localField: "_id", foreignField: "sport_id", as: "ground" } },
    ])
    return res.status(200).json({
        status: "success",
        message: `Data successfully.`,
        data: sports
    });
}
async function getGround(req, res) {
    const groundData = await ground.find({ sport_id: ObjectId(req.query._id) })
    return res.status(200).json({
        status: "success",
        message: `Data successfully.`,
        data: groundData
    });
}
async function bookGround(req, res) {
    const { user_id, ground_id, amount, date, slot, type } = req.body
    if (type == '1to1') {
        const pendingData = await pendingbook.findOne({ ground_id: ObjectId(ground_id), date, cancelled: false, is_confirm: false })
        if (!pendingData) {
            const pendingbookData = new pendingbook({ user_id, type: "1to1", ground_id: ObjectId(ground_id), amount, date, slot })
            pendingbookData.save(function (err, book) {
                if (err) return console.error(err);
                return res.status(200).json({
                    status: "success",
                    message: `Data successfully.`,
                    data: book
                });
            });
        } else {
            const booked = new book({ user_id: [pendingData.user_id, user_id], type: "1to1", ground_id: ObjectId(ground_id), amount: amount + pendingData.amount, date, slot })
            await booked.save();
            await pendingbook.updateOne({ _id: pendingData._id }, { is_confirm: true })
            const pendingbookData = new pendingbook({ user_id, type: "1to1", ground_id: ObjectId(ground_id), amount, date, slot, is_confirm: true })
            pendingbookData.save(function (err, book) {
                if (err) return console.error(err);
                return res.status(200).json({
                    status: "success",
                    message: `Data successfully.`,
                    data: book
                });
            });
        }
    } else {
        const findbooked = await book.findOne({ ground_id: ObjectId(ground_id), date, slot, cancelled: false })
        if (findbooked) {
            return res.status(400).json({
                status: "err",
                message: `slot already booked`,
                data: {}
            });
        }
        await pendingbook.updateOne({ ground_id: ObjectId(ground_id), date, slot }, { cancelled: true })
        const booked = new book({ user_id: [user_id], type: "full", ground_id: ObjectId(ground_id), amount, date, slot })
        booked.save(function (err, book) {
            if (err) return console.error(err);
            return res.status(200).json({
                status: "success",
                message: `Data successfully.`,
                data: book
            });
        });
    }
}

async function getTimeSlotByGround(req, res) {
    const { date, ground_id } = req.query;
    console.log('date--', date, ground_id)
    const data = []
    for (let i = 4; i < 11; i++) {
        data.push({ slot: `${i * 2}:00-${(i * 2) + 2}:00`, booked: false })
    }
    const bookedData = await book.find({ date, cancelled: false, ground_id: ObjectId(ground_id) })
    data.forEach((slot) => {
        bookedData.forEach((bookedData) => {
            if (bookedData.slot == slot.slot) {
                slot.booked = true
            }
        })
    })
    return res.status(200).json({
        status: "success",
        message: `Data successfully.`,
        data: data
    });
}
async function getUserOrders(req, res) {
    const { user_id } = req.query
    const data = await book.find({ user_id: { $in: [user_id] } })
    return res.status(200).json({
        status: "success",
        message: `Data successfully.`,
        data: data
    });
}
async function cancelOrder(req, res) {
    const { order_id } = req.query
    const data = await book.findOneAndUpdate({ _id: ObjectId(order_id) }, { cancelled: true }, { new: true })
    return res.status(200).json({
        status: "success",
        message: `Data successfully.`,
        data: data
    });
}

async function getOpponenet(req, res) {
    const { ground_id, date } = req.query
    const data = await pendingbook.find({ ground_id: ObjectId(ground_id), date, cancelled: false, is_confirm: false })
    return res.status(200).json({
        status: "success",
        message: `Data successfully.`,
        data: data
    });
}
module.exports = {
    getSports,
    getGround,
    singup,
    login,
    bookGround,
    getTimeSlotByGround,
    getUserOrders,
    cancelOrder,
    getOpponenet
};
