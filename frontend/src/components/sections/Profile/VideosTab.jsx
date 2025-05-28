import React from 'react';
import VideoCard from './VideoCard';

export default function VideosTab() {
  // Dữ liệu mẫu cho videos
  const videos = [
    {
      id: 1,
      title: "Cách làm bánh mì Việt Nam",
      description: "Hướng dẫn chi tiết cách làm bánh mì giòn ngon đúng vị Việt Nam",
      thumbnail: "/images/video-1.jpg",
      duration: "6:24"
    },
    {
      id: 2,
      title: "Phở bò Hà Nội truyền thống",
      description: "Bí quyết nấu phở bò với nước dùng trong và thơm ngon",
      thumbnail: "/images/video-2.jpg",
      duration: "8:15"
    },
    {
      id: 3,
      title: "Cách làm bún chả Hà Nội",
      description: "Hướng dẫn chi tiết cách làm bún chả thơm ngon chuẩn vị",
      thumbnail: "/images/video-3.jpg",
      duration: "7:32"
    },
    {
      id: 4,
      title: "Bánh xèo miền Trung",
      description: "Cách làm bánh xèo giòn ngon với nguyên liệu đơn giản",
      thumbnail: "/images/video-4.jpg",
      duration: "5:47"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}