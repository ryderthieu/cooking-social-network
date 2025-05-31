import React, { useEffect, useState } from 'react';
import CommentItem from './CommentItem';
import { FaSortAmountDown } from 'react-icons/fa';

const CommentList = ({ postId, comments }) => {
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular'

  useEffect(() => {
    console.log('list',comments)
  }, [])
  const getSortedComments = () => {
    switch (sortBy) {
      case 'oldest':
        return [...comments].sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'popular':
        return [...comments].sort((a, b) => b.likes - a.likes);
      default: // newest
        return [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header with sort options */}
      <div className="px-6 py-4 border-b border-[#FFB800]/10 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between">
          <div className="text-gray-800 font-semibold">
            {comments.length} bình luận
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 hover:text-[#FFB800] hover:bg-[#FFF4D6] transition-all duration-300">
              <FaSortAmountDown className="w-4 h-4" />
              <span className="text-sm font-medium">Sắp xếp theo</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-[#FFB800]/10 py-1 hidden group-hover:block animate-popup">
              <button 
                onClick={() => setSortBy('newest')}
                className={`w-full px-4 py-2 text-left hover:bg-[#FFF4D6] transition-colors text-sm ${
                  sortBy === 'newest' ? 'text-[#FFB800]' : 'text-gray-700'
                }`}
              >
                Mới nhất
              </button>
              <button 
                onClick={() => setSortBy('oldest')}
                className={`w-full px-4 py-2 text-left hover:bg-[#FFF4D6] transition-colors text-sm ${
                  sortBy === 'oldest' ? 'text-[#FFB800]' : 'text-gray-700'
                }`}
              >
                Cũ nhất
              </button>
              <button 
                onClick={() => setSortBy('popular')}
                className={`w-full px-4 py-2 text-left hover:bg-[#FFF4D6] transition-colors text-sm ${
                  sortBy === 'popular' ? 'text-[#FFB800]' : 'text-gray-700'
                }`}
              >
                Phổ biến nhất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="px-6 py-4 space-y-6">
        {getSortedComments().map(comment => (
          <CommentItem key={comment._id} comment={comment}/>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💭</span>
          </div>
          <p className="text-sm">Chưa có bình luận nào</p>
        </div>
      )}
    </div>
  );
};

export default CommentList; 