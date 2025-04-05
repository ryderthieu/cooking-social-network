const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { 
    getAllIngredients, 
    getIngredientsById, 
    searchIngredient,
    deleteIngredient,
    editIngredient,
    addIngredient
} = require("../controllers/ingredientController");

const router = express.Router();

// GET
router.get("/", authenticateJWT, getAllIngredients);
router.get("/search", authenticateJWT, searchIngredient);
router.get("/:id", getIngredientsById);

// CREATE
router.post("/add-ingredient/", authenticateJWT, addIngredient);

// UPDATE
router.patch("/edit-ingredient/:id", authenticateJWT, editIngredient);

// DELETE
router.delete("/delete-ingredient/:id", authenticateJWT, deleteIngredient);

module.exports = router;