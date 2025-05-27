import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Info,
  Plus,
  Image,
  Smile,
  Send,
  MoreHorizontal,
  Reply,
  Trash2,
} from "lucide-react";

export default function MessagePage() {
  // Danh sách contacts
  const contacts = [
    {
      id: 1,
      name: "Nhóm Nấu Ăn Vui Vẻ",
      lastMessage: "Mai họp nhóm lúc 8h nhé mọi người!",
      time: "2 phút",
      active: true,
    },
    {
      id: 2,
      name: "Nguyễn Văn An",
      lastMessage: "Bạn: Đã gửi công thức mới rồi nha!",
      time: "1 giờ",
      active: false,
    },
    {
      id: 3,
      name: "Trần Thị Bình",
      lastMessage: "Cảm ơn bạn đã chia sẻ món bánh!",
      time: "1 giờ",
      active: false,
    },
    {
      id: 4,
      name: "Lê Minh Tuấn",
      lastMessage: "Bạn: Đã gửi một ảnh",
      time: "1 giờ",
      active: false,
    },
    {
      id: 5,
      name: "Gia Đình",
      lastMessage: "Mẹ: Tối nay ăn gì con?",
      time: "2 giờ",
      active: false,
    },
    {
      id: 6,
      name: "CLB Ẩm Thực",
      lastMessage: "Lan: Nhớ mang nguyên liệu nhé!",
      time: "2 giờ",
      active: false,
    },
    {
      id: 7,
      name: "Bạn Bè Cấp 3",
      lastMessage: "Hùng: Cuối tuần đi ăn không?",
      time: "11 giờ",
      active: true,
    },
  ];

  // Dữ liệu messages cho từng contact (giả lập)
  const allMessages = {
    1: [
      {
        id: 1,
        sender: "Mai",
        content: "Mọi người nhớ mai họp nhóm lúc 8h nhé!",
        time: "07:30",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/women/65.jpg",
        reactions: [],
      },
      {
        id: 2,
        sender: "Bạn",
        content: "Ok Mai, mình sẽ có mặt đúng giờ 👍",
        time: "07:31",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [{ type: "👍", count: 1 }],
      },
      {
        id: 3,
        sender: "Hà",
        content: "Có cần chuẩn bị gì không mọi người?",
        time: "07:32",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/women/66.jpg",
        reactions: [],
      },
      {
        id: 4,
        sender: "Bạn",
        content: "Mình mang bánh mì nhé!",
        time: "07:33",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [],
        replyTo: {
          id: 3,
          sender: "Hà",
          content: "Có cần chuẩn bị gì không mọi người?",
        },
      },
    ],
    2: [
      {
        id: 5,
        sender: "Bạn",
        content: "An ơi, mình vừa gửi công thức mới rồi nha!",
        time: "09:00",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [],
      },
      {
        id: 6,
        sender: "Nguyễn Văn An",
        content: "Cảm ơn bạn nhé! Để mình thử cuối tuần này.",
        time: "09:05",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/men/33.jpg",
        reactions: [{ type: "❤️", count: 1 }],
      },
    ],
    3: [
      {
        id: 7,
        sender: "Trần Thị Bình",
        content: "Bánh bạn làm ngon quá!",
        time: "14:00",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/women/67.jpg",
        reactions: [],
      },
      {
        id: 8,
        sender: "Bạn",
        content: "Cảm ơn Bình nha, hôm nào mình gửi bạn công thức nhé!",
        time: "14:01",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [],
      },
    ],
    4: [
      {
        id: 9,
        sender: "Bạn",
        content: "Đã gửi một ảnh",
        time: "15:00",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [],
      },
      {
        id: 10,
        sender: "Lê Minh Tuấn",
        content: "Ảnh đẹp quá! Đó là món gì vậy?",
        time: "15:01",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/men/34.jpg",
        reactions: [],
      },
    ],
    5: [
      {
        id: 11,
        sender: "Mẹ",
        content: "Tối nay ăn gì con?",
        time: "16:00",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/women/68.jpg",
        reactions: [],
      },
      {
        id: 12,
        sender: "Bạn",
        content: "Mẹ thích ăn gì để con nấu!",
        time: "16:01",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [],
      },
    ],
    6: [
      {
        id: 13,
        sender: "Lan",
        content: "Nhớ mang nguyên liệu nhé mọi người!",
        time: "17:00",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/women/69.jpg",
        reactions: [],
      },
      {
        id: 14,
        sender: "Bạn",
        content: "Ok Lan, mình sẽ mang rau củ.",
        time: "17:01",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [],
      },
    ],
    7: [
      {
        id: 15,
        sender: "Hùng",
        content: "Cuối tuần đi ăn không?",
        time: "18:00",
        isOwn: false,
        avatar:
          "https://randomuser.me/api/portraits/men/35.jpg",
        reactions: [],
      },
      {
        id: 16,
        sender: "Bạn",
        content: "Đi chứ! Lâu rồi chưa gặp mọi người.",
        time: "18:01",
        isOwn: true,
        avatar:
          "https://randomuser.me/api/portraits/men/32.jpg",
        reactions: [],
      },
    ],
  };

  // State
  const [selectedContactId, setSelectedContactId] = useState(contacts[0].id);
  const [messages, setMessages] = useState(allMessages[selectedContactId]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Khi đổi contact, load messages mới
  useEffect(() => {
    setMessages(allMessages[selectedContactId] || []);
    setReplyingTo(null);
    setShowContextMenu(null);
    setNewMessage("");
  }, [selectedContactId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: "You",
        content: newMessage,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
        reactions: [],
        replyTo: replyingTo,
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setReplyingTo(null);
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setShowContextMenu(null);
  };

  const handleRecall = (messageId) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: "Tin nhắn đã được thu hồi", recalled: true }
          : msg
      )
    );
    setShowContextMenu(null);
  };

  const handleReaction = (messageId, reaction) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(
            (r) => r.type === reaction
          );
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.type === reaction ? { ...r, count: r.count + 1 } : r
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { type: reaction, count: 1 }],
            };
          }
        }
        return msg;
      })
    );
  };

  return (
    <div className="fixed inset-0 flex bg-white mt-[80px]">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col h-full pl-2.5">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm trên Messenger"
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className="flex-1 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
            Hộp thư
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                selectedContactId === contact.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/photo-${
                    1507003211169 + index
                  }0-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face`}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full"
                />
                {contact.active && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {contact.name}
                  </p>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between px-[30px] bg-white z-10 mt-2.5">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
              alt="Sun Asterisk Naitei"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h2 className="font-semibold text-gray-900">
                {contacts.find((c) => c.id === selectedContactId).name}
              </h2>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-6 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  message.isOwn ? "flex-row-reverse" : "flex-row"
                } items-end max-w-xs lg:max-w-md relative group`}
              >
                <img
                  src={message.avatar}
                  alt={message.sender}
                  className="w-6 h-6 rounded-full mx-2"
                />
                <div className="relative">
                  {/* Nếu là tin nhắn đã thu hồi */}
                  {message.recalled ? (
                    <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-500 italic">
                      Tin nhắn đã được thu hồi
                    </div>
                  ) : (
                    <>
                      {/* Hiển thị phần trả lời nếu có */}
                      {message.replyTo && (
                        <div className="mb-1 px-3 py-2 bg-blue-50 border-l-4 border-blue-400 rounded-t-lg rounded-br-lg text-xs text-gray-700 max-w-[220px]">
                          <span className="font-semibold text-blue-600">
                            {message.replyTo.sender}:
                          </span>{" "}
                          <span className="italic">
                            {message.replyTo.content.length > 40
                              ? message.replyTo.content.slice(0, 40) + "..."
                              : message.replyTo.content}
                          </span>
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isOwn
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        } ${message.isLink ? "p-2" : ""}`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (!message.recalled) setShowContextMenu(message.id);
                        }}
                      >
                        {/* ...nội dung tin nhắn... */}
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>

                      {/* Quick reaction buttons - show on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border rounded-full px-2 py-1 shadow-lg flex space-x-1 transition-opacity">
                        {["❤️", "😂", "😮", "😢", "😡", "👍"].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            className="hover:scale-125 transition-transform text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      {/* Reactions */}
                      {message.reactions.length > 0 && (
                        <div className="absolute -bottom-2 right-0 flex space-x-1">
                          {message.reactions.map((reaction, index) => (
                            <div
                              key={index}
                              className="bg-white border rounded-full px-1 text-xs flex items-center shadow-sm"
                            >
                              <span>{reaction.type}</span>
                              <span className="ml-1 text-gray-600">
                                {reaction.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Context Menu */}
                      {showContextMenu === message.id && !message.recalled && (
                        <div className="absolute bg-white border shadow rounded p-2 z-10">
                          <button
                            onClick={() => handleReply(message)}
                            className="flex items-center"
                          >
                            <Reply size={14} className="mr-2" />
                            Trả lời
                          </button>
                          {message.isOwn && !message.recalled && (
                            <button
                              onClick={() => handleRecall(message.id)}
                              className="flex items-center mt-1 text-red-600"
                            >
                              <Trash2 size={14} className="mr-2" />
                              Thu hồi
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div
                  className={`text-xs text-gray-500 mx-2 ${
                    message.isOwn ? "text-right" : "text-left"
                  }`}
                >
                  {message.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Preview */}
        {replyingTo && (
          <div className="px-4 py-2 bg-gray-50 border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-gray-600">
                Đang trả lời {replyingTo.sender}
              </div>
              <div className="text-sm text-gray-800 truncate">
                {replyingTo.content.substring(0, 50)}...
              </div>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <Smile className="text-gray-400" />
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-3 py-2 border rounded-full outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      {/* Click outside to close context menu */}
      {showContextMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowContextMenu(null)}
        />
      )}
    </div>
  );
}
