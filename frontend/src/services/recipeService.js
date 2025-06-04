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
  createRecipe: (recipeData) => {
    // If recipeData is FormData, set appropriate headers
    const config = {};
    if (recipeData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    return API.post(endpoint, recipeData, config);
  },

  // Update existing recipe
  updateRecipe: (id, recipeData) => API.patch(`${endpoint}/${id}`, recipeData),

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

  // Get similar recipes based on categories
  getSimilarRecipes: (id, limit = 6) => API.get(`${endpoint}/${id}/similar?limit=${limit}`),

  // Save recipe (add to user's saved recipes)
  saveRecipe: (id) => API.post(`${endpoint}/${id}/save`),

  // Remove saved recipe
  unsaveRecipe: (id) => API.delete(`${endpoint}/${id}/save`),

  // Get user's saved recipes
  getSavedRecipes: () => API.get(`${endpoint}/saved`),
  
  // Get recipe categories (using new category service)
  getRecipeCategories: () => API.get(`/categories/formatted`),

  // Get recipes by user ID
  getRecipeByUserId: (userId) => API.get(`${endpoint}/user/${userId}`),

  // Get my recipes
  getMyRecipes: () => API.get(`${endpoint}/my-recipes`),
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
  getSimilarRecipes,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  getRecipeCategories,
  getRecipeByUserId,
  getMyRecipes,
} = recipeService;

export default recipeService;
