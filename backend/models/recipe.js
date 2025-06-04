const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User', default: 'Admin'}, // Id của người tạo công thức, có liên kết với model User
    name: {type: String, required: true}, // tên món ăn
    slug: {type: String},
    description: {type: String},
    ingredients: [{
        ingredient: {type: Schema.Types.ObjectId, ref: 'Ingredient'}, // Liên kết với model Ingredient
        quantity: {type: Number}, // Số lượng nguyên liệu
        name: {type: String}, // Cached name for easier access
        unit: {type: String} // Unit for this specific recipe usage
    }],
    steps: [{
       step: {type: String, required: true}, // Mô tả bước nấu
       image: [{type: String}],  // Array of image links (tối đa 4 hình)
       description: {type: String}
    }],
    image: [{type: String}],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    utensils: [{type: String}],  // Dụng cụ nấu ăn cần thiết
    time: {type: Number}, // Thời gian nấu (đơn vị phút)
    servings: {type: Number, default: 1}, // Khẩu phần dành cho bao nhiêu người (mặc định 1 người)
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    averageRating: {type: Number, default: 0}, // Điểm đánh giá trung bình
    totalReviews: {type: Number, default: 0} // Tổng số đánh giá
}, {      
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema)