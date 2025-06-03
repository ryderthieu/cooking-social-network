const express = require('express')
const {login, register, forgotPassword, resetPassword, confirmOtp, getUserById, getUserInfo, searchUser, editProfile, saveRecipe, deleteSavedRecipe, getSavedRecipe, savePost, getSavedPost, saveVideo, getFollowers, getFollowing, toggleFollow, deleteSavedPost, deleteSavedVideo, getSavedVideo, getUserStats, googleLogin} = require('../controllers/userController')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/confirm-otp', confirmOtp)
router.post('/toggle-follow', authenticateJWT, toggleFollow)
router.post('/google-login', googleLogin)

router.get('/get-info', authenticateJWT, getUserInfo)
router.get('/search', searchUser)
router.get('/get-saved-recipe', authenticateJWT, getSavedRecipe)
router.get('/get-saved-post', authenticateJWT, getSavedPost)
router.get('/get-saved-video', authenticateJWT, getSavedVideo)
router.get('/get-followers', getFollowers)
router.get('/get-following', getFollowing)
router.get('/:userId', getUserById)
router.get('/:userId/stats', getUserStats);

router.patch('/edit-profile', authenticateJWT, editProfile)
router.patch('/save-recipe', authenticateJWT, saveRecipe)
router.patch('/delete-saved-recipe', authenticateJWT, deleteSavedRecipe)
router.patch('/save-post', authenticateJWT, savePost)
router.patch('/delete-saved-post', authenticateJWT, deleteSavedPost)
router.patch('/save-video', authenticateJWT, saveVideo)
router.patch('/delete-saved-video', authenticateJWT, deleteSavedVideo)
module.exports = router
