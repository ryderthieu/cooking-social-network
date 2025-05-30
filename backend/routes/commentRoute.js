const express = require('express')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const { getCommentById, searchComments, getReplies, getCommentsByTarget, createComment, updateComment, deleteComment } = require('../controllers/commentController')

const router = express.Router()

router.get('/search', searchComments)
router.get('replies/:commentId', getReplies)
router.get('/:commentId', getCommentById)
router.get('/target/:targetType/:targetId', getCommentsByTarget)

router.post('/', authenticateJWT, createComment)

router.patch('/:commentId', authenticateJWT, updateComment)

router.delete('/:commentId', authenticateJWT, deleteComment)
module.exports = router 