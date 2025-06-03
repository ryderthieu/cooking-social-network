const express = require('express');
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

// READ
router.get('/user/:userId', getRecipeByUserId);
router.get('/my-recipes',authenticateJWT, getMyRecipes);
router.get('/search', searchRecipe);
router.get('/filter', searchRecipe); // Add filter route that uses searchRecipe function
router.get('/top', getTopRecipes);
router.get('/:id/similar', getSimilarRecipes);
router.get('/:id', getRecipeById);
router.get('/', getAllRecipes);

// CREATE
router.post('/', authenticateJWT, addRecipe);

// UPDATE
router.patch('/:id', authenticateJWT, editRecipe);

// DELETE
router.delete('/:id', authenticateJWT, deleteRecipe);

module.exports = router;
