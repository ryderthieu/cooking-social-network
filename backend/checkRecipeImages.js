const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/recipe');

async function checkRecipeImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const recipes = await Recipe.find({}).select('name image');
    
    console.log(`Checking ${recipes.length} recipes for image status...\n`);
    
    let noImageCount = 0;
    let hasImageCount = 0;
    let emptyArrayCount = 0;
    let placeholderCount = 0;
    
    const recipesNeedingImages = [];
    
    for (const recipe of recipes) {
      let status = '';
      let needsImage = false;
      
      if (!recipe.image) {
        status = 'NO IMAGE FIELD';
        noImageCount++;
        needsImage = true;
      } else if (Array.isArray(recipe.image)) {
        if (recipe.image.length === 0) {
          status = 'EMPTY ARRAY';
          emptyArrayCount++;
          needsImage = true;
        } else {
          const imageUrl = recipe.image[0];
          if (imageUrl.includes('placeholder') || imageUrl.includes('/placeholder.svg')) {
            status = 'PLACEHOLDER IMAGE';
            placeholderCount++;
            needsImage = true;
          } else {
            status = 'HAS IMAGE';
            hasImageCount++;
          }
        }
      } else if (typeof recipe.image === 'string') {
        if (recipe.image.includes('placeholder') || recipe.image === '') {
          status = 'PLACEHOLDER/EMPTY STRING';
          placeholderCount++;
          needsImage = true;
        } else {
          status = 'HAS IMAGE (STRING)';
          hasImageCount++;
        }
      }
      
      if (needsImage) {
        recipesNeedingImages.push({
          _id: recipe._id,
          name: recipe.name,
          currentImage: recipe.image,
          status: status
        });
      }
      
      console.log(`${recipe.name}: ${status} | Current: ${JSON.stringify(recipe.image)}`);
    }
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total recipes: ${recipes.length}`);
    console.log(`Recipes with images: ${hasImageCount}`);
    console.log(`Recipes without images: ${noImageCount}`);
    console.log(`Recipes with empty image arrays: ${emptyArrayCount}`);
    console.log(`Recipes with placeholder images: ${placeholderCount}`);
    console.log(`Total recipes needing images: ${recipesNeedingImages.length}`);
    
    if (recipesNeedingImages.length > 0) {
      console.log('\n=== RECIPES NEEDING IMAGES ===');
      recipesNeedingImages.forEach((recipe, index) => {
        console.log(`${index + 1}. ${recipe.name} (${recipe.status})`);
      });
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error checking recipe images:', error);
  }
}

checkRecipeImages();