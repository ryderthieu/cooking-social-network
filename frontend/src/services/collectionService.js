import api from './api';

// Get all collections for current user
export const getUserCollections = async () => {
    try {
        const response = await api.get('/collections');
        return response.data;
    } catch (error) {
        console.error('Error fetching user collections:', error);
        throw error.response?.data || error;
    }
};

// Create new collection
export const createCollection = async (collectionData) => {
    try {
        const response = await api.post('/collections', collectionData);
        return response.data;
    } catch (error) {
        console.error('Error creating collection:', error);
        throw error.response?.data || error;
    }
};

// Get recipes in a specific collection
export const getCollectionRecipes = async (collectionId) => {
    try {
        const response = await api.get(`/collections/${collectionId}/recipes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching collection recipes:', error);
        throw error.response?.data || error;
    }
};

// Add recipe to collection
export const addRecipeToCollection = async (collectionId, recipeId) => {
    try {
        const response = await api.post(`/collections/${collectionId}/recipes`, {
            recipeId
        });
        return response.data;
    } catch (error) {
        console.error('Error adding recipe to collection:', error);
        throw error.response?.data || error;
    }
};

// Remove recipe from collection
export const removeRecipeFromCollection = async (collectionId, recipeId) => {
    try {
        const response = await api.delete(`/collections/${collectionId}/recipes`, {
            data: { recipeId }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing recipe from collection:', error);
        throw error.response?.data || error;
    }
};

// Delete collection
export const deleteCollection = async (collectionId) => {
    try {
        const response = await api.delete(`/collections/${collectionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting collection:', error);
        throw error.response?.data || error;
    }
};

// Toggle recipe in favorites (heart button)
export const toggleRecipeInFavorites = async (recipeId) => {
    try {
        const response = await api.post('/collections/favorites/toggle', {
            recipeId
        });
        return response.data;
    } catch (error) {
        console.error('Error toggling recipe in favorites:', error);
        throw error.response?.data || error;
    }
};

// Check if recipe is in favorites
export const checkRecipeInFavorites = async (recipeId) => {
    try {
        const response = await api.get(`/collections/favorites/check/${recipeId}`);
        return response.data;
    } catch (error) {
        console.error('Error checking recipe in favorites:', error);
        throw error.response?.data || error;
    }
};

// Get user collections for dropdown (excluding "Bộ sưu tập mới")
export const getUserCollectionsForDropdown = async () => {
    try {
        const response = await api.get('/collections');
        // Filter out the "Add new collection" placeholder and return real collections
        const realCollections = response.data.data.filter(col => col._id !== "bo-suu-tap-moi");
        return {
            ...response.data,
            data: realCollections
        };
    } catch (error) {
        console.error('Error fetching user collections for dropdown:', error);
        throw error.response?.data || error;
    }
};
