import React, { useState, useRef } from 'react';
import { FaPlay, FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa';

const ReelCard = ({ reel, onLike, onComment, onShare }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(reel?.liked || false);
  const videoRef = useRef(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-6">
        {/* Video container */}
        <div className="relative h-[calc(100vh-120px)] aspect-[9/16] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 pointer-events-none" /> */}

          {/* <video
            ref={videoRef}
            src={reel.video}
            className="w-full h-full object-cover cursor-pointer"
            loop
            muted
            onClick={handleVideoClick}
          /> */}
<iframe width="342" height="607" src="https://www.youtube.com/embed/7FQXsBzgYN8" title="Mâm cơm gia đình siêu bắt cơm #shorts" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          {/* Bottom info */}
          {/* <div className="absolute left-0 right-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent z-20">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img
                  src={reel.user.avatar}
                  alt={reel.user.name}
                  className="w-11 h-11 rounded-full border-2 border-[#FFB800] shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm hover:text-[#FFB800] transition-colors cursor-pointer">
                  {reel.user.name}
                </div>
                <div className="text-sm text-gray-300 flex items-center gap-2">
                  <span>{reel.date}</span>
                </div>
              </div>
            </div>
            <div className="text-white text-sm font-medium mb-2 line-clamp-2">{reel.title}</div>
          </div> */}
        </div>

        {/* Interaction buttons */}
        <div className="flex flex-col items-center gap-8 py-8 self-center">
          <button onClick={handleLike} className="group">
            <div className={`p-4 rounded-full transition-all duration-300 ${isLiked
                ? 'bg-[#FFB800]/20 scale-110'
                : 'bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110'
              }`}>
              <FaHeart className={`w-6 h-6 ${isLiked ? 'text-[#FFB800]' : 'text-gray-600 group-hover:text-[#FFB800]'}`} />
            </div>
            <span className="block text-center mt-2 font-medium text-gray-600">{reel.likes.toLocaleString()}</span>
          </button>

          <button onClick={onComment} className="group">
            <div className="p-4 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
              <FaComment className="w-6 h-6 text-gray-600 group-hover:text-[#FFB800]" />
            </div>
            <span className="block text-center mt-2 font-medium text-gray-600">
              {(Array.isArray(reel.comments) ? reel.comments.length : 0).toLocaleString()}
            </span>
          </button>

          <button onClick={onShare} className="group">
            <div className="p-4 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
              <FaShare className="w-6 h-6 text-gray-600 group-hover:text-[#FFB800]" />
            </div>
            <span className="block text-center mt-2 font-medium text-gray-600">{reel.shares.toLocaleString()}</span>
          </button>

          <button className="group">
            <div className="p-4 rounded-full bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110 transition-all duration-300">
              <FaBookmark className="w-6 h-6 text-gray-600 group-hover:text-[#FFB800]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReelCard; 