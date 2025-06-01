import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import { FaSmile, FaImage, FaGift } from 'react-icons/fa';

const CommentForm = ({ onSubmit, isReply }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useAuth()
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className={`${isReply ? 'py-2' : 'p-4'} transition-all duration-300`}>
      <div className={`flex gap-3 items-center`}>
        <img
          src={user.avatar}
          alt="Your avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-[#FFB800] shadow-lg"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isReply ? 'Viết trả lời...' : 'Viết bình luận...'}
            className={`w-full px-4 py-2.5 rounded-2xl bg-gray-100 border-2 transition-all duration-300 text-gray-700 placeholder-gray-400
              ${isFocused ? 'border-[#FFB800] ring-2 ring-[#FFB800]/20 bg-white' : 'border-transparent hover:bg-gray-200'}
              ${isReply ? 'text-sm' : 'text-base'}`}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-[#FFB800] transition-colors rounded-full hover:bg-[#FFF4D6]"
            >
              <FaSmile className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!text.trim()}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
            ${text.trim()
              ? 'bg-[#FFB800] text-white hover:bg-[#e6a600] shadow-lg shadow-[#FFB800]/20'
              : 'bg-gray-100 text-gray-400'}
            ${isReply ? 'text-sm px-4 py-2' : ''}`}
        >
          Gửi
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 