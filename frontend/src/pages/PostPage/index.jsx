import React, { useState, useRef } from "react";
import {
  LeftSidebar,
  RightSidebar,
} from "../../components/sections/Post/Sidebar";

import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import SharePopup from "../../components/common/SharePopup";
import Posts from "./Posts";
import Reels from "./Reels";
import CreatePostModal from "../../components/common/Modal/CreatePostModal";
import { useAuth } from "@/context/AuthContext";

const PostPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const postsRef = useRef();

  const [sharePopup, setSharePopup] = useState({ open: false, postId: null });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState("post");
  const rightSidebarData = {}
  const {user} = useAuth()
  
  const handlePostCreated = (newPost) => {
    // Đóng modal
    setShowCreateModal(false);
    // Cập nhật danh sách bài viết
    if (postsRef.current?.handleNewPost) {
      postsRef.current.handleNewPost(newPost);
    }
  };

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8]  py-10 px-2 lg:px-8">
      <div className="max-w-7xl mx-auto flex gap-8 relative">
        <LeftSidebar
          activeTab={currentPath.includes("/explore/posts") ? "posts" : "reels"}
          onAdd={() => setShowCreateModal(true)}
        />

        <div className="flex-1">
          <Routes>
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<Posts ref={postsRef} />} />
            <Route path="reels/:id" element={<Reels />} />
            <Route path="reels" element={<Reels />} />
          </Routes>
        </div>

        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <RightSidebar />
          </div>
        </div>
      </div>

      <SharePopup
        open={sharePopup.open}
        postId={sharePopup.postId}
        onClose={() => setSharePopup({ open: false, postId: null })}
      />
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onDone={handlePostCreated}
        type={createType}
      />
    </div>
  );
};

export default PostPage;
