const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');

async function inspectData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get sample recipes to understand data structure
        const recipes = await Recipe.find().limit(3);
        
        console.log('\n📊 Sample Recipe Data Structure:');
        
        for (const recipe of recipes) {
            console.log(`\n--- Recipe: ${recipe.name} ---`);
            console.log(`Ingredients count: ${recipe.ingredients ? recipe.ingredients.length : 0}`);
            
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                console.log('Ingredients structure:');
                recipe.ingredients.forEach((ing, index) => {
                    console.log(`  [${index}]:`, {
                        ingredient: ing.ingredient,
                        quantity: ing.quantity,
                        name: ing.name,
                        unit: ing.unit
                    });
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

inspectData();
