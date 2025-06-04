const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

async function quickMigration() {
    try {        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all recipes with populate to check current state
        const recipes = await Recipe.find().populate('ingredients.ingredient');
        console.log(`📊 Found ${recipes.length} recipes`);

        let issuesFound = 0;
        let recipesFixed = 0;

        for (const recipe of recipes) {
            let needsUpdate = false;
            const updatedIngredients = [];

            if (recipe.ingredients && recipe.ingredients.length > 0) {
                for (const recipeIngredient of recipe.ingredients) {
                    let updatedIngredient = { ...recipeIngredient.toObject() };

                    // Check if ingredient reference is missing or invalid
                    if (!recipeIngredient.ingredient) {
                        console.log(`🔧 Recipe "${recipe.name}" - Missing ingredient reference for: ${recipeIngredient.name}`);
                        issuesFound++;

                        if (recipeIngredient.name) {
                            // Find existing ingredient by name
                            let ingredient = await Ingredient.findOne({
                                name: { $regex: new RegExp(`^${recipeIngredient.name.trim()}$`, 'i') }
                            });

                            // Create if doesn't exist
                            if (!ingredient) {
                                ingredient = new Ingredient({
                                    name: recipeIngredient.name.trim(),
                                    slug: recipeIngredient.name.toLowerCase().replace(/\s+/g, '-'),
                                    unit: recipeIngredient.unit || '',
                                    nutrition: {
                                        calories: 0,
                                        protein: 0,
                                        fat: 0,
                                        carbs: 0,
                                        cholesterol: 0
                                    }
                                });
                                await ingredient.save();
                                console.log(`   ➕ Created ingredient: ${ingredient.name}`);
                            }

                            updatedIngredient.ingredient = ingredient._id;
                            needsUpdate = true;
                            console.log(`   ✅ Fixed reference for: ${ingredient.name}`);
                        }
                    }

                    updatedIngredients.push(updatedIngredient);
                }

                if (needsUpdate) {
                    await Recipe.findByIdAndUpdate(recipe._id, {
                        ingredients: updatedIngredients
                    });
                    recipesFixed++;
                    console.log(`✅ Updated recipe: ${recipe.name}`);
                }
            }
        }

        console.log('\n📈 Migration Summary:');
        console.log(`   Total recipes: ${recipes.length}`);
        console.log(`   Issues found: ${issuesFound}`);
        console.log(`   Recipes fixed: ${recipesFixed}`);

        // Verify the fix
        const verifyRecipes = await Recipe.find().populate('ingredients.ingredient');
        let allValid = true;
        
        for (const recipe of verifyRecipes) {
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                for (const ingredient of recipe.ingredients) {
                    if (!ingredient.ingredient) {
                        console.log(`❌ Still invalid: Recipe "${recipe.name}" - ingredient "${ingredient.name}"`);
                        allValid = false;
                    }
                }
            }
        }

        if (allValid) {
            console.log('🎉 All recipes now have valid ingredient references!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📱 Disconnected from MongoDB');
    }
}

quickMigration();
