const express = require('express')
const {login, register, forgotPassword, resetPassword, confirmOtp} = require('../controllers/userController')

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/confirm-otp', confirmOtp)

module.exports = router