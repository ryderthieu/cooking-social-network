const mongoose = require("mongoose");
const Ingredient = require("../models/ingredient");
const slugify = require("slugify");

// ✅ GET: Lấy tất cả nguyên liệu
const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find(); //Lấy dữ liệu từ database
        res.status(200).json({ success: true, count: ingredients.length, data: ingredients});
    } catch (error) {
        console.error(`❌ Error fetching ingredients: `, error);
        res.status(500).json({ success: false, message: "Server error", error: "Đã xảy ra lỗi. Xin vui lòng thử lại."});
    }
}

// ✅ GET: Lấy nguyên liệu theo Id
const getIngredientsById  = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Ingredient Id"});
    }

    try {
        const ingredient = await Ingredient.findById(id);
        if(!ingredient) {
            return res.status(404).json({ success: false, message: "Ingredient not found"});
        }
        return res.status(200).json({ success: true, data: ingredient });
    } catch (error) {
        console.error(`❌ Error fetching ingredient: `, error);
        res.status(500).json({ success: false, message: "Server error", error: "Đã xảy ra lỗi. Xin vui lòng thử lại."});
    }
}

// ✅ GET: Tìm kiếm
const searchIngredient = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                 success: false, 
                 message: "Vui lòng nhập từ khóa tìm kiếm" 
            });
        }

        // Chuyển keyword thành slug không dấu
        const slug = slugify(keyword, {lower: true, locale: 'vi'});

        // Tìm theo slug
        const filter = {
            slug: {$regex: slug, $options: "i"}
        };

        // Thực hiện tìm kiếm và sắp xếp kết quả
        const ingredients = await Ingredient.find(filter).sort({createAt: -1});

        res.status(200).json({ 
            success: true, 
            message: "Kết quả tìm kiếm", 
            count: ingredients.length, 
            data: ingredients 
        });
    } catch (error) {
        console.error('❌ Error searching ingredient:', error.message);
        res.status(500).json({ 
            success: false, 
            message: "Server error",
            error: "Đã xảy ra lỗi khi tìm kiếm nguyên liệu. Xin vui lòng thử lại." 
        });
    }
};


// DELETE
const deleteIngredient = async (req, res) => {
    const { id } = req.params;
    console.log("Id of ingredient to detele: ", id);

    // Kiểm tra xem Id có đúng định dạng của MongoDB hay không
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({
            success: false,
            message: "Invalid Id",
            error: "Mã nguyên liệu không hợp lệ"
        })
    }

    try {
        const ingredient = await Ingredient.findByIdAndDelete(id);

        if(!ingredient){
            return res.status(404).json({
                success: false,
                error: "Không tìm thấy nguyên liệu",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Xóa nguyên liệu thành công",
            data: ingredient.name
        })

    } catch (error) {
        console.error("❌ Error delete Ingredient ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi xóa nguyên liệu. Xin vui lòng thử lại."
        })
    }
}

// PATCH
const editIngredient = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success: false,
            message: "Invalid Id"
        })
    }

    try {
        const ingredient = await Ingredient.findById(id);
        if(!ingredient){
            return res.status(404).json({
                success: false,
                error: "Không tìm thấy nguyên liệu",
            })
        }

        if(updates.name){
            updates.slug = slugify(updates.name, {lower: true, locale: 'vi'});
        }

        await Ingredient.findByIdAndUpdate(id, updates, { new: true, runValidators: true })



        res.status(200).json({
            success: true,
            message: "Cập nhật nguyên liệu thành công",
            data: ingredient
        })
    } catch (error) {
        console.error("❌ Error updating ingredient: ", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi cập nhật nguyên liệu. Xin vui lòng thử lại."
        })
    }
}

// POST
const addIngredient = async (req, res) => {
    try {
        const {name, unit, nutrition, image} = req.body;
        console.log("add-ingredient req.body: ", req.body);

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Tên nguyên liệu là bắt buộc",
                error: "Vui lòng nhập tên nguyên liệu"
            })
        }

        // Tạo slug từ name
        const slug = slugify(name, {lower: true, locale: 'vi'});

        // Tạo nguyên liệu mới
        const ingredient = new Ingredient ({
            name, 
            slug,
            unit,
            nutrition,
            image,
            author: req.user ? req.user._id : null
        })

        // Lưu ingredient vào DB 
        const newIngredient = await ingredient.save();

        res.status(201).json({
            success: true,
            message: "Thêm nguyên liệu thành công",
            data: newIngredient
        })
        
    } catch (error) {
        console.error("❌ Error adding ingredient: ", error);

        if (error.code === 11000){
            return res.status(400).json({
                success: false,
                message: "Duplicate key error",
                error: "Nguyên liệu này đã tồn tại trong hệ thống"
            })
        }
        
        res.status(500).json({
            success: false,
            message: "Server error",
            error: "Đã xảy ra lỗi khi thêm nguyên liệu. Xin vui lòng thử lại."
        })
    }
}

module.exports = {
    getAllIngredients,
    getIngredientsById,
    searchIngredient,
    deleteIngredient,
    editIngredient,
    addIngredient
};