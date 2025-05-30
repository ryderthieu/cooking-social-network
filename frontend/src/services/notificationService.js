import API from "./api";

export const getNotificationById = ({notificationId}) => {
    return API.get(`/notifications/${notificationId}`)
}

export const getUserNotifications = ({page = 1, limit = 100, isRead, type}) => {
    return API.get('/notifications', {page, limit, isRead, type})
}

export const searchNotifications = ({ page = 1, limit = 100, query, type }) => {
  let url = `/notifications/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
  if (type) {
    url += `&type=${type}`;
  }
  return API.get(url);
};

export const createNotification = ({receiver, type, postId, videoId, commentId}) => {
    return API.post('/notifications', {receiver, type, postId, videoId, commentId})
}

export const markAsRead = ({notificationId}) => {
    return API.patch(`/notificaitons/read/${notificationId}`)
}

export const markAllAsRead = () => {
    return API.patch('/notifications/read')
}

export const markAsUnread = ({notificationId}) => {
    return API.patch(`/notifications/unread/${notificationId}`)
}