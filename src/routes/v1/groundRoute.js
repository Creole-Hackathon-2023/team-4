const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const groundController = require('../../controllers/ground.controller')
const router = express.Router();

router.get('/sport/get-sport', groundController.getSports)
router.get('/get-ground', groundController.getGround);
router.post('/signup', groundController.singup)
router.post('/login', groundController.login)
router.post('/book-ground', groundController.bookGround)
router.get('/get-slot-by-date', groundController.getTimeSlotByGround)
router.get('/get-user-order', groundController.getUserOrders)
router.get('/cancel-order', groundController.cancelOrder)
router.get('/get-opponent', groundController.getOpponenet)
module.exports = router;