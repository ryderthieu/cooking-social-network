import api from "./api";

export const searchIngredients = async (query) => {
  try {
    const response = await api.get(`/api/ingredients/search?keyword=${query}`);
    return response;
  } catch (error) {
    console.error("Error searching ingredients:", error);
    throw error;
  }
};

export const createIngredient = async (ingredientData) => {
  try {
    const response = await api.post('/api/ingredients/add-ingredient', ingredientData);
    return response;
  } catch (error) {
    console.error("Error creating ingredient:", error);
    throw error;
  }
};

export const getIngredientUnits = () => {
  // List of common units
  return [
    { value: "g", label: "g (gram)" },
    { value: "kg", label: "kg (kilogram)" },
    { value: "ml", label: "ml (milliliter)" },
    { value: "l", label: "l (liter)" },
    { value: "cup", label: "cup (cốc)" },
    { value: "tbsp", label: "tbsp (muỗng canh)" },
    { value: "tsp", label: "tsp (muỗng cà phê)" },
    { value: "piece", label: "miếng" },
    { value: "slice", label: "lát" },
    { value: "whole", label: "nguyên trái/cái" },
  ];
};
