const mongoose = require("mongoose");
const Recipe = require("../models/recipe");
const slugify = require("slugify");
const { locales } = require("validator/lib/isIBAN");

// ✅ GET: Lấy tất cả công thức
const getAllRecipes = async (req, res) => {  try {    const recipes = await Recipe.find()
      .populate("author", "firstName lastName  avatar")
      .populate("ingredients.ingredient", "name unit image nutrition")
      .populate("categories", "name type slug image");
    
    console.log(`📊 Total recipes in database: ${recipes.length}`);
    
    res
      .status(200)
      .json({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    console.error(`❌ Error fetching recipe: `, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi. Xin vui lòng thử lại.",
    });
  }
};

// ✅ GET: Lấy công thức theo id
const getRecipeById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }
  try {const recipe = await Recipe.findById(id)
      .populate("author", "firstName lastName avatar")
      .populate("ingredients.ingredient", "name unit image nutrition")
      .populate("categories", "name type slug image");
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
        error: "Không thể tìm thấy công thức.",
      });
    }

    res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    console.error(`❌ Error fetching recipe: `, error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi lấy công thức. Xin vui lòng thử lại.",
    });
  }
};

// ✅ GET: Tìm công thức, search va filter
const searchRecipe = async (req, res) => {
  try {
    const {
      keyword,
      mealType,
      cuisine,
      occasions,
      timeBased,
      difficultyLevel,
      dietaryPreferences,
      mainIngredients,
      cookingMethod,
      ingredient,
      utensils,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};    // Tìm kiếm theo từ khóa (tên công thức hoặc slug)
    if (keyword) {
      const slug = slugify(keyword, {
        lower: true,
        locale: "vi",
        remove: /[*+~.()'"!:@]/g,
      });
      console.log(`🔍 Search keyword: "${keyword}" -> slug: "${slug}"`);
      
      // Tìm kiếm theo cả name và slug
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { slug: { $regex: slug, $options: "i" } }
      ];
    }

    // Import Category model for category searches
    const Category = require("../models/category");

    // Helper function to find category IDs by name and type
    const findCategoryIds = async (categoryName, categoryType) => {
      const categories = await Category.find({
        name: categoryName,
        type: categoryType
      }).select('_id');
      return categories.map(cat => cat._id);
    };

    // Tìm kiếm theo categories - now using ObjectId references
    const categoryFilters = [];

    if (mealType) {
      const categoryIds = await findCategoryIds(mealType, "mealType");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    if (cuisine) {
      const categoryIds = await findCategoryIds(cuisine, "cuisine");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    if (occasions) {
      const categoryIds = await findCategoryIds(occasions, "occasions");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    if (timeBased) {
      const categoryIds = await findCategoryIds(timeBased, "timeBased");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    if (difficultyLevel) {
      const categoryIds = await findCategoryIds(difficultyLevel, "difficultyLevel");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    if (dietaryPreferences) {
      const categoryIds = await findCategoryIds(dietaryPreferences, "dietaryPreferences");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    if (mainIngredients) {
      const categoryIds = await findCategoryIds(mainIngredients, "mainIngredients");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    if (cookingMethod) {
      const categoryIds = await findCategoryIds(cookingMethod, "cookingMethod");
      if (categoryIds.length > 0) {
        categoryFilters.push({ categories: { $in: categoryIds } });
      }
    }

    // Apply category filters using AND logic
    if (categoryFilters.length > 0) {
      filter.$and = categoryFilters;
    }

    // Tìm kiếm theo dụng cụ nấu
    if (utensils) {
      filter.utensils = utensils;
    }

    // Tìm kiếm theo nguyên liệu
    if (ingredient) {
      filter["ingredients.ingredient"] = ingredient;
    }    // Nếu không có điều kiện tìm kiếm nào, trả về tất cả recipes (thay vì lỗi)
    if (Object.keys(filter).length === 0) {
      console.log(`📝 No search filters provided, returning all recipes`);
    }

    // Tính số lượng document khi chuyển sang các trang (trang 1 - skip 0, trang 2 - skip 10,...)
    const skip = (parseInt(page) - 1) * parseInt(limit);    // Đếm tổng document thỏa mãn điều kiện
    const total = await Recipe.countDocuments(filter);

    // Tổng số trang cần thiết để hiện thị kết quả, dùng ceil để làm tròn lên
    const totalPages = Math.ceil(total / parseInt(limit));

    console.log(`🔍 Search filter:`, JSON.stringify(filter, null, 2));
    console.log(`📊 Found ${total} total recipes matching filter`);

    const recipes = await Recipe.find(filter)
      .populate("author", "firstName lastName avatar")
      .populate("ingredients.ingredient", "name unit image nutrition")
      .populate("categories", "name type slug image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`📦 Returned ${recipes.length} recipes in this page`);

    res.status(200).json({
      success: true,
      message: "Kết quả tìm kiếm",
      pagination: {
        total: total,
        currentPage: parseInt(page),
        totalPages: totalPages,
        limit: parseInt(limit),
      },
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error("❌ Error searching recipe: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi tìm kiếm công thức. Xin vui lòng thử lại.",
    });
  }
};

// ✅ POST: Thêm công thức
const addRecipe = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    // Extract fields from JSON request body (no longer FormData)
    const { name, description, servings, time, categories, ingredients, steps, image } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Tên công thức là bắt buộc",
        error: "Vui lòng nhập tên công thức.",
      });
    }

    // Validate data structures (already parsed from frontend)
    let parsedIngredients = ingredients || [];
    let parsedSteps = steps || [];
    let parsedCategories = categories || [];

    if (!Array.isArray(parsedIngredients) || parsedIngredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nguyên liệu là bắt buộc",
        error: "Vui lòng nhập nguyên liệu.",
      });
    }

    if (!Array.isArray(parsedSteps) || parsedSteps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cần phải có bước làm",
        error: "Vui lòng nhập bước làm.",
      });
    }

    // Get image URLs from request body (already uploaded to Cloudinary)
    const mainImageUrls = Array.isArray(image) ? image : (image ? [image] : []);
    console.log('Main image URLs received:', mainImageUrls);

    // Process ingredients - match with database ingredients
    const Ingredient = require('../models/ingredient');
    const processedIngredients = [];

    for (const ing of parsedIngredients) {
      let ingredientRecord = null;
      
      // If ingredientId is provided, use it
      if (ing.ingredientId) {
        try {
          ingredientRecord = await Ingredient.findById(ing.ingredientId);
        } catch (error) {
          console.warn(`Invalid ingredient ID: ${ing.ingredientId}`);
        }
      }
      
      // If no ingredient found and no ID provided, search by name
      if (!ingredientRecord && ing.name) {
        ingredientRecord = await Ingredient.findOne({
          name: { $regex: new RegExp(`^${ing.name.trim()}$`, 'i') }
        });
      }
      
      // If still no ingredient found, create a new one
      if (!ingredientRecord && ing.name) {
        try {
          const slugify = require('slugify');
          ingredientRecord = new Ingredient({
            name: ing.name.trim(),
            slug: slugify(ing.name.trim(), { lower: true, locale: 'vi' }),
            unit: ing.unit || '',
          });
          await ingredientRecord.save();
          console.log(`Created new ingredient: ${ing.name}`);
        } catch (createError) {
          console.error('Error creating ingredient:', createError);
          return res.status(500).json({
            success: false,
            message: "Lỗi tạo nguyên liệu mới",
            error: `Không thể tạo nguyên liệu: ${ing.name}`
          });
        }
      }      if (ingredientRecord) {
        processedIngredients.push({
          ingredient: ingredientRecord._id,
          quantity: parseFloat(ing.amount || ing.quantity) || 1, // Handle both amount and quantity
          name: ingredientRecord.name, // Add name for easier access
          unit: ing.unit || ingredientRecord.unit || ''
        });
      }
    }    // Process steps with Cloudinary image URLs
    const processedSteps = parsedSteps.map((step, index) => {
      const stepData = {
        step: step.summary || step.step || `Bước ${index + 1}`, // Use summary or fallback
        description: step.detail || step.description || '', // Add description field
        time: step.time || null,
        image: []
      };

      // Add step images from Cloudinary URLs
      if (step.images && Array.isArray(step.images)) {
        stepData.image = step.images; // step.images already contains Cloudinary URLs
      }

      return stepData;
    });

    const slug = slugify(name, { lower: true, locale: "vi" });

    const recipe = new Recipe({
      name: name.trim(),
      slug,
      description: description?.trim() || '',
      servings: parseInt(servings) || 1,
      time: parseInt(time) || 30,
      ingredients: processedIngredients,
      steps: processedSteps,
      image: mainImageUrls, // Use Cloudinary URLs
      categories: parsedCategories || [],
      author: req.user ? req.user._id : null,
    });

    const newRecipe = await recipe.save();

    // Automatically add recipe to "Công thức của tôi" collection
    if (req.user && req.user._id) {
      const { addRecipeToMyRecipes } = require("./collectionController");
      await addRecipeToMyRecipes(req.user._id, newRecipe._id);
    }

    res.status(201).json({
      success: true,
      message: "Thêm công thức thành công",
      data: newRecipe,
    });
  } catch (error) {
    console.error("❌ Error adding recipe: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi thêm công thức. Xin vui lòng thử lại.",
    });
  }
};

// ✅ PATCH: Sửa công thức
const editRecipe = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid Id",
        error: "Mã công thức không hợp lệ",
      });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy công thức",
        error: "Công thức không tồn tại",
      });
    }    // Process ingredients if provided
    if (updates.ingredients && Array.isArray(updates.ingredients)) {
      const Ingredient = require('../models/ingredient');
      const processedIngredients = [];

      for (const ing of updates.ingredients) {
        let ingredientRecord = null;
        
        // If ingredientId is provided, use it
        if (ing.ingredientId) {
          try {
            ingredientRecord = await Ingredient.findById(ing.ingredientId);
          } catch (error) {
            console.warn(`Invalid ingredient ID: ${ing.ingredientId}`);
          }
        }
        
        // If no ingredient found and no ID provided, search by name
        if (!ingredientRecord && ing.name) {
          ingredientRecord = await Ingredient.findOne({
            name: { $regex: new RegExp(`^${ing.name.trim()}$`, 'i') }
          });
        }
        
        // If still no ingredient found, create a new one
        if (!ingredientRecord && ing.name) {
          try {
            const slugify = require('slugify');
            ingredientRecord = new Ingredient({
              name: ing.name.trim(),
              slug: slugify(ing.name.trim(), { lower: true, locale: 'vi' }),
              unit: ing.unit || '',
            });
            await ingredientRecord.save();
            console.log(`Created new ingredient: ${ing.name}`);
          } catch (createError) {
            console.error('Error creating ingredient:', createError);
            return res.status(500).json({
              success: false,
              message: "Lỗi tạo nguyên liệu mới",
              error: `Không thể tạo nguyên liệu: ${ing.name}`
            });
          }
        }

        if (ingredientRecord) {
          processedIngredients.push({
            ingredient: ingredientRecord._id,
            quantity: parseFloat(ing.amount || ing.quantity) || 1,
            name: ingredientRecord.name,
            unit: ing.unit || ingredientRecord.unit || ''
          });
        }
      }
      
      updates.ingredients = processedIngredients;
    }

    // Process steps with Cloudinary image URLs if provided
    if (updates.steps && Array.isArray(updates.steps)) {
      const processedSteps = updates.steps.map((step, index) => {
        const stepData = {
          step: step.step || `Bước ${index + 1}`,
          description: step.description || '',
          time: step.time || null,
          image: []
        };

        // Add step images from Cloudinary URLs
        if (step.images && Array.isArray(step.images)) {
          stepData.image = step.images; // step.images already contains Cloudinary URLs
        }

        return stepData;
      });
      
      updates.steps = processedSteps;
    }

    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, locale: "vi" });
    }

    const updateRecipe = await Recipe.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật công thức thành công",
      data: updateRecipe,
    });
  } catch (error) {
    console.error("❌ Error updating recipe: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi chỉnh sửa công thức. Xin vui lòng thử lại.",
    });
  }
};

// ✅ DELETE: Xóa công thức
const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  console.log("id recipe to delete: ", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Id",
      error: "Mã công thức không hợp lệ",
    });
  }

  try {
    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy công thức",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa công thức thành công",
      data: recipe.name,
    });
  } catch (error) {
    console.error("❌ Error deleting recipe: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi xóa công thức. Xin vui lòng thử lại.",
    });
  }
};

// ✅ GET: Lấy top recipes (dựa trên lượt thích)
const getTopRecipes = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const limitNumber = parseInt(limit);

    // Sử dụng aggregate pipeline thay vì find + match + addFields
    const recipes = await Recipe.aggregate([
      // Match recipes with at least one image
      {
        $match: {
          image: { $exists: true, $ne: [] },
        },
      },
      // Add field to calculate likes count
      {
        $addFields: {
          likesCount: {
            $size: { $ifNull: ["$likes", []] },
          },
        },
      },
      // Sort by likes count and creation date
      {
        $sort: {
          likesCount: -1,
          createdAt: -1,
        },
      },
      // Limit results
      { $limit: limitNumber },
      // Populate author info
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },      // Convert author array to object
      {
        $addFields: {
          author: { $arrayElemAt: ["$author", 0] },
        },
      },
      // Populate categories info
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      // Project only needed author fields
      {
        $project: {
          "author.password": 0,
          "author.email": 0,
          "author.__v": 0,
          // Add other fields you want to exclude
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: recipes.length,
      message: "Lấy các công thức nổi bật thành công",
      data: recipes,
    });
  } catch (error) {
    console.error("❌ Error fetching top recipes: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy công thức nổi bật. Xin vui lòng thử lại.",
    });
  }
};

// ✅ GET: Lấy các công thức tương tự dựa trên categories
const getSimilarRecipes = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 6 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    // Lấy recipe hiện tại để biết categories
    const currentRecipe = await Recipe.findById(id).populate('categories', 'type');

    if (!currentRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Tạo query để tìm recipes tương tự
    const similarityQuery = {
      _id: { $ne: id }, // Loại bỏ recipe hiện tại
    };

    // If current recipe has categories, find similar ones
    if (currentRecipe.categories && currentRecipe.categories.length > 0) {
      similarityQuery.categories = {
        $in: currentRecipe.categories.map(cat => cat._id)
      };
    }    // Tìm recipes tương tự
    const similarRecipes = await Recipe.find(similarityQuery)
      .populate("author", "firstName lastName avatar")
      .populate("ingredients.ingredient", "name unit image nutrition")
      .populate("categories", "name type slug image")
      .sort({ averageRating: -1, createdAt: -1 }) // Ưu tiên rating cao và mới
      .limit(parseInt(limit));

    // Nếu không đủ recipes tương tự, lấy thêm random recipes
    if (similarRecipes.length < parseInt(limit)) {
      const remainingLimit = parseInt(limit) - similarRecipes.length;
      const randomRecipes = await Recipe.find({
        _id: {
          $ne: id,
          $nin: similarRecipes.map((recipe) => recipe._id),
        },
      })
        .populate("author", "firstName lastName avatar")
        .populate("ingredients.ingredient", "name unit image nutrition")
        .populate("categories", "name type slug image")
        .sort({ createdAt: -1 })
        .limit(remainingLimit);

      similarRecipes.push(...randomRecipes);
    }

    res.status(200).json({
      success: true,
      count: similarRecipes.length,
      message: "Lấy công thức tương tự thành công",
      data: similarRecipes,
    });
  } catch (error) {
    console.error("❌ Error fetching similar recipes: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy công thức tương tự. Xin vui lòng thử lại.",
    });
  }
};

const getRecipeByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "ID người dùng không hợp lệ"
      });
    }

    const recipes = await Recipe.find({ author: userId })
      .populate("author", "firstName lastName avatar")
      .populate("ingredients.ingredient", "name unit image")
      .populate("categories", "name type slug image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error("❌ Error fetching user recipes:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy công thức của người dùng. Xin vui lòng thử lại."
    });
  }
};

const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipes = await Recipe.find({ author: userId })
      .populate("author", "firstName lastName avatar")
      .populate("ingredients.ingredient", "name unit image")
      .populate("categories", "name type slug image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error("❌ Error fetching my recipes:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: "Đã xảy ra lỗi khi lấy công thức của bạn. Xin vui lòng thử lại."
    });
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  searchRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  getTopRecipes,
  getSimilarRecipes,
  getRecipeByUserId,
  getMyRecipes
};
