import React, { useState } from "react";
import ProfileStats from "./ProfileStats";
import { UserCheck } from "lucide-react";
import EditProfileModal from "../../common/Modal/Profile/EditProfileModal";

export default function ProfileHeader({
  user,
  isOwnProfile,
  isFollowing,
  onToggleFollow,
  onEditProfile,
  stats,
  currentUserId,
  onToggleFollowInModal,
  onMessage,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const profileUser = user;

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (formData) => {
    // Gọi API để cập nhật profile
    if (onEditProfile) {
      await onEditProfile(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Cover photo */}
      <div className="relative h-48 bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      <div className="p-6 pt-16 relative">
        {/* Avatar */}
        <div className="absolute -top-12 left-6">
          <img
            src={profileUser.avatar}
            alt={profileUser.lastName}
            className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white"
          />
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="md:max-w-3xl">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">
                {profileUser.firstName} {profileUser.lastName}
              </h1>
              {!isOwnProfile && onMessage && (
                <button
                  onClick={onMessage}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-700 transition my-auto"
                >
                  Nhắn tin
                </button>
              )}
            </div>
            <p className="text-gray-600 max-w-[700px] mt-4">
              {profileUser.bio ||
                "Đầu bếp đam mê chia sẻ những công thức nấu ăn ngon và dễ làm. Yêu thích khám phá ẩm thực từ khắp nơi trên thế giới 🍳✨"}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
              {profileUser.location && (
                <span className="flex items-center gap-1">
                  <span>📍</span> {profileUser.location}
                </span>
              )}
              {profileUser.createdAt && (
                <span className="flex items-center gap-1">
                  <span>📅 Tham gia</span>
                  {(() => {
                    const date = new Date(profileUser.createdAt);
                    if (!isNaN(date.getTime())) {
                      return `Tháng ${
                        date.getMonth() + 1
                      }, ${date.getFullYear()}`;
                    }
                    return profileUser.createdAt;
                  })()}
                </span>
              )}
            </div>

            <div className="flex gap-6 mt-4">
              <ProfileStats
                stats={stats}
                currentUserId={currentUserId}
                onToggleFollow={onToggleFollowInModal || onToggleFollow}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profileUser}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
