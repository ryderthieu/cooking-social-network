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
    getSimilarRecipes
} = require('../controllers/recipeController');

const router = express.Router();

// READ
router.get('/', getAllRecipes);
router.get('/search', authenticateJWT, searchRecipe);
router.get('/top', getTopRecipes);
router.get('/:id/similar', getSimilarRecipes);
router.get('/:id', getRecipeById);

// CREATE
router.post('/', authenticateJWT, addRecipe);

// UPDATE
router.patch('/:id', authenticateJWT, editRecipe);

// DELETE
router.delete('/:id', authenticateJWT, deleteRecipe);

module.exports = router;
