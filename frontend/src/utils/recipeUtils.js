// Utility function to calculate total nutrition from ingredients
export const calculateNutrition = (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    console.log('No ingredients provided for nutrition calculation');
    return {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      cholesterol: 0,
    };
  }

  console.log('Calculating nutrition for ingredients:', ingredients);

  let totalNutrition = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    cholesterol: 0,
  };

  ingredients.forEach((ingredient, index) => {
    console.log(`Processing ingredient ${index}:`, ingredient);
    
    // Try to find nutrition data in different possible locations
    let nutritionData = null;
    
    // Check multiple possible locations for nutrition data
    if (ingredient.nutrition) {
      nutritionData = ingredient.nutrition;
      console.log('Found nutrition in ingredient.nutrition:', nutritionData);
    } else if (ingredient.ingredient && ingredient.ingredient.nutrition) {
      nutritionData = ingredient.ingredient.nutrition;
      console.log('Found nutrition in ingredient.ingredient.nutrition:', nutritionData);
    } else if (ingredient.ingredient && ingredient.ingredient.nutritionPer100g) {
      nutritionData = ingredient.ingredient.nutritionPer100g;
      console.log('Found nutrition in ingredient.ingredient.nutritionPer100g:', nutritionData);
    }

    if (nutritionData) {
      const quantity = parseFloat(ingredient.quantity) || 0;
      console.log(`Ingredient quantity: ${quantity}, unit: ${ingredient.unit}`);
      
      if (quantity > 0) {
        // Calculate multiplier based on quantity and unit
        let multiplier = 1;
        
        if (ingredient.unit) {
          multiplier = convertQuantityToMultiplier(quantity, ingredient.unit);
        } else {
          // If no unit specified, assume the nutrition is for the given quantity
          multiplier = quantity / 100; // Assume per 100g base
        }
        
        console.log(`Using multiplier: ${multiplier}`);

        // Add nutrition values - handle different property names
        const calories = nutritionData.calories || nutritionData.energy || 0;
        const protein = nutritionData.protein || 0;
        const fat = nutritionData.fat || nutritionData.lipid || 0;
        const carbs = nutritionData.carbs || nutritionData.carbohydrates || nutritionData.carbohydrate || 0;
        const cholesterol = nutritionData.cholesterol || 0;

        totalNutrition.calories += calories * multiplier;
        totalNutrition.protein += protein * multiplier;
        totalNutrition.fat += fat * multiplier;
        totalNutrition.carbs += carbs * multiplier;
        totalNutrition.cholesterol += cholesterol * multiplier;
        
        console.log(`Added nutrition for ${ingredient.name || ingredient.ingredient?.name || 'unknown'}:`, {
          calories: calories * multiplier,
          protein: protein * multiplier,
          fat: fat * multiplier,
          carbs: carbs * multiplier,
          cholesterol: cholesterol * multiplier
        });
      }    } else {
      console.warn(`No nutrition data found for ingredient:`, ingredient.name || ingredient.ingredient?.name || 'unknown ingredient');
      
      // Fallback: Use basic estimation based on ingredient name if no nutrition data
      const ingredientName = (ingredient.name || ingredient.ingredient?.name || '').toLowerCase();
      const quantity = parseFloat(ingredient.quantity) || 0;
      
      if (quantity > 0 && ingredientName) {
        const estimation = estimateNutritionFromName(ingredientName, quantity, ingredient.unit);
        if (estimation) {
          totalNutrition.calories += estimation.calories;
          totalNutrition.protein += estimation.protein;
          totalNutrition.fat += estimation.fat;
          totalNutrition.carbs += estimation.carbs;
          totalNutrition.cholesterol += estimation.cholesterol;
          console.log(`Used estimated nutrition for ${ingredientName}:`, estimation);
        }
      }
    }
  });

  // Round to 1 decimal place
  Object.keys(totalNutrition).forEach(key => {
    totalNutrition[key] = Math.round(totalNutrition[key] * 10) / 10;
  });

  console.log('Calculated nutrition from backend ingredient data:', totalNutrition);
  return totalNutrition;
};

// Helper function to convert quantity and unit to multiplier
const convertQuantityToMultiplier = (quantity, unit) => {
  const unitLower = unit.toLowerCase();
  
  // Define base conversions (assuming nutrition data is per 100g)
  const conversionFactors = {
    // Weight units
    'kg': quantity * 10, // 1kg = 1000g, so multiply by 10 for per 100g base
    'g': quantity / 100, // Direct conversion
    'gram': quantity / 100,
    
    // Volume units (approximate conversion to weight)
    'ml': quantity / 100, // Assume 1ml ≈ 1g for most ingredients
    'l': quantity * 10, // 1L = 1000ml ≈ 1000g
    'lít': quantity * 10,
    'cup': quantity * 2.4, // 1 cup ≈ 240ml ≈ 240g
    'tách': quantity * 2.4,
    
    // Spoon measurements
    'tbsp': quantity * 0.15, // 1 tbsp ≈ 15ml
    'tsp': quantity * 0.05, // 1 tsp ≈ 5ml
    'thìa canh': quantity * 0.15,
    'thìa cà phê': quantity * 0.05,
    
    // Piece measurements (approximate)
    'quả': quantity * 1.5, // Average fruit ≈ 150g
    'củ': quantity * 1.0, // Average root vegetable ≈ 100g
    'trái': quantity * 1.5,
    'lát': quantity * 0.1, // Slice ≈ 10g
    'miếng': quantity * 0.5, // Piece ≈ 50g
    'nhúm': quantity * 0.02, // Pinch ≈ 2g
    'ít': quantity * 0.05, // A little ≈ 5g
  };
  
  return conversionFactors[unitLower] || (quantity / 100); // Default to per 100g conversion
};

// Utility function to format ingredient quantity with unit
export const formatQuantity = (quantity, unit) => {
  if (!quantity) return "Theo ý thích";

  const formattedQuantity =
    quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(1);
  return unit ? `${formattedQuantity} ${unit}` : formattedQuantity;
};

// Utility function to calculate ingredient quantity based on servings
export const calculateIngredientQuantity = (originalQuantity, originalServings, newServings) => {
  if (!originalQuantity || !originalServings || !newServings) return originalQuantity;
  
  const ratio = newServings / originalServings;
  return originalQuantity * ratio;
};

// Helper function to estimate nutrition from ingredient name (basic fallback)
const estimateNutritionFromName = (ingredientName, quantity, unit) => {
  const name = ingredientName.toLowerCase();
  let multiplier = convertQuantityToMultiplier(quantity, unit || 'g');
  
  // Basic nutrition estimates per 100g for common ingredients
  const nutritionEstimates = {
    'rice': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28, cholesterol: 0 },
    'chicken': { calories: 165, protein: 31, fat: 3.6, carbs: 0, cholesterol: 85 },
    'beef': { calories: 250, protein: 26, fat: 15, carbs: 0, cholesterol: 90 },
    'pork': { calories: 242, protein: 27, fat: 14, carbs: 0, cholesterol: 80 },
    'egg': { calories: 155, protein: 13, fat: 11, carbs: 1.1, cholesterol: 372 },
    'oil': { calories: 884, protein: 0, fat: 100, carbs: 0, cholesterol: 0 },
    'sugar': { calories: 387, protein: 0, fat: 0, carbs: 100, cholesterol: 0 },
    'flour': { calories: 364, protein: 10, fat: 1, carbs: 76, cholesterol: 0 },
    'milk': { calories: 42, protein: 3.4, fat: 1, carbs: 5, cholesterol: 5 },
    'potato': { calories: 77, protein: 2, fat: 0.1, carbs: 17, cholesterol: 0 },
    'onion': { calories: 40, protein: 1.1, fat: 0.1, carbs: 9.3, cholesterol: 0 },
    'garlic': { calories: 149, protein: 6.4, fat: 0.5, carbs: 33, cholesterol: 0 },
    'tomato': { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, cholesterol: 0 },
  };
  
  // Find matching ingredient
  for (const [key, nutrition] of Object.entries(nutritionEstimates)) {
    if (name.includes(key)) {
      return {
        calories: nutrition.calories * multiplier,
        protein: nutrition.protein * multiplier,
        fat: nutrition.fat * multiplier,
        carbs: nutrition.carbs * multiplier,
        cholesterol: nutrition.cholesterol * multiplier,
      };
    }
  }
  
  return null; // No estimation available
};