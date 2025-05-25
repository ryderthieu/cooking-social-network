import React, { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import BreadCrumb from "../../components/common/BreadCrumb";
; 
import { Plus } from "lucide-react"; // icon nút
import RecipeCard from "../../components/recipe/SavedCard";

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
  // Thêm công thức khác nếu muốn
];

const SavedRecipes = () => {
  const [activeTab, setActiveTab] = useState("yeu-thich");

  return (
    <MainLayout>
      <div className="px-6">
        {/* Breadcrumb */}
        <div className="pt-4">
          <BreadCrumb />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold my-4 text-center">Công thức đã lưu</h1>

        {/* Tab */}
        <div className="flex gap-6 justify-center my-6">
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
                  }`}
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-dashed">
                  <Plus />
                </div>
              )}
              <span className="mt-2 text-sm">{col.name}</span>
            </div>
          ))}
        </div>

        {/* Recipe List */}
        <h2 className="text-xl font-bold mb-4">{collections.find(c => c.id === activeTab)?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipesMock.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* Add recipe button */}
        <div className="flex justify-end my-8">
          <button className="bg-pink-500 text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg hover:bg-pink-600 transition">
            <Plus /> Thêm công thức
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SavedRecipes;
