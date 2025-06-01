import { useState, useRef, useEffect } from "react";
import { useSocket } from "../../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getUserConversations } from "@/services/conversationService";
import { useAuth } from "@/context/AuthContext";

const MessageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();
  const { user } = useAuth()
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đảm bảo conversations là một mảng trước khi filter
  const unreadCount = Array.isArray(conversations)
    ? conversations.filter((conv) => conv?.unreadCount > 0).length
    : 0;

  useEffect(() => {
    const fetchConversationsList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getUserConversations({ page: 1, limit: 10 });

        if (response?.data?.success && response.data?.data?.conversations) {
          const fetchedConversations = response.data.data.conversations.map(
            (conv) => ({
              ...conv,
              // Client sẽ tự cập nhật isOnline dựa trên socket events
              members: conv.members.map((m) => ({ ...m, isOnline: false })), // Khởi tạo isOnline là false
              otherUser: conv.otherUser
                ? { ...conv.otherUser, isOnline: false }
                : null,
            })
          );
          setConversations(fetchedConversations);
        } else {
          console.error("Invalid conversations data format:", response);
          setError("Không thể tải danh sách tin nhắn");
          setConversations([]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Không thể tải danh sách tin nhắn");
        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationsList(); // Đổi tên hàm để tránh trùng
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (data) => {
        setConversations((prevConvs) => {
          if (!Array.isArray(prevConvs)) return [];
          let convsToUpdate = [...prevConvs];
          const convIndex = convsToUpdate.findIndex(
            (conv) => conv?._id === data.conversationId
          );

          let targetConv;
          if (convIndex !== -1) {
            targetConv = { ...convsToUpdate[convIndex] };
            convsToUpdate.splice(convIndex, 1); // Xóa khỏi vị trí cũ
          } else {
            // Nếu conversation chưa có trong danh sách (có thể là conversation mới)
            // Cần tạo một conversation object mới từ data.
            // Tuy nhiên, data từ 'new_message' có thể không đủ thông tin (vd: members, otherUser)
            // Tạm thời bỏ qua việc thêm conversation mới ở đây, chỉ cập nhật nếu đã tồn tại.
            // Hoặc, cần emit thêm thông tin conversation đầy đủ khi có tin nhắn đầu tiên của conv mới.
            // For now, if not found, we might need to refetch or handle it differently.
            console.warn(
              "New message for a conversation not in dropdown list:",
              data.conversationId
            );
            // Tìm cách lấy đầy đủ thông tin conversation hoặc bỏ qua nếu không có
            // Để đơn giản, nếu không tìm thấy, không làm gì cả với dropdown này
            return prevConvs;
          }

          targetConv.lastMessage = data.message;
          targetConv.updatedAt = new Date().toISOString();
          targetConv.unreadCount = (targetConv.unreadCount || 0) + 1;

          convsToUpdate.unshift(targetConv); // Đưa lên đầu
          return convsToUpdate;
        });
      });

      socket.on("messages_seen", ({ conversationId, unreadCount }) => {
        // Nhận unreadCount từ server
        setConversations((prevConvs) => {
          if (!Array.isArray(prevConvs)) return [];
          return prevConvs.map(
            (conv) =>
              conv?._id === conversationId
                ? { ...conv, unreadCount: unreadCount }
                : conv // Cập nhật unreadCount
          );
        });
      });

      const updateUserOnlineStatusInDropdown = (userId, isOnline) => {
        setConversations((prevConvs) =>
          prevConvs.map((conv) => ({
            ...conv,
            members: conv.members.map((member) =>
              member._id === userId ? { ...member, isOnline } : member
            ),
            otherUser:
              conv.otherUser && conv.otherUser._id === userId
                ? { ...conv.otherUser, isOnline }
                : conv.otherUser,
          }))
        );
      };

      socket.on("user_online", (userId) =>
        updateUserOnlineStatusInDropdown(userId, true)
      );
      socket.on("user_offline", (userId) =>
        updateUserOnlineStatusInDropdown(userId, false)
      );

      // Lắng nghe danh sách người dùng online ban đầu
      socket.on("initial_online_users", (activeOnlineUserIds) => {
        setConversations((prevConvs) =>
          prevConvs.map((conv) => ({
            ...conv,
            members: conv.members.map((member) => ({
              ...member,
              isOnline: activeOnlineUserIds.includes(member._id),
            })),
            otherUser: conv.otherUser
              ? {
                ...conv.otherUser,
                isOnline: activeOnlineUserIds.includes(conv.otherUser._id),
              }
              : null,
          }))
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("new_message");
        socket.off("messages_seen"); // Sửa tên event cho đúng
        socket.off("user_online");
        socket.off("user_offline");
        socket.off("initial_online_users");
      }
    };
  }, [socket]);

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

  const handleConversationClick = (conversationId) => {
    if (!conversationId) return;
    navigate(`/messages/${conversationId}`);
    setIsOpen(false);
  };

  const formatMessageTime = (date) => {
    if (!date) return "";
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: vi,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
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
              <h3 className="text-[16px] font-semibold text-gray-800">
                Tin nhắn
              </h3>
            </div>
          </div>

          {/* Conversations List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Đang tải tin nhắn...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : !Array.isArray(conversations) || conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Chưa có cuộc trò chuyện nào
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation?._id}
                  onClick={() => handleConversationClick(conversation?._id)}
                  className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors ${conversation?.unreadCount > 0 ? "bg-blue-50" : ""
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar with online status */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          conversation?.otherUser?.avatar || "/placeholder.svg"
                        }
                        alt={conversation?.otherUser?.name || "User avatar"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {conversation?.otherUser?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Conversation Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium text-gray-900 ${conversation?.unreadCount > 0 ? "font-semibold" : ""
                            }`}
                        >
                          {conversation?.otherUser?.name || "Người dùng"}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(conversation?.updatedAt)}
                        </span>
                      </div>
                      <p
                        className={`text-sm text-gray-600 truncate mt-1 ${conversation?.unreadCount > 0
                          ? "font-medium text-gray-800"
                          : ""
                          }`}
                      >
                        {(conversation?.lastMessage?.sender._id == user._id ? 'Bạn: ' : '') + (conversation?.lastMessage?.type === 'text'
                          ? conversation.lastMessage.text : conversation?.lastMessage?.type === 'share'
                            ? "Đã chia sẻ một liên kết" : conversation?.lastMessage?.type === 'image'
                              ? "Đã gửi một hình ảnh" : "Không có tin nhắn")}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {conversation?.unreadCount > 0 && (
                      <div className="flex items-center">
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 w-full text-center">
            <button
              onClick={() => {
                navigate("/messages");
                setIsOpen(false);
              }}
              className="text-sm text-[#FF6363] font-semibold hover:text-[#fa5555] py-2 rounded transition-colors"
            >
              Xem tất cả tin nhắn
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;
