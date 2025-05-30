import React, { useState } from 'react';
import FollowModal from '../../common/Modal/Profile/FollowModal'; 

export default function ProfileStats({ stats, currentUserId, onToggleFollow }) {
  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);

  const openFollowerModal = () => setIsFollowerModalOpen(true);
  const openFollowingModal = () => setIsFollowingModalOpen(true);

  return (
    <>
      <div className="flex gap-8 pt-4 border-t w-full border-gray-100">
        <div className="text-center cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out rounded-lg p-3">
          <div className="text-xl font-bold text-gray-900">{stats?.posts?.count || 0}</div>
          <div className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">Bài đăng</div>
        </div>
        <div className="text-center cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out rounded-lg p-3">
          <div className="text-xl font-bold text-gray-900">{stats?.recipes?.count || 0}</div>
          <div className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">Công thức</div>
        </div>
        <div onClick={openFollowerModal} className="text-center cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out rounded-lg p-3">
          <div className="text-xl font-bold text-gray-900">{stats?.followers?.count || 0}</div>
          <div className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">Người theo dõi</div>
        </div>
        <div onClick={openFollowingModal} className="text-center cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out rounded-lg p-3">
          <div className="text-xl font-bold text-gray-900">{stats?.following?.count || 0}</div>
          <div className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">Đang theo dõi</div>
        </div>
      </div>      {/* Modals */}
      <FollowModal
        isOpen={isFollowerModalOpen}
        onClose={() => setIsFollowerModalOpen(false)}
        title="Người theo dõi"
        stats={stats?.followers?.count || 0}
        users={stats?.followers?.data}
        currentUserId={currentUserId}
        currentUserFollowing={stats?.following?.data || []}
        onToggleFollow={onToggleFollow}
      />
      
      <FollowModal
        isOpen={isFollowingModalOpen}
        onClose={() => setIsFollowingModalOpen(false)}
        title="Đang theo dõi"
        stats={stats?.following?.count || 0}
        users={stats?.following?.data}
        currentUserId={currentUserId}
        currentUserFollowing={stats?.following?.data || []}
        onToggleFollow={onToggleFollow}
      />
    </>
  );
}