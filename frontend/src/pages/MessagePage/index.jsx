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
  Search,
  Phone,
  Video,
  Paperclip,
  X
} from "lucide-react";
import { getConversation, getUserConversations } from "@/services/conversationService";
import { deleteMessage, getMessagesByConversation } from "@/services/messageService";

export default function MessagePage() {
  const navigate = useNavigate();
  const { socket, onlineUsers } = useSocket();
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
  const [reactionPickerTarget, setReactionPickerTarget] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
  }, [user, loading, navigate]);

  // Socket listeners
  useEffect(() => {
    console.log("Online users in this component:", onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', ({ message, conversationId: incomingConversationId }) => {
        console.log("Socket event: new_message received in MessagePage", { message, incomingConversationId, currentSelectedConversationId: selectedConversationId });
        
        if (selectedConversationId === incomingConversationId) {
          setMessages(prevMessages => {
            // Kiểm tra xem tin nhắn này có phải là để cập nhật một tin nhắn tạm đã được optimistic update không
            // Điều này đúng nếu người gửi tin nhắn từ server là user hiện tại
            if (message.sender._id === user?._id) {
              const tempMessageIdPattern = /^temp-/; // Tin nhắn tạm có id bắt đầu bằng "temp-"
              // Tìm xem có tin nhắn tạm nào chưa có _id thật không, và nội dung gần giống
              // Hoặc đơn giản hơn: nếu người gửi là mình, giả định tin nhắn server gửi về là để thay thế tin nhắn tạm cuối cùng mình đã gửi
              
              const lastOwnTempMessageIndex = prevMessages.findLastIndex(
                m => m.isOwn && tempMessageIdPattern.test(m.id) && m.content === message.text // Thêm điều kiện content khớp để chắc chắn hơn
              );

              if (lastOwnTempMessageIndex !== -1) {
                const updatedMessages = [...prevMessages];
                updatedMessages[lastOwnTempMessageIndex] = {
                  ...updatedMessages[lastOwnTempMessageIndex], // Giữ lại một số thuộc tính client nếu cần
                  ...message, // Ghi đè bằng dữ liệu từ server
                  id: message._id, // Quan trọng: cập nhật id thật
                  content: message.text, // Đảm bảo content là từ server
                  time: new Date(message.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                  isOwn: true, // Chắc chắn là của mình
                  recalled: message.recalled || message.text === "Tin nhắn này đã bị xóa",
                };
                return updatedMessages;
              } else {
                // Không tìm thấy tin nhắn tạm khớp, hoặc có thể là tin nhắn từ tab khác của chính user
                // => thêm như bình thường nếu nó chưa tồn tại với _id thật
                if (!prevMessages.some(m => m.id === message._id)) {
                  return [...prevMessages, {
                    id: message._id,
                    sender: message.sender,
                    content: message.text,
                    time: new Date(message.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                    isOwn: message.sender._id === user._id,
                    avatar: message.sender.avatar,
                    reactions: message.reactions || [],
                    replyTo: message.replyTo,
                    recalled: message.recalled || message.text === "Tin nhắn này đã bị xóa",
                  }];
                }
                return prevMessages; // Đã tồn tại, không làm gì cả
              }
            } else {
              // Tin nhắn từ người khác, thêm nếu chưa có
              if (!prevMessages.some(m => m.id === message._id)) {
                return [...prevMessages, {
                  id: message._id,
                  sender: message.sender,
                  content: message.text,
                  time: new Date(message.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
                  isOwn: false,
                  avatar: message.sender.avatar,
                  reactions: message.reactions || [],
                  replyTo: message.replyTo,
                  recalled: message.recalled || message.text === "Tin nhắn này đã bị xóa",
                }];
              }
              return prevMessages; // Đã tồn tại, không làm gì cả
            }
          });
        }
        
        // Cập nhật tin nhắn cuối cùng cho danh sách cuộc trò chuyện
        setConversations(prevConvs => 
          prevConvs.map(conv => 
            conv._id === incomingConversationId 
              ? { ...conv, lastMessage: message } 
              : conv
          ).sort((a, b) => { // Sắp xếp lại để conversation có tin nhắn mới lên đầu
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
          })
        );
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
      
      socket.on('user_online', (userId) => {
        setConversations(prev => prev.map(conv => ({
          ...conv,
          members: conv.members.map(member =>
            member._id === userId
              ? { ...member, isOnline: true }
              : member
          )
        })));
      });

      socket.on('user_offline', (userId) => {
        setConversations(prev => prev.map(conv => ({
          ...conv,
          members: conv.members.map(member =>
            member._id === userId
              ? { ...member, isOnline: false }
              : member
          )
        })));
      });
      
      socket.on('message_recalled', ({ messageId, conversationId }) => {
        if (selectedConversationId === conversationId) {
          setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === messageId ? { ...msg, content: "Tin nhắn đã được thu hồi", recalled: true, text: "Tin nhắn này đã bị xóa" } : msg
          ));
        }
      });
      
      socket.on('message_reaction', ({ messageId, conversationId, reactions }) => {
        if (selectedConversationId === conversationId) {
            setMessages(prevMessages => prevMessages.map(msg =>
                msg.id === messageId ? { ...msg, reactions: reactions } : msg
            ));
        }
    });

      return () => {
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('user_stop_typing');
        socket.off('user_online');
        socket.off('user_offline');
        socket.off('message_recalled');
        socket.off('message_reaction');
      };
    }
  }, [socket, selectedConversationId, user?._id]);

  // Effect to re-sync conversation members' online status when onlineUsers from context changes
  useEffect(() => {
    setConversations(prevConvs =>
      prevConvs.map(conv => ({
        ...conv,
        members: conv.members.map(member => ({
          ...member,
          isOnline: onlineUsers.includes(member._id)
        }))
      }))
    );
  }, [onlineUsers]); // Dependency: re-run when onlineUsers array reference changes

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserConversations({ page: 1, limit: 20 }); // Fetch more conversations initially
      if (response.data.success) {
        const fetchedConversations = response.data.data.conversations.map(conv => ({
          ...conv,
          members: conv.members.map(member => ({
            ...member,
            isOnline: onlineUsers.includes(member._id)
          }))
        }));
        setConversations(fetchedConversations);
        if (fetchedConversations.length > 0 && !selectedConversationId) {
          setSelectedConversationId(fetchedConversations[0]._id);
          // fetchMessages will be called by useEffect [selectedConversationId]
        }
      } else {
        setError(response.data.message || 'Không thể tải cuộc trò chuyện');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Không thể tải cuộc trò chuyện. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMessagesByConversation({ conversationId, page: 1, limit: 50 }); // Fetch more messages
      console.log(response)
      if (response.data.success) {
        const formattedMessages = response.data.data.messages.map(msg => ({
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
          recalled: msg.recalled || msg.text === "Tin nhắn này đã bị xóa",
        }));
        setMessages(formattedMessages);
      } else {
        setError(response.data.message || 'Không thể tải tin nhắn');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

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
    if (newMessage.trim() && selectedConversationId && user) {
      socket.emit("send_message", {
        conversationId: selectedConversationId,
        type: 'text',
        text: newMessage,
        replyTo: replyingTo?.id
      });
      
      // Optimistically update UI
      const tempMessageId = `temp-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: tempMessageId,
        sender: { _id: user._id, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar },
        content: newMessage,
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        avatar: user.avatar,
        reactions: [],
        replyTo: replyingTo,
        recalled: false,
      }]);

      setNewMessage("");
      setReplyingTo(null);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (selectedConversationId) {
      if (e.target.value.trim()) {
        socket.emit("user_typing", {
          conversationId: selectedConversationId,
          userId: user._id,
          userName: user.firstName + " " + user.lastName
        });
      } else {
        socket.emit("user_stop_typing", {
          conversationId: selectedConversationId,
          userId: user._id
        });
      }
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setShowContextMenu(null);
  };

  const handleRecall = async (messageId) => {
    try {
      await deleteMessage({ messageId });
      // UI update will be handled by socket event 'message_recalled'
      console.log("Yêu cầu thu hồi tin nhắn đã gửi");
    } catch (error) {
      console.error('Error recalling message:', error);
      setError("Lỗi khi thu hồi tin nhắn.");
    }
    setShowContextMenu(null);
  };

  const handleReaction = async (messageId, reactionType) => {
    if (!socket) {
      console.error("Socket not available for sending reaction");
      setError("Không thể kết nối để gửi cảm xúc.");
      return;
    }
    try {
      console.log(`Emitting react_to_message: messageId=${messageId}, type=${reactionType}`);
      socket.emit("react_to_message", { 
        messageId, 
        type: reactionType 
      });
      // UI sẽ được cập nhật thông qua sự kiện socket 'message_reaction' từ server
      // Không cần optimistic update ở đây nữa nếu server phản hồi nhanh và broadcast sự kiện
    } catch (error) {
      console.error('Error emitting reaction via socket:', error);
      setError("Lỗi khi gửi cảm xúc qua socket.");
    }
  };
  
  const filteredConversations = conversations.filter(conversation => {
    const otherMembers = conversation.members.filter(member => member._id !== user?._id);
    const name = otherMembers.map(member => `${member.firstName} ${member.lastName}`).join(', ');
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => { // Sort by last message time
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
  });

  const renderReactionPicker = () => {
    if (!reactionPickerTarget || !reactionPickerTarget.anchorEl) return null;

    const rect = reactionPickerTarget.anchorEl.getBoundingClientRect();
    const pickerTop = rect.top - 40; // Adjust as needed, 40 is approx height of picker
    const pickerLeft = rect.left;

    const availableReactions = ["❤️", "😂", "😮", "😢", "😡", "👍"];

    return (
      <div 
        className="fixed bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full shadow-xl py-1 px-1 flex items-center space-x-0.5 z-50"
        style={{ top: `${pickerTop}px`, left: `${pickerLeft}px` }}
      >
        {availableReactions.map(emoji => (
          <button
            key={emoji}
            onClick={() => {
              handleReaction(reactionPickerTarget.messageId, emoji);
              setReactionPickerTarget(null); // Close picker
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-full text-base hover:scale-110 transition-transform"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  };

  // Add useEffect to handle closing picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionPickerTarget && reactionPickerTarget.anchorEl && 
          !reactionPickerTarget.anchorEl.contains(event.target) &&
          // Optional: Check if the click is outside the picker itself if picker is not a child of anchorEl
          event.target.closest('.fixed.bg-white') === null // Crude check, improve if picker has specific class
         ) {
        setReactionPickerTarget(null);
      }
    };

    if (reactionPickerTarget) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reactionPickerTarget]);

  const handleScrollToOriginalMessage = (originalMessageId) => {
    const originalMessageElement = document.getElementById(`message-item-${originalMessageId}`);
    if (originalMessageElement) {
      originalMessageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      originalMessageElement.classList.add('message-highlighted');
      setTimeout(() => {
        originalMessageElement.classList.remove('message-highlighted');
      }, 1500); // Highlight trong 1.5 giây
    }
  };

  if (loading) { // Only show initial full page loader
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 mt-[70px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (error && conversations.length === 0) { // Show error only if no conversations loaded
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-red-50 text-red-700 mt-[70px] p-4">
        <Info size={48} className="mb-4"/>
        <p className="text-xl font-semibold mb-2">Ối, có lỗi xảy ra!</p>
        <p className="text-center mb-6">{error}</p>
        <button
          onClick={fetchConversations}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-gray-100 mt-[70px] h-[calc(100vh-70px)]">
      {/* Sidebar */}
      <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Chat</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && conversations.length === 0 && <div className="p-4 text-center text-gray-500">Đang tải danh sách...</div>}
          {!isLoading && conversations.length === 0 && !error && (
            <div className="p-4 text-center text-gray-500 h-full flex flex-col justify-center items-center">
                <MessageSquareText size={48} className="mb-4 text-gray-400"/>
                <p className="font-semibold">Không có cuộc trò chuyện nào</p>
                <p className="text-sm">Hãy bắt đầu trò chuyện với bạn bè.</p>
            </div>
          )}
          {filteredConversations.map((conversation) => {
            const otherMembers = conversation.members.filter(member => member._id !== user?._id);
            const mainOtherMember = otherMembers[0]; // Assuming one-on-one or using the first member for display
            const lastMessage = conversation.lastMessage;
            const isOnline = mainOtherMember?.isOnline;

            return (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversationId(conversation._id)}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-150 ${
                  selectedConversationId === conversation._id ? "bg-blue-50 hover:bg-blue-100" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={mainOtherMember?.avatar || "/default-avatar.png"}
                    alt={mainOtherMember ? `${mainOtherMember.firstName} ${mainOtherMember.lastName}`: "Avatar"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold truncate ${selectedConversationId === conversation._id ? "text-blue-700" : "text-gray-800"}`}>
                      {otherMembers.map(member => `${member.firstName} ${member.lastName}`).join(', ')}
                    </p>
                    {lastMessage && (
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {new Date(lastMessage.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {lastMessage ? 
                      (lastMessage.sender._id === user?._id ? "Bạn: " : "") + (lastMessage.text === "Tin nhắn này đã bị xóa" ? "Tin nhắn đã thu hồi" :lastMessage.text)
                      : "Bắt đầu cuộc trò chuyện"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {selectedConversationId && conversations.find(c => c._id === selectedConversationId) ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                {(() => {
                  const conversation = conversations.find(c => c._id === selectedConversationId);
                  const otherMembers = conversation?.members.filter(member => member._id !== user?._id);
                  const mainOtherMember = otherMembers?.[0];
                  const isOnline = mainOtherMember?.isOnline;
                  
                  return (
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0">
                        <img
                          src={mainOtherMember?.avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-1.jpg"}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                         {isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h2 className="font-semibold text-gray-800 text-base">
                          {otherMembers?.map(member => `${member.firstName} ${member.lastName}`).join(', ')}
                        </h2>
                        <p className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                          {isOnline ? 'Đang hoạt động' : (mainOtherMember?.lastActive ? `Hoạt động ${new Date(mainOtherMember.lastActive).toLocaleTimeString("vi-VN", {hour:'2-digit', minute:'2-digit'})}` : 'Không hoạt động')}
                        </p>
                      </div>
                    </div>
                  );
                })()}
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-500">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-500">
                    <Video size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-500">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-white to-gray-50/50">
              {isLoading && messages.length === 0 && <div className="p-4 text-center text-gray-500">Đang tải tin nhắn...</div>}
              {messages.map((message, index) => {
                const prevMessage = messages[index-1];
                const nextMessage = messages[index+1];

                const showSenderInfo = !message.isOwn && 
                  (index === 0 || prevMessage?.sender._id !== message.sender._id || (prevMessage && new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5*60*1000));
                
                const isFirstInGroupChain = index === 0 || prevMessage?.sender._id !== message.sender._id || message.isOwn !== prevMessage?.isOwn;
                const isLastInGroupChain = index === messages.length - 1 || nextMessage?.sender._id !== message.sender._id || message.isOwn !== nextMessage?.isOwn;

                return (
                  <div
                    key={message.id}
                    id={`message-item-${message.id}`}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"} ${showSenderInfo ? 'mt-2' : 'mt-px'} group`}>
                    {!message.isOwn && (
                      <div className="flex-shrink-0 w-8 h-8 self-end mr-2">
                        {showSenderInfo && (
                          <img
                            src={message.sender.avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-1.jpg"}
                            alt={`${message.sender.firstName} ${message.sender.lastName}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        )}
                      </div>
                    )}
                    <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                      {/* PART 1: REPLY INDICATOR TEXT (ABOVE BUBBLE) */}
                      {message.replyTo && message.replyTo.sender && (
                        <div className={`flex items-center text-xs mb-0.5 
                                        ${message.isOwn ? 'text-gray-200/90 dark:text-slate-300/80' : 'text-gray-500 dark:text-slate-400'}
                                        ${message.isOwn ? (showSenderInfo ? '' : 'mr-0') : (showSenderInfo ? '' : 'ml-0')}
                                      `}>
                          <span>
                            {message.isOwn 
                              ? "Bạn đã trả lời" 
                              : ((message.sender?.firstName || "Ai đó") + " đã trả lời " + 
                                (message.replyTo.sender?._id === user?._id 
                                  ? "bạn" 
                                  : (message.replyTo.sender?.firstName || "một người") + (message.replyTo.sender?.lastName ? ` ${message.replyTo.sender.lastName}` : '')))
                            }
                          </span>
                        </div>
                      )}

                      <div className={`flex items-end ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
                        <div 
                          className={`relative px-3 py-2 rounded-lg 
                                      ${message.isOwn ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-slate-50" : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100"} 
                                      ${message.recalled ? "italic text-gray-500 opacity-70" : ""} 
                                      group-hover:shadow-md transition-shadow duration-150 max-w-xs sm:max-w-sm md:max-w-md`}
                        >
                          {message.recalled ? (
                            <div className="whitespace-pre-wrap italic">Tin nhắn đã được thu hồi</div>
                          ) : (
                            <>
                              {/* PART 2: ORIGINAL MESSAGE PREVIEW (INSIDE BUBBLE) */}
                              {message.replyTo && (
                                <div 
                                  onClick={() => handleScrollToOriginalMessage(message.replyTo.id)}
                                  className={`mb-2 p-2 border-l-4 rounded-r-sm cursor-pointer hover:bg-opacity-80 transition-all
                                              ${message.isOwn 
                                                ? 'bg-blue-400/30 hover:bg-blue-400/40 border-blue-300/50' 
                                                : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 border-gray-400/50 dark:border-slate-500/50'}
                                            `}
                                >
                                  <span className={`block text-xs font-semibold truncate 
                                                  ${message.isOwn ? 'text-blue-100/90' : 'text-gray-700 dark:text-slate-300'}
                                                `}>
                                    {message.replyTo.sender?._id === user?._id ? "Bạn" : (message.replyTo.sender?.firstName || "Ai đó")}
                                  </span>
                                  <p className={`mt-0.5 text-xs line-clamp-2 
                                                 ${message.isOwn ? 'text-blue-100/80' : 'text-gray-600 dark:text-slate-400'}
                                              `}>
                                    {message.replyTo.recalled 
                                      ? <span className="italic">Tin nhắn đã được thu hồi</span>
                                      : message.replyTo.type === 'text'
                                        ? message.replyTo.content 
                                        : message.replyTo.type === 'image' ? "Hình ảnh"
                                        : message.replyTo.type === 'sticker' ? "Nhãn dán"
                                        : message.replyTo.type === 'share' ? `${message.replyTo.sharedType === 'post' ? 'Bài viết' : 'Video'} được chia sẻ`
                                        : message.replyTo.content || "Tin nhắn"
                                  }
                                  </p>
                                </div>
                              )}
                              {/* PART 3: CURRENT REPLY CONTENT */}
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            </>
                          )}
                        </div>
                        {!message.recalled && (
                          <div className={`flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${message.isOwn ? 'mr-1.5' : 'ml-1.5'} mb-0.5`}>
                            {!message.isOwn ? (
                              <>
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setReactionPickerTarget({
                                      messageId: message.id,
                                      anchorEl: e.currentTarget
                                    });
                                  }}
                                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-500 dark:text-slate-400"
                                  title="Thả cảm xúc"
                                >
                                  <Smile size={16} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleReply(message); }}
                                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-500 dark:text-slate-400"
                                  title="Trả lời"
                                >
                                  <Reply size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleReply(message); }}
                                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-500 dark:text-slate-400"
                                  title="Trả lời"
                                >
                                  <Reply size={16} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleRecall(message.id); }}
                                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-700 rounded-full text-red-500 dark:text-red-300"
                                  title="Thu hồi"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {Array.isArray(message.reactions) && message.reactions.length > 0 && !message.recalled && (
                        <div className={`flex flex-wrap gap-x-0.5 gap-y-1 mt-1 items-center ${message.isOwn ? "justify-end pr-1" : "justify-start pl-1"}`}>
                          {message.reactions.slice(0, 4).map((reaction, idx) => { 
                            if (!reaction || typeof reaction.type !== 'string' || !Array.isArray(reaction.users)) {
                              return null;
                            }
                            const userHasReacted = reaction.users.some(u => u._id === user?._id);
                            return (
                              <button
                                key={`${reaction.type}-${idx}`}
                                onClick={(e) => { e.stopPropagation(); if (!message.isOwn) handleReaction(message.id, reaction.type); }}
                                disabled={message.isOwn}
                                className={`px-1 py-px rounded-full text-xs flex items-center gap-0.5 transition-colors shadow-sm 
                                  ${userHasReacted
                                    ? "bg-blue-100 dark:bg-blue-600 border border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-100"
                                    : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200"
                                  } ${message.isOwn ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                title={reaction.users.map(u => (u && (u.firstName || u.username)) || "Ai đó").join(", ") + ` đã thả ${reaction.type}`}
                              >
                                <span className="text-xs">{reaction.type}</span> 
                                {reaction.users.length > 0 && (
                                  <span className="font-normal text-[10px] ml-px">
                                    {reaction.users.length}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                          {message.reactions.length > 4 && !message.recalled && ( 
                            <div 
                              className="px-1 py-px rounded-full text-[10px] flex items-center justify-center bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 cursor-pointer shadow-sm min-w-[20px] h-[18px] ml-0.5"
                              title={`Xem thêm ${message.reactions.length - 4} cảm xúc khác`}
                            >
                              +{message.reactions.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                      {isLastInGroupChain && (
                        <div className={`text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 clear-both ${message.isOwn ? "text-right mr-1" : "text-left ml-1"}`}>
                          {message.time}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {Object.values(typingUsers).length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 italic p-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="flex space-x-0.5">
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                  <span className="text-xs">{Object.values(typingUsers).join(', ')} đang nhập...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyingTo && (
              <div className="px-4 py-2.5 bg-gray-100 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 mr-3 overflow-hidden">
                  <div className="text-xs font-medium text-gray-700">
                    Đang trả lời <span className="text-blue-600">{replyingTo.sender._id === user?._id ? "chính bạn" : `${replyingTo.sender.firstName} ${replyingTo.sender.lastName}`}</span>
                  </div>
                  <div className="text-sm text-gray-600 truncate mt-0.5">
                    {replyingTo.content === "Tin nhắn này đã bị xóa" ? "Tin nhắn đã được thu hồi" : replyingTo.content}
                  </div>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={16}/> {/* X icon for close */}
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-3 flex items-center gap-2 bg-white border-t border-gray-200 shadow- ऊपर">
              <button className="text-gray-500 hover:text-blue-500 p-2 rounded-full transition-colors hover:bg-gray-100">
                <Paperclip size={20} />
              </button>
              <button className="text-gray-500 hover:text-blue-500 p-2 rounded-full transition-colors hover:bg-gray-100">
                <Image size={20} />
              </button>
              <div className="flex-1 relative">
                <input
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 p-1.5 rounded-full hover:bg-gray-200 transition-colors">
                  <Smile size={20} />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors duration-150 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white p-8">
            <Send size={64} className="text-gray-300 mb-6"/>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Trình nhắn tin của bạn</h3>
            <p className="text-gray-500 text-center">Gửi tin nhắn riêng tư cho bạn bè hoặc nhóm.</p>
          </div>
        )}
      </div>
      {renderReactionPicker()}
    </div>
  );
}
