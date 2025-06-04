const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

// Mapping common ingredient names and units based on typical Vietnamese ingredients
const ingredientMappings = {
    // Common meat/protein ingredients
    'meat': { name: 'Thịt', unit: 'gram', category: 'protein' },
    'pork': { name: 'Thịt heo', unit: 'gram', category: 'protein' },
    'chicken': { name: 'Thịt gà', unit: 'gram', category: 'protein' },
    'beef': { name: 'Thịt bò', unit: 'gram', category: 'protein' },
    'fish': { name: 'Cá', unit: 'gram', category: 'protein' },
    'shrimp': { name: 'Tôm', unit: 'gram', category: 'protein' },
    'egg': { name: 'Trứng', unit: 'quả', category: 'protein' },
    
    // Vegetables
    'onion': { name: 'Hành tây', unit: 'gram', category: 'vegetable' },
    'garlic': { name: 'Tỏi', unit: 'gram', category: 'vegetable' },
    'tomato': { name: 'Cà chua', unit: 'gram', category: 'vegetable' },
    'carrot': { name: 'Cà rót', unit: 'gram', category: 'vegetable' },
    'potato': { name: 'Khoai tây', unit: 'gram', category: 'vegetable' },
    'cabbage': { name: 'Bắp cải', unit: 'gram', category: 'vegetable' },
    
    // Seasonings
    'salt': { name: 'Muối', unit: 'gram', category: 'seasoning' },
    'sugar': { name: 'Đường', unit: 'gram', category: 'seasoning' },
    'pepper': { name: 'Tiêu', unit: 'gram', category: 'seasoning' },
    'soy_sauce': { name: 'Nước tương', unit: 'ml', category: 'seasoning' },
    'fish_sauce': { name: 'Nước mắm', unit: 'ml', category: 'seasoning' },
    'oil': { name: 'Dầu ăn', unit: 'ml', category: 'seasoning' },
    
    // Rice and noodles
    'rice': { name: 'Gạo', unit: 'gram', category: 'grain' },
    'noodles': { name: 'Mì', unit: 'gram', category: 'grain' },
    
    // Default mapping
    'default': { name: 'Nguyên liệu', unit: 'gram', category: 'other' }
};

function generateIngredientName(id) {
    // Create a simple name based on ID pattern or return a generic name
    const lastChars = id.slice(-4);
    return `Nguyên liệu ${lastChars}`;
}

function getDefaultUnit() {
    return 'gram';
}

function getDefaultCategory() {
    return 'other';
}

async function createMissingIngredients() {
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

        // Get all existing ingredients
        const existingIngredients = await Ingredient.find({});
        const existingIds = new Set(existingIngredients.map(ing => ing._id.toString()));

        // Find missing ingredient IDs
        const missingIds = Array.from(allIngredientIds).filter(id => !existingIds.has(id));
        console.log(`Missing ingredient IDs: ${missingIds.length}`);

        if (missingIds.length === 0) {
            console.log('No missing ingredients found!');
            await mongoose.disconnect();
            return;
        }

        // Create missing ingredients
        console.log('Creating missing ingredients...');
        const newIngredients = [];

        for (const missingId of missingIds) {
            const ingredientData = {
                _id: new mongoose.Types.ObjectId(missingId),
                name: generateIngredientName(missingId),
                unit: getDefaultUnit(),
                category: getDefaultCategory(),
                nutritionalInfo: {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0
                }
            };
            
            newIngredients.push(ingredientData);
        }

        // Insert all new ingredients
        const insertResult = await Ingredient.insertMany(newIngredients, { ordered: false });
        console.log(`Successfully created ${insertResult.length} new ingredients`);

        // Verify the creation
        const finalIngredientCount = await Ingredient.countDocuments();
        console.log(`Total ingredients in database now: ${finalIngredientCount}`);

        // Show created ingredients
        console.log('\nCreated ingredients:');
        newIngredients.forEach(ing => {
            console.log(`- ${ing._id}: ${ing.name} (${ing.unit})`);
        });

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('Error:', error);
        await mongoose.disconnect();
    }
}

createMissingIngredients();
