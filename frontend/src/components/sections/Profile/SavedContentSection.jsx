import React from "react";
import SavedContent from "./SavedContent";

function SavedContentSection({ savedTab, setSavedTab }) {
  const savedTabs = [
    { key: "recipes", label: "Công thức" },
    { key: "posts", label: "Bài viết" },
    { key: "reels", label: "Reels" },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex space-x-4 mb-6 border-b pb-4">
        {savedTabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              savedTab === tab.key
                ? "bg-amber-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setSavedTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <SavedContent type={savedTab} />
    </div>
  );
}

export default SavedContentSection;