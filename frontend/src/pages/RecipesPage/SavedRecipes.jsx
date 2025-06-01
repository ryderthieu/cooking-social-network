import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Logo from '../../assets/orange-logo.svg';
import BreadCrumb from "../../components/common/BreadCrumb";
import { Plus, MoreVertical, Clock } from "lucide-react";
import SavedCard from "../../components/sections/Recipe/SavedCard";
import ActionButton from "../../components/common/ActionButton";
import AddCollectionModal from "../../components/common/Modal/Recipe/AddCollectionModal";
import { useNavigate } from "react-router-dom";
import {
  getUserCollections,
  createCollection,
  getCollectionRecipes,
  removeRecipeFromCollection,
} from "../../services/collectionService";

export default function SavedRecipes() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collections, setCollections] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load user collections on component mount
  const loadUserCollections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserCollections();

      if (response.success) {
        const userCollections = response.data;

        // Add "Add new collection" option
        const collectionsWithAddOption = [
          ...userCollections,
          { _id: "bo-suu-tap-moi", name: "Bộ sưu tập mới", thumbnail: null },
        ];

        setCollections(collectionsWithAddOption);

        // Set first collection as active tab if none selected
        if (!activeTab && userCollections.length > 0) {
          setActiveTab(userCollections[0]._id);
        }
      }
    } catch (error) {
      setError("Vui lòng đăng nhập để xem được danh sách công thức đã lưu.");
      toast.error("Vui lòng đăng nhập để xem được danh sách công thức đã lưu.");
      console.error("Error loading collections:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadUserCollections();
  }, [loadUserCollections]);

  // Load recipes when active tab changes
  useEffect(() => {
    if (activeTab && collections.length > 0) {
      loadCollectionRecipes(activeTab);
    }
  }, [activeTab, collections]);

  const loadCollectionRecipes = async (collectionId) => {
    if (collectionId === "bo-suu-tap-moi") return;

    try {
      const response = await getCollectionRecipes(collectionId);

      if (response.success) {
        // Process recipes to handle missing authors
        const processedRecipes = response.data.recipes.map((recipe) => ({
          ...recipe,
          author: recipe.author || {
            firstName: "Oshisha",
            lastName: "",
            avatar: "/orange-logo.svg",
          },
        }));

        setCurrentRecipes(processedRecipes);
      }
    } catch (error) {
      console.error("Error loading collection recipes:", error);
      setCurrentRecipes([]);
    }
  };

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

  const handleCreateCollection = async () => {
    try {
      const response = await createCollection({
        name: collectionName,
        description: collectionDescription,
      });

      if (response.success) {
        toast.success("Tạo bộ sưu tập thành công!");
        setShowModal(false);
        setCollectionName("");
        setCollectionDescription("");
        loadUserCollections(); // Reload collections
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Không thể tạo bộ sưu tập");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRemoveRecipe = async (recipeId) => {
    try {
      const response = await removeRecipeFromCollection(activeTab, recipeId);

      if (response.success) {
        // Remove recipe from current recipes
        setCurrentRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe._id !== recipeId)
        );
        toast.success("Đã xóa công thức khỏi bộ sưu tập");
      }
    } catch (error) {
      console.error("Error removing recipe:", error);
      toast.error("Không thể xóa công thức");
    }
  };

  // Filter recipes based on active collection
  const getFilteredRecipes = () => {
    return currentRecipes;
  };

  return (
    <>
      {/* Header banner with gradient */}
      <div
        className="bg-gradient-to-br to-yellow-200 via-amber-300 from-orange-400 pt-10 pb-20 px-6 text-center"
        style={getBannerStyles()}
      >
        <BreadCrumb />
        <h1 className="text-4xl font-bold text-white">Công thức đã lưu</h1>
      </div>

      <div className="my-12 mx-4 lg:mx-32">
        {/* Collection Tabs */}
        <div className="flex gap-10 justify-start my-6">
          {collections.map((col) => (
            <div
              key={col._id}
              onClick={() => handleTabClick(col._id)}
              className={`flex flex-col items-center cursor-pointer ${
                activeTab === col._id
                  ? "text-pink-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {col._id === "bo-suu-tap-moi" ? (
                <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-dashed bg-white hover:border-pink-400 transition-colors">
                  <Plus className="text-gray-400" />
                </div>
              ) : (
                <img
                  src={col.thumbnail || Logo}
                  alt={col.name}
                  className={`w-24 h-24 object-cover rounded-full border-[6px] ${
                    activeTab === col._id
                      ? "border-pink-600"
                      : "border-gray-300"
                  } bg-white`}
                />
              )}
              <span className="mt-2 text-base font-semibold">{col.name}</span>
            </div>
          ))}
        </div>

        {/* Collection Title */}
        <h2 className="text-2xl font-bold mb-6">
          {collections.find((c) => c._id === activeTab)?.name}
        </h2>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Đang tải...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : getFilteredRecipes().length > 0 ? (
            getFilteredRecipes().map((recipe) => (
              <SavedCard
                key={recipe._id}
                recipe={recipe}
                onRemove={() => handleRemoveRecipe(recipe._id)}
                showRemoveOption={true}
              />
            ))
          ) : (            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                Chưa có công thức nào trong bộ sưu tập này
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Hãy thêm một số công thức yêu thích của bạn! <span><a href="/search" className="text-pink-500 font-semibold hover:text-pink-600 hover:underline transition-all duration-200 cursor-pointer">Tại đây</a></span>
              </p>
            </div>
          )}
        </div>

        {/* Add recipe button  */}
        <div className="flex justify-end">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-full flex items-center gap-2 shadow-lg z-100"
            onClick={() => navigate("/recipes/create")}
          >
            <Plus size={20} />
            <span>Tạo công thức mới</span>
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
}
