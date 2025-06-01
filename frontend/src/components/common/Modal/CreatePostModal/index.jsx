import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Video, Plus, Search, User, Settings, ChefHat } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCloudinary } from '@/context/CloudinaryContext';
import { createPost } from '@/services/postService';
import { getAllRecipes,  searchRecipes } from '@/services/recipeService';
import { toast } from 'react-toastify';
import { addVideo } from '@/services/videoService';

const CreatePostModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { uploadImage, uploadVideo } = useCloudinary();
  const [postType, setPostType] = useState('post'); // 'post' hoặc 'reels'
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [recipeTab, setRecipeTab] = useState('system'); // 'system' hoặc 'personal'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const fileInputRef = useRef(null);

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

  const renderUploadProgress = () => {
    if (!isLoading || uploadProgress === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {postType === 'post' ? 'Đang tải ảnh lên...' : 'Đang tải video lên...'}
          </span>
          <span className="text-sm font-medium text-orange-600">{uploadProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    );
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (postType === 'reels' && files.length > 0) {
      // Nếu là reels, chỉ cho phép 1 video
      setMedia([{
        file: files[0],
        preview: URL.createObjectURL(files[0])
      }]);
    } else {
      // Nếu là post, cho phép nhiều ảnh
      const newMedia = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setMedia(prevMedia => {
        const updatedMedia = [...prevMedia, ...newMedia];
        // Giới hạn số lượng ảnh là 5
        return updatedMedia.slice(0, 5);
      });
    }
  };

  const removeMedia = (index) => {
    setMedia(prevMedia => {
      const newMedia = [...prevMedia];
      URL.revokeObjectURL(newMedia[index].preview);
      newMedia.splice(index, 1);
      return newMedia;
    });
  };

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipes([recipe]);
    setShowRecipeModal(false);
  };

  const removeRecipe = () => {
    setSelectedRecipes([]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      if (postType === 'post') {
        // Upload tất cả ảnh lên Cloudinary
        const uploadPromises = media.map(item => uploadImage(item.file));
        const uploadedImages = await Promise.all(uploadPromises);
        let images = []
        uploadedImages.map((v) => images.push(v.url))
        console.log(images)
        
        // Tạo post data
        const postData = {
          caption: content,
          recipe: selectedRecipes.length > 0 ? selectedRecipes[0]._id : null,
          imgUri: images
        };

        await createPost(postData);
        toast.success('Đã tạo bài viết thành công!');
      } else {
        // Xử lý tạo video
        console.log(media)
        if (media.length === 0) {
          toast.error('Vui lòng chọn video!');
          return;
        }

        // Upload video lên Cloudinary
        const videoUrlData = await uploadVideo(media[0].file, (progress) => {
          setUploadProgress(progress);
        });
        const videoUrl = videoUrlData.url
        console.log(videoUrl)
        // Tạo video data
        const videoData = {
          caption: content,
          recipe: selectedRecipes.length > 0 ? selectedRecipes[0]._id : null,
          videoUri: videoUrl
        };

        await addVideo(videoData);
        toast.success('Đã tạo video thành công!');
      }
      
      // Reset form
      onClose();
      setContent('');
      setMedia([]);
      setSelectedRecipes([]);
      setPostType('post');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error creating post/video:', error);
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng bài');
      setError(error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng bài');
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
                onClick={() => {
                  setPostType('post');
                  setMedia([]);
                }}
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
                onClick={() => {
                  setPostType('reels');
                  setMedia([]);
                }}
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
              <div className="w-12 h-12 bg-gradient-to-br rounded-full overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.firstName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
                    <User size={20} className="text-white" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <span className="font-semibold text-gray-800">
                  {user ? `${user.firstName} ${user.lastName}` : 'Người dùng'}
                </span>
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
                  <div className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                    <img 
                      src={selectedRecipes[0].image} 
                      alt={selectedRecipes[0].name} 
                      className="w-6 h-6 rounded-full mr-2" 
                    />
                    <span>{selectedRecipes[0].name}</span>
                    <button
                      type="button"
                      onClick={removeRecipe}
                      className="ml-2 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
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
                        className="aspect-[9/16] w-full object-contain rounded-xl"
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
                {postType === 'post' && media.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-orange-500 transition-colors"
                  >
                    <Plus size={24} className="text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <span className="text-sm font-medium text-gray-600">Thêm vào bài viết</span>
              <div className="flex gap-3">
                {(!media.length || (postType === 'post' && media.length < 5)) && (
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
                )}
                
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

            {renderUploadProgress()}

            {error && (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !content.trim() || (postType === 'reels' && !media.length)}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                isLoading || !content.trim() || (postType === 'reels' && !media.length)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {postType === 'post' ? 'Đang tạo bài viết...' : 'Đang tạo video...'}
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
                    {selectedRecipes.find(r => r._id === recipe._id) && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <Plus size={16} className="text-white rotate-45" />
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
    </div>
  );
};

export default CreatePostModal;