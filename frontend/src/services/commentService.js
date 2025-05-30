import API from "./api";

export const searchComments = ({ page = 1, limit = 10, query, targetId, targetType }) => {
  const url = `/comments/search?page=${page}&limit=${limit}&query=${encodeURIComponent(query)}&targetId=${encodeURIComponent(targetId)}&targetType=${encodeURIComponent(targetType)}`;
  return API.get(url);
};

export const getReplies = ({page = 1, limit = 10, commentId}) => {
    const url = `/comments/replies/${commentId}?page=${page}&limit=${10}`
    return API.get(url)
}

export const getCommentById = ({commentId}) => {
    return API.get(`/comments/${commentId}`)
}

export const getCommentsByTarget = ({targetId, targetType, page = 1, limit = 10}) => {
    return API.get(`/comments/${targetType}/${targetId}?page=${page}&limit=${limit}`)
}

export const createComment = ({ targetId, targetType, text, sticker, replyOf }) => {
    return API.post(`/comments`, { targetId, targetType, text, sticker, replyOf })
}

export const updateComment = ({commentId, text, sticker}) => {
    return API.patch(`/comments/${commentId}`, {text, sticker})
}

export const deleteComment = ({commentId}) => {
    return API.delete(`/comments/${commentId}`)
}