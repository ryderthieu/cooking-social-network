import React, { useState } from "react";
import { 
  EmptyState, 
  ProfileHeader, 
  ProfileTabs, 
  PostsTab, 
  RecipesTab, 
  VideosTab 
} from "../../components/sections/Profile";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");

  const userData = {
    name: "Nguyễn Văn A",
    bio: "Đầu bếp đam mê chia sẻ những công thức nấu ăn ngon và dễ làm. Yêu thích khám phá ẩm thực từ khắp nơi trên thế giới 🍳✨",
    location: "Hồ Chí Minh, Việt Nam",
    joinDate: "Tham gia tháng 3, 2023",
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    coverSrc: "/images/cover-placeholder.jpg",
    stats: {
      posts: 199,
      recipes: 156,
      followers: '2.8k',
      following: 324
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="lg:col-span-6">
          {/* Cover Photo & Profile Info */}
          <ProfileHeader user={userData} />

          {/* Tabs */}
          <div className="w-full">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab Contents */}
            <div className="mt-4">
              {activeTab === "posts" && <PostsTab />}
              {activeTab === "recipes" && <RecipesTab />}
              {activeTab === "videos" && <VideosTab />}
              {activeTab === "saved" && (
                <EmptyState 
                  icon="🔖"
                  title="Chưa có nội dung đã lưu"
                  description="Các bài đăng bạn lưu sẽ hiển thị ở đây"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}