import { formatRelativeTime } from '@/pages/MessagePage';
import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaHeart, FaComment, FaShare, FaBookmark, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ReelCard = ({ reel, onLike, onComment, onShare }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

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

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-6">
        {/* Video container */}
        <div className="relative h-[calc(100vh-120px)] aspect-[9/16] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 pointer-events-none" />

          <video
            ref={videoRef}
            src={reel.video}
            className="w-full h-full object-cover cursor-pointer"
            loop
            muted={isMuted}
            playsInline
            onClick={handleVideoClick}
          />

          {/* Volume control */}
          <button 
            onClick={toggleMute}
            className="absolute top-6 right-6 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            {isMuted ? (
              <FaVolumeMute className="w-6 h-6 text-white" />
            ) : (
              <FaVolumeUp className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Bottom info */}
          <div className="absolute left-0 right-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent z-20">
            <Link to={`/profile/${reel._id}`} className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img
                  src={reel.user.avatar || 'https://via.placeholder.com/40'}
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
            </Link>
            <div className="text-white text-sm font-medium mb-2 line-clamp-2">{reel.title}</div>
            {reel.recipe && (
              <Link 
                to={`/recipes/${reel.recipe._id}`}
                className="inline-block px-4 py-2 bg-[#FFB800] rounded-full text-sm font-medium text-white hover:bg-[#FFA000] transition-colors"
              >
                Xem công thức
              </Link>
            )}
          </div>
        </div>

        {/* Interaction buttons */}
        <div className="flex flex-col items-center gap-8 py-8 self-center">
          <button onClick={onLike} className="group">
            <div className={`p-4 rounded-full transition-all duration-300 ${
              reel.liked
                ? 'bg-[#FFB800]/20 scale-110'
                : 'bg-gray-100 group-hover:bg-[#FFF4D6] group-hover:scale-110'
              }`}>
              <FaHeart className={`w-6 h-6 ${reel.liked ? 'text-[#FFB800]' : 'text-gray-600 group-hover:text-[#FFB800]'}`} />
            </div>
            <span className="block text-center mt-2 font-medium text-gray-600">{reel.likes?.toLocaleString()}</span>
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
            <span className="block text-center mt-2 font-medium text-gray-600">{reel.shares?.toLocaleString()}</span>
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

export const ReelCardReview = ({reel}) => {
  const navigate = useNavigate()
  return (
    <div
      key={reel._id} // Assuming API returns _id
      className="relative group cursor-pointer"
      onClick={() => navigate(`/explore/reels/${reel._id}`)} // Assuming this route exists
    >
      <div className="aspect-[9/16] relative overflow-hidden rounded-xl">
        <img
          src={reel.videoUri.replace('mp4', 'jpg')} // API might use thumbnailUrl
          alt={reel.caption || 'Video Title'}
          className="w-full h-full object-cover"
        />
        {reel.videoUri && ( // API might use videoUrl
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-  opacity duration-300"
            src={reel.videoUri}
            loop
            muted
            autoPlay
            playsInline
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
          />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {reel.author && ( // Check if author info exists
              <div className="flex items-center space-x-2 mb-2">
                <img
                  src={reel.author.avatar || 'https://via.placeholder.com/32'}
                  alt={reel.author.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{reel.author.lastName + " " + reel.author.firstName || 'Tác giả'}</span>
              </div>
            )}
            <p className="text-sm line-clamp-2">{reel.caption || 'Không có tiêu đề'}</p>
            <div className="flex items-center space-x-3 mt-2 text-sm justify-between">
              <span className="flex items-center">
                <FaHeart className="mr-1" /> {reel.likes.length || 0}
              </span>
              <span>
                {formatRelativeTime(reel.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReelCard; 