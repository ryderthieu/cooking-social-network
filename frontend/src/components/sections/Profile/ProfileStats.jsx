import React from 'react';

export default function ProfileStats({ stats }) {
  const defaultStats = {
    posts: 230,
    recipes: 156,
    followers: '2.8k',
    following: 324
  };
  
  const profileStats = stats || defaultStats;
  
  return (
    <div className="flex gap-8 pt-4 border-t border-gray-100">
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900">{profileStats.posts}</div>
        <div className="text-sm text-gray-500">Bài đăng</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900">{profileStats.recipes}</div>
        <div className="text-sm text-gray-500">Công thức</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900">{profileStats.followers}</div>
        <div className="text-sm text-gray-500">Người theo dõi</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900">{profileStats.following}</div>
        <div className="text-sm text-gray-500">Đang theo dõi</div>
      </div>
    </div>
  );
}