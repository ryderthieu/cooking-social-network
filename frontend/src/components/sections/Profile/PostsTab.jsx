import React from 'react';
import PostItem from './PostItem';

export default function PostsTab() {
  // Dữ liệu mẫu
  const posts = [
    {
      id: 1,
      author: "Nguyễn Văn A",
      avatarSrc: "/images/avatar-placeholder.jpg",
      date: "2024-06-01",
      content: "Hôm nay mình vừa thử làm bánh mì Việt Nam, thành công ngoài mong đợi! Ai muốn công thức không nè? 🥖",
      imageSrc: "/images/post-image-1.jpg",
      imageAlt: "Bánh mì Việt Nam",
      likes: 12,
      comments: 2,
      shares: 1
    },
    {
      id: 2,
      author: "Nguyễn Văn A",
      avatarSrc: "/images/avatar-placeholder.jpg",
      date: "2024-05-28",
      content: "Phở bò Hà Nội truyền thống - bí quyết nấu nước dùng trong veo, thơm ngon! 🍜",
      imageSrc: "/images/post-image-2.jpg",
      imageAlt: "Phở bò Hà Nội",
      likes: 24,
      comments: 5,
      shares: 3
    }
  ];

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}