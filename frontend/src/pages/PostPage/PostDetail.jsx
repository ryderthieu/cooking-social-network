import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTimes, FaHeart, FaComment, FaShare, FaBookmark, FaEllipsisH } from 'react-icons/fa';
import CommentList from '../../components/common/PostDetail/CommentList';
import CommentForm from '../../components/common/PostDetail/CommentForm';
import { mockPosts } from './index';

const PostDetail = () => {
  const { id } = useParams();
  const post = mockPosts.find(p => p.id === Number(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(post?.liked || false);
  const [showFullImage, setShowFullImage] = useState(false);
  const navigate = useNavigate();
  
  if (!post) return <div className="text-center py-20 text-xl">Không tìm thấy bài viết</div>;

  const images = post.images || [];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };
  
  const handleShare = () => {};
  const handleAddComment = () => {};

  const getGridClass = (length) => {
    switch (length) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-2";
      case 4: return "grid-cols-2";
      default: return "grid-cols-2";
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
        <button className='absolute top-4 right-4 z-20 p-3 bg-black/30 backdrop-blur-md hover:bg-black/50 text-white rounded-full transition-all duration-300 hover:scale-110'>
          <FaEllipsisH size={18} />
        </button>
        
        {/* Left Column - Image/Video (70%) */}
        <div className="w-[70%] relative bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-[80vh] flex items-center justify-center overflow-hidden">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              {/* Gradient Overlay cho ảnh */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 z-10 pointer-events-none" />
              
              <img
                src={images[currentImageIndex]}
                alt="post"
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
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 transform ${
                          index === currentImageIndex 
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
                {currentImageIndex + 1} / {images.length}
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
        <div className="w-[30%] flex flex-col bg-gradient-to-b from-white via-[#FFF4D6]/10 to-[#FFF4D6]/30 ">
          
          {/* Enhanced Header with User Info */}
          <div className="p-6 border-b border-[#FFB800]/20 bg-gradient-to-r from-white to-[#FFF4D6]/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-14 h-14 rounded-full object-cover border-3 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-lg hover:text-[#FFB800] transition-colors cursor-pointer">
                  {post.user.name}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>{post.date}</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Post Content */}
            <div className="text-gray-800 leading-relaxed mb-6 text-base">
              {post.content}
            </div>
            
            {/* Enhanced Interaction Buttons */}
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
              
              <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:text-[#FFB800] transition-all duration-300 group hover:bg-[#FFF4D6]/50">
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
                  <FaComment className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">{post.comments.length}</span>
              </button>
              
              <button
                onClick={handleShare}
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
          
          {/* Enhanced Comments List */}
          <div className="flex-1 overflow-y-auto">
            <CommentList postId={post.id} comments={post.comments} />
          </div>
          
          {/* Enhanced Comment Form */}
          <div className="border-t border-[#FFB800]/20 bg-gradient-to-r from-[#FFF4D6]/20 to-white">
            <CommentForm onSubmit={text => handleAddComment(post.id, text)} />
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
              src={images[currentImageIndex]}
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
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetail;