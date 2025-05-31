import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { Bell, Heart, MessageCircle, Share2, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadNotifications, markNotificationsAsRead } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-green-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'share':
        if (notification.postId) {
          navigate(`/posts/${notification.postId}`);
        } else if (notification.videoId) {
          navigate(`/reels/${notification.videoId}`);
        }
        break;
      case 'follow':
        navigate(`/profile/${notification.sender._id}`);
        break;
      default:
        break;
    }
    setShowNotifications(false);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    return notificationDate.toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    if (showNotifications && unreadNotifications > 0) {
      markNotificationsAsRead();
    }
  }, [showNotifications]);

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-amber-500">
            CookingApp
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-amber-500">
              Trang chủ
            </Link>
            <Link to="/recipes" className="text-gray-600 hover:text-amber-500">
              Công thức
            </Link>
            <Link to="/reels" className="text-gray-600 hover:text-amber-500">
              Reels
            </Link>
          </nav>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 max-h-[480px] overflow-y-auto">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold">Thông báo</h3>
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Không có thông báo nào
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <img
                                    src={notification.sender?.avatar || "/default-avatar.png"}
                                    alt={notification.sender?.firstName}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className="font-medium">
                                    {notification.sender?.firstName} {notification.sender?.lastName}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {notification.message}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="relative group">
                <button className="flex items-center space-x-3">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block">
                  <div className="py-1">
                    <Link
                      to={`/profile/${user._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Hồ sơ
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cài đặt
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-amber-500 hover:text-amber-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 