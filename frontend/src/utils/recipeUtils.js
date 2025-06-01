// Utility function to calculate total nutrition from ingredients
export const calculateNutrition = (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    return {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      cholesterol: 0,
    };
  }

  const totals = ingredients.reduce(
    (acc, ingredientItem) => {
      const ingredient = ingredientItem.ingredient;
      const quantity = ingredientItem.quantity || 1;

      if (ingredient && ingredient.nutrition) {
        // Calculate nutrition per quantity (assuming nutrition data is per 100g/unit)
        const factor = quantity / 100; // Adjust based on your data structure

        acc.calories += (ingredient.nutrition.calories || 0) * factor;
        acc.protein += (ingredient.nutrition.protein || 0) * factor;
        acc.fat += (ingredient.nutrition.fat || 0) * factor;
        acc.carbs += (ingredient.nutrition.carbs || 0) * factor;
      }

      return acc;
    },
    {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      cholesterol: 0, // This might need to be added to ingredient model
    }
  );
  
  return {
    calories: Math.round(totals.calories * 10) / 10,
    protein: Math.round(totals.protein * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    cholesterol: 37.4, // Static for now, can be calculated if added to ingredient model
  };
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
