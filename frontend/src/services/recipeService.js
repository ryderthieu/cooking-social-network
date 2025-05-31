import API from './api';

export const getAllRecipes = () => {
  return API.get('/recipes');
};

export const getMyRecipes = () => {
  return API.get('/recipes/my-recipes');
};

export const searchRecipes = (keyword) => {
  return API.get(`/recipes/search`, {
    params: {
      keyword,
      page: 1,
      limit: 10
    }
  });
};

export const getRecipeById = (id) => {
  return API.get(`/recipes/${id}`);
}; 