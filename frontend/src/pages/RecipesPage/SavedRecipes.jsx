import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import BreadCrumb from "../../components/common/BreadCrumb";
import { Plus, MoreVertical, Clock } from "lucide-react";
import SavedCard from "../../components/sections/Recipe/SavedCard";
import ActionButton from "../../components/common/ActionButton";
import AddCollectionModal from "../../components/common/Modal/Recipe/AddCollectionModal";
import { Love, Matcha, Ramen } from "@/assets/Recipe/images";
import { useNavigate } from "react-router-dom";

const collections = [
  { id: "yeu-thich", name: "Yêu thích", thumbnail: Love },
  { id: "trang-mieng", name: "Tráng miệng", thumbnail: Matcha },
  { id: "bo-suu-tap-moi", name: "Bộ sưu tập mới", thumbnail: null },
];

const recipesMock = [
  {
    id: 1,
    title: "Mì ramen chuẩn Nhật siêu đơn giản ai cũng có thể làm",
    time: "30 phút",
    type: "Bữa sáng",
    image: Ramen,
    author: "Bạn",
  },
  {
    id: 2,
    title: "Mì ramen chuẩn Nhật siêu đơn giản ai cũng có thể làm",
    time: "30 phút",
    type: "Bữa sáng",
    image: Ramen,
    author: "Bạn",
  },
  {
    id: 3,
    title: "Mì ramen chuẩn Nhật siêu đơn giản ai cũng có thể làm",
    time: "30 phút",
    type: "Bữa sáng",
    image: Ramen,
    author: "Bạn",
  },
];

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("yeu-thich");
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getBannerStyles = () => {
    const maxScroll = 200;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    const width = 100 - scrollProgress * 10;
    const borderRadius = scrollProgress * 48;

    return {
      width: `${width}%`,
      borderRadius: `${borderRadius}px`,
      transition: "width 0.5s ease-out, border-radius 0.5s ease-out",
      margin: "0 auto",
    };
  };

  const handleTabClick = (colId) => {
    if (colId === "bo-suu-tap-moi") {
      setShowModal(true);
    } else {
      setActiveTab(colId);
    }
  };

  const handleCreateCollection = () => {
    // Xử lý tạo bộ sưu tập mới
    console.log("Tạo bộ sưu tập:", { collectionName, collectionDescription });
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Header banner with gradient */}
      <div className="bg-gradient-to-br to-yellow-200 via-amber-300 from-orange-400 pt-10 pb-20 px-6 text-center" style={getBannerStyles()}>
        <BreadCrumb />
        <h1 className="text-[2.5em] font-bold text-white">Công thức đã lưu</h1>
      </div>


      <div className="my-12 mx-4 lg:mx-[120px]">
        {/* Collection Tabs */}
        <div className="flex gap-10 justify-start my-6">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => handleTabClick(col.id)}
              className={`flex flex-col items-center cursor-pointer ${
                activeTab === col.id
                  ? "text-pink-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {col.thumbnail ? (
                <img
                  src={col.thumbnail}
                  alt={col.name}
                  className={`size-[90px] object-cover rounded-full border-[5px] ${
                    activeTab === col.id ? "border-pink-600" : "border-gray-300"
                  } bg-white`}
                />
              ) : (
                <div className="size-[90px] flex items-center justify-center rounded-full border-2 border-dashed bg-white hover:border-pink-400 transition-colors">
                  <Plus className="text-gray-400" />
                </div>
              )}
              <span className="mt-2 text-base font-semibold">{col.name}</span>
            </div>
          ))}
        </div>

        {/* Collection Title */}
        <h2 className="text-2xl font-bold mb-6">
          {collections.find((c) => c.id === activeTab)?.name}
        </h2>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {recipesMock.map((recipe) => (
            <SavedCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* Add recipe button  */}
        <div className="flex justify-end">
          <button className="bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-full flex items-center gap-2 shadow-lg z-100" onClick={() => navigate('/recipes/create')}>
            <Plus size={20} />
            <span>Thêm công thức</span>
          </button>
        </div>
      </div>

      {/* Add Collection Modal */}
      <AddCollectionModal
        showModal={showModal}
        onClose={handleCloseModal}
        collectionName={collectionName}
        setCollectionName={setCollectionName}
        collectionDescription={collectionDescription}
        setCollectionDescription={setCollectionDescription}
        onCreateCollection={handleCreateCollection}
      />
    </>
  );
};

export default SavedRecipes;
