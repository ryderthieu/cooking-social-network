import React, { useState } from "react";
import {
  LeftSidebar,
  RightSidebar,
} from "../../components/sections/Post/Sidebar";

import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import SharePopup from "../../components/common/SharePopup";
import Posts from "./Posts";
import Reels from "./Reels";
import CreatePostModal from "../../components/common/Modal/CreatePostModal";

const PostPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [sharePopup, setSharePopup] = useState({ open: false, postId: null });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState("post");
  const rightSidebarData = {}
  return (
    <div className="min-h-screen bg-[#F5F1E8] py-10 px-2 lg:px-8">
      <div className="max-w-7xl mx-auto flex gap-8 relative">
        <LeftSidebar
          activeTab={currentPath == "/explore/posts" ? "posts" : "reels"}
          onAdd={() => setShowCreateModal(true)}
        />

        <div className="flex-1">
          <Routes>
            <Route path="/posts" element={<Posts />} />
            <Route path="/reels/:id" element={<Reels />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/" element={<Navigate to="posts" replace />} />
          </Routes>
        </div>

        <div className="w-80 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <RightSidebar data={rightSidebarData} />
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
        type={createType}
      />
    </div>
  );
};

export default PostPage;
