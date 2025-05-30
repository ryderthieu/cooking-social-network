import API from "./api";

const endpoint = '/posts';

const postsService = {
  // Fetch all posts
  fetchAll: () => API.get(endpoint),

  // Fetch a post by ID
  fetchById: (id) => API.get(`${endpoint}/${id}`),

  // Create a new post
  create: (postData) => API.post(endpoint, postData),

  // Update an existing post
  update: (id, postData) => API.put(`${endpoint}/${id}`, postData),

  // Delete a post by ID
  remove: (id) => API.delete(`${endpoint}/${id}`),

  // Search posts by keyword
  search: (keyword) => 
    API.get(`${endpoint}/search`, { params: { keyword } }),

  // Like or unlike a post
  toggleLike: (id) => API.patch(`${endpoint}/${id}/like`),

  // Add a comment to a post
  comment: (id, commentData) => 
    API.post(`${endpoint}/${id}/comment`, commentData),

  // Share a post
  share: (id) => API.post(`${endpoint}/${id}/share`),

  // Fetch posts for the current logged-in user
  fetchUserPosts: (currentUserId) => API.get(`${endpoint}/user/${currentUserId}`),
  
  // Fetch posts for a specific user by ID
  fetchPostsByUserId: (userId) => API.get(`${endpoint}/user/${userId}`),

};

// export default postsService;
// import API from "./api";

export const getAllPost = () => {
    return API.get('/posts')
}

export default postsService