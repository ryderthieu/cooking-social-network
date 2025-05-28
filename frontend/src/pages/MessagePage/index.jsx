import { useState, useRef, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { socket, sendMessage, startTyping, stopTyping } = useSocket();
  const { user, loading } = useAuth();
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Kiểm tra authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchConversations();
    }
  }, [user, loading]);

  // Socket listeners
  useEffect(() => {
    if (socket) {
      socket.on('new_message', ({ message, conversationId }) => {
        if (selectedConversationId === conversationId) {
          setMessages(prev => [...prev, {
            id: message._id,
            sender: message.sender,
            content: message.text,
            time: new Date(message.createdAt).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: message.sender._id === user._id,
            avatar: message.sender.avatar,
            reactions: message.reactions || [],
          }]);
        }
      });

      socket.on('user_typing', ({ userId, userName, conversationId }) => {
        if (selectedConversationId === conversationId) {
          setTypingUsers(prev => ({
            ...prev,
            [userId]: userName
          }));
        }
      });

      socket.on('user_stop_typing', ({ userId, conversationId }) => {
        if (selectedConversationId === conversationId) {
          setTypingUsers(prev => {
            const newTyping = { ...prev };
            delete newTyping[userId];
            return newTyping;
          });
        }
      });

      return () => {
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('user_stop_typing');
      };
    }
  }, [socket, selectedConversationId]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const result = await response.json();
      if (result.success) {
        setConversations(result.data.conversations);
        if (result.data.conversations.length > 0) {
          setSelectedConversationId(result.data.conversations[0]._id);
          fetchMessages(result.data.conversations[0]._id);
        }
      } else {
        setError(result.message || 'Không thể tải cuộc trò chuyện');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Không thể tải cuộc trò chuyện');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8080/api/messages/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const result = await response.json();
      if (result.success) {
        const formattedMessages = result.data.messages.map(msg => ({
          id: msg._id,
          sender: msg.sender,
          content: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isOwn: msg.sender._id === user._id,
          avatar: msg.sender.avatar,
          reactions: msg.reactions || [],
          replyTo: msg.replyTo,
          recalled: msg.recalled
        }));
        setMessages(formattedMessages);
      } else {
        setError(result.message || 'Không thể tải tin nhắn');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Không thể tải tin nhắn');
    } finally {
      setIsLoading(false);
    }
  };

  // Khi đổi conversation, load messages mới
  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
      setReplyingTo(null);
      setShowContextMenu(null);
      setNewMessage("");
      setTypingUsers({});
    }
  }, [selectedConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversationId) {
      // Gửi tin nhắn qua socket
      sendMessage({
        conversationId: selectedConversationId,
        type: 'text',
        text: newMessage,
        replyTo: replyingTo?.id
      });

      setNewMessage("");
      setReplyingTo(null);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (selectedConversationId) {
      if (e.target.value) {
        startTyping(selectedConversationId);
      } else {
        stopTyping(selectedConversationId);
      }
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setShowContextMenu(null);
  };

  const handleRecall = async (messageId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${messageId}/recall`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessages(messages.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: "Tin nhắn đã được thu hồi", recalled: true }
            : msg
        ));
      }
    } catch (error) {
      console.error('Error recalling message:', error);
    }
    setShowContextMenu(null);
  };

  const handleReaction = async (messageId, reaction) => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reaction })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessages(messages.map(msg => 
            msg.id === messageId ? { ...msg, reactions: result.data.reactions } : msg
          ));
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 mt-[80px]">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 mt-[80px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-gray-50 mt-[80px]">
      {/* Sidebar */}
      <div className="w-[380px] bg-white shadow-sm flex flex-col h-full">
        {/* Header */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm trên Messenger"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4">
          <button className="w-full py-2.5 text-gray-800 font-medium bg-gray-100 rounded-xl">
            Hộp thư
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 mt-4">
          {conversations.map((conversation) => {
            const otherMembers = conversation.members.filter(member => member._id !== user._id);
            const lastMessage = conversation.lastMessage;
            
            return (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversationId(conversation._id)}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-xl transition-colors duration-200 ${
                  selectedConversationId === conversation._id ? "bg-gray-100" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={otherMembers[0]?.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {otherMembers[0]?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {otherMembers.map(member => `${member.firstName} ${member.lastName}`).join(', ')}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(lastMessage.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-0.5">
                    {lastMessage ? 
                      (lastMessage.sender._id === user._id ? "Bạn: " : "") + lastMessage.text 
                      : "Bắt đầu cuộc trò chuyện"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white ml-1 shadow-sm">
        {selectedConversationId ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b flex items-center bg-white">
              <div className="flex items-center flex-1">
                {(() => {
                  const conversation = conversations.find(c => c._id === selectedConversationId);
                  const otherMembers = conversation?.members.filter(member => member._id !== user._id);
                  return (
                    <>
                      <img
                        src={otherMembers?.[0]?.avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-1.jpg"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <h2 className="font-semibold text-gray-900">
                          {otherMembers?.map(member => `${member.firstName} ${member.lastName}`).join(', ')}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {otherMembers?.[0]?.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              <div className="space-y-2 max-w-full">
                {messages.map((message, index) => {
                  const showAvatar = !message.isOwn && 
                    (index === 0 || messages[index - 1].sender._id !== message.sender._id);
                  const isLastInGroup = index === messages.length - 1 || 
                    messages[index + 1]?.sender._id !== message.sender._id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} ${
                        !isLastInGroup ? "mb-1" : "mb-3"
                      }`}
                    >
                      <div
                        className={`flex ${
                          message.isOwn ? "flex-row-reverse" : "flex-row"
                        } items-end max-w-[75%] w-fit relative group`}
                      >
                        {!message.isOwn && showAvatar && (
                          <div className="flex-shrink-0 w-8">
                            <img
                              src={message.sender.avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-1.jpg"}
                              alt={`${message.sender.firstName} ${message.sender.lastName}`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"} ${!message.isOwn && showAvatar ? "ml-2" : ""}`}>
                          {!message.isOwn && showAvatar && (
                            <span className="text-xs text-gray-500 mb-1">
                              {`${message.sender.firstName} ${message.sender.lastName}`}
                            </span>
                          )}
                          <div className="relative max-w-full">
                            {message.recalled ? (
                              <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-500 italic text-sm">
                                Tin nhắn đã được thu hồi
                              </div>
                            ) : (
                              <>
                                {message.replyTo && (
                                  <div className="mb-2">
                                    <div className="px-3 py-2 bg-gray-50 border-l-[3px] border-gray-300 rounded-lg text-xs text-gray-600 max-w-full overflow-hidden">
                                      <span className="font-medium text-gray-900">
                                        {message.replyTo.sender._id === user._id 
                                          ? "Bạn"
                                          : `${message.replyTo.sender.firstName} ${message.replyTo.sender.lastName}`}
                                      </span>
                                      <p className="mt-1 line-clamp-2">
                                        {message.replyTo.text}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                <div
                                  className={`px-4 py-2 text-sm break-words ${
                                    message.isOwn
                                      ? "bg-blue-500 text-white rounded-t-2xl rounded-l-2xl"
                                      : "bg-gray-100 text-gray-900 rounded-t-2xl rounded-r-2xl"
                                  } ${
                                    !isLastInGroup 
                                      ? message.isOwn 
                                        ? "rounded-br-2xl" 
                                        : "rounded-bl-2xl"
                                      : ""
                                  }`}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    if (!message.recalled) setShowContextMenu(message.id);
                                  }}
                                >
                                  <div className="whitespace-pre-wrap">
                                    {message.content}
                                  </div>
                                </div>

                                {/* Quick reaction buttons - show on hover */}
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border rounded-full shadow-lg flex space-x-0.5 p-1 transition-opacity z-10">
                                  {["❤️", "😂", "😮", "😢", "😡", "👍"].map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => handleReaction(message.id, emoji)}
                                      className="hover:scale-125 transition-transform text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>

                                {/* Reactions */}
                                {message.reactions?.length > 0 && (
                                  <div className={`flex flex-wrap gap-1 mt-1 ${message.isOwn ? "justify-end" : "justify-start"}`}>
                                    {message.reactions.map((reaction, index) => (
                                      <div
                                        key={index}
                                        className="bg-white border rounded-full px-1.5 py-0.5 text-xs flex items-center shadow-sm"
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
                                  <div className={`absolute ${message.isOwn ? "right-0" : "left-0"} top-0 bg-white border shadow-lg rounded-lg py-1 z-20 min-w-[120px]`}>
                                    <button
                                      onClick={() => handleReply(message)}
                                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full transition-colors"
                                    >
                                      <Reply size={16} className="mr-2" />
                                      <span className="text-sm">Trả lời</span>
                                    </button>
                                    {message.isOwn && !message.recalled && (
                                      <button
                                        onClick={() => handleRecall(message.id)}
                                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full transition-colors"
                                      >
                                        <Trash2 size={16} className="mr-2" />
                                        <span className="text-sm">Thu hồi</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <div
                            className={`text-[10px] text-gray-400 mt-1 ${
                              message.isOwn ? "text-right" : "text-left"
                            }`}
                          >
                            {message.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {Object.values(typingUsers).length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 italic">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Smile size={16} className="text-gray-400" />
                    </div>
                    <span className="text-xs">{Object.values(typingUsers).join(', ')} đang nhập...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between border-t">
                <div className="flex-1 mr-4">
                  <div className="text-xs font-medium text-gray-900">
                    Đang trả lời {`${replyingTo.sender.firstName} ${replyingTo.sender.lastName}`}
                  </div>
                  <div className="text-sm text-gray-600 truncate mt-0.5">
                    {replyingTo.content}
                  </div>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ×
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 flex items-center gap-3 bg-white border-t">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Smile size={22} />
              </button>
              <input
                value={newMessage}
                onChange={handleTyping}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
}
