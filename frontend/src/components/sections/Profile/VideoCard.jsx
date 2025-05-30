import React, { useState } from 'react';

export default function VideoCard({ video, index }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Khởi tạo dữ liệu mặc định đầy đủ
  const defaultVideo = {
    id: index,
    title: `Video hướng dẫn nấu ăn ${index}`,
    description: "Hướng dẫn chi tiết cách làm món ngon...",
    thumbnail: `/images/video-${index}.jpg`,
    duration: "5:24",
    youtubeId: "dQw4w9WgXcQ",
    channel: {
      name: "Cooking Master",
      avatar: "/images/avatars/chef-avatar.jpg",
      verified: true
    },
    stats: {
      views: "125K",
      uploadedAt: "2 tuần trước"
    }
  };
  
  // Hợp nhất dữ liệu mặc định với dữ liệu thực tế đảm bảo không bị lỗi
  const videoData = typeof video === 'object' 
    ? {
        ...defaultVideo,
        ...video,
        channel: {
          ...defaultVideo.channel,
          ...(video?.channel || {})
        },
        stats: {
          ...defaultVideo.stats,
          ...(video?.stats || {})
        }
      } 
    : defaultVideo;
  
  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div 
      className="max-w-[360px] bg-white rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
      style={{
        boxShadow: isHovered ? "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" : "0 4px 6px -1px rgba(0,0,0,0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail section */}
      <div className="relative group">
        {!isPlaying ? (
          <>
            <img
              src={videoData.thumbnail || 'https://placehold.co/360x200/png'}
              alt={videoData.title}
              className="w-full aspect-video object-cover"
              style={{
                borderRadius: "16px 16px 0 0"
              }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gradient-to-t from-black/30 to-transparent transition-all"
              onClick={handlePlayClick}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <svg className="w-6 h-6 text-white fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                {videoData.duration}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoData.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1`}
              title={videoData.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                borderRadius: "16px 16px 0 0"
              }}
            ></iframe>
          </div>
        )}
      </div>
      
      {/* Video info section */}
      <div className="flex p-4">
        {/* Channel avatar */}
        <div className="w-10 h-10 mr-3 flex-shrink-0">
          <img 
            src={videoData.channel?.avatar || 'https://placehold.co/100/gray/white?text=U'} 
            alt={videoData.channel?.name || 'Channel'}
            className="w-full h-full rounded-full object-cover ring-2 ring-offset-2 ring-gray-100"
            style={{
              boxShadow: "0 0 0 2px rgba(255,255,255,0.2)"
            }}
            onError={(e) => { e.target.src = 'https://placehold.co/100/gray/white?text=U' }}
          />
        </div>
        
        {/* Video details */}
        <div className="flex-1">
          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2 mb-1 text-gray-800">
            {videoData.title}
          </h3>
          
          {/* Channel name and verification */}
          <div className="flex items-center text-gray-600 text-sm">
            <span className="font-medium text-emerald-600">{videoData.channel?.name || 'Unknown Channel'}</span>
            {videoData.channel?.verified && (
              <svg className="w-4 h-4 ml-1 text-emerald-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>
          
          {/* View count and upload date */}
          <div className="text-xs text-gray-500 mt-1.5 flex items-center">
            <span className="bg-gray-100 rounded-full px-2 py-0.5 font-medium">{videoData.stats?.views || '0'} lượt xem</span>
            <span className="mx-1.5">•</span>
            <span className="italic">{videoData.stats?.uploadedAt || 'mới đây'}</span>
          </div>
        </div>
        
        {/* Options menu button */}
        <div className="ml-1 self-start">
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}