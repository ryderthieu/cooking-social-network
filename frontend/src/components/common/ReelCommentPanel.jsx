import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import CommentList from './PostDetail/CommentList';
import CommentForm from './PostDetail/CommentForm';

const ReelCommentPanel = ({ reel, open, onClose, onAddComment }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (reel && Array.isArray(reel.comments)) {
      setComments(reel.comments);
    } else if (reel) {
      setComments([]);
    }
  }, [reel]);

  const handleAddComment = (text) => {
    const newComment = {
      id: Date.now(),
      user: 'Bạn',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      text,
      likes: 0,
      time: 'Vừa xong',
      replies: []
    };
    setComments(prev => [newComment, ...prev]);
    onAddComment?.(text);
  };

  if (!reel) return null;

  return (
    <div
      className={`fixed bottom-0 right-0 h-[calc(100vh-80px)] z-1 w-[400px] bg-white shadow-2xl flex flex-col transition-all duration-500 ease-out ${
        open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="p-6 pb-4 border-b border-[#FFB800]/10 bg-gradient-to-r from-[#FFF4D6]/20 to-white">
        <button 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#FFB800] hover:scale-110 transition-all duration-300" 
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={reel.user.avatar} 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-base hover:text-[#FFB800] transition-colors cursor-pointer">
              {reel.user.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{reel.date}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-gray-800 font-medium">{reel.title}</div>
      </div>

      {/* Comment List */}
      <CommentList comments={comments || []} />

      {/* Comment Form */}
      <div className="p-4 border-t border-[#FFB800]/10 bg-gradient-to-r from-[#FFF4D6]/20 to-white">
        <CommentForm onSubmit={handleAddComment} />
      </div>
    </div>
  );
};

export default ReelCommentPanel; 