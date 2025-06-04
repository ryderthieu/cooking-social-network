const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');

async function inspectSteps() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get sample recipes to check steps structure
        const recipes = await Recipe.find({}).limit(5);
        
        console.log('\n📊 Sample Recipe Steps Structure:');
        
        for (const recipe of recipes) {
            console.log(`\n--- Recipe: ${recipe.name} ---`);
            console.log(`Steps count: ${recipe.steps ? recipe.steps.length : 0}`);
            
            if (recipe.steps && recipe.steps.length > 0) {
                console.log('Steps structure:');
                recipe.steps.forEach((step, index) => {
                    console.log(`  Step ${index + 1}:`, {
                        step: step.step ? step.step.substring(0, 50) + '...' : 'No step text',
                        description: step.description ? step.description.substring(0, 50) + '...' : 'No description',
                        hasImages: step.image && step.image.length > 0
                    });
                });
            }
        }

        // Count recipes with missing step descriptions
        const allRecipes = await Recipe.find({});
        let recipesNeedingDescriptions = 0;
        let totalStepsNeedingDescriptions = 0;

        for (const recipe of allRecipes) {
            if (recipe.steps && recipe.steps.length > 0) {
                let recipeNeedsDescription = false;
                for (const step of recipe.steps) {
                    if (!step.description || step.description.trim() === '') {
                        totalStepsNeedingDescriptions++;
                        recipeNeedsDescription = true;
                    }
                }
                if (recipeNeedsDescription) {
                    recipesNeedingDescriptions++;
                }
            }
        }

        console.log('\n📈 Statistics:');
        console.log(`Total recipes: ${allRecipes.length}`);
        console.log(`Recipes needing step descriptions: ${recipesNeedingDescriptions}`);
        console.log(`Total steps needing descriptions: ${totalStepsNeedingDescriptions}`);

        await mongoose.disconnect();
        console.log('📱 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
    }
}

inspectSteps();
