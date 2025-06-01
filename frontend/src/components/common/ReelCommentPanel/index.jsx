import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CommentList from '../PostDetail/CommentList';
import CommentForm from '../PostDetail/CommentForm';

const ReelCommentPanel = ({ reel, open, onClose, onAddComment, refreshKey }) => {
  useEffect(() => {
    console.log('Reel in comment panel:', reel);
  }, [reel]);

  if (!reel) return null;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out z-50 ${
        open ? 'translate-x-0' : 'translate-x-full'
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
          <Link to={`/profile/${reel.user._id}`} className="relative group">
            {reel.user?.avatar ? (
              <img 
                src={reel.user.avatar} 
                alt={reel.user.name}
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
              to={`/profile/${reel.user._id}`}
              className="font-bold text-gray-800 text-lg hover:text-[#FFB800] transition-colors"
            >
              {reel.user.name}
            </Link>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{reel.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-[#FFB800]">Tác giả</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-gray-800 font-medium leading-relaxed">{reel.title}</div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        <CommentList reel={reel} key={refreshKey} />
      </div>

      {/* Comment Form */}
      <div className="border-t border-[#FFB800]/20 bg-gradient-to-r from-[#FFF4D6]/20 to-white">
        <CommentForm onSubmit={onAddComment} />
      </div>
    </div>
  );
};

export default ReelCommentPanel; 