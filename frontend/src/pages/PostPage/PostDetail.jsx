import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTimes, FaHeart, FaComment, FaShare, FaBookmark, FaEllipsisH, FaEdit, FaTrash } from 'react-icons/fa';
import CommentList from '../../components/common/PostDetail/CommentList';
import CommentForm from '../../components/common/PostDetail/CommentForm';
import postsService, { getPostById, editPost, deletePost } from '@/services/postService';
import { formatDate } from '@/components/common/Post';
import { useAuth } from '@/context/AuthContext';
import { createComment } from '@/services/commentService';
import SharePopup from '../../components/common/SharePopup';
import { useSocket } from '@/context/SocketContext';
import { deleteSavedPost, savePost } from '@/services/userService';
import EditPostModal from '@/components/common/PostModals/EditPostModal';
import DeleteConfirmModal from '@/components/common/PostModals/DeleteConfirmModal';
import { useCloudinary } from '@/context/CloudinaryContext';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [commentRefresh, setCommentRefresh] = useState(0); // Add this to trigger comment refresh
  const [isBookmarked, setIsBookmarked] = useState(false)
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null, postTitle: null });
  const { sendNotification } = useSocket();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { uploadImage } = useCloudinary();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postsService.fetchById(id);
        setPost(response.data);
        setIsLiked(response.data.likes?.includes(user._id));
        setIsBookmarked(
          user.savedPost.some((id) => id && id.toString() === response.data._id)
        );
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, user._id]);

  if (loading) return (
    <div className="h-[100vh] bg-gradient-to-br from-[#FFF4D6] via-white to-[#FFF4D6] py-6 px-2 lg:px-8 flex justify-center items-center">
      <div className="text-2xl text-gray-600">Đang tải...</div>
    </div>
  );

  if (error) return (
    <div className="h-[100vh] bg-gradient-to-br from-[#FFF4D6] via-white to-[#FFF4D6] py-6 px-2 lg:px-8 flex justify-center items-center">
      <div className="text-xl text-red-600">{error}</div>
    </div>
  );

  if (!post) return (
    <div className="h-[100vh] bg-gradient-to-br from-[#FFF4D6] via-white to-[#FFF4D6] py-6 px-2 lg:px-8 flex justify-center items-center">
      <div className="text-xl text-gray-600">Không tìm thấy bài viết</div>
    </div>
  );

  const imageMedia = post.media?.filter(m => m.type === "image") || [];
  const hasMultipleImages = imageMedia.length > 1;

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? imageMedia.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === imageMedia.length - 1 ? 0 : prev + 1));
  };
  const handleBookmark = async () => {
    try {
      console.log(post._id)
      if (isBookmarked) {
        await deleteSavedPost({postId: post._id})
      }
      else {
        await savePost({postId: post._id})
      }
      setIsBookmarked(prev => !prev)

    }
    catch (error) {
      console.log(error)
    }
  }
  const handleLike = async () => {
    try {
      await postsService.toggleLike(post._id);
      const updatedPost = await postsService.fetchById(post._id);
      setPost(updatedPost.data);
      const isLiking = !isLiked;
      setIsLiked(!isLiked);

      if (isLiking && post.author._id !== user._id) {
        sendNotification({
          receiverId: post.author._id,
          type: 'like',
          postId: post._id,
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = () => {
    setSharePopup({ open: true, postId: post._id, postTitle: post.content });

    if (post.author._id !== user._id) {
      sendNotification({
        receiverId: post.author._id,
        type: 'share',
        postId: post._id,
      });
    }
  };

  const handleAddComment = async (content) => {
    try {
      await createComment({ targetId: post._id, targetType: 'post', text: content });

      // Refresh post data to get updated comment count
      const updatedPost = await postsService.fetchById(id);
      setPost(updatedPost.data);

      // Trigger comment list refresh
      setCommentRefresh(prev => prev + 1);

      if (post.author._id !== user._id) {
        sendNotification({
          receiverId: post.author._id,
          type: 'comment',
          postId: post._id,
          message: `${user.firstName} đã bình luận: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
        });
      }

    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
      console.log(postData)
      // Call API to update post
      await editPost(post._id, postData);

      // Fetch updated post
      const updatedPost = await postsService.fetchById(id);
      setPost(updatedPost.data);
      setShowEditModal(false);
      toast.success('Đã cập nhật bài viết thành công!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bài viết');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      toast.success('Đã xóa bài viết thành công!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa bài viết');
    }
  };

  return (
    <div className="h-[100vh] bg-gradient-to-br from-[#FFF4D6] via-white to-[#FFF4D6] py-6 px-2 lg:px-8 flex justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-7xl flex overflow-hidden border border-[#FFB800]/20 relative backdrop-blur-sm">

        {/* Enhanced Close Button */}
        <button
          onClick={() => navigate(-1)}
          className='absolute top-4 left-4 z-20 p-3 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90'
        >
          <FaTimes size={18} />
        </button>

        {/* More Options Button */}
        {post.author._id === user._id && (
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-3 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full transition-all duration-300 hover:scale-110"
            >
              <FaEllipsisH size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#FFB800]/10 py-2 animate-popup">
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

        {/* Left Column - Image/Video (70%) */}
        <div className="w-[70%] relative bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-[80vh] flex items-center justify-center overflow-hidden">
          {imageMedia.length > 0 ? (
            <div className="relative w-full h-full">
              {/* Gradient Overlay cho ảnh */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 z-10 pointer-events-none" />

              <img
                src={imageMedia[currentImageIndex].url}
                alt={`post-${currentImageIndex}`}
                className="w-full h-full object-contain cursor-zoom-in transition-transform duration-700 ease-out"
                onClick={() => setShowFullImage(true)}
                style={{ imageRendering: 'crisp-edges' }}
              />

              {/* Thêm hiệu ứng vignette */}
              <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-black/60 transition-all duration-300 hover:scale-110 shadow-lg border border-white/10 group z-20"
                  >
                    <FaChevronLeft className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-black/60 transition-all duration-300 hover:scale-110 shadow-lg border border-white/10 group z-20"
                  >
                    <FaChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Cải thiện Image Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-black/30 backdrop-blur-md rounded-full px-5 py-3 z-20 border border-white/10">
                    {imageMedia.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 transform ${index === currentImageIndex
                          ? 'bg-white scale-125'
                          : 'bg-white/40 hover:bg-white/60'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Thêm số thứ tự ảnh */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 text-white/90 text-sm font-medium border border-white/10 z-20">
                {currentImageIndex + 1} / {imageMedia.length}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/70">
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <span className="text-4xl">📷</span>
                </div>
                <p className="text-lg font-light tracking-wide">Không có ảnh</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Info and Comments (30%) */}
        <div className="w-[30%] flex flex-col bg-gradient-to-b from-white via-[#FFF4D6]/10 to-[#FFF4D6]/30">

          {/* Enhanced Header with User Info */}
          <div className="p-6 border-b border-[#FFB800]/20 bg-gradient-to-r from-white to-[#FFF4D6]/30">
            <div className="flex items-center gap-4 mb-4">
              {post.author && (
                <>
                  <Link to={`/profile/${post.author._id}`} className="relative">
                    <img
                      src={post.author.avatar || "https://via.placeholder.com/150"}
                      alt={`${post.author.lastName} ${post.author.firstName}`}
                      className="w-14 h-14 rounded-full object-cover border-3 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/profile/${post.author._id}`} className="font-bold text-gray-800 text-lg hover:text-[#FFB800] transition-colors cursor-pointer">
                      {post.author.lastName} {post.author.firstName}
                    </Link>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Enhanced Post Content */}
            {post.recipe &&
              <div className="mb-1 text-base font-bold text-[#FFB800]">
                <Link to={`/recipes/${post.recipe._id}`}>
                  @{post.recipe.name}
                </Link>
              </div>
            }
            <div className="text-gray-800 leading-relaxed mb-6 text-base text-pretty max-h-[130px] overflow-scroll scrollbar-none">
              {post.caption}
            </div>

            {/* Enhanced Interaction Buttons */}
            <div className="flex items-center justify-around bg-gradient-to-r from-gray-50 to-[#FFF4D6]/40 rounded-2xl p-3 border border-[#FFB800]/10">
              <button
                onClick={handleLike}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group ${isLiked
                  ? 'bg-[#FFB800]/20 text-[#FFB800] shadow-md'
                  : 'text-gray-600 hover:text-[#FFB800] hover:bg-[#FFF4D6]/50'
                  }`}
              >
                <div className={`p-2 rounded-full transition-all duration-300 ${isLiked
                  ? 'bg-[#FFB800]/30 scale-110'
                  : 'bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110'
                  }`}>
                  <FaHeart className={`w-4 h-4 ${isLiked ? 'text-[#FFB800]' : ''}`} />
                </div>
                <span className="font-semibold text-sm">{post.likes?.length || 0}</span>
              </button>

              <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:text-[#FFB800] transition-all duration-300 group hover:bg-[#FFF4D6]/50">
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
                  <FaComment className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">{post.comments?.length || 0}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:text-[#FFB800] transition-all duration-300 group hover:bg-[#FFF4D6]/50"
              >
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
                  <FaShare className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">{post.shares?.length || 0}</span>
              </button>

              <button onClick={handleBookmark} className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group ${isBookmarked
                ? 'bg-[#FFB800]/20 text-[#FFB800] shadow-md'
                : 'text-gray-600 hover:text-[#FFB800] hover:bg-[#FFF4D6]/50'
                }`}>
                <div className={`p-2 rounded-full transition-all duration-300 ${isBookmarked
                  ? 'bg-[#FFB800]/30 scale-110'
                  : 'bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110'
                  }`}>
                  <FaBookmark className="w-4 h-4" />

                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Comments List */}
          <div className="flex-1 overflow-y-auto">
            <CommentList post={post} key={commentRefresh} />
          </div>

          {/* Enhanced Comment Form */}
          <div className="border-t border-[#FFB800]/20 bg-gradient-to-r from-[#FFF4D6]/20 to-white">
            <CommentForm onSubmit={handleAddComment} />
          </div>
        </div>
      </div>

      {/* Cải thiện Full Screen Image Modal */}
      {showFullImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />

          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white/90 rounded-full transition-all duration-300 hover:scale-110 border border-white/10 z-20 group"
          >
            <FaTimes size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={imageMedia[currentImageIndex].url}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-700"
              style={{ imageRendering: 'crisp-edges' }}
            />

            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-black/60 transition-all duration-300 hover:scale-110 border border-white/10 group"
                >
                  <FaChevronLeft className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center hover:bg-black/60 transition-all duration-300 hover:scale-110 border border-white/10 group"
                >
                  <FaChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {hasMultipleImages && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 bg-black/30 backdrop-blur-md rounded-full px-5 py-3 border border-white/10">
              {imageMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/40 hover:bg-white/60'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add SharePopup component at the end of the component, before the closing div */}
      <SharePopup
        open={sharePopup.open}
        postId={sharePopup.postId}
        postTitle={sharePopup.postTitle}
        onClose={() => setSharePopup({ open: false, postId: null, postTitle: null })}
      />

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

export default PostDetail;