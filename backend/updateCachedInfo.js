const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

async function updateCachedIngredientInfo() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all recipes
        const recipes = await Recipe.find();
        console.log(`📊 Found ${recipes.length} recipes to update`);

        let updatedCount = 0;
        let errorCount = 0;

        for (const recipe of recipes) {
            try {
                console.log(`\n🔍 Processing recipe: ${recipe.name} (ID: ${recipe._id})`);
                let hasChanges = false;
                const updatedIngredients = [];

                if (recipe.ingredients && recipe.ingredients.length > 0) {
                    for (const recipeIngredient of recipe.ingredients) {
                        let updatedIngredient = { ...recipeIngredient.toObject() };

                        // If ingredient reference exists but cached name/unit is missing
                        if (recipeIngredient.ingredient && (!recipeIngredient.name || !recipeIngredient.unit)) {
                            try {
                                const ingredient = await Ingredient.findById(recipeIngredient.ingredient);
                                if (ingredient) {
                                    console.log(`   📝 Updating cached info for ingredient: ${ingredient.name}`);
                                    
                                    // Update cached name if missing
                                    if (!updatedIngredient.name && ingredient.name) {
                                        updatedIngredient.name = ingredient.name;
                                        hasChanges = true;
                                    }
                                    
                                    // Update cached unit if missing
                                    if (!updatedIngredient.unit && ingredient.unit) {
                                        updatedIngredient.unit = ingredient.unit;
                                        hasChanges = true;
                                    }

                                    console.log(`   ✅ Cached info: name="${updatedIngredient.name}", unit="${updatedIngredient.unit}"`);
                                } else {
                                    console.log(`   ⚠️  Ingredient not found for ID: ${recipeIngredient.ingredient}`);
                                }
                            } catch (error) {
                                console.log(`   ❌ Error fetching ingredient:`, error.message);
                                errorCount++;
                            }
                        } else if (recipeIngredient.ingredient) {
                            console.log(`   ✅ Ingredient already has cached info: ${recipeIngredient.name}`);
                        } else {
                            console.log(`   ⚠️  Missing ingredient reference`);
                        }

                        updatedIngredients.push(updatedIngredient);
                    }

                    // Update recipe if there were changes
                    if (hasChanges) {
                        await Recipe.findByIdAndUpdate(recipe._id, {
                            ingredients: updatedIngredients
                        });
                        updatedCount++;
                        console.log(`   ✅ Updated recipe: ${recipe.name}`);
                    } else {
                        console.log(`   ✅ Recipe already has complete cached info`);
                    }
                } else {
                    console.log(`   ⚠️  Recipe has no ingredients`);
                }

            } catch (error) {
                console.error(`   ❌ Error processing recipe ${recipe.name}:`, error);
                errorCount++;
            }
        }

        console.log('\n📈 Update Summary:');
        console.log(`   Total recipes processed: ${recipes.length}`);
        console.log(`   Recipes updated: ${updatedCount}`);
        console.log(`   Errors encountered: ${errorCount}`);
        console.log(`   Recipes already complete: ${recipes.length - updatedCount - errorCount}`);

        // Validate the results
        console.log('\n🔍 Validating updated data...');
        const verifyRecipes = await Recipe.find().limit(3);
        
        for (const recipe of verifyRecipes) {
            console.log(`\n--- Verification for: ${recipe.name} ---`);
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                recipe.ingredients.forEach((ing, index) => {
                    console.log(`  [${index}]: ingredient=${ing.ingredient}, name="${ing.name}", unit="${ing.unit}", quantity=${ing.quantity}`);
                });
            }
        }

        console.log('\n🎉 Cached ingredient info update completed!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('📱 Disconnected from MongoDB');
    }
}

updateCachedIngredientInfo();
