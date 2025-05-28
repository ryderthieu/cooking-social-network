const express = require('express')
const { getConversation, getUserConversations, searchConversations, createConversation, addMembers, leaveConversation, removeMember, updateConversationName, deleteConversation } = require('../controllers/conversationController')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/:conversationId', authenticateJWT, getConversation)
router.get('/',authenticateJWT, getUserConversations)
router.get('/search', authenticateJWT, searchConversations)

router.post('/:conversationId/members', authenticateJWT, addMembers)
router.post('/:conversationId/leave', authenticateJWT, leaveConversation)
router.post('/', authenticateJWT, createConversation)


router.patch('/:conversationId/name', authenticateJWT, updateConversationName)

router.delete('/:conversationId/members/:memberId', authenticateJWT, removeMember)
router.delete('/:conversationId', authenticateJWT, deleteConversation)

 
module.exports = router