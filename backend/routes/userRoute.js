const express = require('express')
const {login, register, forgotPassword, resetPassword, confirmOtp, getUserById, getUserInfo, searchUser, editProfile, deleteSavedRecipe, getSavedRecipe, getSavedPost, getFollowers, getFollowing, follow, unfollow} = require('../controllers/userController')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/confirm-otp', confirmOtp)
router.post('/follow', authenticateJWT, follow)
router.post('/unfollow', authenticateJWT, unfollow)

router.get('/get-info', authenticateJWT, getUserInfo)
router.get('/search', searchUser)
router.get('/get-saved-recipe', authenticateJWT, getSavedRecipe)
router.get('/get-saved-post', authenticateJWT, getSavedPost)
router.get('/get-followers', getFollowers)
router.get('/get-following', getFollowing)
router.get('/:userId', getUserById)

router.patch('/edit-profile', authenticateJWT, editProfile)
router.patch('/delete-saved-recipe', authenticateJWT, deleteSavedRecipe)
module.exports = router
