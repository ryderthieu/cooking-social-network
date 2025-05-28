import React from 'react';

export default function VideoCard({ video, index }) {
  // Nếu video là một số (index) thay vì object, dùng dữ liệu mẫu
  const videoData = typeof video === 'object' 
    ? video 
    : {
        id: index,
        title: `Video hướng dẫn ${index}`,
        description: "Hướng dẫn chi tiết cách làm...",
        thumbnail: `/images/video-${index}.jpg`,
        duration: "5:24"
      };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={videoData.thumbnail}
          alt={videoData.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-amber-600 text-xl">▶️</span>
          </div>
        </div>
        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
          {videoData.duration}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          {videoData.title}
        </h4>
        <p className="text-sm text-gray-600">
          {videoData.description}
        </p>
      </div>
    </div>
  );
}