const express = require('express');
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { 
    getAllRecipes, 
    getRecipeById, 
    searchRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe
} = require('../controllers/recipeController');
const router = express.Router();

// GET
router.get('/', getAllRecipes);
router.get('/search', authenticateJWT, searchRecipe);
router.get('/:id', getRecipeById);

// CREATE
router.post('/add-recipe', authenticateJWT, addRecipe);

// UPDATE
router.patch('/edit-recipe/:id', authenticateJWT, editRecipe);

// DELETE
router.delete('/delete-recipe/:id', authenticateJWT, deleteRecipe);

module.exports = router;