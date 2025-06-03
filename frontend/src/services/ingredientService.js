import api from "./api";

export const searchIngredients = async (query) => {
  try {
    const response = await api.get(`/ingredients/search?keyword=${query}`);
    return response;
  } catch (error) {
    console.error("Error searching ingredients:", error);
    throw error;
  }
};

export const createIngredient = async (ingredientData) => {
  try {
    const response = await api.post('/ingredients/add-ingredient', ingredientData);
    return response;
  } catch (error) {
    console.error("Error creating ingredient:", error);
    throw error;
  }
};

export const getIngredientUnits = () => {
  // List of common units
  return [
    { value: "g", label: "g" },
    { value: "kg", label: "kg" },
    { value: "ml", label: "ml" },
    { value: "l", label: "l" },
    { value: "cup", label: "cốc" },
    { value: "tbsp", label: "muỗng canh" },
    { value: "tsp", label: "muỗng cà phê" },
    { value: "piece", label: "miếng" },
    { value: "slice", label: "lát" },
    { value: "whole", label: "quả" },
  ];
};
