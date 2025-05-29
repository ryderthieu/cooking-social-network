import API from "./api";

export const searchConversations = ({query, page = 1, limit = 10}) => {
    return API.get(`/conversations/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
}

export const getConversation = ({conversationId}) => {
    return API.get(`/conversations/${conversationId}`)
}

export const getUserConversations = ({page = 1, limit = 10}) => {
    return API.get(`/conversations?page=${page}&limit=${limit}`)
}

export const addMembers = ({conversationId, memberIds}) => {
    return API.post(`/conversations/${conversationId}/members`, {memberIds})
}

export const leaveConversation = ({conversationId}) => {
    return API.post(`/conversations/${conversationId}`)
}

export const createConversation = ({members, name}) => {
    return API.post('/conversations', {members, name})
}

export const updateConversationName = ({conversationId, name}) => {
    return API.patch(`/conversations/${conversationId}/name`, {name})
}

export const removeMember = ({conversationId, memberId}) => {
    return API.patch(`/conversations/${conversationId}/remove/${memberId}`)
}

export const deleteConversation = ({conversationId}) => {
    return API.delete(`/conversations/${conversationId}`)
}