import React, { useState } from 'react';
import { FaSearch, FaFilter, FaNewspaper, FaVideo, FaBook, FaUser, FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { PostCard } from '../../components/common/Post';
import ReelCard from '../../components/common/ReelCard';
import SharePopup from '../../components/common/SharePopup';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('posts');
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [sharePopup, setSharePopup] = useState({ open: false, postId: null });
    const navigate = useNavigate();

    // Sub-filter state
    const [postSort, setPostSort] = useState('recent');
    const [videoSort, setVideoSort] = useState('recent');
    const [recipeIngredient, setRecipeIngredient] = useState('all');
    const [recipeTime, setRecipeTime] = useState('all');
    const [recipeDifficulty, setRecipeDifficulty] = useState('all');

    // Mock data cho posts và reels
    const mockPosts = [
        {
            id: 1,
            user: {
                name: 'Chef A',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            },
            date: '2024-03-20',
            content: 'Khám phá bí quyết làm bánh mì thơm ngon, giòn rụm với công thức đơn giản...',
            images: [
                'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            ],
            likes: 120,
            comments: [
                { id: 1, user: 'Lê Minh', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', text: 'Nhìn ngon quá!' }
            ],
            shares: 15,
            liked: false
        },
        {
            id: 2,
            user: {
                name: 'Chef B',
                avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
            },
            date: '2024-03-19',
            content: 'Học cách nấu nước dùng phở đậm đà, thơm ngon chuẩn vị...',
            images: [
                'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            ],
            likes: 85,
            comments: [
                { id: 1, user: 'Mai Hương', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Tuyệt vời!' }
            ],
            shares: 8,
            liked: false
        }
    ];

    const mockReels = [
        {
            id: 1,
            user: {
                name: 'Chef Tony',
                avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
            },
            date: '2024-03-20',
            title: 'Cách làm bánh mì Việt Nam tại nhà',
            thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
            video: 'https://www.youtube.com/shorts/KSt9oH2CYus?feature=share',
            likes: '1.7M',
            comments: [
                {
                    id: 1,
                    user: 'Lê Minh',
                    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
                    text: 'Video hay quá!',
                    likes: 5,
                    time: '2 giờ trước',
                    replies: []
                }
            ],
            shares: 45,
            liked: false
        },
        {
            id: 2,
            user: {
                name: 'Chef Anna',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            },
            date: '2024-03-19',
            title: 'Bí quyết làm sushi ngon tại nhà',
            thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
            video: 'https://www.youtube.com/shorts/abc123',
            likes: '4.9K',
            comments: [],
            shares: 28,
            liked: false
        },
        {
            id: 3,
            user: {
                name: 'Chef Mike',
                avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
            },
            date: '2024-03-18',
            title: 'Cách làm phở gà truyền thống',
            thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
            video: 'https://www.youtube.com/shorts/xyz789',
            likes: '7.1K',
            comments: [],
            shares: 56,
            liked: false
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handleLike = (id) => {
        // Xử lý like post
        console.log('Liked post:', id);
    };

    const handleReelLike = (id) => {
        // Xử lý like reel
        console.log('Liked reel:', id);
    };

    // Sub-filter UI cho sidebar
    const renderSidebarSubFilter = () => {
        if (activeFilter === 'posts') {
            return (
                <div className="mt-3 space-y-2 pl-2">
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${postSort === 'recent' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setPostSort('recent')}
                    >
                        Gần nhất
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${postSort === 'time' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setPostSort('time')}
                    >
                        Thời gian
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${postSort === 'followed' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setPostSort('followed')}
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
                        onClick={() => setVideoSort('recent')}
                    >
                        Gần nhất
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium mr-2 ${videoSort === 'time' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setVideoSort('time')}
                    >
                        Thời gian
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${videoSort === 'followed' ? 'bg-[#FFB800] text-white border-[#FFB800]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                        onClick={() => setVideoSort('followed')}
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
                        onChange={e => setRecipeIngredient(e.target.value)}
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
                        onChange={e => setRecipeTime(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] mb-2"
                    >
                        <option value="all">Thời gian</option>
                        <option value="<30">Dưới 30 phút</option>
                        <option value="30-60">30-60 phút</option>
                        <option value=">60">Trên 60 phút</option>
                    </select>
                    <select
                        value={recipeDifficulty}
                        onChange={e => setRecipeDifficulty(e.target.value)}
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
        switch (activeFilter) {
            case 'posts':
                return (
                    <div className="space-y-6">
                        {mockPosts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={() => handleLike(post.id)}
                                onComment={() => navigate(`/posts/${post.id}`)}
                                onShare={() => setSharePopup({ open: true, postId: post.id })}
                            />
                        ))}
                    </div>
                );
            case 'videos':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mockReels.map(reel => (
                            <div
                                key={reel.id}
                                className="relative group cursor-pointer"
                                onClick={() => navigate(`/explore/reels/${reel.id}`)}
                            >
                                <div className="aspect-[9/16] relative overflow-hidden rounded-xl">
                                    {/* Thumbnail */}
                                    <img
                                        src={reel.thumbnail}
                                        alt={reel.title}
                                        className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Video Preview on Hover */}
                                    <video
                                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        src={reel.video}
                                        loop
                                        muted
                                        playsInline
                                        onMouseEnter={(e) => e.target.play()}
                                        onMouseLeave={(e) => {
                                            e.target.pause();
                                            e.target.currentTime = 0;
                                        }}
                                    />

                                    {/* Overlay with Info */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <img
                                                    src={reel.user.avatar}
                                                    alt={reel.user.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <span className="font-medium">{reel.user.name}</span>
                                            </div>
                                            <p className="text-sm line-clamp-2">{reel.title}</p>
                                            <div className="flex items-center space-x-3 mt-2 text-sm">
                                                <span className="flex items-center">
                                                    <FaHeart className="mr-1" /> {reel.likes}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
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
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                    <div className="flex gap-8">
                        {/* Filter Sidebar */}
                        <div className={`w-72 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
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
                                        onClick={() => setActiveFilter('posts')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                                            activeFilter === 'posts'
                                                ? 'bg-[#FFF4D6] text-[#FFB800] shadow-md border border-[#FFB800]/20'
                                                : 'hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <FaNewspaper size={20} />
                                        <span>Bài viết</span>
                                    </button>
                                    {activeFilter === 'posts' && renderSidebarSubFilter()}
                                    <button
                                        onClick={() => setActiveFilter('videos')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                                            activeFilter === 'videos'
                                                ? 'bg-[#FFF4D6] text-[#FFB800] shadow-md border border-[#FFB800]/20'
                                                : 'hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <FaVideo size={20} />
                                        <span>Video</span>
                                    </button>
                                    {activeFilter === 'videos' && renderSidebarSubFilter()}
                                    <button
                                        onClick={() => setActiveFilter('recipes')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                                            activeFilter === 'recipes'
                                                ? 'bg-[#FFF4D6] text-[#FFB800] shadow-md border border-[#FFB800]/20'
                                                : 'hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <FaBook size={20} />
                                        <span>Công thức</span>
                                    </button>
                                    {activeFilter === 'recipes' && renderSidebarSubFilter()}
                                    <button
                                        onClick={() => setActiveFilter('users')}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                                            activeFilter === 'users'
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
                            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <span className="text-[#FFB800] mr-2">Kết quả tìm kiếm</span>
                                    <span className="text-gray-600">cho "{searchQuery}"</span>
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
                postTitle={mockPosts.find(p => p.id === sharePopup.postId)?.content}
                onClose={() => setSharePopup({ open: false, postId: null })}
            />
        </div>
    );
};

export default SearchPage;