import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import BreadCrumb from "../../components/common/BreadCrumb";
import { Plus, MoreVertical, Clock } from "lucide-react";
import SavedCard from "../../components/sections/Recipe/SavedCard";
import ActionButton from "../../components/common/ActionButton";

const collections = [
  { id: "yeu-thich", name: "Yêu thích", thumbnail: "/images/yeuthich.jpg" },
  { id: "trang-mieng", name: "Tráng miệng", thumbnail: "/images/trangmieng.jpg" },
  { id: "bo-suu-tap-moi", name: "Bộ sưu tập mới", thumbnail: null },
];

const recipesMock = [
  {
    id: 1,
    title: "Strawberry Oatmeal Pancake with Honey Syrup",
    time: "30 Minutes",
    type: "Breakfast",
    image: "/images/pancake.jpg",
    author: "Bạn",
  },
  {
    id: 2,
    title: "Strawberry Oatmeal Pancake with Honey Syrup",
    time: "30 Minutes",
    type: "Breakfast",
    image: "/images/pancake.jpg",
    author: "Bạn",
  },
  {
    id: 3,
    title: "Strawberry Oatmeal Pancake with Honey Syrup",
    time: "30 Minutes",
    type: "Breakfast",
    image: "/images/pancake.jpg",
    author: "Bạn",
  },
];

const SavedRecipes = () => {
  const [activeTab, setActiveTab] = useState("yeu-thich");

  return (
    <MainLayout>
      {/* Header banner with gradient */}
      <div className="bg-gradient-to-r from-orange-300 to-yellow-300 py-6 px-6 text-center p-6">
        <BreadCrumb />
        <h1 className="text-3xl font-bold text-white">Công thức đã lưu</h1>
      </div>

      <div className="px-6">
        {/* Collection Tabs */}
        <div className="flex gap-10 justify-center my-6">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => setActiveTab(col.id)}
              className={`flex flex-col items-center cursor-pointer ${
                activeTab === col.id ? "text-pink-600 font-semibold" : "text-gray-600"
              }`}
            >
              {col.thumbnail ? (
                <img
                  src={col.thumbnail}
                  alt={col.name}
                  className={`w-16 h-16 rounded-full border-2 ${
                    activeTab === col.id ? "border-pink-600" : "border-gray-300"
                  } bg-white`}
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-dashed bg-white">
                  <Plus />
                </div>
              )}
              <span className="mt-2 text-sm">{col.name}</span>
            </div>
          ))}
        </div>

        {/* Collection Title */}
        <h2 className="text-xl font-bold mb-6">{collections.find(c => c.id === activeTab)?.name}</h2>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {recipesMock.map((recipe) => (
            <div key={recipe.id} className="bg-orange-50 rounded-lg overflow-hidden shadow">
              <div className="relative">
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                <button className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                  <MoreVertical size={18} />
                </button>
                <div className="absolute bottom-0 left-0 bg-white px-3 py-1 rounded-tr-lg">
                  <div className="text-xs text-gray-500">Tác giả bạn</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                      <Clock size={12} color="white" />
                    </span>
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white">
                      <span className="text-[8px]">🍽️</span>
                    </span>
                    <span>{recipe.type}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add recipe button - positioned at bottom right */}
        <div className="fixed bottom-8 right-8">
          <button className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-full flex items-center gap-2 shadow-lg">
            <Plus size={20} />
            <span>Thêm công thức</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SavedRecipes;