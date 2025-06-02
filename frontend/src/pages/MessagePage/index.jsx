import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  format,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInYears,
  isToday,
  isYesterday,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  Heart,
  Info,
  Plus,
  Image as ImageIcon,
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
  MessageSquareText,
  Settings,
  Bell,
  User,
  Image,
  FileText,
  ChevronDown,
  ChevronRight,
  Share2,
  UtensilsCrossed,
} from "lucide-react";
import {
  getConversation,
  getUserConversations,
} from "@/services/conversationService";
import {
  deleteMessage,
  getMessagesByConversation,
  searchMessages,
} from "@/services/messageService";
import { useCloudinary } from "../../context/CloudinaryContext";
import postsService from "@/services/postService";
import { getVideoById } from "@/services/videoService";
import { getRecipeById } from "@/services/recipeService";
import EmojiPicker from "emoji-picker-react";
import Tooltip from "../../components/Tooltip";

export const formatRelativeTime = (dateString) => {
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

export default function MessagePage() {
  const navigate = useNavigate();
  const { socket, onlineUsers } = useSocket();
  const { user, loading } = useAuth();
  const { uploadImage } = useCloudinary();
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
  const [sharedPosts, setSharedPosts] = useState({});
  const [sharedVideos, setSharedVideos] = useState({});
  const [sharedRecipes, setSharedRecipes] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null); // Ref cho typing timeout
  const [tooltipConfig, setTooltipConfig] = useState({
    visible: false,
    content: "",
    top: 0,
    left: 0,
  });
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

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const [showInfoSidebar, setShowInfoSidebar] = useState(false);
  const [selectedTab, setSelectedTab] = useState("media"); // 'media', 'files', 'links'

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShowIconPicker, setIsShowIconPicker] = useState(false)
  // Thêm state cho modal tìm kiếm
  const [showSearchModal, setShowSearchModal] = useState(false);

  const getReplyPreviewContent = (originalMessage) => {
    if (!originalMessage) return "";
    if (
      originalMessage.recalled ||
      originalMessage.text === "Tin nhắn đã được thu hồi" ||
      originalMessage.content === "Tin nhắn đã được thu hồi"
    ) {
      return "Tin nhắn đã được thu hồi";
    }
    if (originalMessage.type === "image") return "Hình ảnh";
    if (originalMessage.type === "share") {
      if (originalMessage.sharedType === "post") return "Bài viết được chia sẻ";
      if (originalMessage.sharedType === "video") return "Video được chia sẻ";
      return "Nội dung được chia sẻ";
    }
    return originalMessage.text || originalMessage.content || "";
  };
  const handleEmojiClick = (emojiData, event) => {
    setNewMessage(prev => prev + emojiData.emoji)
    console.log(emojiData)
  }
  const fetchPostDetails = async (postId) => {
    try {
      const response = await postsService.fetchById(postId);
      console.log(response);
      setSharedPosts((prev) => ({
        ...prev,
        [postId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };
  const fetchVideoDetails = async (videoId) => {
    try {
      const response = await getVideoById(videoId);
      console.log(response);
      setSharedVideos((prev) => ({
        ...prev,
        [videoId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching video details:", error);
    }
  };
  const fetchRecipeDetails = async (recipeId) => {
    try {
      const response = await getRecipeById(recipeId);
      console.log(response);
      setSharedRecipes((prev) => ({
        ...prev,
        [recipeId]: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };
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
      const currentPath = window.location.pathname.endsWith("/")
        ? window.location.pathname.slice(0, -1)
        : window.location.pathname;

      if (currentPath === "/messages") {
        // Only redirect if on the base /messages page
        const firstConversationId = conversations[0]._id;
        // Check if we are already trying to select this or if selectedConversationId is already set to this.
        // This check selectedConversationId !== firstConversationId can prevent re-navigation if already set.
        // However, relying on currentPath and !paramConversationId should be sufficient.
        navigate(`/messages/${firstConversationId}`, { replace: true });
      }
    }
  }, [
    conversations,
    paramConversationId,
    user,
    navigate,
    selectedConversationId,
  ]); // Added selectedConversationId to dependencies

  const TIME_GROUPING_THRESHOLD_MINUTES = 30; // Ngưỡng để hiển thị mốc thời gian
  // const {conversationId} = useParams() // Dòng này được thay thế bởi dòng có paramConversationId ở trên
  // Hàm định dạng thời gian tương đối

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
        const otherReaders = msg.readBy.filter(
          (reader) => reader.userId !== user._id
        );
        if (otherReaders.length > 0) {
          const currentMessageReadTimestamp = otherReaders.reduce(
            (latest, current) => {
              const currentTime = new Date(current.readAt).getTime();
              return currentTime > latest ? currentTime : latest;
            },
            0
          );

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
      navigate("/login");
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
      socket.on(
        "new_message",
        ({ message, conversationId: incomingConversationId, unreadCounts }) => {
          console.log("Socket event: new_message received in MessagePage", {
            message,
            incomingConversationId,
            currentSelectedConversationId: selectedConversationId,
          });

          let messageIsForSelectedConversation = false;
          if (selectedConversationId === incomingConversationId) {
            messageIsForSelectedConversation = true;
            setMessages((prevMessages) => {
              // Kiểm tra xem tin nhắn này có phải là để cập nhật một tin nhắn tạm đã được optimistic update không
              if (message.sender._id === user?._id) {
                const tempMessageIdPattern = /^temp-/;
                const lastOwnTempMessageIndex = prevMessages.findLastIndex(
                  (m) =>
                    m.isOwn &&
                    tempMessageIdPattern.test(m.id) &&
                    ((message.type === "text" && m.content === message.text) ||
                      (message.type === "image" && m.image === message.image))
                );

                if (lastOwnTempMessageIndex !== -1) {
                  const updatedMessages = [...prevMessages];
                  updatedMessages[lastOwnTempMessageIndex] = {
                    ...updatedMessages[lastOwnTempMessageIndex],
                    id: message._id,
                    type: message.type,
                    text: message.text,
                    image: message.image,
                    content:
                      message.type === "text" ? message.text : message.image,
                    createdAt: message.createdAt,
                    isOwn: true,
                    recalled: message.recalled,
                  };
                  return updatedMessages;
                }
              }

              // Tin nhắn từ người khác hoặc không tìm thấy tin nhắn tạm
              if (!prevMessages.some((m) => m.id === message._id)) {
                const newMessage = {
                  id: message._id,
                  sender: message.sender,
                  type: message.type,
                  text: message.text,
                  image: message.image,
                  content:
                    message.type === "text" ? message.text : message.image,
                  createdAt: message.createdAt,
                  isOwn: message.sender._id === user?._id,
                  avatar: message.sender.avatar,
                  reactions: message.reactions || [],
                  replyTo: message.replyTo,
                  recalled: message.recalled,
                };

                if (!isAtBottom && message.sender._id !== user?._id) {
                  setHasNewMessage(true);
                  setUnreadCount((prev) => prev + 1);
                }
                return [...prevMessages, newMessage];
              }
              return prevMessages;
            });

            if (isAtBottom || message.sender._id === user?._id) {
              scrollToBottom();
            }
          }

          // Cập nhật tin nhắn cuối cùng trong danh sách cuộc trò chuyện
          setConversations((prevConvs) =>
            prevConvs
              .map((conv) => {
                if (conv._id === incomingConversationId) {
                  let newUnreadCount = conv.unreadCount;
                  if (unreadCounts && unreadCounts.hasOwnProperty(user?._id)) {
                    newUnreadCount = unreadCounts[user._id];
                  } else if (message.sender._id !== user?._id) {
                    newUnreadCount = (conv.unreadCount || 0) + 1;
                  }
                  return {
                    ...conv,
                    lastMessage: {
                      ...message,
                      text: message.recalled
                        ? "Tin nhắn đã được thu hồi"
                        : message.type === "text"
                          ? message.text
                          : message.type === "image"
                            ? "Đã gửi một hình ảnh"
                            : message.type === "share"
                              ? message.sharedType === "post"
                                ? "Đã chia sẻ một bài viết"
                                : message.sharedType === "video"
                                  ? "Đã chia sẻ một video"
                                  : message.text || "Đã chia sẻ một liên kết"
                              : message.text, // fallback
                    },
                    unreadCount: newUnreadCount,
                  };
                }
                return conv;
              })
              .sort((a, b) => {
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return (
                  new Date(b.lastMessage.createdAt) -
                  new Date(a.lastMessage.createdAt)
                );
              })
          );

          // Đánh dấu đã xem nếu đang mở cuộc trò chuyện
          if (
            messageIsForSelectedConversation &&
            message.sender._id !== user?._id &&
            socket &&
            user
          ) {
            socket.emit("mark_messages_as_seen", {
              conversationId: selectedConversationId,
            });
          }
        }
      );

      const handleUserTyping = ({ userId, userName, conversationId }) => {
        if (userId === user?._id) return; // Bỏ qua sự kiện typing của chính mình
        if (selectedConversationId === conversationId) {
          setTypingUsers((prev) => ({
            ...prev,
            [userId]: userName,
          }));
        }
      };
      socket.on("user_typing", handleUserTyping);

      const handleUserStopTyping = ({ userId, conversationId }) => {
        if (userId === user?._id) return; // Bỏ qua sự kiện typing của chính mình
        if (selectedConversationId === conversationId) {
          setTypingUsers((prev) => {
            const newTyping = { ...prev };
            delete newTyping[userId];
            return newTyping;
          });
        }
      };
      socket.on("user_stop_typing", handleUserStopTyping);

      // Cập nhật isOnline cho members trong conversations khi có sự kiện user_online/offline
      const updateUserOnlineStatus = (userId, isOnline) => {
        setConversations((prevConvs) =>
          prevConvs.map((conv) => ({
            ...conv,
            members: conv.members.map((member) =>
              member._id === userId ? { ...member, isOnline } : member
            ),
            // Cập nhật otherUser nếu là cuộc trò chuyện 1-1
            otherUser:
              conv.otherUser && conv.otherUser._id === userId
                ? { ...conv.otherUser, isOnline: isOnline }
                : conv.otherUser,
          }))
        );
      };

      socket.on("user_online", (userId) =>
        updateUserOnlineStatus(userId, true)
      );
      socket.on("user_offline", (userId) =>
        updateUserOnlineStatus(userId, false)
      );

      socket.on(
        "message_recalled",
        ({ messageId, conversationId, message }) => {
          if (selectedConversationId === conversationId) {
            // Cập nhật tin nhắn trong danh sách messages
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === messageId || msg._id === messageId
                  ? {
                    ...msg,
                    content: "Tin nhắn đã được thu hồi",
                    recalled: true,
                  }
                  : msg
              )
            );
          }

          // Cập nhật lastMessage trong danh sách conversations nếu tin nhắn bị xóa là tin nhắn cuối cùng
          setConversations((prevConvs) =>
            prevConvs.map((conv) => {
              if (
                conv._id === conversationId &&
                (conv.lastMessage?.id === messageId ||
                  conv.lastMessage?._id === messageId)
              ) {
                return {
                  ...conv,
                  lastMessage: {
                    ...conv.lastMessage,
                    text: "Tin nhắn đã được thu hồi",
                    recalled: true,
                  },
                };
              }
              return conv;
            })
          );
        }
      );

      socket.on(
        "message_reaction",
        ({ messageId, conversationId, reactions }) => {
          if (selectedConversationId === conversationId) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === messageId ? { ...msg, reactions: reactions } : msg
              )
            );
          }
        }
      );

      socket.on(
        "messages_seen",
        ({ conversationId, seenBy, unreadCount: unreadCountForSeenByUser }) => {
          if (selectedConversationId === conversationId) {
            // Cập nhật trạng thái đã đọc cho từng tin nhắn trong state `messages`
            setMessages((prevMessages) =>
              prevMessages.map((msg) => {
                // Nếu tin nhắn không phải của người xem và chưa được đánh dấu là đã đọc bởi người xem
                if (
                  msg.sender._id !== seenBy &&
                  (!msg.readBy ||
                    !msg.readBy.some((reader) => reader.userId === seenBy))
                ) {
                  const newReadBy = msg.readBy
                    ? [...msg.readBy, { userId: seenBy, readAt: new Date() }]
                    : [{ userId: seenBy, readAt: new Date() }];
                  return { ...msg, readBy: newReadBy };
                }
                return msg;
              })
            );
          }
          // Cập nhật unreadCount cho conversation trong danh sách, CHỈ KHI người xem là user hiện tại
          if (seenBy === user?._id) {
            setConversations((prevConvs) =>
              prevConvs.map((conv) =>
                conv._id === conversationId
                  ? { ...conv, unreadCount: unreadCountForSeenByUser } // Cập nhật unreadCount từ server
                  : conv
              )
            );
          }
        }
      );

      return () => {
        socket.off("new_message");
        socket.off("user_typing");
        socket.off("user_stop_typing");
        socket.off("user_online");
        socket.off("user_offline");
        socket.off("message_recalled");
        socket.off("message_reaction");
        socket.off("messages_seen");
        socket.off("initial_online_users");

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        if (socket && user && selectedConversationId) {
          socket.emit("user_stop_typing", {
            conversationId: selectedConversationId,
            userId: user._id,
          });
        }
      };
    }
  }, [socket, selectedConversationId, user, isAtBottom]);

  // Effect để lấy danh sách người dùng online ban đầu và cập nhật conversations
  useEffect(() => {
    if (socket) {
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
      return () => socket.off("initial_online_users");
    }
  }, [socket]);

  // Thêm effect để đánh dấu tin nhắn đã xem khi người dùng mở cuộc trò chuyện
  // hoặc khi có tin nhắn mới đến và người dùng đang xem cuộc trò chuyện đó
  useEffect(() => {
    if (selectedConversationId && socket && user) {
      const selectedConv = conversations.find(
        (c) => c._id === selectedConversationId
      );
      // Chỉ emit nếu có tin nhắn chưa đọc thực sự (dựa trên unreadCount của conversation)
      if (selectedConv && selectedConv.unreadCount > 0) {
        socket.emit("mark_messages_as_seen", {
          conversationId: selectedConversationId,
        });
      }
    }
  }, [selectedConversationId, conversations, socket, user]); // Thêm conversations vào dependencies

  // Effect to re-sync conversation members' online status when onlineUsers from SocketContext changes
  // (Có thể không cần thiết nữa nếu initial_online_users và user_online/offline đã đủ)
  useEffect(() => {
    if (onlineUsers && conversations.length > 0) {
      setConversations((prevConvs) =>
        prevConvs.map((conv) => ({
          ...conv,
          members: conv.members.map((member) => ({
            ...member,
            isOnline: onlineUsers.includes(member._id),
          })),
          otherUser: conv.otherUser
            ? {
              ...conv.otherUser,
              isOnline: onlineUsers.includes(conv.otherUser._id),
            }
            : conv.otherUser,
        }))
      );
    }
  }, [onlineUsers, conversations.length]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserConversations({ page: 1, limit: 20 });
      if (
        response.data.success &&
        response.data.data &&
        response.data.data.conversations
      ) {
        const fetchedConversations = response.data.data.conversations.map(
          (conv) => ({
            ...conv, // Dữ liệu từ API đã có members và otherUser được chuẩn bị sẵn
            // Client sẽ tự cập nhật isOnline dựa trên socket events
            members: conv.members.map((m) => ({
              ...m,
              isOnline: onlineUsers.includes(m._id),
            })),
            otherUser: conv.otherUser
              ? {
                ...conv.otherUser,
                isOnline: onlineUsers.includes(conv.otherUser._id),
              }
              : null,
          })
        );
        setConversations(fetchedConversations);
        // Navigation to the first conversation (if no specific one is in URL)
        // is now handled by a separate useEffect.
      } else {
        setError(response.data.message || "Không thể tải cuộc trò chuyện");
        setConversations([]); // Đảm bảo conversations là mảng rỗng khi có lỗi
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Không thể tải cuộc trò chuyện. Vui lòng thử lại.");
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
      console.log(response);
      if (
        response.data.success &&
        response.data.data &&
        response.data.data.messages
      ) {
        const fetchedApiMessages = response.data.data.messages;
        const formattedFetchedMessages = fetchedApiMessages.map((msg) => ({
          id: msg._id,
          sender: msg.sender,
          type: msg.type,
          sharedType: msg.sharedType,
          sharedId: msg.sharedId,
          text: msg.text,
          image: msg.image,
          content: msg.type === "text" ? msg.text : msg.image,
          createdAt: msg.createdAt,
          isOwn: msg.sender._id === user._id,
          avatar: msg.sender.avatar,
          reactions: msg.reactions || [],
          replyTo: msg.replyTo,
          recalled: msg.recalled || msg.text === "Tin nhắn này đã bị xóa",
          readBy: msg.readBy || [],
        }));

        // Cập nhật tin nhắn theo trang
        if (pageToFetch > 1) {
          setMessages((prevMessages) => {
            // Kiểm tra trùng lặp tin nhắn
            const newMessages = formattedFetchedMessages.filter(
              (newMsg) =>
                !prevMessages.some((prevMsg) => prevMsg.id === newMsg.id)
            );
            return [...newMessages, ...prevMessages];
          });

          // Khôi phục vị trí cuộn
          if (prevScrollHeightBeforeFetch > 0) {
            setScrollRestoreInfo({
              prevScrollHeight: prevScrollHeightBeforeFetch,
            });
          }
        } else {
          setMessages(formattedFetchedMessages);
        }

        // Kiểm tra nếu không còn tin nhắn để tải
        setHasMoreMessages(fetchedApiMessages.length === 50);
      } else {
        setError(response.data.message || "Không thể tải tin nhắn");
        if (pageToFetch === 1) setMessages([]);
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Không thể tải tin nhắn. Vui lòng thử lại.");
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
    messagesEndRef.current?.scrollIntoView();
  };

  useLayoutEffect(() => {
    if (scrollRestoreInfo && messageContainerRef.current) {
      const { prevScrollHeight } = scrollRestoreInfo;
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight - prevScrollHeight;
      setScrollRestoreInfo(null);
    } else if (
      currentPage === 1 &&
      !isLoading &&
      !isLoadingMore &&
      messages.length > 0
    ) {
      scrollToBottom();
    }
  }, [messages, scrollRestoreInfo, currentPage, isLoading, isLoadingMore]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversationId && user) {
      socket.emit("send_message", {
        conversationId: selectedConversationId,
        type: "text",
        text: newMessage,
        replyTo: replyingTo?.id,
      });

      // Optimistically update UI
      const tempMessageId = `temp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: tempMessageId,
          sender: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
          },
          content: newMessage,
          createdAt: new Date().toISOString(), // Sử dụng ISO string cho createdAt
          isOwn: true,
          avatar: user.avatar,
          reactions: [],
          replyTo: replyingTo,
          recalled: false,
        },
      ]);

      setNewMessage("");
      setReplyingTo(null);
      scrollToBottom(); // THÊM ĐỂ CUỘN XUỐNG KHI GỬI TIN NHẮN MỚI

      // Stop typing indication
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socket && user && selectedConversationId) {
        socket.emit("user_stop_typing", {
          conversationId: selectedConversationId,
          userId: user._id,
        });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
        username: user.firstName || user.username,
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("user_stop_typing", {
          conversationId: selectedConversationId,
          userId: user._id,
        });
      }, 3000); // 3 giây
    } else {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket.emit("user_stop_typing", {
        conversationId: selectedConversationId,
        userId: user._id,
      });
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setShowContextMenu(null);
  };

  const handleDeleteMessage = async (message) => {
    const messageId = message?.id || message?._id;
    if (!messageId) {
      console.error("MessageId is undefined", message);
      setError("Không thể xóa tin nhắn. ID tin nhắn không hợp lệ.");
      return;
    }

    try {
      const response = await deleteMessage({ messageId });

      if (response.data.success) {
        // Emit socket event để thông báo tin nhắn đã bị xóa
        if (socket) {
          socket.emit("delete_message", {
            messageId,
            conversationId: selectedConversationId,
          });
        }

        // Cập nhật UI ngay lập tức cho người gửi
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, content: "Tin nhắn đã được thu hồi", recalled: true }
              : msg
          )
        );

        // Cập nhật lastMessage trong conversations
        setConversations((prevConvs) =>
          prevConvs.map((conv) => {
            if (
              conv._id === selectedConversationId &&
              conv.lastMessage?.id === messageId
            ) {
              return {
                ...conv,
                lastMessage: {
                  ...conv.lastMessage,
                  text: "Tin nhắn đã được thu hồi",
                  recalled: true,
                },
              };
            }
            return conv;
          })
        );
      } else {
        setError(
          "Không thể xóa tin nhắn. " +
          (response.data.message || "Vui lòng thử lại.")
        );
      }

      setShowContextMenu(null);
    } catch (error) {
      console.error("Error deleting message:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể xóa tin nhắn. Vui lòng thử lại.";
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
      console.log(
        `Emitting react_to_message: messageId=${messageId}, type=${reactionType}`
      );
      socket.emit("react_to_message", {
        messageId,
        type: reactionType,
      });
      // UI sẽ được cập nhật thông qua sự kiện socket 'message_reaction' từ server
      // Không cần optimistic update ở đây nữa nếu server phản hồi nhanh và broadcast sự kiện
    } catch (error) {
      console.error("Error emitting reaction via socket:", error);
      setError("Lỗi khi gửi cảm xúc qua socket.");
    }
  };

  const filteredConversations = conversations
    .filter((conversation) => {
      const otherUser = conversation.otherUser;
      return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return (
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
      );
    });

  const renderReactionPicker = () => {
    if (!reactionPickerTarget || !reactionPickerTarget.anchorEl) return null;

    const rect = reactionPickerTarget.anchorEl.getBoundingClientRect();
    const pickerTop = rect.top - 40; // Adjust as needed, 40 is approx height of picker
    const pickerLeft = rect.left;

    const availableReactions = ["❤️", "😂", "😮", "😢", "😡", "👍"];

    return (
      <div
        className="fixed bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full shadow-xl py-1 px-1 flex items-center space-x-0.5 z-50 reaction-picker-popover"
        style={{ top: `${pickerTop}px`, left: `${pickerLeft}px` }}
      >
        {availableReactions.map((emoji) => (
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
      if (
        reactionPickerTarget &&
        reactionPickerTarget.anchorEl &&
        !reactionPickerTarget.anchorEl.contains(event.target) &&
        event.target.closest(".reaction-picker-popover") === null // Sử dụng class CSS cụ thể
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
    const originalMessageElement = document.getElementById(
      `message-item-${originalMessageId}`
    );
    if (originalMessageElement) {
      originalMessageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      originalMessageElement.classList.add("message-highlighted");
      setTimeout(() => {
        originalMessageElement.classList.remove("message-highlighted");
      }, 1500); // Highlight trong 1.5 giây
    }
  };

  const formatDetailedMessageTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    if (isToday(date)) {
      return format(date, "HH:mm", { locale: vi });
    }
    if (isYesterday(date)) {
      return `Hôm qua lúc ${format(date, "HH:mm", { locale: vi })}`;
    }
    if (differenceInYears(now, date) < 1) {
      return `${format(date, "dd/MM", { locale: vi })} lúc ${format(
        date,
        "HH:mm",
        { locale: vi }
      )}`;
    }
    return `${format(date, "dd/MM/yyyy", { locale: vi })} lúc ${format(
      date,
      "HH:mm",
      { locale: vi }
    )}`;
  };

  const checkIfAtBottom = () => {
    if (messageContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;
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
      const { scrollTop, scrollHeight, clientHeight } =
        messageContainerRef.current;

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

      container.addEventListener("scroll", debouncedScroll);
      return () => {
        container.removeEventListener("scroll", debouncedScroll);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [
    selectedConversationId,
    user,
    isLoadingMore,
    hasMoreMessages,
    currentPage,
    isLoading,
  ]);

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
        limit: 20,
      });

      if (response.data.success) {
        // Lọc bỏ tin nhắn đã xóa và tin nhắn không hợp lệ khỏi kết quả tìm kiếm
        const filteredResults = response.data.data.messages.filter((msg) => {
          return (
            !isMessageDeleted(msg) &&
            ((msg.type === "text" && msg.text && msg.text.trim() !== "") ||
              (msg.type === "image" && msg.image && msg.image.trim() !== ""))
          );
        });
        setSearchResults(filteredResults);
      } else {
        setSearchError(response.data.message || "Không thể tìm kiếm tin nhắn");
      }
    } catch (error) {
      console.error("Error searching messages:", error);
      setSearchError("Đã xảy ra lỗi khi tìm kiếm");
    } finally {
      setIsSearching(false);
    }
  };

  const scrollToMessage = (messageId) => {
    const messageElement = document.getElementById(`message-item-${messageId}`);
    if (messageElement && messageContainerRef.current) {
      // Tính toán vị trí cuộn trong container
      const container = messageContainerRef.current;
      const messageTop = messageElement.offsetTop;
      const containerHeight = container.clientHeight;

      // Cuộn container đến vị trí tin nhắn
      container.scrollTo({
        top: messageTop - containerHeight / 2,
        behavior: "smooth",
      });

      // Thêm hiệu ứng highlight
      messageElement.classList.add("message-highlighted");
      setTimeout(() => {
        messageElement.classList.remove("message-highlighted");
      }, 2000);
    }
  };

  const handleSearchResultClick = (messageId) => {
    scrollToMessage(messageId);
    setIsSearchOpen(false); // Đóng dropdown sau khi click
  };

  const handleCloseSearch = () => {
    setSearchResults([]); // Đóng kết quả tìm kiếm
    setSearchText(""); // Reset ô tìm kiếm
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const result = await uploadImage(file, "messages");
        if (result.secure_url) {
          // Gửi tin nhắn hình ảnh qua socket
          socket.emit("send_message", {
            conversationId: selectedConversationId,
            type: "image",
            image: result.secure_url, // Sử dụng trường image thay vì text
          });

          // Optimistic update UI
          const tempMessageId = `temp-${Date.now()}`;
          setMessages((prev) => [
            ...prev,
            {
              id: tempMessageId,
              sender: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
              },
              type: "image",
              image: result.secure_url, // Sử dụng trường image
              createdAt: new Date().toISOString(),
              isOwn: true,
              avatar: user.avatar,
              reactions: [],
              recalled: false,
            },
          ]);

          scrollToBottom();
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setIsUploading(true);
          try {
            const result = await uploadImage(file, "messages");
            if (result.secure_url) {
              // Gửi tin nhắn hình ảnh qua socket
              socket.emit("send_message", {
                conversationId: selectedConversationId,
                type: "image",
                image: result.secure_url,
              });

              // Optimistic update UI
              const tempMessageId = `temp-${Date.now()}`;
              setMessages((prev) => [
                ...prev,
                {
                  id: tempMessageId,
                  sender: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                  },
                  type: "image",
                  image: result.secure_url,
                  createdAt: new Date().toISOString(),
                  isOwn: true,
                  avatar: user.avatar,
                  reactions: [],
                  recalled: false,
                },
              ]);

              scrollToBottom();
            }
          } catch (error) {
            console.error("Error uploading pasted image:", error);
            setError("Không thể tải ảnh lên. Vui lòng thử lại.");
          } finally {
            setIsUploading(false);
          }
        }
      }
    }
  };

  // Thêm vào phần render message để hiển thị ảnh
  const renderMessageContent = (message) => {
    if (message.recalled) {
      return (
        <div className="whitespace-pre-wrap italic">
          Tin nhắn đã được thu hồi
        </div>
      );
    }

    if (message.type === "image") {
      return (
        <img
          src={message.image}
          alt="Message"
          className="max-w-[300px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(message.image, "_blank")}
          onError={(e) => {
            e.target.src = "/placeholder-image.png";
            console.error("Failed to load image:", message.image);
          }}
        />
      );
    }

    if (message.type === "share" && message.sharedId) {
      // Fetch post details if not already fetched for 'post' type
      if (message.sharedType === "post" && !sharedPosts[message.sharedId]) {
        fetchPostDetails(message.sharedId);
      }
      // Fetch recipe details if not already fetched for 'recipe' type
      else if (message.sharedType === "recipe" && !sharedRecipes[message.sharedId]) {
        fetchRecipeDetails(message.sharedId);
      }

      const sharedPost = sharedPosts[message.sharedId];
      const sharedRecipe = sharedRecipes[message.sharedId];
      if (message.sharedType === "post") {
        return (
          <div
            onClick={() =>
              message.sharedId &&
              window.open(`/posts/${message.sharedId}`, "_blank")
            }
            className="bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all border border-gray-200 overflow-hidden max-w-[300px]"
          >
            {/* Post Preview */}
            {sharedPost?.media?.[0]?.url ? (
              <div className="w-full aspect-video relative overflow-hidden">
                <img
                  src={sharedPost.media[0].url}
                  alt="Post preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                <FileText className="text-gray-400" size={32} />
              </div>
            )}

            {/* Post Info */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Share2 size={16} className="text-blue-500" />
                <span className="text-sm text-blue-500 font-medium">
                  Bài viết được chia sẻ
                </span>
              </div>

              {sharedPost ? (
                <>
                  <h4 className="font-medium text-gray-800 line-clamp-2 mb-1">
                    {sharedPost.content || "Bài viết không có nội dung."}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={sharedPost.author?.avatar || "/default-avatar.png"}
                      alt={sharedPost.author?.firstName}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs text-gray-500">
                      {sharedPost.author?.firstName}{" "}
                      {sharedPost.author?.lastName}
                    </span>
                  </div>
                </>
              ) : (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      } else if (message.sharedType === "recipe") {
        return (
          <div
            onClick={() =>
              message.sharedId &&
              window.open(`/recipes/${message.sharedId}`, "_blank")
            }
            className="bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all border border-gray-200 overflow-hidden max-w-[300px]"
          >
            {/* Recipe Preview */}
            {sharedRecipe?.image?.[0] ? (
              <div className="w-full aspect-video relative overflow-hidden">
                <img
                  src={sharedRecipe.image[0]}
                  alt="Recipe preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                <UtensilsCrossed className="text-gray-400" size={32} />
              </div>
            )}

            {/* Recipe Info */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <UtensilsCrossed size={16} className="text-orange-500" />
                <span className="text-sm text-orange-500 font-medium">
                  Công thức được chia sẻ
                </span>
              </div>

              {sharedRecipe ? (
                <>
                  <h4 className="font-medium text-gray-800 line-clamp-2 mb-1">
                    {sharedRecipe.name || "Công thức không có tên."}
                  </h4>
                </>
              ) : (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      } else if (message.sharedType === "video") {
        if (!sharedVideos[message.sharedId]) {
          fetchVideoDetails(message.sharedId);
        }
        const sharedVideo = sharedVideos[message.sharedId];
        console.log("video", sharedVideo);
        return (
          <a href={`/explore/reels/${sharedVideo?._id}`} className="rounded-lg overflow-hidden">
            <div
              className={`flex items-center gap-2 mb-1 p-2 rounded-t-lg border-b 
              ${message.isOwn
                  ? "bg-blue-400 border-blue-300"
                  : "bg-gray-50 border-gray-200"
                }`}
            >
              <Video
                size={16}
                className={message.isOwn ? "text-white" : "text-purple-500"}
              />
              <span
                className={`text-sm font-medium ${message.isOwn ? "text-white" : "text-purple-500"
                  }`}
              >
                Video được chia sẻ
              </span>
            </div>
            <img
              src={sharedVideo?.videoUri.replace("mp4", "jpg")}
              alt="Video thumbnail"
              className="w-[200px] object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white opacity-80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {message.text && message.text !== message.sharedId && (
              <div
                className={`p-2 text-xs rounded-b-lg ${message.isOwn
                  ? "bg-blue-400 text-blue-50"
                  : "bg-gray-50 text-gray-600"
                  }`}
              >
                {message.text}
              </div>
            )}
          </a>
        );
      }
    }

    // Default to text message if no other type matches
    return (
      <div className="whitespace-pre-wrap">
        {message.text || message.content}
      </div>
    );
  };

  // Thêm style cho hiệu ứng highlight rõ ràng hơn
  const additionalStyles = `
    .message-highlighted {
      background-color: rgba(59, 130, 246, 0.1);
      transition: background-color 0.5s ease;
    }
    .message-highlighted > div {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }
  `;

  // Thêm hàm kiểm tra tin nhắn đã xóa với nhiều điều kiện hơn
  const isMessageDeleted = (message) => {
    return (
      message.recalled ||
      message.text === "Tin nhắn đã được thu hồi" ||
      message.text === "Tin nhắn này đã bị xóa" ||
      message.content === "Tin nhắn đã được thu hồi" ||
      message.content === "Tin nhắn này đã bị xóa" ||
      (typeof message.text === "string" &&
        message.text.includes("đã được thu hồi")) ||
      (typeof message.content === "string" &&
        message.content.includes("đã được thu hồi"))
    );
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      setIsUploading(true);
      try {
        for (const file of imageFiles) {
          const result = await uploadImage(file, "messages");
          if (result.secure_url) {
            // Gửi tin nhắn hình ảnh qua socket
            socket.emit("send_message", {
              conversationId: selectedConversationId,
              type: "image",
              image: result.secure_url,
            });

            // Optimistic update UI
            const tempMessageId = `temp-${Date.now()}`;
            setMessages((prev) => [
              ...prev,
              {
                id: tempMessageId,
                sender: {
                  _id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  avatar: user.avatar,
                },
                type: "image",
                image: result.secure_url,
                createdAt: new Date().toISOString(),
                isOwn: true,
                avatar: user.avatar,
                reactions: [],
                recalled: false,
              },
            ]);

            scrollToBottom();
          }
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Không thể tải ảnh lên. Vui lòng thử lại.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  if (loading) {
    // Only show initial full page loader
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 mt-[80px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (error && conversations.length === 0) {
    // Show error only if no conversations loaded
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-red-50 text-red-700 mt-[80px] p-4">
        <Info size={48} className="mb-4" />
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
    <div className="fixed inset-0 flex bg-gray-100 mt-[80px] h-[calc(100vh-70px)]">
      {/* Sidebar */}
      <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Chat</h1>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
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
          {isLoading && conversations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Đang tải danh sách...
            </div>
          )}
          {!isLoading && conversations.length === 0 && !error && (
            <div className="p-4 text-center text-gray-500 h-full flex flex-col justify-center items-center">
              <MessageSquareText size={48} className="mb-4 text-gray-400" />
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
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-150 ${selectedConversationId === conversation._id
                  ? "bg-blue-50 hover:bg-blue-100"
                  : ""
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={otherUser?.avatar || "/default-avatar.png"}
                    alt={otherUser?.name || "Avatar"}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0 relative">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-semibold truncate ${selectedConversationId === conversation._id
                        ? "text-blue-700"
                        : "text-gray-800"
                        }`}
                    >
                      {otherUser?.name || "Người dùng"}
                    </p>
                    {lastMessage && (
                      <span
                        className={`text-xs  ml-2 flex-shrink-0 ${conversation.unreadCount > 0
                          ? "font-bold text-black"
                          : "text-gray-400"
                          }`}
                      >
                        {/* Hiển thị thời gian tương đối cho lastMessage trong danh sách conversation */}
                        {formatRelativeTime(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${conversation.unreadCount > 0
                      ? "font-bold text-black"
                      : "text-gray-500 "
                      }`}
                  >
                    {lastMessage
                      ? (lastMessage.sender._id === user?._id ? "Bạn: " : "") +
                      (lastMessage.recalled ||
                        lastMessage.text === "Tin nhắn này đã bị xóa" ||
                        lastMessage.content === "Tin nhắn này đã bị xóa"
                        ? "Tin nhắn đã thu hồi"
                        : lastMessage.type === "image"
                          ? "Đã gửi một hình ảnh"
                          : lastMessage.type === "share"
                            ? lastMessage.sharedType === "post"
                              ? "Đã chia sẻ một bài viết"
                              : lastMessage.sharedType === "video"
                                ? "Đã chia sẻ một video"
                                : lastMessage.text || "Đã chia sẻ một liên kết"
                            : lastMessage.text || "")
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
      <div className="flex-1 flex h-full">
        {/* Main Chat */}
        <div
          className={`flex flex-col bg-white transition-all duration-300 ${showInfoSidebar ? "w-[65%]" : "w-full"
            }`}
        >
          {selectedConversationId &&
            conversations.find((c) => c._id === selectedConversationId) ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  {(() => {
                    const conversation = conversations.find(
                      (c) => c._id === selectedConversationId
                    );
                    const otherUser = conversation?.otherUser;
                    const isOnline = otherUser?.isOnline;

                    return (
                      <div className="flex items-center">
                        <div className="relative flex-shrink-0">
                          <img
                            src={otherUser?.avatar || "/default-avatar.png"}
                            alt={otherUser?.name || "Avatar"}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <h2 className="font-semibold text-gray-800 text-base">
                            {otherUser?.name || "Người dùng"}
                          </h2>
                          <p
                            className={`text-xs ${isOnline ? "text-green-600" : "text-gray-500"
                              }`}
                          >
                            {isOnline ? "Đang hoạt động" : "Không hoạt động"}
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
                    <button
                      onClick={() => setShowInfoSidebar((prev) => !prev)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-500"
                    >
                      <Info size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute right-6 top-16 w-72 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Tìm thấy {searchResults.length} kết quả
                    </p>
                    <button
                      onClick={handleCloseSearch}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={14} />
                    </button>
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
                            {format(
                              new Date(result.createdAt),
                              "HH:mm dd/MM/yyyy",
                              { locale: vi }
                            )}
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
                    <span className="ml-2 text-sm text-gray-500">
                      Đang tải tin nhắn cũ...
                    </span>
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
                {!isLoading &&
                  messages.length === 0 &&
                  !isLoadingMore &&
                  selectedConversationId && (
                    <div className="flex flex-col justify-center items-center h-full text-gray-500">
                      <MessageSquareText
                        size={48}
                        className="mb-4 text-gray-400"
                      />
                      <p className="font-semibold">Không có tin nhắn nào</p>
                      <p className="text-sm">
                        Hãy bắt đầu cuộc trò chuyện này!
                      </p>
                    </div>
                  )}

                {/* Danh sách tin nhắn */}
                {messages.map((message, index) => {
                  const prevMessage = messages[index - 1];
                  const nextMessage = messages[index + 1];

                  const showSenderInfo =
                    !message.isOwn &&
                    (index === 0 ||
                      prevMessage?.sender._id !== message.sender._id ||
                      (prevMessage &&
                        message.createdAt &&
                        prevMessage.createdAt &&
                        new Date(message.createdAt).getTime() -
                        new Date(prevMessage.createdAt).getTime() >
                        5 * 60 * 1000));

                  const isFirstInGroupChain =
                    index === 0 ||
                    prevMessage?.sender._id !== message.sender._id ||
                    message.isOwn !== prevMessage?.isOwn;
                  const isLastInGroupChain =
                    index === messages.length - 1 ||
                    nextMessage?.sender._id !== message.sender._id ||
                    message.isOwn !== nextMessage?.isOwn;

                  let showTimeSeparator = false;
                  if (message.createdAt) {
                    if (index === 0) {
                      showTimeSeparator = true;
                    } else if (prevMessage && prevMessage.createdAt) {
                      const diffMinutes = differenceInMinutes(
                        new Date(message.createdAt),
                        new Date(prevMessage.createdAt)
                      );
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
                            {format(new Date(message.createdAt), "HH:mm", {
                              locale: vi,
                            })}
                          </span>
                        </div>
                      )}
                      <div
                        id={`message-item-${message.id}`}
                        className={`flex ${message.isOwn ? "justify-end" : "justify-start"
                          } ${showSenderInfo && !showTimeSeparator
                            ? "mt-2"
                            : "mt-px"
                          } group relative message-item`}
                      >
                        {!message.isOwn && (
                          <div className="flex-shrink-0 w-8 h-8 self-end mr-2">
                            {showSenderInfo && (
                              <img
                                src={
                                  message.sender.avatar || "/default-avatar.png"
                                }
                                alt={`${message.sender.firstName} ${message.sender.lastName}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            )}
                          </div>
                        )}
                        <div
                          className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"
                            } max-w-xs sm:max-w-sm md:max-w-md relative group`}
                        >
                          <div className={`flex items-center gap-1`}>
                            {/* Message bubble */}
                            <div
                              onMouseEnter={(e) => {
                                if (!message.recalled) {
                                  const rect =
                                    e.currentTarget.getBoundingClientRect();
                                  setTooltipConfig({
                                    visible: true,
                                    content: formatDetailedMessageTime(
                                      message.createdAt
                                    ),
                                    top: rect.top,
                                    left: rect.left,
                                  });
                                }
                              }}
                              onMouseLeave={() => {
                                setTooltipConfig((prev) => ({
                                  ...prev,
                                  visible: false,
                                }));
                              }}
                              className={`relative px-3 py-2 rounded-lg
                                ${message.isOwn
                                  ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-slate-50"
                                  : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100"
                                } 
                                ${message.recalled ? "italic text-gray-500" : ""
                                } 
                                ${message.type === "image" ||
                                  (message.type === "share" &&
                                    (message.sharedType === "video" ||
                                      message.sharedType === "post" ||
                                      message.sharedType === "recipe"))
                                  ? "p-1"
                                  : "px-3 py-2"
                                }
                                hover:shadow-md transition-shadow duration-150`}
                            >
                              {/* Reply Preview Section */}
                              {message.replyTo && !message.recalled && (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleScrollToOriginalMessage(
                                      message.replyTo.id || message.replyTo._id
                                    );
                                  }}
                                  className={`mb-1.5 p-2 rounded-md cursor-pointer transition-colors border-l-2
                                    ${message.isOwn
                                      ? "bg-blue-400 hover:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400 border-blue-200"
                                      : "bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 border-gray-400"
                                    } opacity-90 hover:opacity-100`}
                                >
                                  <div
                                    className={`text-xs font-semibold flex items-center ${message.isOwn
                                      ? "text-blue-50"
                                      : "text-gray-700 dark:text-slate-200"
                                      }`}
                                  >
                                    <Reply
                                      size={12}
                                      className="mr-1.5 transform scale-x-[-1]"
                                    />
                                    Trả lời{" "}
                                    {message.replyTo.sender?._id === user?._id
                                      ? "chính bạn"
                                      : message.replyTo.sender?.firstName ||
                                      message.replyTo.sender?.name ||
                                      "..."}
                                  </div>
                                  <p
                                    className={`text-xs truncate mt-0.5 ${message.isOwn
                                      ? "text-blue-100"
                                      : "text-gray-600 dark:text-slate-300"
                                      }`}
                                  >
                                    {getReplyPreviewContent(message.replyTo)}
                                  </p>
                                </div>
                              )}
                              {/* End Reply Preview Section */}
                              {renderMessageContent(message)}
                            </div>

                            {/* Message actions */}
                            {!message.recalled && (
                              <div
                                className={`absolute ${message.isOwn
                                  ? "left-0 -translate-x-full -ml-1"
                                  : "right-0 translate-x-full ml-1"
                                  } top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150`}
                              >
                                {!message.isOwn ? (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setReactionPickerTarget({
                                          messageId: message.id || message._id,
                                          anchorEl: e.currentTarget,
                                        });
                                      }}
                                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-500 dark:text-slate-400"
                                      title="Thả cảm xúc"
                                    >
                                      <Smile size={16} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReply(message);
                                      }}
                                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-500 dark:text-slate-400"
                                      title="Trả lời"
                                    >
                                      <Reply size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReply(message);
                                      }}
                                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full text-gray-500 dark:text-slate-400"
                                      title="Trả lời"
                                    >
                                      <Reply size={16} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteMessage(message)
                                      }
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
                          {Array.isArray(message.reactions) &&
                            message.reactions.length > 0 &&
                            !message.recalled && (
                              <div
                                className={`flex flex-wrap gap-x-0.5 gap-y-1 mt-1 items-center ${message.isOwn
                                  ? "justify-end"
                                  : "justify-start"
                                  }`}
                              >
                                {message.reactions
                                  .slice(0, 4)
                                  .map((reaction, idx) => {
                                    if (
                                      !reaction ||
                                      typeof reaction.type !== "string" ||
                                      !Array.isArray(reaction.users)
                                    ) {
                                      return null;
                                    }
                                    const userHasReacted = reaction.users.some(
                                      (u) => u._id === user?._id
                                    );
                                    return (
                                      <button
                                        key={`${reaction.type}-${idx}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (!message.isOwn)
                                            handleReaction(
                                              message.id,
                                              reaction.type
                                            );
                                        }}
                                        disabled={message.isOwn}
                                        className={`px-1 py-px rounded-full text-xs flex items-center gap-0.5 transition-colors shadow-sm 
                                      ${userHasReacted
                                            ? "bg-blue-100 dark:bg-blue-600 border border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-100"
                                            : "bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200"
                                          } ${message.isOwn
                                            ? "cursor-not-allowed opacity-70"
                                            : "cursor-pointer"
                                          }`}
                                        title={
                                          reaction.users
                                            .map(
                                              (u) =>
                                                (u &&
                                                  (u.firstName ||
                                                    u.username)) ||
                                                "Ai đó"
                                            )
                                            .join(", ") +
                                          ` đã thả ${reaction.type}`
                                        }
                                      >
                                        <span className="text-xs">
                                          {reaction.type}
                                        </span>
                                        {reaction.users.length > 0 && (
                                          <span className="font-normal text-[10px] ml-px">
                                            {reaction.users.length}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })}
                                {message.reactions.length > 4 &&
                                  !message.recalled && (
                                    <div
                                      className="px-1 py-px rounded-full text-[10px] flex items-center justify-center bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 cursor-pointer shadow-sm min-w-[20px] h-[18px] ml-0.5"
                                      title={`Xem thêm ${message.reactions.length - 4
                                        } cảm xúc khác`}
                                    >
                                      +{message.reactions.length - 4}
                                    </div>
                                  )}
                              </div>
                            )}

                          {/* Message status */}
                          {(() => {
                            if (
                              message.id === lastReadUserMessageId &&
                              latestReadTimestamp
                            ) {
                              return (
                                <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 px-1">
                                  Đã xem{" "}
                                  {format(
                                    new Date(latestReadTimestamp),
                                    "HH:mm",
                                    { locale: vi }
                                  )}
                                </div>
                              );
                            } else if (
                              index === messages.length - 1 &&
                              message.isOwn &&
                              !message.recalled
                            ) {
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
                      Đang trả lời{" "}
                      <span className="text-blue-600">
                        {replyingTo.sender._id === user?._id
                          ? "chính bạn"
                          : `${replyingTo.sender.firstName} ${replyingTo.sender.lastName}`}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate mt-0.5">
                      {replyingTo.content === "Tin nhắn này đã bị xóa"
                        ? "Tin nhắn đã được thu hồi"
                        : replyingTo.content}
                    </div>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={16} /> {/* X icon for close */}
                  </button>
                </div>
              )}

              {/* Message Input */}
              <div className="p-3 flex items-center gap-2 bg-white border-t border-gray-200">
                <div className="flex-1 relative mb-2">
                  <input
                    value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    onPaste={handlePaste}
                    placeholder="Nhập tin nhắn..."
                    className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-10"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <button className=" text-gray-400 hover:text-blue-500 p-1.5 rounded-full hover:bg-gray-200 transition-colors" onClick={() => { setIsShowIconPicker(prev => !prev) }}>
                      <Smile size={20} />
                    </button>
                    {isShowIconPicker && (
                      <div className="absolute z-50 top-[-450px] left-[-270px] h-[350px] w-auto">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                    <button className="text-gray-400 hover:text-blue-500 p-2 rounded-full transition-colors hover:bg-gray-100" onClick={() => fileInputRef.current?.click()}>
                      <Image size={20} />
                    </button>
                  </div>

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
              <Send size={64} className="text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Trình nhắn tin của bạn
              </h3>
              <p className="text-gray-500 text-center">
                Gửi tin nhắn riêng tư cho bạn bè hoặc nhóm.
              </p>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div
          className={`bg-white border-l border-gray-200 transition-all duration-300 relative ${showInfoSidebar ? "w-[35%]" : "w-0 opacity-0 overflow-hidden"
            }`}
        >
          {selectedConversationId &&
            conversations.find((c) => c._id === selectedConversationId) && (
              <div className="h-full flex flex-col">
                {/* Phần trên - Avatar và thông tin (40% chiều cao) */}
                <div className="h-[40%] flex flex-col items-center justify-center border-b border-gray-200 relative">
                  <button
                    onClick={() => setShowInfoSidebar(false)}
                    className="absolute top-2 right-2 p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <X size={20} />
                  </button>
                  {(() => {
                    const conversation = conversations.find(
                      (c) => c._id === selectedConversationId
                    );
                    const otherUser = conversation?.otherUser;
                    return (
                      <>
                        <div className="relative mb-4">
                          <img
                            src={otherUser?.avatar || "/default-avatar.png"}
                            alt={otherUser?.name}
                            className="w-28 h-28 rounded-full object-cover"
                          />
                          {otherUser?.isOnline && (
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                          {otherUser?.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {otherUser?.isOnline
                            ? "Đang hoạt động"
                            : "Không hoạt động"}
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Phần dưới - Các chức năng */}
                <div className="flex-1 overflow-y-auto">
                  {/* Các nút chức năng */}
                  <div className="p-4 space-y-2">
                    <button
                      onClick={() => {
                        const conversation = conversations.find(
                          (c) => c._id === selectedConversationId
                        );
                        if (conversation?.otherUser?._id) {
                          navigate(`/profile/${conversation.otherUser._id}`);
                        }
                      }}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User size={20} className="text-gray-600" />
                      <span className="text-gray-700">Trang cá nhân</span>
                    </button>

                    {/* Nút tìm kiếm */}
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Search size={20} className="text-gray-600" />
                      <span className="text-gray-700">Tìm kiếm tin nhắn</span>
                    </button>

                    {/* Tabs cho media và links */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedTab("media")}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === "media"
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                          }`}
                      >
                        <Image
                          size={20}
                          className={
                            selectedTab === "media"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }
                        />
                        <span>Ảnh/Video</span>
                      </button>

                      <button
                        onClick={() => setSelectedTab("links")}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${selectedTab === "links"
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700"
                          }`}
                      >
                        <FileText
                          size={20}
                          className={
                            selectedTab === "links"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }
                        />
                        <span>Liên kết</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Modal */}
                  {showSearchModal && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col">
                      {/* Modal Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Tìm kiếm tin nhắn
                        </h3>
                        <button
                          onClick={() => {
                            setShowSearchModal(false);
                            setSearchText("");
                            setSearchResults([]);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Search Input */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleSearch()
                            }
                            placeholder="Nhập từ khóa tìm kiếm..."
                            className="w-full px-4 py-2 pl-10 pr-4 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            size={18}
                            onClick={handleSearch}
                          />
                          {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            </div>
                          )}
                          {searchText && !isSearching && (
                            <button
                              onClick={() => {
                                setSearchText("");
                                setSearchResults([]);
                              }}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Search Results */}
                      <div className="flex-1 overflow-y-auto p-2">
                        {searchResults.length > 0 ? (
                          <div className="space-y-2">
                            {searchResults.map((result) => (
                              <div
                                key={result._id}
                                onClick={() => {
                                  handleSearchResultClick(result._id);
                                  // Bỏ dòng setShowSearchModal(false) để không đóng modal
                                }}
                                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                              >
                                <div className="flex items-start space-x-3">
                                  <img
                                    src={
                                      result.sender.avatar ||
                                      "/default-avatar.png"
                                    }
                                    alt={result.sender.firstName}
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">
                                      {result.sender.firstName}{" "}
                                      {result.sender.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                      {result.text}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {format(
                                        new Date(result.createdAt),
                                        "HH:mm dd/MM/yyyy",
                                        { locale: vi }
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : searchText && !isSearching ? (
                          <div className="text-center py-8 text-gray-500">
                            <Search
                              size={40}
                              className="mx-auto mb-3 text-gray-400"
                            />
                            <p>Không tìm thấy kết quả nào</p>
                          </div>
                        ) : !searchText ? (
                          <div className="text-center py-8 text-gray-500">
                            <Search
                              size={40}
                              className="mx-auto mb-3 text-gray-400"
                            />
                            <p>Nhập từ khóa để tìm kiếm tin nhắn</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* Content của tab */}
                  <div className="p-4 border-t border-gray-200">
                    {selectedTab === "media" && (
                      <div className="grid grid-cols-3 gap-1">
                        {messages
                          .filter((m) => {
                            return (
                              m.type === "image" &&
                              !isMessageDeleted(m) &&
                              m.image && // Kiểm tra có URL hình ảnh
                              typeof m.image === "string" && // Đảm bảo image là string
                              m.image.trim() !== ""
                            ); // Đảm bảo image không rỗng
                          })
                          .slice(0, 9)
                          .map((message, index) => (
                            <div
                              key={message.id}
                              className="aspect-square relative group"
                            >
                              <img
                                src={message.image}
                                alt="Shared media"
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                onClick={() =>
                                  window.open(message.image, "_blank")
                                }
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
                            </div>
                          ))}
                      </div>
                    )}

                    {selectedTab === "links" && (
                      <div className="space-y-2">
                        {messages
                          .filter((m) => {
                            return (
                              (m.type === "share" && !isMessageDeleted(m)) ||
                              (m.text?.includes("http") && !isMessageDeleted(m))
                            );
                          })
                          .slice(0, 10)
                          .map((message, index) => {
                            if (message.type === "share") {
                              const sharedContent = (() => {
                                if (message.sharedType === "post" && sharedPosts[message.sharedId]) {
                                  const post = sharedPosts[message.sharedId];
                                  return {
                                    title: post.content || "Bài viết được chia sẻ",
                                    icon: <Share2 size={16} className="text-blue-500" />,
                                    link: `/posts/${message.sharedId}`,
                                    type: "Bài viết"
                                  };
                                } else if (message.sharedType === "video" && sharedVideos[message.sharedId]) {
                                  const video = sharedVideos[message.sharedId];
                                  return {
                                    title: video.description || "Video được chia sẻ",
                                    icon: <Video size={16} className="text-purple-500" />,
                                    link: `/explore/reels/${message.sharedId}`,
                                    type: "Video"
                                  };
                                } else if (message.sharedType === "recipe" && sharedRecipes[message.sharedId]) {
                                  const recipe = sharedRecipes[message.sharedId];
                                  return {
                                    title: recipe.name || "Công thức được chia sẻ",
                                    icon: <UtensilsCrossed size={16} className="text-orange-500" />,
                                    link: `/recipes/${message.sharedId}`,
                                    type: "Công thức"
                                  };
                                }
                                return null;
                              })();

                              if (!sharedContent) return null;

                              return (
                                <a
                                  key={message.id}
                                  href={sharedContent.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-3 hover:bg-gray-50 rounded-lg transition-all border border-gray-100 hover:border-gray-200"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    {sharedContent.icon}
                                    <span className="text-sm font-medium">{sharedContent.type}</span>
                                  </div>
                                  <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                                    {sharedContent.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(message.createdAt), "HH:mm dd/MM/yyyy", { locale: vi })}
                                  </p>
                                </a>
                              );
                            }

                            // Hiển thị link thông thường
                            return (
                              <div
                                key={message.id}
                                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100 hover:border-gray-200"
                                onClick={() => window.open(message.text, '_blank')}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <FileText size={16} className="text-gray-500" />
                                  <span className="text-sm font-medium">Liên kết</span>
                                </div>
                                <p className="text-sm text-blue-600 truncate mb-1">{message.text}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(message.createdAt), "HH:mm dd/MM/yyyy", { locale: vi })}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      {renderReactionPicker()} {/* Gọi hàm renderReactionPicker ở đây */}

      {/* Add Tooltip component */}
      <Tooltip
        content={tooltipConfig.content}
        top={tooltipConfig.top}
        left={tooltipConfig.left}
        visible={tooltipConfig.visible}
      />

      {/* Add file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* <button 
        className="text-gray-400 hover:text-blue-500 p-2 rounded-full transition-colors hover:bg-gray-100" 
        onClick={() => fileInputRef.current?.click()}
      >
        <Image size={20} />
      </button> */}
    </div>
  );
}
