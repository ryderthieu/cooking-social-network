import API from "./api";

export const getMessagesByConversation = ({conversationId, page = 1, limit = 20}) => {
    return API.get(`/messages/conversations/${conversationId}?page=${page}&limit=${limit}`)
}

export const searchMessages = ({query, conversationId, page = 1, limit = 10}) => {
    return API.get(`/messages/search?conversationId=${conversationId}&query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
}

export const getMessageById = ({messageId}) => {
    return API.get(`/messages/${messageId}`)
}

export const createMessage = ({ conversationId, type, text, image, sticker, sharedType, sharedId }) => {
    return API.post('/messages',{ conversationId, type, text, image, sticker, sharedType, sharedId } )
}

export const deleteMessage = ({messsageId}) => {
    return API.patch(`/messages/${messsageId}/delete`)
}

export const updateMessage = ({messageId}) => {
    return API.patch(`/messages/${messageId}`)
}

export const reactToMessage = ({messageId, reaction}) => {
    return API.patch(`/messages/${messageId}/react`, {reaction})
}