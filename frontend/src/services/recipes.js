import { api } from './api';

/**
 * Service chuyên xử lý các API liên quan đến recipes
 */
export const RecipeDataService = {
  
  /**
   * Lấy danh sách blogs
   * @param {object} params - Query parameters
   * @param {number} params.limit - Số lượng blogs
   * @param {number} params.page - Trang hiện tại
   * @param {string} params.category - Danh mục blog
   * @returns {Promise<object>} Response chứa danh sách blogs
   */
  getBlogs: async (params = {}) => {
    try {
      const defaultParams = {
        limit: 4,
        page: 1,
        ...params
      };
      
      const response = await api.get('/blogs', defaultParams);
      
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination || {},
        message: 'Lấy danh sách blogs thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message,
        message: 'Lỗi khi lấy danh sách blogs'
      };
    }
  },

  /**
   * Lấy danh sách recipes phổ biến
   * @param {object} params - Query parameters
   * @param {string} params.categoryType - Loại danh mục
   * @param {string} params.item - Item cụ thể
   * @param {number} params.limit - Số lượng recipes
   * @returns {Promise<object>} Response chứa danh sách recipes
   */
  getPopularRecipes: async (params = {}) => {
    try {
      const defaultParams = {
        limit: 8,
        sortBy: 'popularity',
        ...params
      };
      
      const response = await api.get('/recipes/popular', defaultParams);
      
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination || {},
        message: 'Lấy danh sách recipes phổ biến thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message,
        message: 'Lỗi khi lấy danh sách recipes phổ biến'
      };
    }
  },

  /**
   * Lấy danh sách tất cả recipes
   * @param {object} params - Query parameters
   * @param {string} params.categoryType - Loại danh mục
   * @param {string} params.item - Item cụ thể
   * @param {number} params.page - Trang hiện tại
   * @param {number} params.limit - Số lượng recipes
   * @param {string} params.search - Từ khóa tìm kiếm
   * @returns {Promise<object>} Response chứa danh sách recipes
   */
  getRecipes: async (params = {}) => {
    try {
      const defaultParams = {
        page: 1,
        limit: 8,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...params
      };
      
      const response = await api.get('/recipes', defaultParams);
      
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination || {},
        hasMore: response.hasMore || false,
        message: 'Lấy danh sách recipes thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        hasMore: false,
        error: error.message,
        message: 'Lỗi khi lấy danh sách recipes'
      };
    }
  },

  /**
   * Lấy danh sách categories cho slider
   * @param {object} params - Query parameters
   * @param {string} params.type - Loại category (cuisine, meal-type, etc.)
   * @returns {Promise<object>} Response chứa danh sách categories
   */
  getCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', params);
      
      return {
        success: true,
        data: response.data || [],
        message: 'Lấy danh sách categories thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message,
        message: 'Lỗi khi lấy danh sách categories'
      };
    }
  },

  /**
   * Lấy chi tiết một recipe
   * @param {string|number} id - ID của recipe
   * @returns {Promise<object>} Response chứa chi tiết recipe
   */
  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      
      return {
        success: true,
        data: response.data || {},
        message: 'Lấy chi tiết recipe thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: {},
        error: error.message,
        message: 'Lỗi khi lấy chi tiết recipe'
      };
    }
  },

  /**
   * Tìm kiếm recipes
   * @param {object} params - Query parameters
   * @param {string} params.q - Từ khóa tìm kiếm
   * @param {string} params.category - Danh mục
   * @param {string} params.difficulty - Độ khó
   * @param {number} params.maxCookTime - Thời gian nấu tối đa
   * @returns {Promise<object>} Response chứa kết quả tìm kiếm
   */
  searchRecipes: async (params = {}) => {
    try {
      const response = await api.get('/recipes/search', params);
      
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination || {},
        message: 'Tìm kiếm thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error.message,
        message: 'Lỗi khi tìm kiếm'
      };
    }
  },

  /**
   * Lấy recipes theo danh mục
   * @param {string} categorySlug - Slug của danh mục
   * @param {object} params - Query parameters bổ sung
   * @returns {Promise<object>} Response chứa recipes theo danh mục
   */
  getRecipesByCategory: async (categorySlug, params = {}) => {
    try {
      const response = await api.get(`/categories/${categorySlug}/recipes`, params);
      
      return {
        success: true,
        data: response.data || [],
        pagination: response.pagination || {},
        category: response.category || {},
        message: 'Lấy recipes theo danh mục thành công'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        category: {},
        error: error.message,
        message: 'Lỗi khi lấy recipes theo danh mục'
      };
    }
  }
};

// Export default
export default RecipeDataService;