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
                message: "Không tìm thấy nguyên liệu", 
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