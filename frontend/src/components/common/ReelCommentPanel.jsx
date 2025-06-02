import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaHeart, FaReply } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '@/utils/timeUtils';
import CommentList from './PostDetail/CommentList';
import CommentForm from './PostDetail/CommentForm';
import { formatRelativeTime } from '@/pages/MessagePage';

const ReelCommentPanel = ({ reel, open, onClose, onAddComment, comments }) => {
  const [commentRefresh, setCommentRefresh] = useState(0);
  
  const handleComment = async (content) => {
    setCommentRefresh(prev => prev + 1)
    await onAddComment(content)
  }

  if (!reel) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-50 ${open ? 'translate-x-0' : 'translate-x-full'
        }`}
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-[#FFB800]/10 bg-gradient-to-r from-[#FFF4D6]/30 to-white backdrop-blur-sm">
        <button
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#FFB800] hover:scale-110 transition-all duration-300"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <div className="flex items-center gap-4">
          <Link to={`/profile/${reel._id}`} className="relative group">
            {reel.author.avatar ? (
              <img
                src={reel.author.avatar}
                alt={reel.author.lastName}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#FFB800] shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-[#FFB800] group-hover:scale-105 transition-transform duration-300">
                <FaUser className="text-gray-400" size={28} />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFB800] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FaUser className="text-white" size={12} />
            </div>
          </Link>
          <div>
            <Link
              to={`/profile/${reel._id}`}
              className="font-bold text-gray-800 text-lg hover:text-[#FFB800] transition-colors"
            >
              {reel.author.lastName + ' ' + reel.author.firstName}
            </Link>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{formatRelativeTime(reel.createdAt)}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-[#FFB800]">Tác giả</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-gray-800 font-medium leading-relaxed">{reel.caption}</div>
        {reel.recipe && (
          <Link
            to={`/recipes/${reel.recipe._id}`}
            className="inline-block bg- rounded-full text-sm font-medium text-[#FFB800] transition-colors"
          >
            @{reel.recipe.name || 'Công thức'}
          </Link>
        )}
      </div>

      {/* Comments List */}
      <CommentList reel={reel} key = {commentRefresh}/>

      {/* Comment Form */}
      <CommentForm onSubmit={handleComment} />
    </div>
  );
};

export default ReelCommentPanel; 