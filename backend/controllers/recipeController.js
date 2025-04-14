const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const slugify = require('slugify');
const { locales } = require('validator/lib/isIBAN');

// ✅ GET: Lấy tất cả công thức
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json({ success: true, count: recipes.length, data: recipes});
    } catch (error) {
        console.error(`❌ Error fetching recipe: `, error);
        res.status(500).json({ success: false, message: "Server error", error: "Đã xảy ra lỗi. Xin vui lòng thử lại."});
    }
}

// ✅ GET: Lấy công thức theo id
const getRecipeById = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({success: false, message: "Invalid Id"})
    }

    try {
        const recipe = await Recipe.findById(id);
        if(!recipe){
            return res.status(404).json({
                success: false, 
                message: "Recipe not found",
                error: "Không thể tìm thấy công thức."
            })
        }
        
        
        res.status(200).json({success: true, data: recipe});
        
    } catch (error) {
        console.error(`❌ Error fetching recipe: `, error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: "Đã xảy ra lỗi lấy công thức. Xin vui lòng thử lại."
        })
    }
}

// ✅ GET: Tìm công thức
const searchRecipe = async (req, res) => {
    try {
        const { 
            keyword, 
            mealType, 
            cuisine, 
            occasions, 
            timeBased, 
            difficultyLevel, 
            ingredient, 
            utensils, 
            page = 1, 
            limit = 10 
        } = req.query;
        
        const filter = {};

        // Tìm kiếm theo từ khóa (tên công thức)
        if(keyword){
            const slug = slugify(keyword, { lower: true, locale: 'vi', remove: /[*+~.()'"!:@]/g });
            filter.slug = {$regex: slug, $options: "i"};
        }

         // Tìm kiếm theo categories (mealType, cuisine, occasions,...)
        
        if (mealType){
            filter['categories.mealType'] = mealType;
        }

        if (cuisine){
            filter['categories.cuisine'] = cuisine;
        }

        if (occasions){
            filter['categories.occasions'] = occasions;
        }

        if (timeBased){
            filter['categories.timeBased'] = timeBased;
        }
        
        if (difficultyLevel){
            filter['categories.difficultyLevel'] = difficultyLevel;
        }

        // Tìm kiếm theo dụng cụ nấu
        if (utensils){
            filter.utensils = utensils;
        }

        // Tìm kiếm theo nguyên liệu
        if (ingredient) {
            filter['ingredients.ingredient'] = ingredient;
        }

        // Kiểm tra nếu không có điều kiện tìm kiếm nào
        if (Object.keys(filter).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập ít nhất một điều kiện tìm kiếm"
            });
        }

        // Tính số lượng document khi chuyển sang các trang (trang 1 - skip 0, trang 2 - skip 10,...)
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Đếm tổng document thỏa mãn điều kiện
        const total = await Recipe.countDocuments(filter);

        // Tổng số trang cần thiết để hiện thị kết quả, dùng ceil để làm tròn lên
        const totalPages = Math.ceil(total / parseInt(limit));
    
        const recipes = await Recipe.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            message: "Kết quả tìm kiếm",
            pagination: {
                total: total,
                currentPage: parseInt(page),
                totalPages: totalPages,
                limit: parseInt(limit)
            },
            count: recipes.length,
            data: recipes
        });
    } catch (error) {
        console.error("❌ Error searching recipe: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi tìm kiếm công thức. Xin vui lòng thử lại."
        })
    }
}

// ✅ POST: Thêm công thức
const addRecipe = async (req, res) => {
    try {
        const {name, ingredients, steps, image, categories, utensils, time } = req.body;

        if(!name){
            return res.status(400).json({
                success: false,
                message: "Tên công thức là bắt buộc",
                error: "Vui lòng nhập tên công thức."
            })
        }

        if(!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nguyên liệu là bắt buộc",
                error: "Vui lòng nhập nguyên liệu."
            })
        }

        if(!Array.isArray(steps) || steps.length === 0){
            return res.status(400).json({
                success: false,
                message: "Cần phải có bước làm",
                error: "Vui lòng nhập bước làm."
            })
        }

        const slug = slugify(name, {lower: true, locale: 'vi'});

        const recipe = new Recipe ({
            name,
            slug,
            ingredients,
            steps,
            image,
            categories,
            utensils,
            time,
            author: req.user ? req.user._id : null
        })

        const newRecipe = await recipe.save();

        res.status(201).json({
            success: true,
            message: "Thêm công thức thành công",
            data: newRecipe,
        })
        
    } catch (error) {
        console.error("❌ Error adding recipe: ", error);

        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: "Đã xảy ra lỗi khi thêm công thức. Xin vui lòng thử lại."
        })
    }
}

// ✅ PATCH: Sửa công thức
const editRecipe = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({ success: false, message: "Invalid Id", error: "Mã công thức không hợp lệ"})
        }

        const recipe = await Recipe.findById(id);

        if(!recipe){
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy công thức", 
                error: "Công thức không tồn tại"
            })
        }
        if(updates.name){
            updates.slug = slugify(updates.name, { lower: true, locale: 'vi' });
        }

        const updateRecipe = await Recipe.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        res.status(200).json({
            success: true,
            message: "Cập nhật công thức thành công",
            data: updateRecipe
        })
    } catch (error) {
        console.error("❌ Error updating recipe: ", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: "Đã xảy ra lỗi khi chỉnh sửa công thức. Xin vui lòng thử lại."
        })
    }
}

// ✅ DELETE: Xóa công thức
const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    console.log("id recipe to delete: ", id)
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({
            success: false,
            message: "Invalid Id",
            error: "Mã công thức không hợp lệ"
        })
    }

    try {
        const recipe = await Recipe.findByIdAndDelete(id);

        if(!recipe){
            return res.status(404).json({
                success: false,
                error: "Không tìm thấy công thức"
            })
        }

        res.status(200).json({
            success: true,
            message: "Xóa công thức thành công",
            data: recipe.name
        })
        
    } catch (error) {
        console.error("❌ Error deleting recipe: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi xóa công thức. Xin vui lòng thử lại."
        })
    }

}

module.exports = {
    getAllRecipes,
    getRecipeById,
    searchRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe
}