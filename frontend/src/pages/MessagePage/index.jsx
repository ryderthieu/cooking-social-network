import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import ReactDOM from 'react-dom';
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInYears,
  isToday,
  isYesterday
} from "date-fns";
import { vi } from "date-fns/locale";
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
  X,
  MessageSquareText
} from "lucide-react";
import { getConversation, getUserConversations } from "@/services/conversationService";
import { deleteMessage, getMessagesByConversation, searchMessages } from "@/services/messageService";

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
  const typingTimeoutRef = useRef(null); // Ref cho typing timeout
  const [tooltipConfig, setTooltipConfig] = useState({ visible: false, content: '', top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [scrollRestoreInfo, setScrollRestoreInfo] = useState(null); // Để khôi phục vị trí cuộn
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { conversationId: paramConversationId } = useParams();

  const messageContainerRef = useRef(null); // Ref cho container của tin nhắn

  // Thêm state cho tìm kiếm
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  // Effect để ưu tiên selectedConversationId từ URL params
  useEffect(() => {
    if (paramConversationId) {
      setSelectedConversationId(paramConversationId);
    }
    // If no paramConversationId is present in the URL (e.g., user lands on /messages),
    // selectedConversationId will remain null initially.
    // Another useEffect will handle navigating to the first conversation if appropriate.
  }, [paramConversationId]);

  // Effect to handle navigation when user lands on base /messages route
  // or if paramConversationId is removed (e.g. navigating from /messages/123 to /messages)
  useEffect(() => {
    // If there's no specific conversation ID in the URL (paramConversationId is falsy),
    // the user is authenticated, conversations are loaded,
    // and no conversation is currently effectively selected via URL (selectedConversationId might be from a previous URL param).
    if (!paramConversationId && user && conversations.length > 0) {
      // Check if selectedConversationId is null or if the current selected one is not in the fresh list of conversations
      // This also handles the case where the user was on a conversation that got deleted.
      // Or, more simply, if we are on the base /messages path and no param is driving selection.
      const currentPath = window.location.pathname.endsWith('/')
        ? window.location.pathname.slice(0, -1)
        : window.location.pathname;

      if (currentPath === '/messages') { // Only redirect if on the base /messages page
        const firstConversationId = conversations[0]._id;
        // Check if we are already trying to select this or if selectedConversationId is already set to this.
        // This check selectedConversationId !== firstConversationId can prevent re-navigation if already set.
        // However, relying on currentPath and !paramConversationId should be sufficient.
        navigate(`/messages/${firstConversationId}`, { replace: true });
      }
    }
  }, [conversations, paramConversationId, user, navigate, selectedConversationId]); // Added selectedConversationId to dependencies

  const TIME_GROUPING_THRESHOLD_MINUTES = 30; // Ngưỡng để hiển thị mốc thời gian
  // const {conversationId} = useParams() // Dòng này được thay thế bởi dòng có paramConversationId ở trên
  // Hàm định dạng thời gian tương đối
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    const seconds = differenceInSeconds(now, date);
    if (seconds < 60) return "vừa xong";

    const minutes = differenceInMinutes(now, date);
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = differenceInHours(now, date);
    if (hours < 24) return `${hours} giờ trước`;

    const days = differenceInDays(now, date);
    if (days < 7) return `${days} ngày trước`;
    
    const weeks = differenceInWeeks(now, date);
    if (weeks < 52) return `${weeks} tuần trước`; // Giả sử 1 năm có 52 tuần

    const years = differenceInYears(now, date);
    return `${years} năm trước`;
  };

  // CSS cho hiệu ứng typing
  const typingIndicatorStyle = `
    @keyframes typing-ellipsis {
      0% { content: "."; }
      33% { content: ".."; }
      66% { content: "..."; }
      100% { content: "."; }
    }
    .typing-ellipsis::after {
      content: ".";
      animation: typing-ellipsis 1.5s infinite;
    }
  `;

  // Tính toán ID và thời gian đọc của tin nhắn cuối cùng do người dùng hiện tại gửi và đã được người khác xem
  let lastReadUserMessageId = null;
  let latestReadTimestamp = null;

  if (user && messages && messages.length > 0) {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.isOwn && msg.readBy && msg.readBy.length > 0) {
        const otherReaders = msg.readBy.filter(reader => reader.userId !== user._id);
        if (otherReaders.length > 0) {
          const currentMessageReadTimestamp = otherReaders.reduce((latest, current) => {
            const currentTime = new Date(current.readAt).getTime();
            return currentTime > latest ? currentTime : latest;
          }, 0);
          
          if (currentMessageReadTimestamp > 0) {
            lastReadUserMessageId = msg.id;
            latestReadTimestamp = currentMessageReadTimestamp;
            break; 
          }
        }
      }
    }
  }

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
      socket.on('new_message', ({ message, conversationId: incomingConversationId, unreadCounts }) => {
        console.log("Socket event: new_message received in MessagePage", { message, incomingConversationId, currentSelectedConversationId: selectedConversationId });
        
        let messageIsForSelectedConversation = false;
        if (selectedConversationId === incomingConversationId) {
          messageIsForSelectedConversation = true;
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
                  createdAt: message.createdAt, // Sử dụng createdAt trực tiếp
                  isOwn: true, // Chắc chắn là của mình
                  recalled: message.recalled || message.text === "Tin nhắn này đã bị xóa",
                };
                // Nếu không ở bottom và tin nhắn mới không phải của mình
                if (!isAtBottom && message.sender._id !== user?._id) {
                  setHasNewMessage(true);
                  setUnreadCount(prev => prev + 1);
                }
                return updatedMessages;
              } else {
                // Không tìm thấy tin nhắn tạm khớp, hoặc có thể là tin nhắn từ tab khác của chính user
                // => thêm như bình thường nếu nó chưa tồn tại với _id thật
                if (!prevMessages.some(m => m.id === message._id)) {
                  const newMessage = {
                    id: message._id,
                    sender: message.sender,
                    content: message.text,
                    createdAt: message.createdAt, // Sử dụng createdAt trực tiếp
                    isOwn: message.sender._id === user._id,
                    avatar: message.sender.avatar,
                    reactions: message.reactions || [],
                    replyTo: message.replyTo,
                    recalled: message.recalled || message.text === "Tin nhắn này đã bị xóa",
                  };
                  // Nếu không ở bottom và tin nhắn mới không phải của mình
                  if (!isAtBottom && message.sender._id !== user?._id) {
                    setHasNewMessage(true);
                    setUnreadCount(prev => prev + 1);
                  }
                  return [...prevMessages, newMessage];
                }
                return prevMessages; // Đã tồn tại, không làm gì cả
              }
            } else {
              // Tin nhắn từ người khác, thêm nếu chưa có
              if (!prevMessages.some(m => m.id === message._id)) {
                const newMessage = {
                  id: message._id,
                  sender: message.sender,
                  content: message.text,
                  createdAt: message.createdAt, // Sử dụng createdAt trực tiếp
                  isOwn: false,
                  avatar: message.sender.avatar,
                  reactions: message.reactions || [],
                  replyTo: message.replyTo,
                  recalled: message.recalled || message.text === "Tin nhắn này đã bị xóa",
                };
                // Nếu không ở bottom và tin nhắn mới không phải của mình
                if (!isAtBottom && message.sender._id !== user?._id) {
                  setHasNewMessage(true);
                  setUnreadCount(prev => prev + 1);
                }
                return [...prevMessages, newMessage];
              }
              return prevMessages; // Đã tồn tại, không làm gì cả
            }
          });
          
          // Chỉ tự động cuộn xuống nếu đang ở bottom hoặc là tin nhắn của chính mình
          if (isAtBottom || message.sender._id === user?._id) {
            scrollToBottom();
          }
        }
        
        // Nếu tin nhắn mới đến trong cuộc trò chuyện đang mở và không phải của user hiện tại, đánh dấu đã xem
        if (messageIsForSelectedConversation && message.sender._id !== user?._id && socket && user) {
          socket.emit('mark_messages_as_seen', { conversationId: selectedConversationId });
          console.log(`Auto emitted mark_messages_as_seen for ${selectedConversationId} due to new incoming message.`);
        }
        
        // Cập nhật tin nhắn cuối cùng VÀ UNREAD COUNT cho danh sách cuộc trò chuyện
        setConversations(prevConvs => 
          prevConvs.map(conv => {
            if (conv._id === incomingConversationId) {
              let newUnreadCount = conv.unreadCount; // Giữ nguyên nếu không có unreadCounts từ server hoặc user hiện tại không có trong đó
              if (unreadCounts && unreadCounts.hasOwnProperty(user?._id)) {
                newUnreadCount = unreadCounts[user._id];
              } else if (message.sender._id !== user?._id) { 
                // Fallback: nếu không có unreadCounts từ server, tự tăng cho người nhận
                // Điều này có thể không cần nếu server luôn gửi unreadCounts chính xác
                newUnreadCount = (conv.unreadCount || 0) + 1;
              }
              return { ...conv, lastMessage: message, unreadCount: newUnreadCount };
            }
            return conv;
          }).sort((a, b) => { // Sắp xếp lại để conversation có tin nhắn mới lên đầu
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
          })
        );
      });

      const handleUserTyping = ({ userId, userName, conversationId }) => {
        if (userId === user?._id) return; // Bỏ qua sự kiện typing của chính mình
        if (selectedConversationId === conversationId) {
          setTypingUsers(prev => ({
            ...prev,
            [userId]: userName
          }));
        }
      };
      socket.on('user_typing', handleUserTyping);

      const handleUserStopTyping = ({ userId, conversationId }) => {
        if (userId === user?._id) return; // Bỏ qua sự kiện typing của chính mình
        if (selectedConversationId === conversationId) {
          setTypingUsers(prev => {
            const newTyping = { ...prev };
            delete newTyping[userId];
            return newTyping;
          });
        }
      };
      socket.on('user_stop_typing', handleUserStopTyping);
      
      // Cập nhật isOnline cho members trong conversations khi có sự kiện user_online/offline
      const updateUserOnlineStatus = (userId, isOnline) => {
        setConversations(prevConvs =>
          prevConvs.map(conv => ({
          ...conv,
          members: conv.members.map(member => 
              member._id === userId ? { ...member, isOnline } : member
            ),
            // Cập nhật otherUser nếu là cuộc trò chuyện 1-1
            otherUser: conv.otherUser && conv.otherUser._id === userId 
              ? { ...conv.otherUser, isOnline: isOnline }
              : conv.otherUser
          }))
        );
      };

      socket.on('user_online', (userId) => updateUserOnlineStatus(userId, true));
      socket.on('user_offline', (userId) => updateUserOnlineStatus(userId, false));
      
      socket.on('message_recalled', ({ messageId, conversationId, message }) => {
        if (selectedConversationId === conversationId) {
          // Cập nhật tin nhắn trong danh sách messages
          setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === messageId || msg._id === messageId
              ? { ...msg, content: "Tin nhắn đã được thu hồi", recalled: true }
              : msg
          ));
        }

        // Cập nhật lastMessage trong danh sách conversations nếu tin nhắn bị xóa là tin nhắn cuối cùng
        setConversations(prevConvs => prevConvs.map(conv => {
          if (conv._id === conversationId && (conv.lastMessage?.id === messageId || conv.lastMessage?._id === messageId)) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                text: "Tin nhắn đã được thu hồi",
                recalled: true
              }
            };
          }
          return conv;
        }));
      });
      
      socket.on('message_reaction', ({ messageId, conversationId, reactions }) => {
        if (selectedConversationId === conversationId) {
            setMessages(prevMessages => prevMessages.map(msg =>
                msg.id === messageId ? { ...msg, reactions: reactions } : msg
            ));
        }
    });

      socket.on('messages_seen', ({ conversationId, seenBy, unreadCount: unreadCountForSeenByUser }) => {
        if (selectedConversationId === conversationId) {
          // Cập nhật trạng thái đã đọc cho từng tin nhắn trong state `messages`
          setMessages(prevMessages => prevMessages.map(msg => {
            // Nếu tin nhắn không phải của người xem và chưa được đánh dấu là đã đọc bởi người xem
            if (msg.sender._id !== seenBy && (!msg.readBy || !msg.readBy.some(reader => reader.userId === seenBy))) {
              const newReadBy = msg.readBy ? [...msg.readBy, { userId: seenBy, readAt: new Date() }] : [{ userId: seenBy, readAt: new Date() }];
              return { ...msg, readBy: newReadBy };
            }
            return msg;
          }));
        }
        // Cập nhật unreadCount cho conversation trong danh sách, CHỈ KHI người xem là user hiện tại
        if (seenBy === user?._id) {
          setConversations(prevConvs => 
            prevConvs.map(conv => 
              conv._id === conversationId 
                ? { ...conv, unreadCount: unreadCountForSeenByUser } // Cập nhật unreadCount từ server
                : conv
            )
          );
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
        socket.off('messages_seen');
        socket.off('initial_online_users');

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        if (socket && user && selectedConversationId) {
          socket.emit("user_stop_typing", { conversationId: selectedConversationId, userId: user._id });
        }
      };
    }
  }, [socket, selectedConversationId, user, isAtBottom]);

  // Effect để lấy danh sách người dùng online ban đầu và cập nhật conversations
  useEffect(() => {
    if (socket) {
      socket.on('initial_online_users', (activeOnlineUserIds) => {
        setConversations(prevConvs =>
          prevConvs.map(conv => ({
            ...conv,
            members: conv.members.map(member => ({
              ...member,
              isOnline: activeOnlineUserIds.includes(member._id)
            })),
            otherUser: conv.otherUser 
              ? { ...conv.otherUser, isOnline: activeOnlineUserIds.includes(conv.otherUser._id) }
              : null
          }))
        );
      });
      return () => socket.off('initial_online_users');
    }
  }, [socket]);
  
  // Thêm effect để đánh dấu tin nhắn đã xem khi người dùng mở cuộc trò chuyện
  // hoặc khi có tin nhắn mới đến và người dùng đang xem cuộc trò chuyện đó
  useEffect(() => {
    if (selectedConversationId && socket && user) {
      const selectedConv = conversations.find(c => c._id === selectedConversationId);
      // Chỉ emit nếu có tin nhắn chưa đọc thực sự (dựa trên unreadCount của conversation)
      if (selectedConv && selectedConv.unreadCount > 0) {
        socket.emit('mark_messages_as_seen', { conversationId: selectedConversationId });
      }
    }
  }, [selectedConversationId, conversations, socket, user]); // Thêm conversations vào dependencies

  // Effect to re-sync conversation members' online status when onlineUsers from SocketContext changes
  // (Có thể không cần thiết nữa nếu initial_online_users và user_online/offline đã đủ)
  useEffect(() => {
    if (onlineUsers && conversations.length > 0) {
        setConversations(prevConvs =>
          prevConvs.map(conv => ({
          ...conv,
          members: conv.members.map(member => ({
            ...member,
              isOnline: onlineUsers.includes(member._id)
            })),
            otherUser: conv.otherUser 
              ? { ...conv.otherUser, isOnline: onlineUsers.includes(conv.otherUser._id) }
              : conv.otherUser
          }))
        );
    }
  }, [onlineUsers, conversations.length]); 

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserConversations({ page: 1, limit: 20 });
      if (response.data.success && response.data.data && response.data.data.conversations) {
        const fetchedConversations = response.data.data.conversations.map(conv => ({
          ...conv, // Dữ liệu từ API đã có members và otherUser được chuẩn bị sẵn
          // Client sẽ tự cập nhật isOnline dựa trên socket events
          members: conv.members.map(m => ({...m, isOnline: onlineUsers.includes(m._id)})),
          otherUser: conv.otherUser ? {...conv.otherUser, isOnline: onlineUsers.includes(conv.otherUser._id)} : null
        }));        
        setConversations(fetchedConversations);
        // Navigation to the first conversation (if no specific one is in URL)
        // is now handled by a separate useEffect.
      } else {
        setError(response.data.message || 'Không thể tải cuộc trò chuyện');
        setConversations([]); // Đảm bảo conversations là mảng rỗng khi có lỗi
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Không thể tải cuộc trò chuyện. Vui lòng thử lại.');
      setConversations([]); // Đảm bảo conversations là mảng rỗng khi có lỗi
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId, pageToFetch) => {
    if (!conversationId || !user) return;

    // Kiểm tra điều kiện để tránh gọi API không cần thiết
    if (pageToFetch > 1 && (isLoadingMore || !hasMoreMessages)) {
      return;
    }

    // Lưu trữ chiều cao cuộn trước khi tải tin nhắn mới
    let prevScrollHeightBeforeFetch = 0;
    if (pageToFetch > 1 && messageContainerRef.current) {
      prevScrollHeightBeforeFetch = messageContainerRef.current.scrollHeight;
    }

    try {
      if (pageToFetch > 1) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setMessages([]);
        setCurrentPage(1);
        setHasMoreMessages(true);
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = 0;
        }
      }
      setError(null);

      const response = await getMessagesByConversation({
        conversationId,
        page: pageToFetch,
        limit: 50,
      });

      if (response.data.success && response.data.data && response.data.data.messages) {
        const fetchedApiMessages = response.data.data.messages;
        const formattedFetchedMessages = fetchedApiMessages.map(msg => ({
          id: msg._id,
          sender: msg.sender,
          content: msg.text,
          createdAt: msg.createdAt,
          isOwn: msg.sender._id === user._id,
          avatar: msg.sender.avatar,
          reactions: msg.reactions || [],
          replyTo: msg.replyTo,
          recalled: msg.recalled || msg.text === "Tin nhắn này đã bị xóa",
          readBy: msg.readBy || []
        }));

        // Cập nhật tin nhắn theo trang
        if (pageToFetch > 1) {
          setMessages(prevMessages => {
            // Kiểm tra trùng lặp tin nhắn
            const newMessages = formattedFetchedMessages.filter(
              newMsg => !prevMessages.some(prevMsg => prevMsg.id === newMsg.id)
            );
            return [...newMessages, ...prevMessages];
          });

          // Khôi phục vị trí cuộn
          if (prevScrollHeightBeforeFetch > 0) {
            setScrollRestoreInfo({ prevScrollHeight: prevScrollHeightBeforeFetch });
          }
        } else {
          setMessages(formattedFetchedMessages);
        }

        // Kiểm tra nếu không còn tin nhắn để tải
        setHasMoreMessages(fetchedApiMessages.length === 50);
      } else {
        setError(response.data.message || 'Không thể tải tin nhắn');
        if (pageToFetch === 1) setMessages([]);
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
      if (pageToFetch === 1) setMessages([]);
      setHasMoreMessages(false);
    } finally {
      if (pageToFetch > 1) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectedConversationId && user) {
      // Reset states cho cuộc trò chuyện mới
      setMessages([]); // Xóa tin nhắn cũ
      setCurrentPage(1); // Đặt lại trang hiện tại là 1
      setHasMoreMessages(true); // Giả định là còn tin nhắn để tải
      setIsLoadingMore(false); // Reset trạng thái tải thêm
      setScrollRestoreInfo(null); // Reset thông tin khôi phục cuộn

      fetchMessages(selectedConversationId, 1); // Tải trang đầu tiên

      // Reset các state khác
      setReplyingTo(null);
      setShowContextMenu(null);
      setNewMessage("");
      setTypingUsers({});
    } else if (!selectedConversationId) {
      // Nếu không có cuộc trò chuyện nào được chọn (ví dụ: người dùng điều hướng ra khỏi /messages/:id)
      setMessages([]);
      setCurrentPage(1);
      setHasMoreMessages(true);
    }
    // Không cần fetchMessages ở đây nếu selectedConversationId là null
  }, [selectedConversationId, user]); // Thêm user vào dependencies

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    if (scrollRestoreInfo && messageContainerRef.current) {
      const { prevScrollHeight } = scrollRestoreInfo;
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight - prevScrollHeight;
      setScrollRestoreInfo(null);
    } else if (currentPage === 1 && !isLoading && !isLoadingMore && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollRestoreInfo, currentPage, isLoading, isLoadingMore]);

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
        createdAt: new Date().toISOString(), // Sử dụng ISO string cho createdAt
        isOwn: true,
        avatar: user.avatar,
        reactions: [],
        replyTo: replyingTo,
        recalled: false,
      }]);

      setNewMessage("");
      setReplyingTo(null);
      scrollToBottom(); // THÊM ĐỂ CUỘN XUỐNG KHI GỬI TIN NHẮN MỚI

      // Stop typing indication
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socket && user && selectedConversationId) {
        socket.emit("user_stop_typing", { conversationId: selectedConversationId, userId: user._id });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    const currentMessage = e.target.value;
    setNewMessage(currentMessage);

    if (!socket || !user || !selectedConversationId) return;

    if (currentMessage.trim() !== "") {
      socket.emit("user_typing", { 
        conversationId: selectedConversationId, 
        userId: user._id, 
        username: user.firstName || user.username 
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("user_stop_typing", { conversationId: selectedConversationId, userId: user._id });
      }, 3000); // 3 giây
      } else {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit("user_stop_typing", { conversationId: selectedConversationId, userId: user._id });
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setShowContextMenu(null);
  };

  const handleDeleteMessage = async (message) => {
    const messageId = message?.id || message?._id;
    if (!messageId) {
      console.error('MessageId is undefined', message);
      setError("Không thể xóa tin nhắn. ID tin nhắn không hợp lệ.");
      return;
    }

    try {
      const response = await deleteMessage({ messageId });
      
      if (response.data.success) {
        // Emit socket event để thông báo tin nhắn đã bị xóa
        if (socket) {
          socket.emit('delete_message', { 
            messageId,
            conversationId: selectedConversationId
          });
        }

        // Cập nhật UI ngay lập tức cho người gửi
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, content: "Tin nhắn đã được thu hồi", recalled: true } : msg
        ));

        // Cập nhật lastMessage trong conversations
        setConversations(prevConvs => prevConvs.map(conv => {
          if (conv._id === selectedConversationId && conv.lastMessage?.id === messageId) {
            return {
              ...conv,
              lastMessage: {
                ...conv.lastMessage,
                text: "Tin nhắn đã được thu hồi",
                recalled: true
              }
            };
          }
          return conv;
        }));
      } else {
        setError("Không thể xóa tin nhắn. " + (response.data.message || "Vui lòng thử lại."));
      }

      setShowContextMenu(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      const errorMessage = error.response?.data?.message || "Không thể xóa tin nhắn. Vui lòng thử lại.";
      setError(errorMessage);
    }
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
    const otherUser = conversation.otherUser;
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
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

  const formatDetailedMessageTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: vi });
    }
    if (isYesterday(date)) {
      return `Hôm qua lúc ${format(date, 'HH:mm', { locale: vi })}`;
    }
    if (differenceInYears(now, date) < 1) {
      return `${format(date, 'dd/MM', { locale: vi })} lúc ${format(date, 'HH:mm', { locale: vi })}`;
    }
    return `${format(date, 'dd/MM/yyyy', { locale: vi })} lúc ${format(date, 'HH:mm', { locale: vi })}`;
  };

  const checkIfAtBottom = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
      const isBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      setIsAtBottom(isBottom);
      if (isBottom) {
        setHasNewMessage(false);
        setUnreadCount(0);
      }
    }
  };

  const handleScroll = () => {
    if (messageContainerRef.current && user && selectedConversationId) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
      
      // Kiểm tra vị trí cuộn cho infinite scroll
      if (scrollTop < 100 && !isLoadingMore && hasMoreMessages && !isLoading) {
        const nextPageToFetch = currentPage + 1;
        setCurrentPage(nextPageToFetch);
        fetchMessages(selectedConversationId, nextPageToFetch);
      }

      // Kiểm tra xem có ở bottom không
      checkIfAtBottom();
    }
  };

  // Thêm debounce để tránh gọi handleScroll quá nhiều lần
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      let timeoutId;
      const debouncedScroll = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          handleScroll();
        }, 150); // Debounce 150ms
      };

      container.addEventListener('scroll', debouncedScroll);
      return () => {
        container.removeEventListener('scroll', debouncedScroll);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [selectedConversationId, user, isLoadingMore, hasMoreMessages, currentPage, isLoading]);

  // Thêm hàm xử lý click nút "Tin nhắn mới"
  const handleNewMessageClick = () => {
    scrollToBottom();
    setHasNewMessage(false);
    setUnreadCount(0);
  };

  // Thêm hàm xử lý tìm kiếm
  const handleSearch = async () => {
    if (!searchText.trim() || !selectedConversationId) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await searchMessages({
        query: searchText,
        conversationId: selectedConversationId,
        page: 1,
        limit: 20
      });

      if (response.data.success) {
        setSearchResults(response.data.data.messages);
      } else {
        setSearchError(response.data.message || 'Không thể tìm kiếm tin nhắn');
      }
    } catch (error) {
      console.error('Error searching messages:', error);
      setSearchError('Đã xảy ra lỗi khi tìm kiếm');
    } finally {
      setIsSearching(false);
    }
  };

  // Thêm hàm xử lý khi click vào kết quả tìm kiếm
  const handleSearchResultClick = (messageId) => {
    const messageElement = document.getElementById(`message-item-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('message-highlighted');
      setTimeout(() => {
        messageElement.classList.remove('message-highlighted');
      }, 2000);
    }
    setSearchResults([]); // Đóng kết quả tìm kiếm
    setSearchText(""); // Reset ô tìm kiếm
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
            const otherUser = conversation.otherUser;
            const lastMessage = conversation.lastMessage;
            const isOnline = otherUser?.isOnline;
            
            return (
              <div
                key={conversation._id}
                onClick={() => navigate(`/messages/${conversation._id}`)}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-150 ${
                  selectedConversationId === conversation._id ? "bg-blue-50 hover:bg-blue-100" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={otherUser?.avatar || "/default-avatar.png"}
                    alt={otherUser?.name || "Avatar"}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => { e.target.src = "/default-avatar.png" }}
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0 relative">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold truncate ${selectedConversationId === conversation._id ? "text-blue-700" : "text-gray-800"}`}>
                      {otherUser?.name || 'Người dùng'}
                    </p>
                    {lastMessage && (
                      <span className={`text-xs  ml-2 flex-shrink-0 ${conversation.unreadCount > 0 ? "font-bold text-black" : "text-gray-400"}`}>
                        {/* Hiển thị thời gian tương đối cho lastMessage trong danh sách conversation */}
                        {formatRelativeTime(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${conversation.unreadCount > 0 ? "font-bold text-black" : "text-gray-500 "}`} >
                      {lastMessage ? 
                      (lastMessage.sender._id === user?._id ? "Bạn: " : "") + (lastMessage.text === "Tin nhắn này đã bị xóa" ? "Tin nhắn đã thu hồi" : lastMessage.text || '')
                        : "Bắt đầu cuộc trò chuyện"}
                    </p>
                  {conversation.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 inline-block absolute right-0 top-6">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        {selectedConversationId && conversations.find(c => c._id === selectedConversationId) ? (
          <>
            {/* Chat Header with Search */}
            <div className="px-6 py-3 border-b border-gray-200 bg-white shadow-sm relative">
              <div className="flex items-center justify-between">
                {(() => {
                  const conversation = conversations.find(c => c._id === selectedConversationId);
                const otherUser = conversation?.otherUser;
                const isOnline = otherUser?.isOnline;
                  
                  return (
                  <div className="flex items-center">
                    <div className="relative flex-shrink-0">
                      <img
                        src={otherUser?.avatar || "/default-avatar.png"}
                        alt={otherUser?.name || "Avatar"}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => { e.target.src = "/default-avatar.png" }}
                        />
                        {isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                    <div className="ml-3">
                      <h2 className="font-semibold text-gray-800 text-base">
                        {otherUser?.name || 'Người dùng'}
                        </h2>
                      <p className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                        </p>
                      </div>
                  </div>
                  );
                })()}
                <div className="flex items-center space-x-2">
                  {/* Search Input */}
                  <div className="relative mr-2">
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Tìm tin nhắn..."
                      className="w-48 px-3 py-1.5 pl-8 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <Search 
                      className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
                      size={14}
                      onClick={handleSearch}
                    />
                    {isSearching && (
                      <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    {searchText && !isSearching && (
                      <button
                        onClick={() => {
                          setSearchText('');
                          setSearchResults([]);
                          setSearchError(null);
                        }}
                        className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

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

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute right-6 top-16 w-72 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">
                      Tìm thấy {searchResults.length} kết quả
                    </p>
                  </div>
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      onClick={() => handleSearchResultClick(result._id)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={result.sender.avatar || "/default-avatar.png"}
                          alt={result.sender.firstName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {result.sender.firstName} {result.sender.lastName}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {result.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(result.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Error Message */}
              {searchError && (
                <div className="absolute right-6 top-16 w-72 bg-red-50 text-red-600 p-3 rounded-lg shadow-lg border border-red-100">
                  <p className="text-sm">{searchError}</p>
                </div>
              )}
            </div>

            {/* Style for message highlight */}
            <style>
              {`
                @keyframes highlight {
                  0% { background-color: rgba(59, 130, 246, 0.1); }
                  50% { background-color: rgba(59, 130, 246, 0.2); }
                  100% { background-color: transparent; }
                }
                .message-highlighted {
                  animation: highlight 2s ease-out;
                }
              `}
            </style>

            {/* Messages Container */}
            <div
              ref={messageContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-white to-gray-50/50"
            >
              {/* Loading indicator cho infinite scroll */}
              {isLoadingMore && (
                <div className="flex justify-center items-center py-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-sm text-gray-500">Đang tải tin nhắn cũ...</span>
                </div>
              )}

              {/* Thông báo khi không còn tin nhắn cũ */}
              {!isLoadingMore && !hasMoreMessages && messages.length > 0 && (
                <div className="text-center py-3">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Bạn đã xem hết tin nhắn
                  </span>
                </div>
              )}

              {/* Loading indicator cho lần tải đầu tiên */}
              {isLoading && messages.length === 0 && !isLoadingMore && (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-500">Đang tải tin nhắn...</p>
                </div>
              )}

              {/* Hiển thị khi không có tin nhắn */}
              {!isLoading && messages.length === 0 && !isLoadingMore && selectedConversationId && (
                <div className="flex flex-col justify-center items-center h-full text-gray-500">
                  <MessageSquareText size={48} className="mb-4 text-gray-400"/>
                  <p className="font-semibold">Không có tin nhắn nào</p>
                  <p className="text-sm">Hãy bắt đầu cuộc trò chuyện này!</p>
                </div>
              )}

              {/* Danh sách tin nhắn */}
              {messages.map((message, index) => {
                const prevMessage = messages[index-1];
                const nextMessage = messages[index+1];

                const showSenderInfo = !message.isOwn && 
                  (index === 0 || prevMessage?.sender._id !== message.sender._id || (prevMessage && message.createdAt && prevMessage.createdAt && new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5*60*1000));
                
                const isFirstInGroupChain = index === 0 || prevMessage?.sender._id !== message.sender._id || message.isOwn !== prevMessage?.isOwn;
                const isLastInGroupChain = index === messages.length - 1 || nextMessage?.sender._id !== message.sender._id || message.isOwn !== nextMessage?.isOwn;

                let showTimeSeparator = false;
                if (message.createdAt) {
                  if (index === 0) {
                    showTimeSeparator = true;
                  } else if (prevMessage && prevMessage.createdAt) {
                    const diffMinutes = differenceInMinutes(new Date(message.createdAt), new Date(prevMessage.createdAt));
                    if (diffMinutes >= TIME_GROUPING_THRESHOLD_MINUTES) {
                      showTimeSeparator = true;
                    }
                  }
                }
                  
                  return (
                  <React.Fragment key={message.id}>
                    {showTimeSeparator && (
                      <div className="text-center my-3">
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-slate-400 px-2 py-1 rounded-full shadow-sm">
                          {format(new Date(message.createdAt), 'HH:mm', { locale: vi })}
                        </span>
                      </div>
                    )}
                    <div
                      id={`message-item-${message.id}`}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} ${
                        showSenderInfo && !showTimeSeparator ? "mt-2" : "mt-px"
                      } group relative`}
                    >
                      {!message.isOwn && (
                        <div className="flex-shrink-0 w-8 h-8 self-end mr-2">
                          {showSenderInfo && (
                            <img
                              src={message.sender.avatar || "/default-avatar.png"}
                              alt={`${message.sender.firstName} ${message.sender.lastName}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          )}
                        </div>
                      )}
                      <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"} max-w-xs sm:max-w-sm md:max-w-md relative group`}>
                        <div className={`flex items-center gap-1`}>
                          {/* Message bubble */}
                          <div 
                            onMouseEnter={(e) => {
                              if (!message.recalled) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipConfig({
                                  visible: true,
                                  content: formatDetailedMessageTime(message.createdAt),
                                  top: rect.top + rect.height / 2,
                                  left: rect.left
                                });
                              }
                            }}
                            onMouseLeave={() => {
                              setTooltipConfig(prev => ({ ...prev, visible: false }));
                            }}
                            className={`relative px-3 py-2 rounded-lg
                              ${message.isOwn ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-slate-50" : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100"} 
                              ${message.recalled ? "italic text-gray-500" : ""} 
                              hover:shadow-md transition-shadow duration-150`}
                          >
                            {message.recalled ? (
                              <div className="whitespace-pre-wrap italic">Tin nhắn đã được thu hồi</div>
                            ) : (
                              <>
                                {/* Reply preview */}
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
                                {/* Message content */}
                                <div className="whitespace-pre-wrap">{message.content}</div>
                              </>
                            )}
                          </div>

                          {/* Message actions */}
                          {!message.recalled && (
                            <div className={`absolute ${message.isOwn ? "left-0 -translate-x-full -ml-1" : "right-0 translate-x-full ml-1"} top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150`}>
                              {!message.isOwn ? (
                                <>
                                  <button
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      setReactionPickerTarget({
                                        messageId: message.id || message._id,
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
                                    onClick={() => handleDeleteMessage(message)}
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

                        {/* Reactions */}
                        {Array.isArray(message.reactions) && message.reactions.length > 0 && !message.recalled && (
                          <div className={`flex flex-wrap gap-x-0.5 gap-y-1 mt-1 items-center ${message.isOwn ? "justify-end" : "justify-start"}`}>
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

                        {/* Message status */}
                        {(() => {
                          if (message.id === lastReadUserMessageId && latestReadTimestamp) {
                            return (
                              <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 px-1">
                                Đã xem {format(new Date(latestReadTimestamp), 'HH:mm', { locale: vi })}
                              </div>
                            );
                          } else if (index === messages.length - 1 && message.isOwn && !message.recalled) {
                            return (
                              <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 px-1">
                                Đã gửi
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              {/* Typing indicator */}
              {Object.keys(typingUsers).length > 0 && (
                <div className="text-sm text-gray-500 italic px-4 pb-2 flex items-center">
                  <style>{typingIndicatorStyle}</style>
                  <span>{Object.values(typingUsers).join(", ")}</span>
                  <span className="typing-ellipsis ml-1"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* New Message Button */}
            {hasNewMessage && (
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={handleNewMessageClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-200 animate-bounce"
                >
                  <span>Tin nhắn mới</span>
                  <Send size={16} className="transform rotate-90" />
                </button>
              </div>
            )}

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

    {/* Tooltip Portal */}
    {tooltipConfig.visible && ReactDOM.createPortal(
      <div 
        className="fixed z-[9999] px-2.5 py-1.5 text-xs text-white bg-gray-800 dark:bg-slate-900 rounded-md shadow-xl whitespace-nowrap pointer-events-none select-none transition-opacity duration-100"
        style={{
          top: `${tooltipConfig.top}px`,
          left: `${tooltipConfig.left}px`,
          transform: 'translate(-100%, -50%)',
          marginLeft: '-8px', // Khoảng cách với cạnh trái của bubble
          opacity: tooltipConfig.visible ? 1 : 0, 
        }}
      >
        {tooltipConfig.content}
      </div>,
      document.getElementById('tooltip-portal')
    )}
</div>
);
}
