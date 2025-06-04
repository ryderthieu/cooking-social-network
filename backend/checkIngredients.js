const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');
const Ingredient = require('./models/ingredient');

async function checkAvailableIngredients() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all existing ingredients
        const existingIngredients = await Ingredient.find({}).select('name unit _id');
        console.log(`\n📊 Available ingredients in database: ${existingIngredients.length}`);
        
        console.log('\nExisting ingredients:');
        existingIngredients.forEach((ing, index) => {
            console.log(`${index + 1}. ${ing.name} (${ing.unit}) - ID: ${ing._id}`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        await mongoose.disconnect();
    }
}

checkAvailableIngredients();
