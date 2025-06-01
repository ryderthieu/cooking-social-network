const mongoose = require("mongoose");
const Category = require("../models/category");
const slugify = require("slugify");

// ✅ GET: Lấy tất cả categories
const getAllCategories = async (req, res) => {
  try {
    const { type, featured, active = true } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (featured !== undefined) query['metadata.featured'] = featured === 'true';
    if (active !== undefined) query.isActive = active === 'true';

    const categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ type: 1, order: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error(`❌ Error fetching categories:`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy danh sách categories."
    });
  }
};

// ✅ GET: Lấy categories theo type cho dropdown/menu
const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { limit } = req.query;

    const categories = await Category.getByType(type, { 
      limit: limit ? parseInt(limit) : 0 
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error(`❌ Error fetching categories by type:`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy categories theo loại."
    });
  }
};

// ✅ GET: Lấy category theo ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ 
      success: false, 
      message: "Invalid category ID" 
    });
  }

  try {
    const category = await Category.findById(id).populate('parent');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: "Không thể tìm thấy category."
      });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(`❌ Error fetching category:`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy category."
    });
  }
};

// ✅ POST: Tạo category mới
const createCategory = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      image,
      backgroundColor,
      textColor,
      parent,
      metadata,
      order
    } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
        error: "Tên và loại category là bắt buộc."
      });
    }

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // Check if category with same name or slug exists
    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }]
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
        error: "Category với tên này đã tồn tại."
      });
    }

    const newCategory = new Category({
      name,
      slug,
      type,
      description,
      image,
      backgroundColor,
      textColor,
      parent,
      metadata,
      order: order || 0
    });

    const savedCategory = await newCategory.save();
    await savedCategory.populate('parent');

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: savedCategory
    });
  } catch (error) {
    console.error(`❌ Error creating category:`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi tạo category."
    });
  }
};

// ✅ PUT: Cập nhật category
const updateCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ 
      success: false, 
      message: "Invalid category ID" 
    });
  }

  try {
    const updateData = { ...req.body };
    
    // Update slug if name is changed
    if (updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
      
      // Check if new slug conflicts with existing category
      const existingCategory = await Category.findOne({
        slug: updateData.slug,
        _id: { $ne: id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category name conflicts with existing category",
          error: "Tên category này đã tồn tại."
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent');

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: "Không thể tìm thấy category."
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    console.error(`❌ Error updating category:`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi cập nhật category."
    });
  }
};

// ✅ DELETE: Xóa category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ 
      success: false, 
      message: "Invalid category ID" 
    });
  }

  try {
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: "Không thể tìm thấy category."
      });
    }

    // Check if category has recipes
    if (category.recipeCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with recipes",
        error: "Không thể xóa category đang có công thức."
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error(`❌ Error deleting category:`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi xóa category."
    });
  }
};

// ✅ GET: Lấy categories cho Header
const getFormattedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ type: 1, order: 1 });

    // Group by type
    const groupedCategories = categories.reduce((acc, category) => {
      if (!acc[category.type]) {
        acc[category.type] = [];
      }
      acc[category.type].push({
        name: category.name,
        slug: category.slug,
        count: category.recipeCount,
        path: category.path,
        image: category.image,
        backgroundColor: category.backgroundColor,
        textColor: category.textColor
      });
      return acc;
    }, {});  
    const allCategories = [
      {
        name: "Loại bữa ăn",
        key: "mealType",
        items: (groupedCategories.mealType || []).slice(0, 3),
        background: "bg-[#ffefd0]",
        color: "bg-[#FFD0A1]"
      },
      {
        name: "Vùng ẩm thực",
        key: "cuisine",
        items: (groupedCategories.cuisine || []).slice(0, 3),
        background: "bg-[#FFE9E9]",
        color: "bg-[#c98c8b4e]"
      },
      {
        name: "Dịp đặc biệt",
        key: "occasions",
        items: (groupedCategories.occasions || []).slice(0, 3),
        background: "bg-[#E8F5E8]",
        color: "bg-[#90EE90]"
      },
      {
        name: "Chế độ ăn",
        key: "dietaryPreferences",
        items: (groupedCategories.dietaryPreferences || []).slice(0, 3),
        background: "bg-[#F0E6FF]",
        color: "bg-[#DDA0DD]"
      },
      {
        name: "Nguyên liệu chính",
        key: "mainIngredients",
        items: (groupedCategories.mainIngredients || []).slice(0, 3),
        background: "bg-[#FFE4E1]",
        color: "bg-[#FFA07A]"
      },
      {
        name: "Phương pháp nấu",
        key: "cookingMethod",
        items: groupedCategories.cookingMethod || [],
        background: "bg-[#F0F8FF]",
        color: "bg-[#87CEEB]"
      },
      {
        name: "Thời gian",
        key: "timeBased",
        items: groupedCategories.timeBased || [],
        background: "bg-[#FFF8DC]",
        color: "bg-[#F0E68C]"
      }
    ];

    // Lọc chỉ những category cho header (theo yêu cầu)
    const headerCategories = ["mealType", "cuisine", "occasions", "dietaryPreferences", "mainIngredients"];
    const formattedCategories = allCategories
      .filter(cat => headerCategories.includes(cat.key) && cat.items.length > 0);

    res.status(200).json({
      success: true,
      data: formattedCategories
    });
  } catch (error) {
    console.error(`❌ Error fetching formatted categories:`, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy categories."
    });
  }
};

// Get all formatted categories (không filter - cho trang recipe detail, search page, etc.)
const getAllFormattedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ type: 1, order: 1, name: 1 });

    // Group categories by type
    const groupedCategories = categories.reduce((acc, category) => {
      if (!acc[category.type]) {
        acc[category.type] = [];
      }
      acc[category.type].push({
        name: category.name,
        slug: category.slug,
        count: category.recipeCount,
        path: category.path,
        image: category.image,
        backgroundColor: category.backgroundColor,
        textColor: category.textColor
      });
      return acc;
    }, {});

    // Format tất cả categories (không filter)
    const allFormattedCategories = [
      {
        name: "Loại bữa ăn",
        key: "mealType",
        items: groupedCategories.mealType || [],
        background: "bg-[#ffefd0]",
        color: "bg-[#FFD0A1]"
      },
      {
        name: "Vùng ẩm thực", 
        key: "cuisine",
        items: groupedCategories.cuisine || [],
        background: "bg-[#FFE9E9]",
        color: "bg-[#c98c8b4e]"
      },
      {
        name: "Dịp đặc biệt",
        key: "occasions",
        items: groupedCategories.occasions || [],
        background: "bg-[#E8F5E8]",
        color: "bg-[#90EE90]"
      },
      {
        name: "Chế độ ăn",
        key: "dietaryPreferences",
        items: groupedCategories.dietaryPreferences || [],
        background: "bg-[#F0E6FF]",
        color: "bg-[#DDA0DD]"
      },
      {
        name: "Nguyên liệu chính",
        key: "mainIngredients",
        items: groupedCategories.mainIngredients || [],
        background: "bg-[#FFE4E1]",
        color: "bg-[#FFA07A]"
      },
      {
        name: "Phương pháp nấu",
        key: "cookingMethod",
        items: groupedCategories.cookingMethod || [],
        background: "bg-[#F0F8FF]",
        color: "bg-[#87CEEB]"
      },
      {
        name: "Thời gian",
        key: "timeBased",
        items: groupedCategories.timeBased || [],
        background: "bg-[#FFF8DC]",
        color: "bg-[#F0E68C]"
      },
      {
        name: "Mức độ khó",
        key: "difficultyLevel",
        items: groupedCategories.difficultyLevel || [],
        background: "bg-[#E6E6FA]",
        color: "bg-[#DDA0DD]"
      }
    ].filter(cat => cat.items.length > 0);

    res.status(200).json({
      success: true,
      data: allFormattedCategories
    });
  } catch (error) {
    console.error(`❌ Error fetching all formatted categories:`, error);
    res.status(500).json({
      success: false,
      message: "Server error", 
      error: "Đã xảy ra lỗi khi lấy categories."
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoriesByType,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getFormattedCategories,
  getAllFormattedCategories
};
