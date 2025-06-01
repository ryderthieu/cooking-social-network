import API from "./api";

export const getAllVideos = async () => {
  try {
    const response = await API.get("/videos");
    console.log('Video service response:', response);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await API.get(`/videos/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in getVideoById:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const searchVideos = async (keyword) => {
  try {
    const response = await API.get(`/videos/search?keyword=${keyword}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in searchVideos:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const addVideo = async (data) => {
  try {
    const response = await API.post("/videos/add-video", data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in addVideo:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const editVideo = async (id, data) => {
  try {
    const response = await API.put(`/videos/edit-video/${id}`, data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in editVideo:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteVideo = async (id) => {
  try {
    const response = await API.delete(`/videos/delete-video/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const likeVideo = async (id) => {
  try {
    const response = await API.patch(`/videos/like-video/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in likeVideo:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const toggleLike = async (id) => {
  try {
    const response = await API.patch(`/videos/${id}/like`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in toggleLike:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const shareVideo = async (id) => {
  try {
    const response = await API.patch(`/videos/share-video/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in shareVideo:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const commentVideo = async (id, data) => {
  try {
    const response = await API.post(`/videos/${id}/comments`, data);
    return {
      success: true,
      data: {
        _id: response.data._id,
        text: data.text,
        author: response.data.author,
        createdAt: response.data.createdAt,
        likes: [],
      }
    };
  } catch (error) {
    console.error('Error in commentVideo:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getSavedVideos = async () => {
  try {
    const response = await API.get('/videos/saved');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in getSavedVideos:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const saveVideo = async (id) => {
  try {
    const response = await API.patch(`/videos/save-video/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in saveVideo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 