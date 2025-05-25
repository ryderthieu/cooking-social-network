import React, { useState } from 'react';
import { FaHeart, FaReply, FaEllipsisH } from 'react-icons/fa';
import ReplyList from './ReplyList';
import CommentForm from './CommentForm';

const CommentItem = ({ comment }) => {
  const [liked, setLiked] = useState(comment.liked || false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [replying, setReplying] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = () => {
    setLiked(l => !l);
    setLikes(l => liked ? l - 1 : l + 1);
  };

  const handleReply = (text) => {
    setReplies(r => [
      ...r,
      {
        id: Date.now(),
        user: 'Bạn',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        text,
        likes: 0,
        liked: false,
        time: 'Vừa xong'
      }
    ]);
    setReplying(false);
  };

  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-start gap-3">
        <div className="relative">
          <img 
            src={comment.avatar} 
            className="w-10 h-10 rounded-full object-cover border-2 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FFB800] rounded-full border-2 border-white shadow-sm"></div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-800 hover:text-[#FFB800] transition-colors cursor-pointer">
              {comment.user}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-[#FFF4D6] rounded-full transition-all duration-300 text-gray-400 hover:text-[#FFB800]"
              >
                <FaEllipsisH className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-[#FFB800]/10 py-1 z-10 animate-popup">
                  <button className="w-full px-4 py-2 text-left hover:bg-[#FFF4D6] text-gray-700 hover:text-[#FFB800] transition-colors text-sm">
                    Chỉnh sửa bình luận
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-[#FFF4D6] text-gray-700 hover:text-[#FFB800] transition-colors text-sm">
                    Xóa bình luận
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-[#FFF4D6] text-gray-700 hover:text-[#FFB800] transition-colors text-sm">
                    Báo cáo bình luận
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl px-4 py-2.5 text-gray-800 mt-1 group-hover:bg-[#FFF4D6]/50 transition-colors">
            {comment.text}
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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
                <FaHeart className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">{likes}</span>
            </button>

            <button 
              onClick={() => setReplying(r => !r)} 
              className="flex items-center gap-2 hover:text-[#FFB800] transition-colors"
            >
              <div className="p-1.5 rounded-full hover:bg-[#FFF4D6] transition-all duration-300">
                <FaReply className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Trả lời</span>
            </button>

            <span className="text-gray-400">• {comment.time || '2 giờ trước'}</span>
          </div>
        </div>
      </div>

      {/* Form trả lời */}
      {replying && (
        <div className="ml-12">
          <CommentForm onSubmit={handleReply} isReply />
        </div>
      )}

      {/* Danh sách trả lời */}
      {replies.length > 0 && <ReplyList replies={replies} />}
    </div>
  );
};

export default CommentItem; 