import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaTrash, FaSearch, FaUser, FaCog } from 'react-icons/fa';
import { ChefHat } from 'lucide-react';
import Portal from '../Portal';
import { getAllRecipes, searchRecipes } from '@/services/recipeService';
import { toast } from 'react-toastify';

const EditPostModal = ({ isOpen, onClose, post, onSave }) => {
  const [caption, setCaption] = useState(post?.caption || '');
  const [images, setImages] = useState(post?.media?.filter(m => m.type === "image") || []);
  const [newImages, setNewImages] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(post?.recipe || null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeTab, setRecipeTab] = useState('system');
  const [recipes, setRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);

  // Fetch recipes khi tab thay đổi
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoadingRecipes(true);
      try {
        const response = await getAllRecipes();
        if (response.data.success) {
          setRecipes(response.data.data || []);
        } else {
          toast.error('Không thể tải danh sách công thức');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
        toast.error('Không thể tải danh sách công thức');
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    if (showRecipeModal) {
      fetchRecipes();
    }
  }, [recipeTab, showRecipeModal]);

  // Search recipes
  useEffect(() => {
    const searchRecipesDebounced = async () => {
      if (!recipeSearch.trim()) {
        const response = await getAllRecipes();
        if (response.data.success) {
          setRecipes(response.data.data || []);
        }
        return;
      }

      setIsLoadingRecipes(true);
      try {
        const response = await searchRecipes(recipeSearch);
        if (response.data.success) {
          setRecipes(response.data.data || []);
        }
      } catch (error) {
        console.error('Error searching recipes:', error);
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    const timeoutId = setTimeout(searchRecipesDebounced, 500);
    return () => clearTimeout(timeoutId);
  }, [recipeSearch]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ caption, images, newImages, recipe: selectedRecipe?._id });
    onClose();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setNewImages(prev => [...prev, ...imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))]);
  };

  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => {
      const newArray = prev.filter((_, i) => i !== index);
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return newArray;
    });
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(false);
  };

  const removeRecipe = () => {
    setSelectedRecipe(null);
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="bg-white rounded-2xl w-full max-w-4xl p-8 shadow-xl transform transition-all relative z-[10000] max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa bài viết</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Nội dung
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full h-40 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#FFB800] focus:ring focus:ring-[#FFB800]/20 transition-all resize-none"
                placeholder="Nhập nội dung bài viết..."
              />
            </div>

            {/* Selected Recipe */}
            {selectedRecipe && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Công thức đã chọn
                </label>
                <div className="flex items-center bg-orange-50 text-orange-700 px-4 py-2 rounded-xl">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name} 
                    className="w-10 h-10 rounded-lg object-cover mr-3" 
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{selectedRecipe.name}</h4>
                    <p className="text-sm text-orange-600/70">
                      {selectedRecipe.categories?.difficultyLevel || 'Chưa có độ khó'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeRecipe}
                    className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Image Section */}
            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-medium mb-4">
                Hình ảnh
              </label>

              {/* Image Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {/* Existing Images */}
                {images.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group aspect-square">
                    <img
                      src={image.url}
                      alt={`post-${index}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* New Images */}
                {newImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative group aspect-square">
                    <img
                      src={image.preview}
                      alt={`new-${index}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add Image Button */}
                <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FFB800] transition-colors flex flex-col items-center justify-center gap-2">
                  <FaImage className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Thêm ảnh</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Thêm vào bài viết</span>
              <button
                type="button"
                onClick={() => setShowRecipeModal(true)}
                className="p-2 hover:bg-white rounded-lg transition-colors flex items-center gap-2 text-orange-600"
              >
                <ChefHat size={20} />
                <span className="text-sm font-medium">Gắn công thức</span>
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#FFB800] text-white hover:bg-[#FFB800]/90 transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recipe Selection Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRecipeModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden relative z-[10002]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Chọn công thức</h3>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FaTimes size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Recipe Tabs */}
            <div className="px-6 py-3 border-b border-gray-100">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setRecipeTab('system')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    recipeTab === 'system' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  <FaCog size={16} className="inline mr-1" />
                  Hệ thống
                </button>
                <button
                  onClick={() => setRecipeTab('personal')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    recipeTab === 'personal' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600'
                  }`}
                >
                  <FaUser size={16} className="inline mr-1" />
                  Của tôi
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  placeholder="Tìm kiếm công thức..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Recipe List */}
            <div className="px-6 pb-4 max-h-80 overflow-y-auto">
              {isLoadingRecipes ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <div
                    key={recipe._id}
                    onClick={() => handleRecipeSelect(recipe)}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{recipe.name}</h4>
                      <p className="text-sm text-gray-500">
                        {recipe.categories?.difficultyLevel || 'Chưa có độ khó'}
                      </p>
                    </div>
                    {selectedRecipe?._id === recipe._id && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <FaTimes className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {recipeSearch.trim() 
                    ? 'Không tìm thấy công thức phù hợp'
                    : 'Chưa có công thức nào'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
};

export default EditPostModal; 