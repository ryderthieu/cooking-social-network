const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');
const {
    createReview,
    updateReview,
    deleteReview,
    getReviewsByRecipe,
    getUserReviewForRecipe
} = require('../controllers/reviewController');

// POST /api/reviews/:recipeId - Tạo đánh giá mới
router.post('/:recipeId', authenticateJWT, createReview);

// PUT /api/reviews/review/:reviewId - Cập nhật đánh giá
router.put('/review/:reviewId', authenticateJWT, updateReview);

// DELETE /api/reviews/review/:reviewId - Xóa đánh giá
router.delete('/review/:reviewId', authenticateJWT, deleteReview);

// GET /api/reviews/:recipeId - Lấy tất cả đánh giá của recipe
router.get('/:recipeId', getReviewsByRecipe);

// GET /api/reviews/:recipeId/user - Lấy đánh giá của user cho recipe
router.get('/:recipeId/user', authenticateJWT, getUserReviewForRecipe);

module.exports = router;
