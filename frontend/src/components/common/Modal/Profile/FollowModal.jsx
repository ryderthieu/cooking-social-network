import React from "react";
import { X, Search, UserPlus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FollowModal({
  isOpen,
  onClose,
  title,
  users,
  stats,
  currentUserId,
  onToggleFollow,
  currentUserFollowing = [],
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            {title}
            <span className="ml-3 rounded-lg text-xs font-bold text-rose-500 bg-orange-400/20 px-2 py-1">
              {stats}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* User List */}
        <div className="overflow-y-auto max-h-[400px]">
          {" "}
          {users?.map((user) => {
            // Check if current user is following this user
            const isFollowing =
              currentUserFollowing?.some(
                (followedUser) =>
                  (followedUser._id || followedUser) === user._id
              ) || false;

            return (
              <div
                key={user._id || user.id}
                className="flex items-center justify-between py-4 px-8 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {`${user.firstName} ${user.lastName}`}
                      </p>
                      {user.isVerified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{user._id}</p>
                  </div>
                </div>{" "}                {/* Follow Button */}
                {user._id !== currentUserId && (
                  <div className="flex-shrink-0">
                    {isFollowing ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFollow(user._id);
                        }}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Đang theo dõi
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFollow(user._id);
                        }}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Theo dõi
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {/* Empty State */}
          {(!users || users.length === 0) && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm">Không tìm thấy người dùng nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
