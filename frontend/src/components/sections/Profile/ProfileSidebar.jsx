import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaUtensils,
  FaVideo,
  FaBookmark,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import { UserCheck } from "lucide-react";

export default function ProfileSidebar({
  activeTab,
  onTabChange,
  userData,
  userStats,
  isOwnProfile,
  onEditProfile,
  isFollowing,
  onToggleFollow,
}) {

  const menuItems = [
    {
      key: "posts",
      label: "Bài viết",
      icon: <FaUser />,
      count: userStats?.posts?.count || 0,
    },
    {
      key: "recipes",
      label: "Công thức",
      icon: <FaUtensils />,
      count: userStats?.recipes?.count || 0,
    },
    {
      key: "videos",
      label: "Video",
      icon: <FaVideo />,
      count: userStats?.videos?.count || 0,
    },
  ];

  // Add saved tab only for own profile
  if (isOwnProfile) {
    menuItems.push({
      key: "saved",
      label: "Đã lưu",
      icon: <FaBookmark />,
      count: null,
    });
  }

  return (
    <aside className="w-80 pr-6 space-y-6 sticky top-24">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Navigation Menu */}
        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Nội dung
          </h4>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.key}>
                <button
                  onClick={() => onTabChange(item.key)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group ${
                    activeTab === item.key
                      ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-500 shadow-sm border border-amber-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm transition-transform duration-200 `}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== null && (
                    <span
                      className={`text-xs size-6 p-1 rounded-lg grid place-items-center font-bold ${
                        activeTab === item.key
                          ? "bg-amber-400/30 text-amber-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 md:mt-0 w-full">
            {isOwnProfile ? (
              <button
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                onClick={onEditProfile}
              >
                Chỉnh sửa hồ sơ
              </button>
            ) : (
              <button
                className={`w-full px-4 flex flex-row gap-2 justify-center items-center py-2 rounded-lg font-medium ${
                  isFollowing
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-amber-500 hover:bg-amber-600 text-white transition hover:-translate-y-1 transform duration-300 ease-in-out"
                }`}
                onClick={onToggleFollow}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={16} />
                    <span>Đang theo dõi</span>
                  </>
                ) : (
                  "Theo dõi"
                )}
              </button>
            )}
          </div>

        {/* Extended Bio Section */}
        {userData?.bio && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-amber-500">✨</span>
              Giới thiệu
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {userData.bio}
            </p>
          </div>
        )}

      </div>
    </aside>
  );
}