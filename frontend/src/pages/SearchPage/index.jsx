import React, { useState } from 'react';
import { FaSearch, FaFilter, FaNewspaper, FaVideo, FaBook, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('posts');
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    // Sub-filter state
    const [postSort, setPostSort] = useState('recent');
    const [videoSort, setVideoSort] = useState('recent');
    const [recipeIngredient, setRecipeIngredient] = useState('all');
    const [recipeTime, setRecipeTime] = useState('all');
    const [recipeDifficulty, setRecipeDifficulty] = useState('all');

    // Mock data - sẽ được thay thế bằng API call thực tế
    const mockResults = {
        posts: [
            { 
                id: 1, 
                title: 'Cách làm bánh mì ngon', 
                author: 'Chef A', 
                date: '2024-03-20',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                excerpt: 'Khám phá bí quyết làm bánh mì thơm ngon, giòn rụm với công thức đơn giản...'
            },
            { 
                id: 2, 
                title: 'Bí quyết nấu phở', 
                author: 'Chef B', 
                date: '2024-03-19',
                image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                excerpt: 'Học cách nấu nước dùng phở đậm đà, thơm ngon chuẩn vị...'
            },
        ],
        videos: [
            { 
                id: 1, 
                title: 'Hướng dẫn làm bánh mì', 
                author: 'Chef A', 
                views: 1000,
                thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                duration: '15:30'
            },
            { 
                id: 2, 
                title: 'Cách nấu phở chuẩn vị', 
                author: 'Chef B', 
                views: 2000,
                thumbnail: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                duration: '20:15'
            },
        ],
        recipes: [
            { 
                id: 1, 
                title: 'Công thức bánh mì', 
                author: 'Chef A', 
                difficulty: 'Dễ',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                time: '45 phút'
            },
            { 
                id: 2, 
                title: 'Công thức phở bò', 
                author: 'Chef B', 
                difficulty: 'Trung bình',
                image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                time: '120 phút'
            },
        ],
        users: [
            {
                id: 1,
                name: 'Nguyễn Văn A',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                role: 'Đầu bếp chuyên nghiệp',
                followers: 1200,
                recipes: 45
            },
            {
                id: 2,
                name: 'Trần Thị B',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                role: 'Food Blogger',
                followers: 2500,
                recipes: 78
            }
        ]
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: Implement search logic
        console.log('Searching for:', searchQuery);
    };

    const renderPostCard = (item) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex">
                <div className="shrink-0">
                    <img className="h-32 w-48 object-cover" src={item.image} alt={item.title} />
                </div>
                <div className="p-6 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#FFB800] transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.excerpt}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm">Tác giả: {item.author}</p>
                        <p className="text-gray-500 text-sm">Ngày đăng: {item.date}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderVideoCard = (item) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex">
                <div className="relative shrink-0">
                    <img className="h-32 w-48 object-cover" src={item.thumbnail} alt={item.title} />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                        {item.duration}
                    </div>
                </div>
                <div className="p-6 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#FFB800] transition-colors">
                        {item.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm">Tác giả: {item.author}</p>
                        <p className="text-gray-500 text-sm">{item.views} lượt xem</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRecipeCard = (item) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex">
                <div className="shrink-0">
                    <img className="h-32 w-48 object-cover" src={item.image} alt={item.title} />
                </div>
                <div className="p-6 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#FFB800] transition-colors">
                        {item.title}
                    </h3>
                    <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 bg-[#FFF4D6] text-[#FFB800] rounded-full text-sm">
                            {item.difficulty}
                        </span>
                        <span className="text-gray-500 text-sm">{item.time}</span>
                    </div>
                    <p className="text-gray-500 text-sm">Tác giả: {item.author}</p>
                </div>
            </div>
        </div>
    );

    const renderUserCard = (item) => (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center p-6">
                <div className="shrink-0">
                    <img 
                        className="h-20 w-20 rounded-full object-cover border-2 border-[#FFB800]" 
                        src={item.avatar} 
                        alt={item.name} 
                    />
                </div>
                <div className="ml-6 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1 hover:text-[#FFB800] transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{item.role}</p>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                            <span className="text-[#FFB800] font-semibold mr-2">{item.followers}</span>
                            <span className="text-gray-500 text-sm">người theo dõi</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-[#FFB800] font-semibold mr-2">{item.recipes}</span>
                            <span className="text-gray-500 text-sm">công thức</span>
                        </div>
                    </div>
                </div>
                <button className="px-6 py-2 bg-[#FFB800] text-white rounded-lg hover:bg-[#E6A600] transition-colors">
                    Theo dõi
                </button>
            </div>
        </div>
    );

    const renderResults = () => {
        const results = mockResults[activeFilter];
        return (
            <div className="space-y-6">
                {results.map(item => {
                    switch (activeFilter) {
                        case 'posts':
                            return renderPostCard(item);
                        case 'videos':
                            return renderVideoCard(item);
                        case 'recipes':
                            return renderRecipeCard(item);
                        case 'users':
                            return renderUserCard(item);
                        default:
                            return null;
                    }
                })}
            </div>
        );
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
        </div>
    );
};

export default SearchPage;