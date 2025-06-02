import API from "./api";

const endpoint = "/categories";

/**
 * Service for category-related API calls
 */
const categoryService = {
  // Get all categories
  getAllCategories: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return API.get(`${endpoint}${queryString ? `?${queryString}` : ''}`);
  },

  // Get formatted categories for dropdown/menu
  getFormattedCategories: () => API.get(`${endpoint}/formatted`),

  // Get all formatted categories (không bị filter cho header)
  getAllFormattedCategories: () => API.get(`${endpoint}/all-formatted`),

  // Get categories by type
  getCategoriesByType: (type, limit = null) => {
    const params = limit ? `?limit=${limit}` : '';
    return API.get(`${endpoint}/type/${type}${params}`);
  },  // Get category by ID
  getCategoryById: (id) => API.get(`${endpoint}/id/${id}`),

  // Get category by slug and type
  getCategoryBySlugAndType: (type, slug) => API.get(`${endpoint}/${type}/${slug}`),

  // Create new category (admin only)
  createCategory: (categoryData) => API.post(endpoint, categoryData),

  // Update category (admin only)
  updateCategory: (id, categoryData) => API.put(`${endpoint}/${id}`, categoryData),

  // Delete category (admin only)
  deleteCategory: (id) => API.delete(`${endpoint}/${id}`),

  // Get featured categories
  getFeaturedCategories: () => API.get(`${endpoint}?featured=true`),
  // Helper methods for specific category types
  getMealTypes: (limit = null) => categoryService.getCategoriesByType('mealType', limit),
  getCuisines: (limit = null) => categoryService.getCategoriesByType('cuisine', limit),
  getOccasions: (limit = null) => categoryService.getCategoriesByType('occasions', limit),
  getDietaryPreferences: (limit = null) => categoryService.getCategoriesByType('dietaryPreferences', limit),
  getMainIngredients: (limit = null) => categoryService.getCategoriesByType('mainIngredients', limit),
  getCookingMethods: (limit = null) => categoryService.getCategoriesByType('cookingMethod', limit)
};

export default categoryService;

// Export individual methods for easier imports
export const getAllCategories = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return API.get(`${endpoint}${queryString ? `?${queryString}` : ''}`);
};

export const getFormattedCategories = () => API.get(`${endpoint}/formatted`);
export const getAllFormattedCategories = () => API.get(`${endpoint}/all-formatted`);
export const getCategoriesByType = (type, limit = null) => {
  const params = limit ? `?limit=${limit}` : '';
  return API.get(`${endpoint}/type/${type}${params}`);
};
export const getCategoryById = (id) => API.get(`${endpoint}/id/${id}`);

export {
  categoryService
};
