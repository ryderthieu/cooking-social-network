import {
  FaUserFriends,
  FaFire,
  FaNewspaper,
  FaVideo,
  FaUser,
  FaBookmark,
  FaUtensils,
  FaPlus,
} from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import CreatePostModal from "../../common/Modal/CreatePostModal";
import { useAuth } from "@/context/AuthContext";

const defaultData = {
  menu: [
    { label: "Bài viết", icon: <FaNewspaper />, href: "/explore/posts" },
    { label: "Reels", icon: <FaVideo />, href: "/explore/reels/1" },
    { label: "Trang cá nhân", icon: <FaUser />, href: "/profile" },
    { label: "Bài viết đã lưu", icon: <FaBookmark />, href: "/saved" },
    { label: "Công thức của tôi", icon: <FaUtensils />, href: "/my-recipes" },
  ],
};

export const LeftSidebar = ({
  activeTab,
  onTabChange,
  data = defaultData,
  onAdd,
}) => {
  const { user } = useAuth();
  console.log("user", user);
  return (
    <>
      <aside className="hidden lg:block w-72 pr-4 space-y-6 sticky top-24 h-fit">
        <div className="bg-white rounded-2xl shadow p-6 mb-2">
          {/* Profile Section */}
          {user && (
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user.avatar}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-800">
                  {user.lastName} {user.firstName}
                </h3>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <ul className="space-y-2">
            {data.menu.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    (item.label === "Bài viết" && activeTab === "posts") ||
                    (item.label === "Reels" && activeTab === "reels")
                      ? "bg-[#F5F5F5] text-[#FF6363] font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Add Post Button */}
          <button
            onClick={onAdd}
            className="mt-6 w-full bg-[#FF6363] text-white py-3 rounded-xl font-semibold hover:bg-[#ff4f4f] transition flex items-center justify-center gap-2"
          >
            <FaPlus /> Tạo bài viết mới
          </button>
        </div>
      </aside>
    </>
  );
};

export const RightSidebar = ({ data }) => (
  <aside className="hidden lg:block w-72 pl-4 space-y-6 sticky top-24 h-fit">
    <div className="bg-white rounded-2xl shadow p-6 mb-2">
      <div className="flex items-center mb-4 text-[#FF6363] font-bold text-lg">
        <FaUserFriends className="mr-2" /> Gợi ý theo dõi
      </div>
      <ul className="space-y-3">
        {data.suggestFollow?.map((user) => (
          <li
            key={user.name}
            className="flex items-center gap-3 justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#FF6363]"
              />
              <div className="flex flex-col ">
                <span className="text-gray-700 font-medium text-sm">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {user.followers ? user.followers : 1000} theo dõi
                </span>
              </div>
            </div>
            <button className="ml-2 px-3 py-1 bg-[#FF6363] text-white rounded-full text-xs font-semibold hover:bg-[#e6a600] transition">
              <MdLibraryAdd size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center mb-4 text-[#FF6363] font-bold text-lg">
        <FaFire className="mr-2" /> Món ăn hot
      </div>
      <ul className="space-y-3">
        {data.hotDishs?.map((dish) => (
          <li key={dish.name} className="flex items-center gap-3">
            <img
              src={dish.image}
              className="w-10 h-10 rounded object-cover border border-[#FF6363]"
            />
            <div>
              <span className="text-gray-700 font-medium text-sm line-clamp-2">
                {dish.name}
              </span>
              <div className="text-xs text-gray-500">{dish.posts} bài đăng</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);
