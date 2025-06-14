const express = require('express')
const { getConversation, getUserConversations, searchConversations, createConversation, addMembers, leaveConversation, removeMember, updateConversationName, deleteConversation, getRecentConversations, findPrivateConversation } = require('../controllers/conversationController')
const { authenticateJWT } = require('../middlewares/authMiddleware')

const router = express.Router()
router.get('/find-private', findPrivateConversation)
router.get('/search', authenticateJWT, searchConversations)
router.get('/:conversationId', authenticateJWT, getConversation)
router.get('/',authenticateJWT, getUserConversations)

router.post('/:conversationId/members', authenticateJWT, addMembers)
router.post('/:conversationId/leave', authenticateJWT, leaveConversation)
router.post('/', authenticateJWT, createConversation)


router.patch('/:conversationId/name', authenticateJWT, updateConversationName)
router.patch('/:conversationId/remove/:memberId', authenticateJWT, removeMember)

router.delete('/:conversationId', authenticateJWT, deleteConversation)

 
module.exports = router