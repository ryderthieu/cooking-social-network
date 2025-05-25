import {
    FaBookmark,
    FaEllipsisH,
    FaEdit,
    FaTrash,
    FaHeart,
    FaComment,
    FaShare,
} from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const PostCard = ({ post, onLike, onComment, onShare, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isLiked, setIsLiked] = useState(post?.liked || false);

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.();
    };

    const getGridClass = (length) => {
        switch (length) {
            case 1:
                return "grid-cols-1";
            case 2:
                return "grid-cols-2";
            case 3:
                return "grid-cols-2";
            case 4:
                return "grid-cols-2";
            default:
                return "grid-cols-2";
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-[#FFB800]/10 p-6 mb-8 transition-all duration-500 hover:shadow-2xl hover:border-[#FFB800]/30 group backdrop-blur-sm">
            {/* Header với Avatar và Menu */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <Link to={'/'} className="relative">
                        <img
                            src={post.user.avatar}
                            alt={post.user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    <div>
                        <Link to={'/'} className="font-bold text-gray-800 text-base hover:text-[#FFB800] transition-colors cursor-pointer">
                            {post.user.name}
                        </Link>
                        <Link to={`/posts/${post.id}`} className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{post.date}</span>
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-3 hover:bg-[#FFF4D6] rounded-full transition-all duration-300 hover:scale-110 text-gray-600 hover:text-[#FFB800]"
                    >
                        <FaEllipsisH />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#FFB800]/10 py-2 z-10 animate-popup">
                            <button className="w-full px-4 py-3 text-left hover:bg-[#FFF4D6] flex items-center gap-3 text-gray-700 hover:text-[#FFB800] transition-colors group">
                                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                    <FaEdit className="w-4 h-4" />
                                </div>
                                <span className="font-medium">Chỉnh sửa</span>
                            </button>
                            <button className="w-full px-4 py-3 text-left hover:bg-[#FFF4D6] flex items-center gap-3 text-gray-700 hover:text-[#FFB800] transition-colors group">
                                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                    <FaBookmark className="w-4 h-4" />
                                </div>
                                <span className="font-medium">Lưu bài viết</span>
                            </button>
                            <button className="w-full px-4 py-3 text-left hover:bg-[#FFF4D6] flex items-center gap-3 text-gray-700 hover:text-[#FFB800] transition-colors group">
                                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                    <FaTrash className="w-4 h-4" />
                                </div>
                                <span className="font-medium">Xóa bài viết</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="text-gray-800 mb-6 text-base leading-relaxed">
                {post.content}
            </div>

            {/* Grid ảnh */}
            {post.images && post.images.length > 0 && (
                <div className="mb-6">
                    <div 
                        className={`grid ${getGridClass(post.images.length)} gap-2 rounded-2xl overflow-hidden max-h-[600px]`}
                        style={{ gridAutoRows: post.images.length === 1 ? '1fr' : '200px' }}
                    >
                        {post.images.map((image, index) => (
                            <Link to={`/posts/${post.id}`}
                                key={index}
                                onClick={() => {
                                    setCurrentImageIndex(index);
                                    setShowFullscreen(true);
                                }}
                                className={`relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black cursor-pointer group
                                    ${index === 0 && post.images.length === 3 ? 'row-span-2' : ''}
                                    ${post.images.length === 1 ? 'max-h-[500px]' : ''}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 z-10 pointer-events-none" />
                                <img
                                    src={image}
                                    alt={`post-${index}`}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                />
                                {post.images.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                        <span className="text-white text-2xl font-bold">+{post.images.length - 4}</span>
                                    </div>
                                )}
                            </Link>
                        )).slice(0, 4)}
                    </div>
                </div>
            )}

            {/* Nút tương tác */}
            <div className="flex items-center justify-around bg-gradient-to-r from-gray-50 to-[#FFF4D6]/40 rounded-2xl p-3 border border-[#FFB800]/10">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group ${
                        isLiked 
                            ? 'bg-[#FFB800]/20 text-[#FFB800] shadow-md' 
                            : 'text-gray-600 hover:text-[#FFB800] hover:bg-[#FFF4D6]/50'
                    }`}
                >
                    <div className={`p-2 rounded-full transition-all duration-300 ${
                        isLiked 
                            ? 'bg-[#FFB800]/30 scale-110' 
                            : 'bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110'
                    }`}>
                        <FaHeart className={`w-4 h-4 ${isLiked ? 'text-[#FFB800]' : ''}`} />
                    </div>
                    <span className="font-semibold text-sm">{post.likes}</span>
                </button>
                
                <button 
                    onClick={onComment}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:text-[#FFB800] transition-all duration-300 group hover:bg-[#FFF4D6]/50"
                >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
                        <FaComment className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{post.comments.length}</span>
                </button>
                
                <button
                    onClick={onShare}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:text-[#FFB800] transition-all duration-300 group hover:bg-[#FFF4D6]/50"
                >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
                        <FaShare className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{post.shares}</span>
                </button>

                <button className="p-2 rounded-full bg-gray-100 hover:bg-[#FFF4D6] text-gray-600 hover:text-[#FFB800] transition-all duration-300 hover:scale-110">
                    <FaBookmark className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
