const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

async function findMissingIngredients() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all recipes with their ingredients
        const recipes = await Recipe.find({});
        console.log(`Total recipes: ${recipes.length}`);

        // Collect all ingredient ObjectIds from recipes
        const allIngredientIds = new Set();
        recipes.forEach(recipe => {
            if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                recipe.ingredients.forEach(ing => {
                    if (ing.ingredient && mongoose.Types.ObjectId.isValid(ing.ingredient)) {
                        allIngredientIds.add(ing.ingredient.toString());
                    }
                });
            }
        });

        console.log(`Total unique ingredient IDs found in recipes: ${allIngredientIds.size}`);

        // Get all existing ingredients
        const existingIngredients = await Ingredient.find({});
        const existingIds = new Set(existingIngredients.map(ing => ing._id.toString()));
        console.log(`Total ingredients in Ingredient collection: ${existingIngredients.length}`);

        // Find missing ingredient IDs
        const missingIds = Array.from(allIngredientIds).filter(id => !existingIds.has(id));
        console.log(`Missing ingredient IDs: ${missingIds.length}`);

        if (missingIds.length > 0) {
            console.log('\nMissing ingredient IDs:');
            missingIds.forEach(id => console.log(`- ${id}`));

            // Find recipes that use these missing ingredients
            console.log('\nRecipes using missing ingredients:');
            for (const recipe of recipes) {
                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    const recipeMissingIds = recipe.ingredients
                        .filter(ing => ing.ingredient && missingIds.includes(ing.ingredient.toString()))
                        .map(ing => ing.ingredient.toString());
                    
                    if (recipeMissingIds.length > 0) {
                        console.log(`Recipe "${recipe.title}" (${recipe._id}): ${recipeMissingIds.length} missing ingredients`);
                        recipeMissingIds.forEach(missingId => {
                            const ing = recipe.ingredients.find(i => i.ingredient && i.ingredient.toString() === missingId);
                            console.log(`  - Missing ID: ${missingId}, Name: ${ing.name || 'No name'}, Quantity: ${ing.quantity || 'No quantity'}, Unit: ${ing.unit || 'No unit'}`);
                        });
                        console.log('');
                    }
                }
            }
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        await mongoose.disconnect();
    }
}

findMissingIngredients();
