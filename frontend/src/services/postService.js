import API from "./api";

export const getAllPost = () => {
    return API.get('/posts')
}