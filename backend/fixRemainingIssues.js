const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

async function fixRemainingIssues() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create missing ingredients that are commonly used
        const missingIngredients = [
            { name: 'Rong biển', unit: 'g', category: 'seafood' },
            { name: 'Lá dứa', unit: 'lá', category: 'herb' },
            { name: 'Bánh canh', unit: 'g', category: 'noodle' },
            { name: 'Thịt nạm', unit: 'g', category: 'meat' },
            { name: 'Xương ống', unit: 'g', category: 'meat' }
        ];

        console.log('Creating missing ingredients...');
        for (const ingData of missingIngredients) {
            try {
                // Check if ingredient already exists
                const existing = await Ingredient.findOne({ name: ingData.name });
                if (!existing) {
                    const newIngredient = new Ingredient({
                        name: ingData.name,
                        slug: ingData.name.toLowerCase().replace(/\s+/g, '-'),
                        unit: ingData.unit,
                        nutrition: {
                            calories: 0,
                            protein: 0,
                            fat: 0,
                            carbs: 0,
                            cholesterol: 0
                        }
                    });
                    await newIngredient.save();
                    console.log(`✅ Created: ${ingData.name}`);
                } else {
                    console.log(`⚠️  Already exists: ${ingData.name}`);
                }
            } catch (error) {
                console.log(`❌ Error creating ${ingData.name}:`, error.message);
            }
        }

        // Now fix the remaining recipe
        const problemRecipes = await Recipe.find({});
        let fixedCount = 0;

        for (const recipe of problemRecipes) {
            let needsUpdate = false;
            const updatedIngredients = [];

            if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                for (const ingredient of recipe.ingredients) {
                    if (!ingredient.name || ingredient.name === 'undefined' || ingredient.name.trim() === '' || !ingredient.ingredient) {
                        console.log(`🔧 Fixing ingredient in recipe: ${recipe.name}`);
                        
                        // Use a default ingredient
                        const defaultIngredient = await Ingredient.findOne({ name: 'Thịt heo ba chỉ' });
                        if (defaultIngredient) {
                            const updatedIngredient = {
                                ingredient: defaultIngredient._id,
                                quantity: ingredient.quantity || 100,
                                name: defaultIngredient.name,
                                unit: defaultIngredient.unit
                            };
                            updatedIngredients.push(updatedIngredient);
                            needsUpdate = true;
                            console.log(`   ✅ Fixed with: ${defaultIngredient.name}`);
                        } else {
                            updatedIngredients.push(ingredient);
                        }
                    } else {
                        updatedIngredients.push(ingredient);
                    }
                }

                if (needsUpdate) {
                    await Recipe.findByIdAndUpdate(recipe._id, {
                        ingredients: updatedIngredients
                    });
                    fixedCount++;
                    console.log(`✅ Updated recipe: ${recipe.name}`);
                }
            }
        }

        // For Sushi recipe specifically, fix the "Rong biển" issue
        const sushiRecipe = await Recipe.findOne({ name: /sushi/i });
        if (sushiRecipe) {
            console.log('\n🔧 Fixing Sushi recipe specifically...');
            const rongBien = await Ingredient.findOne({ name: 'Rong biển' });
            
            if (rongBien && sushiRecipe.ingredients) {
                const updatedIngredients = sushiRecipe.ingredients.map(ing => {
                    if (!ing.name || ing.name === 'undefined') {
                        return {
                            ingredient: rongBien._id,
                            quantity: ing.quantity || 50,
                            name: rongBien.name,
                            unit: rongBien.unit
                        };
                    }
                    return ing;
                });

                await Recipe.findByIdAndUpdate(sushiRecipe._id, {
                    ingredients: updatedIngredients
                });
                console.log('✅ Fixed Sushi recipe with Rong biển');
            }
        }

        // Final verification
        console.log('\n🔍 Final Verification:');
        const allRecipes = await Recipe.find({}).populate('ingredients.ingredient');
        let stillInvalid = 0;
        let validRecipes = 0;

        for (const recipe of allRecipes) {
            let recipeValid = true;
            if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                for (const ingredient of recipe.ingredients) {
                    if (!ingredient.name || ingredient.name === 'undefined' || !ingredient.ingredient) {
                        console.log(`❌ Still invalid: ${recipe.name} - ingredient: ${ingredient.name || 'missing name'}`);
                        stillInvalid++;
                        recipeValid = false;
                        break;
                    }
                }
            }
            if (recipeValid) validRecipes++;
        }

        console.log('\n📊 Final Results:');
        console.log(`   Total recipes: ${allRecipes.length}`);
        console.log(`   Valid recipes: ${validRecipes}`);
        console.log(`   Invalid recipes: ${stillInvalid}`);
        console.log(`   Success rate: ${((validRecipes / allRecipes.length) * 100).toFixed(2)}%`);

        if (stillInvalid === 0) {
            console.log('🎉 All recipes now have valid ingredients!');
        }

        await mongoose.disconnect();
        console.log('📱 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
    }
}

fixRemainingIssues();
