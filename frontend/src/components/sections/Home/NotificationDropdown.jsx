import { Bell, Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from "@/services/notificationService";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const navigate = useNavigate();

  // Lấy thông báo từ API khi component mount
  useEffect(() => {
    const getAllNotifications = async () => {
      try {
        const res = await getUserNotifications({ page: 1, limit: 10 });
        setNotifications(res.data.data.notifications);
        // Đếm số thông báo chưa đọc
        const unreadNotifications = res.data.data.notifications.filter(
          (n) => !n.isRead
        );
        setUnreadCount(unreadNotifications.length);
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
      console.log(notification);
      setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Giữ 10 thông báo mới nhất
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("notifications_marked_as_read", () => {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
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
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    );

    return () => {
      socket.off("new_notification");
      socket.off("notifications_marked_as_read");
      socket.off("notification_marked_as_read");
    };
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    console.log(notification);
    if (!notification.isRead) {
      try {
        await markAsRead({ notificationId: notification._id });
        // Cập nhật UI ngay lập tức
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notification._id ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
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
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Cập nhật UI
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
      // Socket sẽ tự động emit cho các thiết bị khác
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationContent = (notification) => {
    const senderName = notification.sender
      ? `${notification.sender.firstName} ${notification.sender.lastName}`
      : "Ai đó";
    switch (notification.type) {
      case "like":
        return (
          <>
            <span className="font-semibold">{senderName}</span> đã thích bài
            viết của bạn
          </>
        );
      case "comment":
        return notification.message ? (
          <>
            <span className="font-semibold">{senderName}</span>:{" "}
            {notification.message}
          </>
        ) : (
          <>
            <span className="font-semibold">{senderName}</span> đã bình luận về
            bài viết của bạn
          </>
        );
      case "share":
        return (
          <>
            <span className="font-semibold">{senderName}</span> đã chia sẻ bài
            viết của bạn
          </>
        );
      case "follow":
        return (
          <>
            <span className="font-semibold">{senderName}</span> đã theo dõi bạn
          </>
        );
      default:
        return notification.message || "Có thông báo mới";
    }
  };

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

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 "
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-7 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-800 flex justify-between items-center">
            <span className="text-[16px]">Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <img
                    src={
                      notification.sender?.avatar ||
                      "https://via.placeholder.com/150"
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium">
                      {getNotificationContent(notification)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 text-center border-t">
            <button
              onClick={() => {
                navigate("/notification");
                setOpen(false);
              }}
              className="text-sm text-[#FF6363] font-semibold hover:text-[#fa5555]"
            >
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
