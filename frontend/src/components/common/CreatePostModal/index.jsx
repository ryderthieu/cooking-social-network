import React, { useState, useRef } from 'react';
import { X, Image, Video, Plus, Search, User, Settings, ChefHat } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose }) => {
  const [postType, setPostType] = useState('post'); // 'post' hoặc 'reels'
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeTab, setRecipeTab] = useState('system'); // 'system' hoặc 'personal'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Mock data cho recipes
  const systemRecipes = [
    { id: 1, name: 'Phở Bò Hà Nội', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', difficulty: 'Khó' },
    { id: 2, name: 'Bánh Mì Thịt Nướng', image: 'https://images.unsplash.com/photo-1564888111485-9c4d5eab2848?w=100&h=100&fit=crop', difficulty: 'Dễ' },
    { id: 3, name: 'Bún Chả Hà Nội', image: 'https://images.unsplash.com/photo-1559847844-d9b43e2d1b94?w=100&h=100&fit=crop', difficulty: 'Trung bình' },
    { id: 4, name: 'Cơm Tấm Sài Gòn', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=100&h=100&fit=crop', difficulty: 'Dễ' },
  ];

  const personalRecipes = [
    { id: 5, name: 'Bánh Xèo Miền Tây', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop', difficulty: 'Trung bình' },
    { id: 6, name: 'Chả Cá Lã Vọng', image: 'https://images.unsplash.com/photo-1564888111485-9c4d5eab2848?w=100&h=100&fit=crop', difficulty: 'Khó' },
  ];

  const currentRecipes = recipeTab === 'system' ? systemRecipes : personalRecipes;
  const filteredRecipes = currentRecipes.filter(recipe => 
    recipe.name.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setMedia([...media, ...newMedia]);
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    URL.revokeObjectURL(newMedia[index].preview);
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const handleRecipeSelect = (recipe) => {
    if (!selectedRecipes.find(r => r.id === recipe.id)) {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const removeRecipe = (recipeId) => {
    setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipeId));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('type', postType);
      formData.append('recipes', JSON.stringify(selectedRecipes.map(r => r.id)));
      
      media.forEach((item) => {
        formData.append('media', item.file);
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      onClose();
      setContent('');
      setMedia([]);
      setSelectedRecipes([]);
      setPostType('post');
    } catch (error) {
      setError('Đã có lỗi xảy ra khi đăng bài');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-xl font-bold text-gray-800">Tạo bài viết mới</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Post Type Selection */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setPostType('post')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  postType === 'post' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Bài viết
              </button>
              <button
                type="button"
                onClick={() => setPostType('reels')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  postType === 'reels' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Reels
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* User Info */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br  rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, rgb(251, 146, 60) 0%, rgb(236, 72, 153) 100%)'}}>
                <User size={20} className="text-white" />
              </div>
              <div className="ml-3">
                <span className="font-semibold text-gray-800">Nguyễn Văn A</span>
                <p className="text-sm text-gray-500">Đăng công khai</p>
              </div>
            </div>

            {/* Content Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={postType === 'post' ? "Bạn đang nghĩ gì?" : "Mô tả cho reels của bạn..."}
              className="w-full h-32 p-4 border border-gray-200 rounded-xl mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            />

            {/* Selected Recipes */}
            {selectedRecipes.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Công thức đã chọn:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                      <img src={recipe.image} alt={recipe.name} className="w-6 h-6 rounded-full mr-2" />
                      <span>{recipe.name}</span>
                      <button
                        type="button"
                        onClick={() => removeRecipe(recipe.id)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Preview */}
            {media.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {media.map((item, index) => (
                  <div key={index} className="relative group">
                    {postType === 'post' ? (
                      <img
                        src={item.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    ) : (
                      <video
                        src={item.preview}
                        className="w-full h-48 object-cover rounded-xl"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Thêm vào bài viết</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title={`Thêm ${postType === 'post' ? 'ảnh' : 'video'}`}
                >
                  {postType === 'post' ? (
                    <Image size={20} className="text-green-600" />
                  ) : (
                    <Video size={20} className="text-red-600" />
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowRecipeModal(true)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Gắn công thức"
                >
                  <ChefHat size={20} className="text-orange-600" />
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaChange}
              accept={postType === 'post' ? "image/*" : "video/*"}
              multiple={postType === 'post'}
              className="hidden"
            />

            {error && (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !content.trim()}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                isLoading || !content.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'background-gradient text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng...
                </div>
              ) : (
                'Đăng bài'
              )}
            </button>   
          </div>
        </div>
      </div>

      {/* Recipe Selection Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Chọn công thức</h3>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
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
                  <Settings size={16} className="inline mr-1" />
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
                  <User size={16} className="inline mr-1" />
                  Của tôi
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-6 py-3">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
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
                    <p className="text-sm text-gray-500">{recipe.difficulty}</p>
                  </div>
                  {selectedRecipes.find(r => r.id === recipe.id) && (
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <Plus size={16} className="text-white rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostModal;