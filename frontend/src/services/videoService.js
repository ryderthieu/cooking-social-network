import API from "./api";

export const getAllVideos = async () => {
  try {
    const response = await API.get("/videos");
    console.log('Video service response:', response);
    return response;
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await API.get(`/videos/${id}`);
    return response;
  } catch (error) {
    console.error('Error in getVideoById:', error);
    throw error;
  }
};

export const searchVideos = async (keyword) => {
  try {
    const response = await API.get(`/videos/search?keyword=${keyword}`);
    return response;
  } catch (error) {
    console.error('Error in searchVideos:', error);
    throw error;
  }
};

export const addVideo = async (data) => {
  try {
    const response = await API.post("/videos/add-video", data);
    return response;
  } catch (error) {
    console.error('Error in addVideo:', error);
    throw error;
  }
};

export const editVideo = async (id, data) => {
  try {
    const response = await API.put(`/videos/edit-video/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error in editVideo:', error);
    throw error;
  }
};

export const deleteVideo = async (id) => {
  try {
    const response = await API.delete(`/videos/delete-video/${id}`);
    return response;
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    throw error;
  }
};

export const likeVideo = async (id) => {
  try {
    const response = await API.patch(`/videos/like-video/${id}`);
    return response;
  } catch (error) {
    console.error('Error in likeVideo:', error);
    throw error;
  }
};

export const toggleLike = async (id) => {
  try {
    const response = await API.patch(`/videos/${id}/like`);
    return response;
  } catch (error) {
    console.error('Error in toggleLike:', error);
    throw error;
  }
};

export const shareVideo = async (id) => {
  try {
    const response = await API.patch(`/videos/share-video/${id}`);
    return response;
  } catch (error) {
    console.error('Error in shareVideo:', error);
    throw error;
  }
};

export const commentVideo = async (id, data) => {
  try {
    const response = await API.post(`/videos/${id}/comments`, data);
    return response;
  } catch (error) {
    console.error('Error in commentVideo:', error);
    throw error;
  }
};

export const getVideoByUserId = async (userId) => {
  try {
    const response = await API.get(`/videos/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Error in getVideoByUserId:', error);
    throw error;
  }
};

export const getMyVideos = async () => {
  try {
    const response = await API.get('/videos/my-videos');
    return response;
  } catch (error) {
    console.error('Error in getMyVideos:', error);
    throw error;
  }
};
