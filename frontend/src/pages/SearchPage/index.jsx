import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaNewspaper, FaVideo, FaBook, FaUser, FaHeart } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PostCard } from '../../components/common/Post';
import { ReelCardReview } from '../../components/common/ReelCard';
import SharePopup from '../../components/common/SharePopup';
import postsService from '../../services/postService'; // Assuming default export
import recipeService from '../../services/recipeService'; // Assuming default export
import { searchUsers } from '../../services/userService';
import { searchVideos } from '../../services/videoService';
import UserCard from '../../components/common/UserCard';
import SavedCard from '@/components/sections/Recipe/SavedCard';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState(''); // From URL, drives API calls
    const [pageSearchQuery, setPageSearchQuery] = useState(''); // For the input on this page
    const [activeFilter, setActiveFilter] = useState('posts');
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [sharePopup, setSharePopup] = useState({ open: false, postId: null });

    const navigate = useNavigate();
    const location = useLocation();

    // Sub-filter state
    const [postSort, setPostSort] = useState('recent');
    const [videoSort, setVideoSort] = useState('recent');
    const [recipeIngredient, setRecipeIngredient] = useState('all');
    const [recipeTime, setRecipeTime] = useState('all');
    const [recipeDifficulty, setRecipeDifficulty] = useState('all');

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
        const queryFromUrl = params.get('q') || '';
        const filterFromUrl = params.get('filter') || 'posts';

        setSearchQuery(queryFromUrl);
        setPageSearchQuery(queryFromUrl); // Sync input field on page load
        setActiveFilter(filterFromUrl);

        // Sync sub-filters from URL or set to default
        setPostSort(params.get('postSort') || 'recent');
        setVideoSort(params.get('videoSort') || 'recent');
        setRecipeIngredient(params.get('recipeIngredient') || 'all');
        setRecipeTime(params.get('recipeTime') || 'all');
        setRecipeDifficulty(params.get('recipeDifficulty') || 'all');

    }, [location.search]);

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
                    case 'posts':
                        // Note: postsService.search might need adjustment if it expects an object for params
                        // For now, assuming it takes keyword and potentially other options if backend supports
                        const postData = await postsService.search(searchQuery);
                        console.log(postData.data.posts)
                        setPostResult(Array.isArray(postData?.data.posts) ? postData.data.posts : []);
                        break;
                    case 'videos':
                        const videoData = await searchVideos(searchQuery); // searchVideos returns { success: true, data: response.data }
                        console.log(videoData)
                        setReelResult(videoData.success && Array.isArray(videoData.data.videos) ? videoData.data.videos : []);
                        break;
                    case 'recipes':
                        const recipeParams = { keyword: searchQuery };
                        if (recipeIngredient !== 'all') recipeParams.ingredient = recipeIngredient;
                        if (recipeTime !== 'all') recipeParams.time = recipeTime;
                        if (recipeDifficulty !== 'all') recipeParams.difficulty = recipeDifficulty;
                        const recipeData = await recipeService.searchRecipes(recipeParams);
                        console.log(recipeData)
                        setRecipeResult(Array.isArray(recipeData?.data.data) ? recipeData.data.data : []);
                        break;
                    case 'users':
                        const userData = await searchUsers({ key: searchQuery });
                        setUserResult(Array.isArray(userData?.data?.users) ? userData.data.users : []);
                        break;
                    default:
                        setPostResult([]);
                        setReelResult([]);
                        setRecipeResult([]);
                        setUserResult([]);
                }
            } catch (err) {
                console.error("Search API error:", err);
                setError(err.message || 'Đã có lỗi xảy ra khi tìm kiếm.');
                setPostResult([]);
                setReelResult([]);
                setRecipeResult([]);
                setUserResult([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, activeFilter, postSort, videoSort, recipeIngredient, recipeTime, recipeDifficulty]);

    const updateUrlParams = (newParams) => {
        const params = new URLSearchParams(location.search);
        Object.keys(newParams).forEach(key => {
            if (newParams[key] !== undefined && newParams[key] !== null && newParams[key] !== '') {
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
        updateUrlParams({ postSort: newSort, filter: 'posts', q: searchQuery });
    };

    const handleVideoSortChange = (newSort) => {
        updateUrlParams({ videoSort: newSort, filter: 'videos', q: searchQuery });
    };

    const handleRecipeIngredientChange = (e) => {
        updateUrlParams({ recipeIngredient: e.target.value, filter: 'recipes', q: searchQuery });
    };

    const handleRecipeTimeChange = (e) => {
        updateUrlParams({ recipeTime: e.target.value, filter: 'recipes', q: searchQuery });
    };

    const handleRecipeDifficultyChange = (e) => {
        updateUrlParams({ recipeDifficulty: e.target.value, filter: 'recipes', q: searchQuery });
    };


    const handleLike = async (id) => {
        try {
            const res = await postsService.toggleLike(id);
            const updatedPost = res.data.post;
            const isLiking = res.data.message === "Đã like bài viết";
            console.log('update', updatedPost);
            setPostResult(prevPosts =>
                prevPosts.map(post => (post._id === id ? updatedPost : post))
            );

            if (isLiking && updatedPost.author._id !== res.data.userId) {
                sendNotification({
                    receiverId: updatedPost.author._id,
                    type: 'like',
                    postId: id,
                });
            }
        }
        catch (error) {
            console.log(error.message)
        }
    };

    // Sub-filter UI cho sidebar
    const renderSidebarSubFilter = () => {
        if (activeFilter === 'posts') {
            return (
                <div className="mt-3 space-y-2 pl-2">
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${postSort === 'recent' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => handlePostSortChange('recent')}
                    >
                        Gần nhất
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${postSort === 'time' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => handlePostSortChange('time')}
                    >
                        Thời gian
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${postSort === 'followed' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => handlePostSortChange('followed')}
                    >
                        Đã follow
                    </button>
                </div>
            );
        }
        if (activeFilter === 'videos') {
            return (
                <div className="mt-3 space-y-2 pl-2">
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${videoSort === 'recent' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => handleVideoSortChange('recent')}
                    >
                        Gần nhất
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${videoSort === 'time' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => handleVideoSortChange('time')}
                    >
                        Thời gian
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${videoSort === 'followed' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => handleVideoSortChange('followed')}
                    >
                        Đã follow
                    </button>
                </div>
            );
        }
        if (activeFilter === 'recipes') {
            return (
                <div className="mt-3 space-y-2 pl-2">
                    <select
                        value={recipeIngredient}
                        onChange={handleRecipeIngredientChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] mb-2"
                    >
                        <option value="all">Nguyên liệu</option>
                        <option value="thit">Thịt</option>
                        <option value="ca">Cá</option>
                        <option value="trung">Trứng</option>
                        <option value="rau">Rau củ</option>
                    </select>
                    <select
                        value={recipeTime}
                        onChange={handleRecipeTimeChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] mb-2"
                    >
                        <option value="all">Thời gian</option>
                        <option value="<30">Dưới 30 phút</option>
                        <option value="30-60">30-60 phút</option>
                        <option value=">60">Trên 60 phút</option>
                    </select>
                    <select
                        value={recipeDifficulty}
                        onChange={handleRecipeDifficultyChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800]"
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
        if (loading) return <p className="text-center text-gray-600">Đang tải kết quả...</p>;
        if (error) return <p className="text-center text-red-500">Lỗi: {error}</p>;
        if (!searchQuery) return <p className="text-center text-gray-500">Nhập từ khóa để bắt đầu tìm kiếm.</p>;

        switch (activeFilter) {
            case 'posts':
                if (postResult.length === 0) return <p className="text-center text-gray-500">Không tìm thấy bài viết nào.</p>;
                return (
                    <div className="space-y-6">
                        {postResult?.map(post => (
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
            case 'videos':
                if (reelResult.length === 0) return <p className="text-center text-gray-500">Không tìm thấy video nào.</p>;
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {reelResult?.map(reel => (
                            <ReelCardReview reel={reel} key={reel._id} />
                        ))}
                    </div>
                );
            case 'recipes':
                if (recipeResult.length === 0) return <p className="text-center text-gray-500">Không tìm thấy công thức nào.</p>;
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipeResult?.map(recipe => (
                            <SavedCard recipe={recipe} key={recipe._id}/>
                        ))}
                    </div>
                );
            case 'users':
                if (userResult.length === 0) return <p className="text-center text-gray-500">Không tìm thấy người dùng nào.</p>;
                return (
                    <div className="space-y-4">
                        {userResult?.map(user => (
                            <UserCard key={user._id} user={user} />
                        ))}
                    </div>
                );
            default:
                return <p className="text-center text-gray-500">Chọn một bộ lọc để xem kết quả.</p>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section with Custom Gradient Background */}
            <div className="py-12 px-[110px] flex justify-center">
                <div
                    className="w-full rounded-3xl shadow-lg px-8 py-10"
                    style={{
                        background: 'linear-gradient(30deg, rgba(246,60,60,0.9) 0%, rgba(255,175,1,0.75) 50%, rgba(255,225,1,0.6) 100%)'
                    }}
                >
                    <h1 className="text-3xl font-bold text-white mb-8 text-center">Tìm kiếm</h1>
                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handlePageSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={pageSearchQuery}
                                onChange={(e) => setPageSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm bài viết, video, công thức, người dùng..."
                                className="w-full px-6 py-4 rounded-xl border-2 border-white/30 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent shadow-lg text-lg placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FFB800] hover:text-[#E6A600] transition-colors"
                            >
                                <FaSearch size={24} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-8 px-[110px]">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filter Sidebar */}
                        <div className={`w-full md:w-72 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Bộ lọc</h2>
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="md:hidden text-gray-500 hover:text-[#FFB800] transition-colors"
                                    >
                                        <FaFilter size={20} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleActiveFilterChange('posts')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${activeFilter === 'posts'
                                            ? 'bg-[#FFF4D6] text-[#FFB800] shadow-md border border-[#FFB800]/20'
                                            : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <FaNewspaper size={20} />
                                        <span>Bài viết</span>
                                    </button>
                                    {activeFilter === 'posts' && renderSidebarSubFilter()}
                                    <button
                                        onClick={() => handleActiveFilterChange('videos')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${activeFilter === 'videos'
                                            ? 'bg-[#FFF4D6] text-[#FFB800] shadow-md border border-[#FFB800]/20'
                                            : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <FaVideo size={20} />
                                        <span>Video</span>
                                    </button>
                                    {activeFilter === 'videos' && renderSidebarSubFilter()}
                                    <button
                                        onClick={() => handleActiveFilterChange('recipes')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${activeFilter === 'recipes'
                                            ? 'bg-[#FFF4D6] text-[#FFB800] shadow-md border border-[#FFB800]/20'
                                            : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <FaBook size={20} />
                                        <span>Công thức</span>
                                    </button>
                                    {activeFilter === 'recipes' && renderSidebarSubFilter()}
                                    <button
                                        onClick={() => handleActiveFilterChange('users')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${activeFilter === 'users'
                                            ? 'bg-[#FFF4D6] text-[#FFB800] shadow-md border border-[#FFB800]/20'
                                            : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <FaUser size={20} />
                                        <span>Người dùng</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 min-h-[300px]"> {/* Added min-h for better loading/empty state visibility */}
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <span className="text-[#FFB800] mr-2">Kết quả tìm kiếm</span>
                                    {searchQuery && <span className="text-gray-600">cho "{searchQuery}"</span>}
                                </h2>
                                {renderResults()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SharePopup
                open={sharePopup.open}
                postId={sharePopup.postId}
                // Ensure postResult is not empty and the post exists before trying to access its properties
                postTitle={postResult.find(p => p._id === sharePopup.postId)?.content || postResult.find(p => p._id === sharePopup.postId)?.title || ''}
                onClose={() => setSharePopup({ open: false, postId: null })}
            />
        </div>
    );
};

export default SearchPage;