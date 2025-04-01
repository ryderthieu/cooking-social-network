const mongoose = require("mongoose");
const Ingredient = require("../models/ingredient");

// ✅ GET: Lấy tất cả nguyên liệu
const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find(); //Lấy dữ liệu từ database
        res.status(200).json({ success: true, count: ingredients.length, data: ingredients});
    } catch (error) {
        console.error(`❌ Error fetching ingredients: `, error);
        res.status(500).json({ success: false, message: "Server error"});
    }
}

// ✅ GET: Lấy nguyên liệu theo Id
const getIngredientsById  = async (req, res) => {
    const { id } = req.params;
    console.log("ingredient id: ", id);

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Ingredient Id"});
    }

    try {
        const ingredient = await Ingredient.findById(id);
        if(!ingredient) {
            return res.status(404).json({ success: false, message: "Ingredient not found"})
        }
        return res.status(200).json({ success: true, data: ingredient });
    } catch (error) {
        console.error(`❌ Error fetching ingredient: `, error);
        res.status(500).json({ success: false, message: "Server error"});
    }
}

// ✅ GET: Tìm kiếm
const searchIngredient = async (req, res) => {
    try {
        const { query } = req.query;
        const ingredients = await Ingredient.find({ name: { $regex: query, $options: "i" } });
        res.status(201).json({ success: true, data: ingredient });
    } catch (error) {
        console.error('Error searching ingredient: ', error);
        res.status(500).json({ success: false, message: "Server error"});
    }
    
}

// DELETE
const deleteIngredient = async (req, res) => {
    const { id } = req.param;
    console.log("id: ", id);

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ success: false, message: "Invalid Id"});
    }

    try {
        const ingredient = await Ingredient.findById();
        if(!ingredient) {
            
        }

    } catch (error) {
        console.error('Error delete Ingredient ', error);
        res.status(500). json({ success: false, message: "Server error", error: "Đã xảy ra lỗi. Xin vui lòng thử lại."})
    }
}

// PUT
const editIngredient = async (req, res) => {

}

// POST
const addIngredient = async (req, res) => {

}




module.exports = {
    getAllIngredients,
    getIngredientsById,
    searchIngredient,
    deleteIngredient,
    editIngredient,
    addIngredient
};