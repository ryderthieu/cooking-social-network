const express = require('express')
const { getNotificationById, getUserNotifications, searchNotifications, createNotification, markAsRead, markAsUnread, markAllAsRead } = require('../controllers/notificationController')
const { authenticateJWT } = require('../middlewares/authMiddleware')


const router = express.Router()

router.get('/search', authenticateJWT, searchNotifications)
router.get('/:notificationId', authenticateJWT, getNotificationById)
router.get('/', authenticateJWT, getUserNotifications)

router.post('/', authenticateJWT, createNotification)

router.patch('/read/:commentId', authenticateJWT, markAsRead)
router.patch('/read', authenticateJWT, markAllAsRead)
router.patch('/unread/:commentId',authenticateJWT, markAsUnread)

module.exports = router