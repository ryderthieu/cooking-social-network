const mongoose = require('mongoose');
const Review = require('../models/review');
const Recipe = require('../models/recipe');

// ✅ POST: Tạo đánh giá mới
const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { recipeId } = req.params;
        const userId = req.user._id; // Từ auth middleware

        // Kiểm tra recipeId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid recipe ID"
            });
        }

        // Kiểm tra recipe tồn tại
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: "Recipe not found"
            });
        }

        // Kiểm tra user đã review recipe này chưa
        const existingReview = await Review.findOne({ user: userId, recipe: recipeId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đánh giá công thức này rồi"
            });
        }

        // Tạo review mới
        const newReview = new Review({
            user: userId,
            recipe: recipeId,
            rating,
            comment
        });

        await newReview.save();

        // Cập nhật rating trung bình cho recipe
        await updateRecipeRating(recipeId);

        // Populate thông tin user cho response
        await newReview.populate('user', 'firstName lastName avatar');

        res.status(201).json({
            success: true,
            data: newReview,
            message: "Đánh giá đã được thêm thành công"
        });
    } catch (error) {
        console.error('❌ Error creating review:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi tạo đánh giá"
        });
    }
};

// ✅ PUT: Cập nhật đánh giá
const updateReview = async (req, res) => {    try {
        const { rating, comment } = req.body;
        const { reviewId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        const review = await Review.findOne({ _id: reviewId, user: userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đánh giá hoặc bạn không có quyền chỉnh sửa"
            });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        // Cập nhật rating trung bình cho recipe
        await updateRecipeRating(review.recipe);

        await review.populate('user', 'firstName lastName avatar');

        res.status(200).json({
            success: true,
            data: review,
            message: "Đánh giá đã được cập nhật"
        });
    } catch (error) {
        console.error('❌ Error updating review:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi cập nhật đánh giá"
        });
    }
};

// ✅ DELETE: Xóa đánh giá
const deleteReview = async (req, res) => {    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review ID"
            });
        }

        const review = await Review.findOne({ _id: reviewId, user: userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đánh giá hoặc bạn không có quyền xóa"
            });
        }

        const recipeId = review.recipe;
        await Review.findByIdAndDelete(reviewId);

        // Cập nhật rating trung bình cho recipe
        await updateRecipeRating(recipeId);

        res.status(200).json({
            success: true,
            message: "Đánh giá đã được xóa"
        });
    } catch (error) {
        console.error('❌ Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi xóa đánh giá"
        });
    }
};

// ✅ GET: Lấy tất cả đánh giá của một recipe
const getReviewsByRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid recipe ID"
            });
        }

        const reviews = await Review.find({ recipe: recipeId })
            .populate('user', 'firstName lastName avatar')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments({ recipe: recipeId });

        res.status(200).json({
            success: true,
            data: reviews,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalReviews: total
            }
        });
    } catch (error) {
        console.error('❌ Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi lấy đánh giá"
        });
    }
};

// ✅ GET: Lấy đánh giá của user cho một recipe cụ thể
const getUserReviewForRecipe = async (req, res) => {    try {
        const { recipeId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid recipe ID"
            });
        }

        const review = await Review.findOne({ user: userId, recipe: recipeId })
            .populate('user', 'firstName lastName avatar');

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('❌ Error fetching user review:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi lấy đánh giá"
        });
    }
};

// Helper function để cập nhật rating trung bình của recipe
const updateRecipeRating = async (recipeId) => {
    try {
        const result = await Review.aggregate([
            { $match: { recipe: new mongoose.Types.ObjectId(recipeId) } },
            {
                $group: {
                    _id: '$recipe',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            await Recipe.findByIdAndUpdate(recipeId, {
                averageRating: Math.round(result[0].averageRating * 10) / 10, // Làm tròn 1 chữ số thập phân
                totalReviews: result[0].totalReviews
            });
        } else {
            // Nếu không có review nào, reset về 0
            await Recipe.findByIdAndUpdate(recipeId, {
                averageRating: 0,
                totalReviews: 0
            });
        }
    } catch (error) {
        console.error('❌ Error updating recipe rating:', error);
    }
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    getReviewsByRecipe,
    getUserReviewForRecipe
};
