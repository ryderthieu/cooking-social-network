import {
    FaBookmark,
    FaEllipsisH,
    FaEdit,
    FaTrash,
    FaHeart,
    FaComment,
    FaShare,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EditPostModal from './PostModals/EditPostModal';
import DeleteConfirmModal from './PostModals/DeleteConfirmModal';
import { editPost, deletePost, getPostById } from "@/services/postService";
import { useCloudinary } from "@/context/CloudinaryContext";
import { toast } from "react-toastify";

export const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        const now = new Date();

        // Reset thời gian về 00:00:00 để so sánh ngày
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Nếu là thời gian trong ngày hôm nay
        if (date >= today) {
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

            if (diffMins < 1) return "Vừa xong";
            if (diffHours < 1) return `${diffMins} phút trước`;
            return `${diffHours} giờ trước`;
        }

        // Nếu là ngày hôm qua
        if (date >= yesterday) {
            return "Hôm qua";
        }

        // Tính số ngày chênh lệch
        const diffTime = Math.abs(today - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Nếu trong khoảng 2-3 ngày
        if (diffDays <= 3) {
            return `${diffDays} ngày trước`;
        }

        // Còn lại hiển thị ngày tháng năm
        return new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    } catch (error) {
        return dateString;
    }
};

export const PostCard = ({
    post: initialPost,
    onLike,
    onComment,
    onShare,
    onBookmark,
    onPostUpdated,
    onDelete,
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [post, setPost] = useState(initialPost);
    const [isLiked, setIsLiked] = useState(() =>
        post?.likes?.some((id) => id.toString() === user?._id)
    );
    const [isBookmarked, setIsBookmarked] = useState(false);
    const { uploadImage } = useCloudinary();

    useEffect(() => {
        setPost(initialPost);
    }, [initialPost]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        onLike?.(post._id);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        onBookmark?.(post._id);
    };

    const handleEdit = async (editedData) => {
        try {
            // Upload new images if any
            let uploadedImages = [];
            if (editedData.newImages?.length > 0) {
                const uploadPromises = editedData.newImages.map(item => uploadImage(item.file));
                const uploadedResults = await Promise.all(uploadPromises);
                uploadedImages = uploadedResults.map(result => result.url);
            }

            // Get existing image URLs
            const existingImageUrls = editedData.images.map(img => img.url);

            // Combine all image URLs
            const allImageUrls = [...existingImageUrls, ...uploadedImages];

            // Prepare data for API
            const postData = {
                caption: editedData.caption,
                recipe: editedData.recipe,
                imgUri: allImageUrls
            };

            // Call API to update post
            await editPost(post._id, postData);
            
            // Fetch updated post and update state
            const response = await getPostById(post._id);
            const updatedPost = response.data;
            setPost(updatedPost); // Cập nhật local state
            onPostUpdated?.(updatedPost); // Thông báo cho component cha (nếu cần)
            setShowEditModal(false);
            toast.success('Đã cập nhật bài viết thành công!');
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
        }
    };

    const handleDelete = async () => {
        try {
            console.log(post._id)
            await deletePost(post._id);
            onDelete?.(post._id);
            setShowDeleteModal(false)
            toast.success('Đã xóa bài viết thành công!');
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa bài viết');
        }
    };

    useEffect(() => {
        if (user && post && Array.isArray(user.savedPost)) {
            setIsBookmarked(
                user.savedPost.some((id) => id && id.toString() === post._id)
            );
        }
    }, [user, post]);

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

    if (!post || !post.author) return null;

    const imageMedia = post.media?.filter((m) => m.type === "image") || [];

    return (
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 transition-all duration-500 hover:shadow-2xl hover:border-[#FFB800]/30 group backdrop-blur-sm">
            {/* Header với Avatar và Menu */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <Link to={`/profile/${post.author._id}`} className="relative">
                        <img
                            src={post.author.avatar || "https://via.placeholder.com/150"}
                            alt={`${post.author.firstName} ${post.author.lastName}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                    </Link>

                    <div>
                        <div className="flex flex-row">
                            <Link
                                to={`/profile/${post.author._id}`}
                                className="font-bold text-gray-800 text-base hover:text-[#FFB800] transition-colors cursor-pointer"
                            >
                                {post.author.lastName} {post.author.firstName}
                            </Link>
                        </div>

                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{formatDate(post.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {post.author._id === user._id && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-3 hover:bg-[#FFF4D6] rounded-full transition-all duration-300 hover:scale-110 text-gray-600 hover:text-[#FFB800]"
                        >
                            <FaEllipsisH />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#FFB800]/10 py-2 z-10 animate-popup">
                                <button
                                    onClick={() => {
                                        setShowEditModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-[#FFF4D6] flex items-center gap-3 text-gray-700 hover:text-[#FFB800] transition-colors group"
                                >
                                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                        <FaEdit className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Chỉnh sửa</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-[#FFF4D6] flex items-center gap-3 text-gray-700 hover:text-red-500 transition-colors group"
                                >
                                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                        <FaTrash className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Xóa bài viết</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Nội dung bài viết */}
            {post.recipe &&
                <div className="mb-1 text-base font-bold text-[#FFB800]">
                    <Link to={`/recipes/${post.recipe._id}`}>
                        @{post.recipe.name}
                    </Link>
                </div>
            }
            <div className="text-gray-800 mb-6 text-base leading-relaxed text-pretty">
                {post.caption}
            </div>

            {/* Grid ảnh */}
            {imageMedia.length > 0 && (
                <div className="mb-6">
                    <div
                        className={`grid ${getGridClass(
                            imageMedia.length
                        )} gap-2 rounded-2xl overflow-hidden max-h-[600px]`}
                        style={{ gridAutoRows: imageMedia.length === 1 ? "1fr" : "200px" }}
                    >
                        {imageMedia.slice(0, 4).map((media, index) => (
                            <Link
                                to={`/posts/${post._id}`}
                                key={media._id}
                                className={`relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black cursor-pointer group
                                ${index === 0 && imageMedia.length === 3
                                        ? "row-span-2"
                                        : ""
                                    }
                                ${imageMedia.length === 1 ? "max-h-[500px]" : ""
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 z-10 pointer-events-none" />
                                <img
                                    src={media.url}
                                    alt={`post-${index}`}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                {imageMedia.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                        <span className="text-white text-2xl font-bold">
                                            +{imageMedia.length - 4}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Nút tương tác */}
            <div className="flex items-center justify-around bg-gradient-to-r from-gray-50 to-[#FFF4D6]/40 rounded-2xl p-3 border border-[#FFB800]/10">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group ${isLiked
                        ? "bg-[#FFB800]/20 text-[#FFB800] shadow-md"
                        : "text-gray-600 hover:text-[#FFB800] hover:bg-[#FFF4D6]/50"
                        }`}
                >
                    <div
                        className={`p-2 rounded-full transition-all duration-300 ${isLiked
                            ? "bg-[#FFB800]/30 scale-110"
                            : "bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110"
                            }`}
                    >
                        <FaHeart className={`w-4 h-4 ${isLiked ? "text-[#FFB800]" : ""}`} />
                    </div>
                    <span className="font-semibold text-sm">
                        {post?.likes?.length || 0}
                    </span>
                </button>

                <button
                    onClick={() => onComment?.(post)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:text-[#FFB800] transition-all duration-300 group hover:bg-[#FFF4D6]/50"
                >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
                        <FaComment className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">
                        {post.comments?.length || 0}
                    </span>
                </button>

                <button
                    onClick={() => onShare?.(post)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:text-[#FFB800] transition-all duration-300 group hover:bg-[#FFF4D6]/50"
                >
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
                        <FaShare className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">
                        {post.shares?.length || 0}
                    </span>
                </button>

                <button
                    onClick={() => { handleBookmark() }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group ${isBookmarked
                        ? "bg-[#FFB800]/20 text-[#FFB800] shadow-md"
                        : "text-gray-600 hover:text-[#FFB800] hover:bg-[#FFF4D6]/50"
                        }`

                    }>
                    <FaBookmark className="w-4 h-4" />
                </button>
            </div>

            {/* Add Modals */}
            <EditPostModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                post={post}
                onSave={handleEdit}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};
