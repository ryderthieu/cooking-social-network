import React from 'react';

export default function ProfileTabs({ activeTab, setActiveTab, showSavedTab = false }) {
  const tabs = [
    { id: "posts", label: "Bài viết" },
    { id: "recipes", label: "Công thức" },
    { id: "videos", label: "Video" },
  ];
  
  if (showSavedTab) {
    tabs.push({ id: "saved", label: "Đã lưu" });
  }
  
  const gridCols = `grid-cols-${tabs.length}`;

  return (
    <div className={`grid w-full ${gridCols} bg-white rounded-2xl shadow-sm border-0 p-1 mb-6`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-4 rounded-xl ${
            activeTab === tab.id
              ? "bg-amber-100 font-semibold text-amber-600"
              : "text-gray-500 hover:text-amber-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}