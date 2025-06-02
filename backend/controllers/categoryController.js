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

// ✅ GET: Lấy category theo slug và type
const getCategoryBySlugAndType = async (req, res) => {
  try {
    const { type, slug } = req.params;

    const category = await Category.getBySlugAndType(slug, type);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        error: "Không thể tìm thấy category."
      });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(`❌ Error fetching category by slug and type:`, error);
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
      },      {
        name: "Phương pháp nấu",
        key: "cookingMethod",
        items: groupedCategories.cookingMethod || [],
        background: "bg-[#F0F8FF]",
        color: "bg-[#87CEEB]"
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
      .sort({ type: 1, order: 1, name: 1 });    // Group categories by type
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
        backgroundColor: category.backgroundColor || "#f3f4f6",
        textColor: category.textColor || "#374151"
      });
      return acc;
    }, {});

    // Create dynamic background colors based on actual data
    const getBackgroundForType = (type, items) => {
      if (items.length > 0 && items[0].backgroundColor) {
        // Convert hex/color value to Tailwind class if needed
        const bgColor = items[0].backgroundColor;
        if (bgColor.startsWith('#')) {
          // For now, use default mapping - in production you might want a more sophisticated converter
          return `bg-[${bgColor}]`;
        }
        return bgColor.startsWith('bg-') ? bgColor : `bg-[${bgColor}]`;
      }      // Fallback colors for each type
      const fallbackColors = {
        mealType: "bg-[#ffefd0]",
        cuisine: "bg-[#FFE9E9]", 
        occasions: "bg-[#E8F5E8]",
        dietaryPreferences: "bg-[#F0E6FF]",
        mainIngredients: "bg-[#FFE4E1]",
        cookingMethod: "bg-[#F0F8FF]"
      };
      return fallbackColors[type] || "bg-[#f3f4f6]";
    };

    const getColorForType = (type, items) => {
      if (items.length > 0 && items[0].textColor) {
        const color = items[0].textColor;
        return color.startsWith('bg-') ? color : `bg-[${color}]`;
      }      // Fallback colors for each type
      const fallbackColors = {
        mealType: "bg-[#FFD0A1]",
        cuisine: "bg-[#c98c8b4e]",
        occasions: "bg-[#90EE90]", 
        dietaryPreferences: "bg-[#DDA0DD]",
        mainIngredients: "bg-[#FFA07A]",
        cookingMethod: "bg-[#87CEEB]"
      };
      return fallbackColors[type] || "bg-[#374151]";
    };

    // Format tất cả categories (không filter)
    const allFormattedCategories = [
      {
        name: "Loại bữa ăn",
        key: "mealType",
        items: groupedCategories.mealType || [],
        background: getBackgroundForType("mealType", groupedCategories.mealType || []),
        color: getColorForType("mealType", groupedCategories.mealType || [])
      },
      {
        name: "Vùng ẩm thực",
        key: "cuisine",
        items: groupedCategories.cuisine || [],
        background: getBackgroundForType("cuisine", groupedCategories.cuisine || []),
        color: getColorForType("cuisine", groupedCategories.cuisine || [])
      },
      {
        name: "Dịp đặc biệt",
        key: "occasions",
        items: groupedCategories.occasions || [],
        background: getBackgroundForType("occasions", groupedCategories.occasions || []),
        color: getColorForType("occasions", groupedCategories.occasions || [])
      },
      {
        name: "Chế độ ăn",
        key: "dietaryPreferences",
        items: groupedCategories.dietaryPreferences || [],
        background: getBackgroundForType("dietaryPreferences", groupedCategories.dietaryPreferences || []),
        color: getColorForType("dietaryPreferences", groupedCategories.dietaryPreferences || [])
      },
      {
        name: "Nguyên liệu chính",
        key: "mainIngredients",
        items: groupedCategories.mainIngredients || [],
        background: getBackgroundForType("mainIngredients", groupedCategories.mainIngredients || []),
        color: getColorForType("mainIngredients", groupedCategories.mainIngredients || [])
      },      {
        name: "Phương pháp nấu",
        key: "cookingMethod",
        items: groupedCategories.cookingMethod || [],
        background: getBackgroundForType("cookingMethod", groupedCategories.cookingMethod || []),
        color: getColorForType("cookingMethod", groupedCategories.cookingMethod || [])
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
  getCategoryBySlugAndType,
  createCategory,
  updateCategory,
  deleteCategory,
  getFormattedCategories,
  getAllFormattedCategories
};
