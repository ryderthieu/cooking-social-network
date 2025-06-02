const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoriesByType,
    getCategoryById,
    getCategoryBySlugAndType,
    createCategory,
    updateCategory,
    deleteCategory,
    getFormattedCategories,
    getAllFormattedCategories
} = require('../controllers/categoryController');

// Public routes
router.get('/', getAllCategories);
router.get('/formatted', getFormattedCategories); // For header menu (filtered)
router.get('/all-formatted', getAllFormattedCategories); // For all pages (not filtered)
router.get('/type/:type', getCategoriesByType);
router.get('/id/:id', getCategoryById); // Changed to /id/:id to avoid conflict
router.get('/:type/:slug', getCategoryBySlugAndType); // Get category by type and slug

// Admin routes (should add auth middleware later)
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
