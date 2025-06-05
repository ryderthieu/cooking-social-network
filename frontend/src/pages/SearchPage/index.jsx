import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaNewspaper,
  FaVideo,
  FaBook,
  FaUser,
  FaHeart,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PostCard } from "../../components/common/Post";
import { ReelCardReview } from "../../components/common/ReelCard";
import SharePopup from "../../components/common/SharePopup";
import postsService from "../../services/postService"; // Assuming default export
import recipeService from "../../services/recipeService"; // Assuming default export
import { searchUsers } from "../../services/userService";
import { searchVideos } from "../../services/videoService";
import { getAllFormattedCategories } from "../../services/categoryService";
import UserCard from "../../components/common/UserCard";
import SavedCard from "@/components/sections/Recipe/SavedCard";
import { useSocket } from "../../context/SocketContext";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // From URL, drives API calls
  const [pageSearchQuery, setPageSearchQuery] = useState(""); // For the input on this page
  const [activeFilter, setActiveFilter] = useState("posts");
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null });

  const navigate = useNavigate();
  const location = useLocation();

  // Sub-filter state
  const [postSort, setPostSort] = useState("recent");
  const [videoSort, setVideoSort] = useState("recent");
  const [recipeMealType, setRecipeMealType] = useState("all");
  const [recipeCuisine, setRecipeCuisine] = useState("all");
  const [recipeOccasions, setRecipeOccasions] = useState("all");
  const [recipeDietaryPreferences, setRecipeDietaryPreferences] = useState("all");
  const [recipeMainIngredients, setRecipeMainIngredients] = useState("all");
  const [recipeCookingMethod, setRecipeCookingMethod] = useState("all");
  const [recipeTime, setRecipeTime] = useState("all");
  const [recipeDifficulty, setRecipeDifficulty] = useState("all");

  // Categories state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Results state
  const [postResult, setPostResult] = useState([]);
  const [reelResult, setReelResult] = useState([]);
  const [recipeResult, setRecipeResult] = useState([]);
  const [userResult, setUserResult] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to sync state from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get("q") || "";
    const filterFromUrl = params.get("filter") || "posts";

    setSearchQuery(queryFromUrl);
    setPageSearchQuery(queryFromUrl); // Sync input field on page load
    setActiveFilter(filterFromUrl);

    // Sync sub-filters from URL or set to default
    setPostSort(params.get("postSort") || "recent");
    setVideoSort(params.get("videoSort") || "recent");
    setRecipeCategory(params.get("recipeCategory") || "all");
    setRecipeTime(params.get("recipeTime") || "all");
    setRecipeDifficulty(params.get("recipeDifficulty") || "all");
  }, [location.search]);

  // Load categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getAllFormattedCategories();
        if (response.data?.success) {
          setCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Effect to fetch data when searchQuery or filters change
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        // Clear results if search query is empty
        setPostResult([]);
        setReelResult([]);
        setRecipeResult([]);
        setUserResult([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        switch (activeFilter) {
          case "posts":
            // Note: postsService.search might need adjustment if it expects an object for params
            // For now, assuming it takes keyword and potentially other options if backend supports
            const postData = await postsService.search(searchQuery);
            console.log(postData.data.posts);
            setPostResult(
              Array.isArray(postData?.data.posts) ? postData.data.posts : []
            );
            break;
          case "videos":
            const videoData = await searchVideos(searchQuery); // searchVideos returns { success: true, data: response.data }
            console.log(videoData);
            setReelResult(
              videoData.success && Array.isArray(videoData.data.videos)
                ? videoData.data.videos
                : []
            );
            break;
          case "recipes": {
            const recipeParams = { keyword: searchQuery };
            
            // Map selected category to appropriate parameter based on category type
            if (recipeCategory !== "all") {
              // Find the selected category in categories list to get its type
              let selectedCategory = null;
              categories.forEach((categoryGroup) => {
                const foundCategory = categoryGroup.items?.find((item) => 
                  (item.slug === recipeCategory) || (item.name === recipeCategory)
                );
                if (foundCategory) {
                  selectedCategory = { ...foundCategory, type: categoryGroup.key };
                }
              });

              if (selectedCategory) {
                // Map category type to the correct API parameter
                const categoryTypeMap = {
                  mealType: 'mealType',
                  cuisine: 'cuisine', 
                  occasions: 'occasions',
                  dietaryPreferences: 'dietaryPreferences',
                  mainIngredients: 'mainIngredients',
                  cookingMethod: 'cookingMethod'
                };
                
                const paramName = categoryTypeMap[selectedCategory.type];
                if (paramName) {
                  recipeParams[paramName] = selectedCategory.name;
                }
              }
            }
            
            if (recipeTime !== "all") recipeParams.time = recipeTime;
            if (recipeDifficulty !== "all")
              recipeParams.difficulty = recipeDifficulty;
            const recipeData = await recipeService.searchRecipes(recipeParams);
            console.log(recipeData);
            setRecipeResult(
              Array.isArray(recipeData?.data.data) ? recipeData.data.data : []
            );
            break;
          }
          case "users": {
            const userData = await searchUsers({ key: searchQuery });
            setUserResult(
              Array.isArray(userData?.data?.users) ? userData.data.users : []
            );
            break;
          }
          default:
            setPostResult([]);
            setReelResult([]);
            setRecipeResult([]);
            setUserResult([]);
        }
      } catch (err) {
        console.error("Search API error:", err);
        setError(err.message || "Đã có lỗi xảy ra khi tìm kiếm.");
        setPostResult([]);
        setReelResult([]);
        setRecipeResult([]);
        setUserResult([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    searchQuery,
    activeFilter,
    postSort,
    videoSort,
    recipeCategory,
    recipeTime,
    recipeDifficulty,
    categories,
  ]);

  const updateUrlParams = (newParams) => {
    const params = new URLSearchParams(location.search);
    Object.keys(newParams).forEach((key) => {
      if (
        newParams[key] !== undefined &&
        newParams[key] !== null &&
        newParams[key] !== ""
      ) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handlePageSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ q: pageSearchQuery });
  };

  const handleActiveFilterChange = (newFilter) => {
    updateUrlParams({ filter: newFilter, q: searchQuery }); // Keep current searchQuery
  };

  const handlePostSortChange = (newSort) => {
    updateUrlParams({ postSort: newSort, filter: "posts", q: searchQuery });
  };

  const handleVideoSortChange = (newSort) => {
    updateUrlParams({ videoSort: newSort, filter: "videos", q: searchQuery });
  };

  const handleRecipeCategoryChange = (e) => {
    updateUrlParams({
      recipeCategory: e.target.value,
      filter: "recipes",
      q: searchQuery,
    });
  };

  const handleRecipeTimeChange = (e) => {
    updateUrlParams({
      recipeTime: e.target.value,
      filter: "recipes",
      q: searchQuery,
    });
  };

  const handleRecipeDifficultyChange = (e) => {
    updateUrlParams({
      recipeDifficulty: e.target.value,
      filter: "recipes",
      q: searchQuery,
    });
  };

  const handleLike = async (id) => {
    try {
      const res = await postsService.toggleLike(id);
      const updatedPost = res.data.post;
      const isLiking = res.data.message === "Đã like bài viết";
      console.log("update", updatedPost);
      setPostResult((prevPosts) =>
        prevPosts.map((post) => (post._id === id ? updatedPost : post))
      );

      if (isLiking && updatedPost.author._id !== res.data.userId) {
        sendNotification({
          receiverId: updatedPost.author._id,
          type: "like",
          postId: id,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Sub-filter UI cho sidebar
  const renderSidebarSubFilter = () => {
    if (activeFilter === "posts") {
      return (
        <div className="mt-3 space-y-2 pl-2">
          <button
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${
              postSort === "recent"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
            onClick={() => handlePostSortChange("recent")}
          >
            Gần nhất
          </button>
          <button
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${
              postSort === "time"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
            onClick={() => handlePostSortChange("time")}
          >
            Thời gian
          </button>
          <button
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
              postSort === "followed"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
            onClick={() => handlePostSortChange("followed")}
          >
            Đã follow
          </button>
        </div>
      );
    }
    if (activeFilter === "videos") {
      return (
        <div className="mt-3 space-y-2 pl-2">
          <button
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${
              videoSort === "recent"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
            onClick={() => handleVideoSortChange("recent")}
          >
            Gần nhất
          </button>
          <button
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${
              videoSort === "time"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
            onClick={() => handleVideoSortChange("time")}
          >
            Thời gian
          </button>
          <button
            className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
              videoSort === "followed"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
            }`}
            onClick={() => handleVideoSortChange("followed")}
          >
            Đã follow
          </button>
        </div>
      );
    }
    if (activeFilter === "recipes") {
      return (
        <div className="mt-3 space-y-2 pl-2">
          <select
            value={recipeCategory}
            onChange={handleRecipeCategoryChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-200 mb-2"
          >
            <option value="all">Danh mục</option>
            {loadingCategories ? (
              <option disabled>Đang tải...</option>
            ) : (
              categories.map((categoryGroup) => 
                categoryGroup.items?.map((item) => (
                  <option key={item._id} value={item.slug || item.name}>
                    {item.name}
                  </option>
                ))
              ).flat()
            )}
          </select>
          <select
            value={recipeTime}
            onChange={handleRecipeTimeChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-200 mb-2"
          >
            <option value="all">Thời gian</option>
            <option value="<30">Dưới 30 phút</option>
            <option value="30-60">30-60 phút</option>
            <option value=">60">Trên 60 phút</option>
          </select>
          <select
            value={recipeDifficulty}
            onChange={handleRecipeDifficultyChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-200"
          >
            <option value="all">Độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const renderResults = () => {
    if (loading)
      return <p className="text-center text-gray-600">Đang tải kết quả...</p>;
    if (error) return <p className="text-center text-red-500">Lỗi: {error}</p>;
    if (!searchQuery)
      return (
        <p className="text-center text-gray-500">
          Nhập từ khóa để bắt đầu tìm kiếm.
        </p>
      );

    switch (activeFilter) {
      case "posts":
        if (postResult.length === 0)
          return (
            <p className="text-center text-gray-500">
              Không tìm thấy bài viết nào.
            </p>
          );
        return (
          <div className="space-y-6">
            {postResult?.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={() => handleLike(post._id)}
                onComment={() => navigate(`/posts/${post._id}`)}
                onShare={() => setSharePopup({ open: true, postId: post._id })}
              />
            ))}
          </div>
        );
      case "videos":
        if (reelResult.length === 0)
          return (
            <p className="text-center text-gray-500">
              Không tìm thấy video nào.
            </p>
          );
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {reelResult?.map((reel) => (
              <ReelCardReview reel={reel} key={reel._id} />
            ))}
          </div>
        );
      case "recipes":
        if (recipeResult.length === 0)
          return (
            <p className="text-center text-gray-500">
              Không tìm thấy công thức nào.
            </p>
          );
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipeResult?.map((recipe) => (
              <SavedCard recipe={recipe} key={recipe._id} />
            ))}
          </div>
        );
      case "users":
        if (userResult.length === 0)
          return (
            <p className="text-center text-gray-500">
              Không tìm thấy người dùng nào.
            </p>
          );
        return (
          <div className="space-y-4">
            {userResult?.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        );
      default:
        return (
          <p className="text-center text-gray-500">
            Chọn một bộ lọc để xem kết quả.
          </p>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header banner with gradient */}
      <div className="relative overflow-hidden">
        {/* Background with multiple gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-400 to-amber-400"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6">
          {/* Main title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center tracking-tight">
            Tìm kiếm
          </h1>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto w-full">
            <form
              onSubmit={handlePageSearchSubmit}
              className="flex items-center bg-white/95 backdrop-blur-sm border-2 border-[#FFA663] rounded-[35px] px-6 py-2"
            >
              <FaSearch className="w-6 h-6 mr-4 text-[#FFA663] animate-pulse" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết, video, công thức, người dùng..."
                value={pageSearchQuery}
                onChange={(e) => setPageSearchQuery(e.target.value)}
                className="flex-1 outline-none text-[17px] placeholder-gray-500 bg-transparent font-medium"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF37A5] to-[#FF6B9D] text-white font-bold py-3 px-8 rounded-[30px] ml-3 text-[15px] hover:from-[#FF2A8F] hover:to-[#FF4585] transition-all duration-300 transform"
              >
                TÌM KIẾM
              </button>
            </form>

            {/* Search suggestions */}
            <div className="my-4 flex flex-wrap justify-center gap-2">
              {["Cơm", "Bánh", "Bún bò", "Gà", "Kim chi"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setPageSearchQuery(tag);
                      updateUrlParams({ q: tag });
                    }}
                    className="bg-white/20 text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/30"
                  >
                    #{tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom wave effect */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-12 fill-gray-50"
          >
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6 px-4 sm:px-[80px]">
        <div className="container mx-auto">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <FaFilter className="text-orange-500" size={20} />
                <span className="font-semibold text-gray-800">Bộ lọc tìm kiếm</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 capitalize">{
                  activeFilter === 'posts' ? 'Bài viết' :
                  activeFilter === 'videos' ? 'Video' :
                  activeFilter === 'recipes' ? 'Công thức' :
                  activeFilter === 'users' ? 'Người dùng' : 'Tất cả'
                }</span>
                <div className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </div>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
            {/* Filter Sidebar */}
            <div
              className={`w-full md:w-72  flex-shrink-0 transition-all duration-300 ${
                isFilterOpen ? "block" : "hidden md:block"
              }`}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FaFilter className="text-gray-600 mr-2" size={20} />
                    Bộ lọc
                  </h2>
                  
                </div>
                
                {/* Main Filters */}
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => handleActiveFilterChange("recipes")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                      activeFilter === "recipes"
                        ? "bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FaBook size={18} className={activeFilter === "recipes" ? "text-orange-600" : "text-gray-500 group-hover:text-orange-500"} />
                      <span className="font-medium">Công thức</span>
                    </div>
                    {activeFilter === "recipes" && (
                      <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">
                        {recipeResult.length}
                      </span>
                    )}
                  </button>
                  {activeFilter === 'recipes' && renderSidebarSubFilter()}
                  
                  <button
                    onClick={() => handleActiveFilterChange("posts")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                      activeFilter === "posts"
                        ? "bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FaNewspaper size={18} className={activeFilter === "posts" ? "text-orange-600" : "text-gray-500 group-hover:text-orange-500"} />
                      <span className="font-medium">Bài viết</span>
                    </div>
                    {activeFilter === "posts" && (
                      <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">
                        {postResult.length}
                      </span>
                    )}
                  </button>
                  {activeFilter === 'posts' && renderSidebarSubFilter()}
                  
                  <button
                    onClick={() => handleActiveFilterChange("videos")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                      activeFilter === "videos"
                        ? "bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FaVideo size={18} className={activeFilter === "videos" ? "text-orange-600" : "text-gray-500 group-hover:text-orange-500"} />
                      <span className="font-medium">Video</span>
                    </div>
                    {activeFilter === "videos" && (
                      <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">
                        {reelResult.length}
                      </span>
                    )}
                  </button>
                  {activeFilter === 'videos' && renderSidebarSubFilter()}
                  
                  <button
                    onClick={() => handleActiveFilterChange("users")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                      activeFilter === "users"
                        ? "bg-orange-50 text-orange-700 border border-orange-200 shadow-sm"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FaUser size={18} className={activeFilter === "users" ? "text-orange-600" : "text-gray-500 group-hover:text-orange-500"} />
                      <span className="font-medium">Người dùng</span>
                    </div>
                    {activeFilter === "users" && (
                      <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">
                        {userResult.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 space-y-1">
                    
                    {searchQuery && (
                      <div className="text-center mt-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Đang tìm: </span>
                        <span className="font-semibold text-orange-600">"{searchQuery}"</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 min-h-[400px]">
                {/* Results Header */}
                <div className="p-6 pb-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center flex-wrap">
                      <span className="text-orange-600 mr-2">Kết quả tìm kiếm</span>
                      {searchQuery && (
                        <span className="text-gray-600 text-lg">cho "{searchQuery}"</span>
                      )}
                    </h2>
                    <div className="flex items-center space-x-4">
                      {/* Result count badge */}
                      <div className="bg-gray-300/20 text-gray-700 px-4 py-2 rounded-full text-sm">
                        {
                          activeFilter === 'posts' ? `${postResult.length} bài viết` :
                          activeFilter === 'videos' ? `${reelResult.length} video` :
                          activeFilter === 'recipes' ? `${recipeResult.length} công thức` :
                          activeFilter === 'users' ? `${userResult.length} người dùng` :
                          '0 kết quả'
                        }
                      </div>
                      {/* Loading indicator */}
                      {loading && (
                        <div className="flex items-center space-x-2 text-orange-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                          <span className="text-sm">Đang tải...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Results Content */}
                <div className="p-6">
                  {renderResults()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SharePopup
        open={sharePopup.open}
        postId={sharePopup.postId}
        // Ensure postResult is not empty and the post exists before trying to access its properties
        postTitle={
          postResult.find((p) => p._id === sharePopup.postId)?.content ||
          postResult.find((p) => p._id === sharePopup.postId)?.title ||
          ""
        }
        onClose={() => setSharePopup({ open: false, postId: null })}
      />
    </div>
  );
};

export default SearchPage;
