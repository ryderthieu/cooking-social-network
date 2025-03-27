const express = require('express')
const {login, register, forgotPassword, resetPassword, confirmOtp, getUserById, getUserInfo, searchUser} = require('../controllers/userController')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/confirm-otp', confirmOtp)
router.get('/get-info', authenticateJWT, getUserInfo)
router.get('/search', searchUser)
router.get('/:userId', getUserById)
module.exports = router
