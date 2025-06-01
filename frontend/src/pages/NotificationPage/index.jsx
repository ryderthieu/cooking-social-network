import { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "@/services/notificationService";
import { Heart, MessageCircle, Share2, Bell, UserPlus } from "lucide-react";

const NotificationPage = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();
  const navigate = useNavigate();

  // Lấy thông báo từ API khi component mount
  useEffect(() => {
    const getAllNotifications = async () => {
      try {
        const res = await getUserNotifications({ page: 1, limit: 50 });
        setNotifications(res.data.data.notifications);
      } catch (error) {
        console.log(error.message);
      }
    };
    getAllNotifications();
  }, []);

  // Lắng nghe thông báo mới từ socket
  useEffect(() => {
    if (!socket) return;

    socket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    socket.on("notifications_marked_as_read", () => {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    });

    socket.on(
      "notification_marked_as_read",
      ({ notificationId, notification }) => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId
              ? { ...notification, isRead: true }
              : notif
          )
        );
      }
    );

    return () => {
      socket.off("new_notification");
      socket.off("notifications_marked_as_read");
      socket.off("notification_marked_as_read");
    };
  }, [socket]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "share":
        return <Share2 className="w-5 h-5 text-green-500" />;
      case "follow":
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationContent = (notification) => {
    const senderName = notification.sender
      ? `${notification.sender.firstName} ${notification.sender.lastName}`
      : "Ai đó";
    switch (notification.type) {
      case "like":
        return { name: senderName, text: " đã thích bài viết của bạn" };
      case "comment":
        return {
          name: senderName,
          text: notification.message
            ? `: ${notification.message}`
            : " đã bình luận về bài viết của bạn",
        };
      case "share":
        return { name: senderName, text: " đã chia sẻ bài viết của bạn" };
      default:
        return { name: "", text: notification.message || "Có thông báo mới" };
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead({ notificationId: notification._id });
        // Cập nhật UI ngay lập tức
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notification._id ? { ...notif, isRead: true } : notif
          )
        );
        // Socket sẽ tự động emit cho các thiết bị khác
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    if (
      notification.type === "like" ||
      notification.type === "comment" ||
      notification.type === "share"
    ) {
      if (notification.postId) {
        navigate(`/posts/${notification.postId}`);
      } else if (notification.videoId) {
        navigate(`/reels/${notification.videoId}`);
      }
    } else if (notification.type === "follow") {
      navigate(`/profile/${notification.sender._id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Cập nhật UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      // Socket sẽ tự động emit cho các thiết bị khác
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const filtered = notifications.filter((n) =>
    filter === "all" ? true : filter === "read" ? n.isRead : !n.isRead
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF4D6] via-white to-[#FFF4D6] p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-1/4 border-r border-[#FFB800]/20 p-6 bg-gradient-to-br from-white to-[#FFF4D6]/20">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Bộ lọc</h2>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => setFilter("all")}
                className={`text-left w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  filter === "all"
                    ? "bg-[#FFB800]/10 text-[#FFB800] font-medium"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                Tất cả thông báo
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("unread")}
                className={`text-left w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  filter === "unread"
                    ? "bg-[#FFB800]/10 text-[#FFB800] font-medium"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                Chưa đọc
              </button>
            </li>
            <li>
              <button
                onClick={() => setFilter("read")}
                className={`text-left w-full px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  filter === "read"
                    ? "bg-[#FFB800]/10 text-[#FFB800] font-medium"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                Đã đọc
              </button>
            </li>
          </ul>
        </aside>

        {/* Right Content */}
        <main className="w-3/4 p-6 bg-gradient-to-br from-white to-[#FFF4D6]/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
            {filtered.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-medium text-[#FFB800] hover:text-[#FFB800]/80 transition-colors"
              >
                Đánh dấu tất cả là đã đọc
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Không có thông báo nào.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((notification) => {
                const content = getNotificationContent(notification);
                return (
                  <li
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex gap-4 items-start p-4 rounded-xl border border-gray-100 hover:bg-[#FFF4D6]/5 transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-blue-50/30" : "bg-white"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm text-gray-800 ${
                          !notification.isRead ? "font-medium" : ""
                        }`}
                      >
                        {content.name && (
                          <span className="font-semibold">{content.name}</span>
                        )}
                        {content.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default NotificationPage;
