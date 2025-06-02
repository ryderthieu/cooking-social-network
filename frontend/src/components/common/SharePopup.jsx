import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCopy,
  FaFacebook,
  FaTwitter,
  FaComments,
  FaSearch,
} from "react-icons/fa";
import { getUserConversations } from "@/services/conversationService";
import { createMessage } from "@/services/messageService";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { sharePost } from "@/services/postService";
import { shareVideo } from "@/services/videoService";

const SharePopup = ({ open, onClose, postId, postTitle, videoId, recipeId, recipeTitle, type = "post" }) => {
  const [activeTab, setActiveTab] = useState("social");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (open && activeTab === "chat") {
      fetchConversations();
    }
  }, [open, activeTab]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getUserConversations({ page: 1, limit: 20 });
      setConversations(response.data.data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Không thể tải danh sách cuộc trò chuyện");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const getShareUrl = () => {
    switch (type) {
      case "post":
        return `${window.location.origin}/posts/${postId}`;
      case "video":
        return `${window.location.origin}/videos/${videoId}`;
      case "recipe":
        return `${window.location.origin}/recipes/${recipeId}`;
      default:
        return window.location.href;
    }
  };

  const getShareTitle = () => {
    switch (type) {
      case "post":
        return postTitle;
      case "video":
        return "video";
      case "recipe":
        return recipeTitle;
      default:
        return "";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareUrl());
    toast.success("Đã copy link!");
  };

  const handleShareToChat = async (conversationId) => {
    try {
      setSharing(true);
      if (postId) {
        await sharePost(postId);
      } else if (videoId) {
        await shareVideo(videoId);
      }
      // Recipe sharing doesn't need to track share count
      
      await createMessage({
        conversationId,
        type: "share",
        sharedType: type,
        sharedId: postId || videoId || recipeId,
        text: `Đã chia sẻ ${type === "post" ? "bài viết" : type === "video" ? "video" : "công thức"} "${getShareTitle()}"`,
      });
      toast.success(`Đã chia sẻ ${type === "post" ? "bài viết" : type === "video" ? "video" : "công thức"}!`);
      onClose();
    } catch (error) {
      console.error("Error sharing to chat:", error);
      toast.error(`Không thể chia sẻ ${type === "post" ? "bài viết" : type === "video" ? "video" : "công thức"}`);
    } finally {
      setSharing(false);
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      (conv.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.members || []).some((member) =>
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
  );

  const getConversationName = (conv) => {
    if (conv.name) return conv.name;
    if (conv.members?.length === 2) {
      const otherMember = conv.members.find(
        (member) => member._id !== currentUser?._id
      );
      if (otherMember) {
        return `${otherMember.lastName} ${otherMember.firstName}`;
      }
    }
    return conv.members
      ?.map((member) => `${member.lastName} ${member.firstName}`)
      .join(", ");
  };

  const getConversationAvatar = (conv) => {
    if (conv.members?.length === 2) {
      const otherMember = conv.members.find(
        (member) => member._id !== currentUser?._id
      );
      if (otherMember) {
        return otherMember.avatar;
      }
    }
    return conv.avatar;
  };

  const getLastActive = (conv) => {
    if (!conv.lastMessage?.createdAt) return "";
    const date = new Date(conv.lastMessage.createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Vừa xong";
    if (diffHours < 1) return `${diffMins} phút trước`;
    if (diffDays < 1) return `${diffHours} giờ trước`;
    if (diffDays === 1) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadein">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-popup border border-[#FFB800]/10">
        <button
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#FFB800] hover:scale-110 transition-all duration-300"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Chia sẻ bài viết
        </h3>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("social")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === "social"
                ? "bg-white text-[#FFB800] shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Mạng xã hội
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              activeTab === "chat"
                ? "bg-white text-[#FFB800] shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Tin nhắn
          </button>
        </div>

        {activeTab === "social" ? (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#FFF4D6] text-gray-700 font-medium transition-all duration-300 group"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <FaCopy className="w-5 h-5" />
              </div>
              <span>Copy link</span>
            </button>

            <a
              href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                getShareUrl()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#FFF4D6] text-gray-700 font-medium transition-all duration-300 group"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <FaFacebook className="w-5 h-5 text-blue-600" />
              </div>
              <span>Chia sẻ Facebook</span>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                getShareUrl()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#FFF4D6] text-gray-700 font-medium transition-all duration-300 group"
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <FaTwitter className="w-5 h-5 text-sky-500" />
              </div>
              <span>Chia sẻ Twitter</span>
            </a>
          </div>
        ) : (
          <div>
            {/* Search Bar */}
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:bg-white transition-all"
              />
            </div>

            {/* Conversations List */}
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFB800]"></div>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => !sharing && handleShareToChat(conv._id)}
                    disabled={sharing}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF4D6] transition-all duration-300 group ${
                      sharing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <img
                      src={
                        getConversationAvatar(conv) ||
                        "https://via.placeholder.com/150"
                      }
                      alt={getConversationName(conv)}
                      className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-[#FFB800] transition-all"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-800">
                        {getConversationName(conv)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getLastActive(conv)}
                      </div>
                    </div>
                    <FaComments className="w-5 h-5 text-gray-400 group-hover:text-[#FFB800] transition-colors" />
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? "Không tìm thấy cuộc trò chuyện"
                    : "Chưa có cuộc trò chuyện nào"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadein {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadein {
          animation: fadein 0.3s ease-out;
        }
        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-popup {
          animation: popup 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default SharePopup;
