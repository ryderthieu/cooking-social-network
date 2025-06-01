const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Đảm bảo một user chỉ có thể review một recipe một lần
reviewSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
