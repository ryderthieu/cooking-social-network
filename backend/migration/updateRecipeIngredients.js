const mongoose = require('mongoose');
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const slugify = require('slugify');
require('dotenv').config();

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

// Create ingredient if it doesn't exist
async function findOrCreateIngredient(ingredientData) {
    try {
        // Try to find ingredient by name (case insensitive)
        let ingredient = await Ingredient.findOne({
            name: { $regex: new RegExp(`^${ingredientData.name.trim()}$`, 'i') }
        });

        // If not found, create new ingredient
        if (!ingredient) {
            ingredient = new Ingredient({
                name: ingredientData.name.trim(),
                slug: slugify(ingredientData.name.trim(), { lower: true, locale: 'vi' }),
                unit: ingredientData.unit || '',
                nutrition: {
                    calories: 0,
                    protein: 0,
                    fat: 0,
                    carbs: 0,
                    cholesterol: 0
                }
            });
            await ingredient.save();
            console.log(`   ➕ Created new ingredient: ${ingredient.name}`);
        }

        return ingredient;
    } catch (error) {
        console.error(`   ❌ Error creating ingredient ${ingredientData.name}:`, error);
        return null;
    }
}

// Update recipe ingredients to match the model
async function updateRecipeIngredients() {
    try {
        console.log('🔄 Starting recipe ingredients migration...');
        
        // Get all recipes
        const recipes = await Recipe.find();
        console.log(`📊 Found ${recipes.length} recipes to check`);

        let updatedCount = 0;
        let errorCount = 0;

        for (const recipe of recipes) {
            try {
                console.log(`\n🔍 Processing recipe: ${recipe.name} (ID: ${recipe._id})`);
                let hasChanges = false;
                const updatedIngredients = [];

                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    for (const recipeIngredient of recipe.ingredients) {
                        let updatedIngredient = { ...recipeIngredient.toObject() };

                        // Case 1: ingredient field is missing or not a valid ObjectId
                        if (!recipeIngredient.ingredient || !mongoose.Types.ObjectId.isValid(recipeIngredient.ingredient)) {
                            console.log(`   🔧 Fixing ingredient reference for: ${recipeIngredient.name || 'Unknown'}`);
                            
                            if (recipeIngredient.name) {
                                // Find or create ingredient
                                const ingredient = await findOrCreateIngredient({
                                    name: recipeIngredient.name,
                                    unit: recipeIngredient.unit
                                });

                                if (ingredient) {
                                    updatedIngredient.ingredient = ingredient._id;
                                    hasChanges = true;
                                    console.log(`   ✅ Linked to ingredient: ${ingredient.name} (${ingredient._id})`);
                                } else {
                                    console.log(`   ❌ Failed to create/find ingredient for: ${recipeIngredient.name}`);
                                    errorCount++;
                                }
                            } else {
                                console.log(`   ⚠️  Skipping ingredient with no name`);
                            }
                        } else {
                            // Case 2: ingredient field exists, verify it's valid
                            try {
                                const existingIngredient = await Ingredient.findById(recipeIngredient.ingredient);
                                if (!existingIngredient) {
                                    console.log(`   🔧 Invalid ingredient reference found, creating new one for: ${recipeIngredient.name || 'Unknown'}`);
                                    
                                    if (recipeIngredient.name) {
                                        const ingredient = await findOrCreateIngredient({
                                            name: recipeIngredient.name,
                                            unit: recipeIngredient.unit
                                        });

                                        if (ingredient) {
                                            updatedIngredient.ingredient = ingredient._id;
                                            hasChanges = true;
                                            console.log(`   ✅ Re-linked to ingredient: ${ingredient.name} (${ingredient._id})`);
                                        }
                                    }
                                } else {
                                    console.log(`   ✅ Ingredient reference is valid: ${existingIngredient.name}`);
                                }
                            } catch (error) {
                                console.log(`   ❌ Error validating ingredient reference:`, error.message);
                            }
                        }

                        // Ensure required fields are present
                        if (!updatedIngredient.name && updatedIngredient.ingredient) {
                            try {
                                const ingredient = await Ingredient.findById(updatedIngredient.ingredient);
                                if (ingredient) {
                                    updatedIngredient.name = ingredient.name;
                                    hasChanges = true;
                                    console.log(`   📝 Added cached name: ${ingredient.name}`);
                                }
                            } catch (error) {
                                console.log(`   ❌ Error fetching ingredient name:`, error.message);
                            }
                        }

                        updatedIngredients.push(updatedIngredient);
                    }

                    // Update recipe if there were changes
                    if (hasChanges) {
                        recipe.ingredients = updatedIngredients;
                        await recipe.save();
                        updatedCount++;
                        console.log(`   ✅ Updated recipe: ${recipe.name}`);
                    } else {
                        console.log(`   ✅ Recipe already has valid ingredients`);
                    }
                } else {
                    console.log(`   ⚠️  Recipe has no ingredients array`);
                }

            } catch (error) {
                console.error(`   ❌ Error processing recipe ${recipe.name}:`, error);
                errorCount++;
            }
        }

        console.log('\n📈 Migration Summary:');
        console.log(`   Total recipes processed: ${recipes.length}`);
        console.log(`   Recipes updated: ${updatedCount}`);
        console.log(`   Errors encountered: ${errorCount}`);
        console.log(`   Recipes already valid: ${recipes.length - updatedCount - errorCount}`);

    } catch (error) {
        console.error('❌ Error in migration:', error);
    }
}

// Validate all recipes after migration
async function validateRecipes() {
    try {
        console.log('\n🔍 Validating all recipes...');
        
        const recipes = await Recipe.find().populate('ingredients.ingredient');
        let validCount = 0;
        let invalidCount = 0;

        for (const recipe of recipes) {
            let isValid = true;
            
            if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                for (const ingredient of recipe.ingredients) {
                    if (!ingredient.ingredient) {
                        console.log(`❌ Recipe "${recipe.name}" has invalid ingredient reference`);
                        isValid = false;
                        break;
                    }
                }
            }

            if (isValid) {
                validCount++;
            } else {
                invalidCount++;
            }
        }

        console.log('\n📊 Validation Results:');
        console.log(`   Valid recipes: ${validCount}`);
        console.log(`   Invalid recipes: ${invalidCount}`);
        console.log(`   Success rate: ${((validCount / recipes.length) * 100).toFixed(2)}%`);

    } catch (error) {
        console.error('❌ Error in validation:', error);
    }
}

// Main function
async function main() {
    try {
        await connectDB();
        await updateRecipeIngredients();
        await validateRecipes();
        
        console.log('\n🎉 Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    updateRecipeIngredients,
    validateRecipes
};
