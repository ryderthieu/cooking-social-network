import React, { useState } from 'react';
import { FaHeart, FaEllipsisH } from 'react-icons/fa';

const ReplyItem = ({ reply }) => {
  const [liked, setLiked] = useState(reply.liked || false);
  const [likes, setLikes] = useState(reply.likes || 0);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = () => {
    setLiked(l => !l);
    setLikes(l => liked ? l - 1 : l + 1);
  };

  return (
    <div className="flex items-start gap-3 group">
      <div className="relative">
        <img 
          src={reply.userId?.avatar} 
          className="w-8 h-8 rounded-full object-cover border-2 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FFB800] rounded-full border-2 border-white shadow-sm"></div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-800 hover:text-[#FFB800] transition-colors cursor-pointer text-sm">
            {reply.userId?.lastName} {reply.userId?.firstName}
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 hover:bg-[#FFF4D6] rounded-full transition-all duration-300 text-gray-400 hover:text-[#FFB800]"
            >
              <FaEllipsisH className="w-3.5 h-3.5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-[#FFB800]/10 py-1 z-10 animate-popup">
                <button className="w-full px-4 py-2 text-left hover:bg-[#FFF4D6] text-gray-700 hover:text-[#FFB800] transition-colors text-sm">
                  Chỉnh sửa
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-[#FFF4D6] text-gray-700 hover:text-[#FFB800] transition-colors text-sm">
                  Xóa
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-[#FFF4D6] text-gray-700 hover:text-[#FFB800] transition-colors text-sm">
                  Báo cáo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl px-4 py-2 text-gray-800 text-sm mt-1 group-hover:bg-[#FFF4D6]/50 transition-colors">
          {reply.text}
        </div>

        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
          <button 
            onClick={handleLike} 
            className={`flex items-center gap-2 transition-all duration-300 ${
              liked ? 'text-[#FFB800]' : 'hover:text-[#FFB800]'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-300 ${
              liked 
                ? 'bg-[#FFB800]/20' 
                : 'hover:bg-[#FFF4D6]'
            }`}>
              <FaHeart className="w-3 h-3" />
            </div>
            <span className="font-medium text-xs">{likes}</span>
          </button>

          <span className="text-gray-400 text-xs">• {reply.time || '2 giờ trước'}</span>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem; 