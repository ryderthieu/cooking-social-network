const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'}, // Id của người tạo công thức, có liên kết với model User
    name: {type: String, required: true}, // tên món ăn
    ingredients: [
        {
            ingredient: {type: Schema.Types.ObjectId, ref: 'Ingredient'}, // Liên kết với model Ingredient
            quantity: {type: Number} // Số lượng nguyên liệu
        }
    ],
    steps: [{
       step: {type: String, required: true}, // Mô tả bước nấu
       image: {type: String}   // Link ảnh minh họa (optional)
    }],
    image: [{type: String}],
    categories: {
        mealType: [{ type: String, enum: ["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa xế", "Món tráng miệng"] }],
        cuisine: [{ type: String, enum: ["Việt Nam", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Thái Lan", "Ấn Độ", "Âu", "Mỹ", "Mexico"] }],
        occasions: [{ type: String, enum: ["Tiệc tùng", "Sinh nhật", "Ngày lễ Tết", "Ăn chay", "Món ăn cho ngày lạnh/nóng"] }],
        dietaryPreferences: [{ type: String, enum: ["Ăn chay", "Thuần chay", "Keto/Low-carb", "Thực phẩm chức năng", "Không gluten", "Ăn kiêng giảm cân"] }],
        mainIngredients: [{ type: String, enum: ["Thịt gà", "Thịt bò", "Thịt heo", "Hải sản", "Trứng", "Rau củ", "Đậu phụ"] }],
        cookingMethod: [{ type: String, enum: ["Chiên", "Nướng", "Hấp", "Xào", "Luộc", "Hầm", "Nấu súp"] }],
        timeBased: [{ type: String, enum: ["Dưới 15 phút", "15-30 phút", "Trên 1 tiếng"] }],
        difficultyLevel: { type: String, enum: ["Dễ", "Trung bình", "Khó"] }
    },
    utensils: [{type: String}],  // Dụng cụ nấu ăn cần thiết
    time: {type: Number} // Thời gian nấu (đơn vị phút)
}, {      
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema)