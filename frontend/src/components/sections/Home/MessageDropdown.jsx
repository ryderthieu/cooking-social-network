import { useState, useRef, useEffect } from "react";

const MessageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Nguyễn Văn An",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Bạn có công thức làm bánh mì không?",
      time: "2 phút trước",
      isRead: false,
      isOnline: true,
    },
    {
      id: 2,
      sender: "Trần Thị Bình",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Cảm ơn bạn đã chia sẻ công thức phở!",
      time: "15 phút trước",
      isRead: false,
      isOnline: false,
    },
    {
      id: 3,
      sender: "Lê Minh Châu",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Món gà nướng của bạn trông ngon quá!",
      time: "1 giờ trước",
      isRead: true,
      isOnline: true,
    },
    {
      id: 4,
      sender: "Phạm Thị Dung",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Bạn có thể hướng dẫn cách làm bánh flan không?",
      time: "3 giờ trước",
      isRead: true,
      isOnline: false,
    },
    {
      id: 5,
      sender: "Hoàng Văn Em",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Video nấu ăn của bạn rất hay!",
      time: "1 ngày trước",
      isRead: true,
      isOnline: false,
    },
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
    );
  };

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
  };

  return (
    <div
      className="relative rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
      ref={dropdownRef}
    >
      {/* Message Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full focus:outline-none transition-colors duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 mt-7">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Tin nhắn</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>
          </div>

          {/* Messages List */}
          <div className="max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => markAsRead(message.id)}
                className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${
                  !message.isRead ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar with online status */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={message.avatar || "/placeholder.svg"}
                      alt={message.sender}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {message.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium text-gray-900 ${
                          !message.isRead ? "font-semibold" : ""
                        }`}
                      >
                        {message.sender}
                      </p>
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm text-gray-600 truncate mt-1 ${
                        !message.isRead ? "font-medium text-gray-800" : ""
                      }`}
                    >
                      {message.message}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!message.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 w-full text-center">
            {/* <Link
              to="/messages"
              className="w-full text-center font-semibold text-orange-500 hover:text-orange-600 text-sm py-2 hover:bg-orange-50 rounded transition-colors"
            >
            </Link> */}
            <a
              href="/messages"
              className="text-sm  text-orange-500 font-semibold hover:text-orange-600  py-2 rounded transition-colors"
            >
              Xem tất cả tin nhắn
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;
