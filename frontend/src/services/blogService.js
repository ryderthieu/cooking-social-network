import api from "./api";

// Get all blogs with pagination and filters
export const getAllBlogs = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/blogs?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Get blog by ID or slug
export const getBlogById = async (id) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

// Get featured blogs
export const getFeaturedBlogs = async (limit = 5) => {
  try {
    const response = await api.get(`/blogs/featured?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    throw error;
  }
};

// Get related blogs
export const getRelatedBlogs = async (id, limit = 3) => {
  try {
    const response = await api.get(`/blogs/${id}/related?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    throw error;
  }
};

// Create new blog
export const createBlog = async (blogData) => {
  try {
    const response = await api.post("/blogs", blogData);
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Update blog
export const updateBlog = async (id, blogData) => {
  try {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Delete blog
export const deleteBlog = async (id) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// Toggle like blog
export const toggleLikeBlog = async (id) => {
  try {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};
