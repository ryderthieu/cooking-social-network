const express = require('express');
const router = express.Router();
const {
    getUserCollections,
    createCollection,
    addRecipeToCollection,
    removeRecipeFromCollection,
    getCollectionRecipes,
    deleteCollection,
    toggleRecipeInFavorites,
    checkRecipeInFavorites
} = require('../controllers/collectionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// GET /api/collections - Get all collections for user
router.get('/', getUserCollections);

// POST /api/collections - Create new collection
router.post('/', createCollection);

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
