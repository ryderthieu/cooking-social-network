import React from 'react';

export default function ProfileTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "posts", label: "Bài đăng" },
    { id: "recipes", label: "Công thức" },
    { id: "videos", label: "Video" },
    { id: "saved", label: "Đã lưu" }
  ];
  
  return (
    <div className="grid w-full grid-cols-4 bg-white rounded-2xl shadow-sm border-0 p-1 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-4 rounded-xl ${
            activeTab === tab.id
              ? "bg-amber-100 text-amber-800"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}