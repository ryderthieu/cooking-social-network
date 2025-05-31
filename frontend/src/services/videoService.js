import API from "./api";

export const getAllVideos = () => {
  return API.get("/videos");
};

export const getVideoById = (id) => {
  return API.get(`/videos/${id}`);
};

export const searchVideos = (keyword) => {
  return API.get(`/videos/search?keyword=${keyword}`);
};

export const addVideo = (data) => {
  return API.post("/videos/add-video", data);
};

export const editVideo = (id, data) => {
  return API.put(`/videos/edit-video/${id}`, data);
};

export const deleteVideo = (id) => {
  return API.delete(`/videos/delete-video/${id}`);
};

export const likeVideo = (id) => {
  return API.patch(`/videos/like-video/${id}`);
};

export const shareVideo = (id) => {
  return API.patch(`/videos/share-video/${id}`);
};

export const commentVideo = (id, data) => {
  return API.post(`/videos/${id}/comments`, data);
};

export const getSavedVideos = () => {
  return API.get('/videos/saved');
};

export const saveVideo = (id) => {
  return API.patch(`/videos/save-video/${id}`);
}; 