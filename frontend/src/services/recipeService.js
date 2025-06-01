import API from "./api";

const endpoint = "/recipes";

/**
 * Service for recipe-related API calls
 */
const recipeService = {
  // Fetch all recipes
  getAllRecipes: () => API.get(endpoint),

  // Fetch recipe by ID
  getRecipeById: (id) => API.get(`${endpoint}/${id}`),

  // Create new recipe
  createRecipe: (recipeData) => API.post(endpoint, recipeData),

  // Update existing recipe
  updateRecipe: (id, recipeData) => API.put(`${endpoint}/${id}`, recipeData),

  // Delete recipe
  deleteRecipe: (id) => API.delete(`${endpoint}/${id}`),

  // Search recipes
  searchRecipes: (params) => API.get(`${endpoint}/search`, { params }),

  // Get top/popular recipes
  getTopRecipes: (limit = 4) => API.get(`${endpoint}/top?limit=${limit}`),
  
  // Toggle like for recipe
  toggleLike: (id) => API.patch(`${endpoint}/${id}/like`),

  // Get recipes by author
  getRecipesByAuthor: (authorId) => API.get(`${endpoint}/author/${authorId}`),

  // Filter recipes
  filterRecipes: (filters) =>
    API.get(`${endpoint}/filter`, { params: { ...filters } }),

  // Save recipe (add to user's saved recipes)
  saveRecipe: (id) => API.post(`${endpoint}/${id}/save`),

  // Remove saved recipe
  unsaveRecipe: (id) => API.delete(`${endpoint}/${id}/save`),

  // Get user's saved recipes
  getSavedRecipes: () => API.get(`${endpoint}/saved`),
};

export const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getTopRecipes,
  toggleLike,
  getRecipesByAuthor,
  filterRecipes,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
} = recipeService;

export default recipeService;
