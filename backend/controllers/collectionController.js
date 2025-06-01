const Collection = require('../models/collection');
const Recipe = require('../models/recipe');

// Default logo path for collections without thumbnails
const DEFAULT_LOGO_PATH = '/orange-logo.svg';

// Get all collections for a user
const getUserCollections = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Check if user has "Yêu thích" collection, create if not exists
        let favoriteCollection = await Collection.findOne({ 
            owner: userId, 
            isDefault: true,
            defaultType: 'favorites'
        });
        
        if (!favoriteCollection) {
            favoriteCollection = new Collection({
                name: 'Yêu thích',
                description: 'Bộ sưu tập các công thức yêu thích của bạn',
                owner: userId,
                isDefault: true,
                defaultType: 'favorites',
                thumbnail: DEFAULT_LOGO_PATH
            });
            await favoriteCollection.save();
        }        // Check if user has "Công thức của tôi" collection, create if not exists
        let myRecipesCollection = await Collection.findOne({ 
            owner: userId, 
            isDefault: true,
            defaultType: 'created'
        });
        
        if (!myRecipesCollection) {
            // Get user avatar for thumbnail
            const User = require('../models/user');
            const user = await User.findById(userId).select('avatar');
            const userAvatar = user?.avatar || DEFAULT_LOGO_PATH;
            
            myRecipesCollection = new Collection({
                name: 'Công thức của tôi',
                description: 'Những công thức do tôi tạo',
                owner: userId,
                isDefault: true,
                defaultType: 'created',
                thumbnail: userAvatar
            });
            await myRecipesCollection.save();
        }
        
        const collections = await Collection.find({ owner: userId })
            .populate('recipes', 'name image averageRating time categories')
            .sort({ isDefault: -1, createdAt: -1 });

        // Update thumbnails for collections without recipes
        const updatedCollections = collections.map(collection => {
            if (!collection.thumbnail || (collection.recipes.length === 0 && collection.thumbnail !== DEFAULT_LOGO_PATH)) {
                collection.thumbnail = collection.recipes.length > 0 && collection.recipes[0].image?.length > 0
                    ? collection.recipes[0].image[0]
                    : DEFAULT_LOGO_PATH;
            }
            return collection;
        });

        res.status(200).json({
            success: true,
            data: updatedCollections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách bộ sưu tập',
            error: error.message
        });
    }
};

// Create a new collection
const createCollection = async (req, res) => {
    try {
        const { name, description, thumbnail } = req.body;
        const userId = req.user._id;

        // Check if collection name already exists for this user
        const existingCollection = await Collection.findOne({ 
            owner: userId, 
            name: name.trim() 
        });

        if (existingCollection) {
            return res.status(400).json({
                success: false,
                message: 'Tên bộ sưu tập đã tồn tại'
            });
        }

        const newCollection = new Collection({
            name: name.trim(),
            description: description?.trim(),
            thumbnail,
            owner: userId
        });

        await newCollection.save();

        res.status(201).json({
            success: true,
            message: 'Tạo bộ sưu tập thành công',
            data: newCollection
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo bộ sưu tập',
            error: error.message
        });
    }
};

// Add recipe to collection
const addRecipeToCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { recipeId } = req.body;
        const userId = req.user._id;

        // Find collection and verify ownership
        const collection = await Collection.findOne({ 
            _id: collectionId, 
            owner: userId 
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bộ sưu tập'
            });
        }

        // Check if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy công thức'
            });
        }

        // Check if recipe is already in collection
        if (collection.recipes.includes(recipeId)) {
            return res.status(400).json({
                success: false,
                message: 'Công thức đã có trong bộ sưu tập'
            });
        }        collection.recipes.push(recipeId);
        
        // If this is the first recipe, set it as thumbnail
        if (collection.recipes.length === 1) {
            const recipeImage = recipe.image && recipe.image.length > 0 ? recipe.image[0] : DEFAULT_LOGO_PATH;
            collection.thumbnail = recipeImage;
        }
        
        await collection.save();

        res.status(200).json({
            success: true,
            message: 'Thêm công thức vào bộ sưu tập thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm công thức vào bộ sưu tập',
            error: error.message
        });
    }
};

// Remove recipe from collection
const removeRecipeFromCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const { recipeId } = req.body;
        const userId = req.user._id;

        const collection = await Collection.findOne({ 
            _id: collectionId, 
            owner: userId 
        }).populate('recipes', 'image');

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bộ sưu tập'
            });
        }

        // Check if the recipe being removed is the one used for thumbnail
        const recipeToRemove = collection.recipes.find(recipe => recipe._id.toString() === recipeId);
        const isFirstRecipe = collection.recipes[0] && collection.recipes[0]._id.toString() === recipeId;

        collection.recipes = collection.recipes.filter(
            recipe => recipe._id.toString() !== recipeId
        );
        
        // Update thumbnail if necessary
        if (isFirstRecipe) {
            if (collection.recipes.length > 0 && collection.recipes[0].image?.length > 0) {
                // Set thumbnail to the new first recipe's image
                collection.thumbnail = collection.recipes[0].image[0];
            } else {
                // No recipes left or first recipe has no image, use default
                collection.thumbnail = DEFAULT_LOGO_PATH;
            }
        }
        
        await collection.save();

        res.status(200).json({
            success: true,
            message: 'Xóa công thức khỏi bộ sưu tập thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa công thức khỏi bộ sưu tập',
            error: error.message
        });
    }
};

// Get recipes in a specific collection
const getCollectionRecipes = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const userId = req.user._id;

        const collection = await Collection.findOne({ 
            _id: collectionId, 
            owner: userId 
        }).populate({
            path: 'recipes',
            populate: {
                path: 'author',
                select: 'firstName lastName avatar'
            }
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bộ sưu tập'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                collection: {
                    _id: collection._id,
                    name: collection.name,
                    description: collection.description,
                    thumbnail: collection.thumbnail
                },
                recipes: collection.recipes
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy công thức trong bộ sưu tập',
            error: error.message
        });
    }
};

// Delete collection
const deleteCollection = async (req, res) => {
    try {
        const { collectionId } = req.params;
        const userId = req.user._id;

        const collection = await Collection.findOne({ 
            _id: collectionId, 
            owner: userId 
        });

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bộ sưu tập'
            });
        }

        // Prevent deletion of default collections
        if (collection.isDefault) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa bộ sưu tập mặc định'
            });
        }

        await Collection.findByIdAndDelete(collectionId);

        res.status(200).json({
            success: true,
            message: 'Xóa bộ sưu tập thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa bộ sưu tập',
            error: error.message
        });
    }
};

// Toggle recipe in favorites collection (for heart button)
const toggleRecipeInFavorites = async (req, res) => {
    try {
        const { recipeId } = req.body;
        const userId = req.user._id;

        // Find or create favorites collection
        let favoriteCollection = await Collection.findOne({ 
            owner: userId, 
            isDefault: true,
            defaultType: 'favorites'
        });
        
        if (!favoriteCollection) {
            favoriteCollection = new Collection({
                name: 'Yêu thích',
                description: 'Bộ sưu tập các công thức yêu thích của bạn',
                owner: userId,
                isDefault: true,
                defaultType: 'favorites',
                thumbnail: DEFAULT_LOGO_PATH
            });
            await favoriteCollection.save();
        }

        const isRecipeInFavorites = favoriteCollection.recipes.includes(recipeId);
        
        if (isRecipeInFavorites) {
            // Remove from favorites
            const wasFirstRecipe = favoriteCollection.recipes[0] && favoriteCollection.recipes[0].toString() === recipeId;
            
            favoriteCollection.recipes = favoriteCollection.recipes.filter(
                recipe => recipe.toString() !== recipeId
            );
            
            // Update thumbnail if removing first recipe
            if (wasFirstRecipe) {
                if (favoriteCollection.recipes.length > 0) {
                    // Get the new first recipe's image
                    const firstRecipe = await Recipe.findById(favoriteCollection.recipes[0]);
                    favoriteCollection.thumbnail = firstRecipe?.image?.length > 0 ? firstRecipe.image[0] : DEFAULT_LOGO_PATH;
                } else {
                    favoriteCollection.thumbnail = DEFAULT_LOGO_PATH;
                }
            }
            
            await favoriteCollection.save();
            
            res.status(200).json({
                success: true,
                message: 'Đã bỏ khỏi yêu thích',
                isInFavorites: false
            });
        } else {
            // Add to favorites
            favoriteCollection.recipes.push(recipeId);
            
            // If this is the first recipe, set it as thumbnail
            if (favoriteCollection.recipes.length === 1) {
                const recipe = await Recipe.findById(recipeId);
                favoriteCollection.thumbnail = recipe?.image?.length > 0 ? recipe.image[0] : DEFAULT_LOGO_PATH;
            }
            
            await favoriteCollection.save();
            
            res.status(200).json({
                success: true,
                message: 'Đã thêm vào yêu thích',
                isInFavorites: true
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật yêu thích',
            error: error.message
        });
    }
};

// Check if recipe is in favorites
const checkRecipeInFavorites = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user._id;

        const favoriteCollection = await Collection.findOne({ 
            owner: userId, 
            isDefault: true,
            defaultType: 'favorites'
        });
        
        const isInFavorites = favoriteCollection ? 
            favoriteCollection.recipes.includes(recipeId) : false;

        res.status(200).json({
            success: true,
            isInFavorites
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi kiểm tra yêu thích',
            error: error.message
        });
    }
};

// Initialize default collections for user
const initializeDefaultCollections = async (userId) => {
    try {
        // Get user avatar for "Công thức của tôi" collection
        const User = require('../models/user');
        const user = await User.findById(userId).select('avatar');
        const userAvatar = user?.avatar || DEFAULT_LOGO_PATH;
        
        const defaultCollections = [
            {
                name: 'Yêu thích',
                description: 'Những công thức tôi yêu thích',
                owner: userId,
                isDefault: true,
                defaultType: 'favorites',
                thumbnail: DEFAULT_LOGO_PATH
            },
            {
                name: 'Đã xem',
                description: 'Những công thức tôi đã xem gần đây',
                owner: userId,
                isDefault: true,
                defaultType: 'viewed',
                thumbnail: DEFAULT_LOGO_PATH
            },
            {
                name: 'Công thức của tôi',
                description: 'Những công thức do tôi tạo',
                owner: userId,
                isDefault: true,
                defaultType: 'created',
                thumbnail: userAvatar
            }
        ];

        for (const collectionData of defaultCollections) {
            const existingCollection = await Collection.findOne({
                owner: userId,
                defaultType: collectionData.defaultType
            });

            if (!existingCollection) {
                await Collection.create(collectionData);
            }
        }
    } catch (error) {
        console.error('Error initializing default collections:', error);
    }
};

// Add recipe to "Công thức của tôi" collection when user creates a recipe
const addRecipeToMyRecipes = async (userId, recipeId) => {
    try {
        // Find or create "Công thức của tôi" collection
        let myRecipesCollection = await Collection.findOne({ 
            owner: userId, 
            isDefault: true,
            defaultType: 'created'
        });
        
        if (!myRecipesCollection) {
            // Get user avatar for thumbnail
            const User = require('../models/user');
            const user = await User.findById(userId).select('avatar');
            const userAvatar = user?.avatar || DEFAULT_LOGO_PATH;
            
            myRecipesCollection = new Collection({
                name: 'Công thức của tôi',
                description: 'Những công thức do tôi tạo',
                owner: userId,
                isDefault: true,
                defaultType: 'created',
                thumbnail: userAvatar
            });
        }

        // Check if recipe is already in collection
        if (!myRecipesCollection.recipes.includes(recipeId)) {
            myRecipesCollection.recipes.push(recipeId);
            
            // If this is the first recipe, set it as thumbnail
            if (myRecipesCollection.recipes.length === 1) {
                const Recipe = require('../models/recipe');
                const recipe = await Recipe.findById(recipeId);
                myRecipesCollection.thumbnail = recipe?.image?.length > 0 ? recipe.image[0] : myRecipesCollection.thumbnail;
            }
            
            await myRecipesCollection.save();
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error adding recipe to "Công thức của tôi":', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getUserCollections,
    createCollection,
    addRecipeToCollection,
    removeRecipeFromCollection,
    getCollectionRecipes,
    deleteCollection,
    toggleRecipeInFavorites,
    checkRecipeInFavorites,
    addRecipeToMyRecipes
};
