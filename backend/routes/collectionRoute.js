const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getUserCollections,
    createCollection,
    updateCollection,
    updateCollectionImage,
    addRecipeToCollection,
    removeRecipeFromCollection,
    getCollectionRecipes,
    deleteCollection,
    toggleRecipeInFavorites,
    checkRecipeInFavorites
} = require('../controllers/collectionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// All routes require authentication
router.use(authenticateJWT);

// GET /api/collections - Get all collections for user
router.get('/', getUserCollections);

// POST /api/collections - Create new collection
router.post('/', createCollection);

// PUT /api/collections/:collectionId - Update collection
router.put('/:collectionId', updateCollection);

// PUT /api/collections/:collectionId/image - Update collection image
router.put('/:collectionId/image', updateCollectionImage);

// GET /api/collections/:collectionId/recipes - Get recipes in collection
router.get('/:collectionId/recipes', getCollectionRecipes);

// POST /api/collections/:collectionId/recipes - Add recipe to collection
router.post('/:collectionId/recipes', addRecipeToCollection);

// DELETE /api/collections/:collectionId/recipes - Remove recipe from collection
router.delete('/:collectionId/recipes', removeRecipeFromCollection);

// POST /api/collections/favorites/toggle - Toggle recipe in favorites
router.post('/favorites/toggle', toggleRecipeInFavorites);

// GET /api/collections/favorites/check/:recipeId - Check if recipe is in favorites
router.get('/favorites/check/:recipeId', checkRecipeInFavorites);

// DELETE /api/collections/:collectionId - Delete collection
router.delete('/:collectionId', deleteCollection);

module.exports = router;
