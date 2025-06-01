import React, { useState } from 'react';
import ReplyItem from './ReplyItem';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ReplyList = ({ replies }) => {
  const [showAll, setShowAll] = useState(false);
  const displayReplies = showAll ? replies : replies.slice(0, 2);
  const hasMoreReplies = replies.length > 2;

  return (
    <div className="ml-12 mt-3">
      <div className="relative pl-6 border-l-2 border-[#FFB800]/10">
        {/* Hiệu ứng gradient cho border */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FFB800]/20 via-[#FFB800]/10 to-transparent"></div>

        <div className="space-y-4">
          {displayReplies.map(reply => (
            <ReplyItem key={reply._id} reply={reply} />
          ))}
        </div>

        {hasMoreReplies && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-[#FFB800] transition-colors group"
          >
            {showAll ? (
              <>
                <FaChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
                <span>Ẩn bớt trả lời</span>
              </>
            ) : (
              <>
                <FaChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                <span>Xem thêm {replies.length - 2} trả lời</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReplyList; 