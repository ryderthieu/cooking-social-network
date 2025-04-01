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

// GET
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.get('/search', authenticateJWT, searchRecipe);

// CREATE
router.post('/add-recipe/:id', authenticateJWT, addRecipe);

// UPDATE
router.patch('/edit-recipe/:id', authenticateJWT, editRecipe);

// DELETE
router.delete('/delete-recipe/:id', authenticateJWT, deleteRecipe);

module.exports = router;