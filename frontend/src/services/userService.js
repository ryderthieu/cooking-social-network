import API from "./Api";

export const login = ({email, password}) => {
    return API.post('/users/login', {email, password})
}

export const register = ({ email, password, lastName, firstName, gender, birthDay }) => {
    return API.post('/users/register', { email, password, lastName, firstName, gender, birthDay })
}

export const forgotPassword = ({email}) => {
    return API.post('/users/forgot-password', {email})
}

export const resetPassword = ({email, newPassword}) => {
    return API.post('/users/reset-password', {email, newPassword})
}

export const confirmOtp = ({email, otp}) => {
    return API.post('/users/confirm-otp', {email, otp})
}

export const toggleFollow = ({followingId, action}) => {
    return API.post('/users/toggle-follow', {followingId, action})
}

export const getUserInfo = () => {
    return API.get('/users/get-info')
}

export const searchUsers = ({key, page = 1, limit = 10}) => {
    return API.get(`/users/search?key=${encodeURIComponent(key)}&page=${page}&limit=${limit}`)
}

export const getSavedRecipes = () => {
    return API.get('/users/get-saved-recipe')
}

export const getSavedPost = () => {
    return API.get('/users/get-saved-post')
}

export const getSavedReels = () => {
    return API.get('/users/get-saved-video')
}

export const getFollowers = ({userId}) => {
    return API.get('/users/get-followers', {userId})
}

export const getFollowing = ({userId}) => {
    return API.get('/users/get-following', {userId})
}

export const getUserById = ({userId}) => {
    return API.get(`/users/${userId}`)
}

export const editProfile = ({ firstName, lastName, gender, birthDay, avatar }) => {
    const newInfo = { firstName, lastName, gender, birthDay, avatar }
    return API.patch('/users/edit-profile', newInfo)
}

export const deleteSavedRecipe = ({recipeId}) => {
    return API.patch('/users/delete-saved-recipe', {recipeId})
}

export const deleteSavedPost = ({postId}) => {
    return API.patch('/users/delete-saved-post', {postId})
}

export const deleteSavedReel = ({reelId}) => {
    return API.patch('/users/delete-saved-video', {reelId})
}