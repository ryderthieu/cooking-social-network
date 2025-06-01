import api from './api';

// Tạo đánh giá mới
export const createReview = async (recipeId, reviewData) => {
  try {
    const response = await api.post(`/reviews/${recipeId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi tạo đánh giá' };
  }
};

// Cập nhật đánh giá
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/reviews/review/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi cập nhật đánh giá' };
  }
};

// Xóa đánh giá
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/review/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi xóa đánh giá' };
  }
};

// Lấy tất cả đánh giá của một recipe
export const getReviewsByRecipe = async (recipeId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/reviews/${recipeId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy đánh giá' };
  }
};

// Lấy đánh giá của user cho một recipe
export const getUserReviewForRecipe = async (recipeId) => {
  try {
    const response = await api.get(`/reviews/${recipeId}/user`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Lỗi khi lấy đánh giá của người dùng' };
  }
};
