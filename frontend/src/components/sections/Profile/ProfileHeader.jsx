import React from 'react';
import ProfileStats from './ProfileStats';

export default function ProfileHeader({ user }) {
  const defaultUser = {
    name: "Nguyễn Văn A",
    bio: "Đầu bếp đam mê chia sẻ những công thức nấu ăn ngon và dễ làm. Yêu thích khám phá ẩm thực từ khắp nơi trên thế giới 🍳✨",
    location: "Hồ Chí Minh, Việt Nam",
    joinDate: "Tham gia tháng 3, 2023",
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    coverSrc: "/images/cover-placeholder.jpg",
    stats: {
      recipes: 156,
      followers: '2.8k',
      following: 324
    }
  };
  
  const profileUser = user || defaultUser;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden mb-6">
      <div className="relative h-48 bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200">
        <img
          src={profileUser.coverSrc}
          alt="Cover"
          className="object-cover w-full h-full opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Avatar */}
        <div className="absolute left-6 -bottom-12">
          <div className="w-24 h-24 border-4 border-white shadow-lg rounded-full overflow-hidden">
            <img
              src={profileUser.avatarSrc}
              alt={profileUser.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-16 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {profileUser.name}
            </h1>
            <p className="text-gray-600 mb-2">
              {profileUser.bio}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{profileUser.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{profileUser.joinDate}</span>
              </div>
            </div>
          </div>
          <button className="rounded-full p-2 hover:bg-gray-100">
            <span>⋯</span>
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 flex items-center">
            <span className="mr-2">✏️</span>
            Chỉnh sửa hồ sơ
          </button>
          <button className="border border-gray-200 hover:bg-gray-50 rounded-xl px-4 py-2 flex items-center">
            <span className="mr-2">👥</span>
            Theo dõi
          </button>
        </div>

        {/* Stats */}
        <ProfileStats stats={profileUser.stats} />
      </div>
    </div>
  );
}