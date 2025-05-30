const express = require('express')
const { getMessageById, getMessagesByConversation, searchMessages, createMessage, getRecentMessages, updateMessage, deleteMessage, reactToMessage } = require('../controllers/messageController')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/conversations/:conversationId', authenticateJWT, getMessagesByConversation)
router.get('/search', authenticateJWT, searchMessages)
// router.get('/recent', authenticateJWT, getRecentMessages)
router.get('/:messageId', authenticateJWT, getMessageById)


router.post('/', authenticateJWT, createMessage)

router.patch('/:messageId/delete', authenticateJWT, deleteMessage)
router.patch('/:messageId', authenticateJWT, updateMessage)
router.patch('/:messageId/react', authenticateJWT, reactToMessage)

module.exports = router