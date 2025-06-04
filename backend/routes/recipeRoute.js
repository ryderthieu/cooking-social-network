const express = require('express');
const multer = require('multer');
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { 
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
} = require('../controllers/recipeController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// READ
router.get('/user/:userId', getRecipeByUserId);
router.get('/my-recipes',authenticateJWT, getMyRecipes);
router.get('/search', searchRecipe);
router.get('/filter', searchRecipe); // Add filter route that uses searchRecipe function
router.get('/top', getTopRecipes);
router.get('/:id/similar', getSimilarRecipes);
router.get('/:id', getRecipeById);
router.get('/', getAllRecipes);

// CREATE - Updated to handle JSON data with Cloudinary URLs (no file upload needed)
router.post('/', authenticateJWT, addRecipe);

// UPDATE
router.patch('/:id', authenticateJWT, editRecipe);

// DELETE
router.delete('/:id', authenticateJWT, deleteRecipe);

module.exports = router;
