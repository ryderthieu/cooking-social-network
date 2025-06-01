import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Logo from "../../assets/orange-logo.svg";
import BreadCrumb from "../../components/common/BreadCrumb";
import { Plus, MoreVertical, Clock } from "lucide-react";
import SavedCard from "../../components/sections/Recipe/SavedCard";
import ActionButton from "../../components/common/ActionButton";
import AddCollectionModal from "../../components/common/Modal/Recipe/AddCollectionModal";
import CollectionOptionsDropdown from "../../components/common/Modal/Recipe/CollectionOptionsDropdown";
import EditCollectionModal from "../../components/common/Modal/Recipe/EditCollectionModal";
import ChangeCollectionImageModal from "../../components/common/Modal/Recipe/ChangeCollectionImageModal";
import DeleteCollectionModal from "../../components/common/Modal/Recipe/DeleteCollectionModal";
import { useNavigate } from "react-router-dom";
import {
  getUserCollections,
  createCollection,
  getCollectionRecipes,
  removeRecipeFromCollection,
  updateCollection,
  updateCollectionImage,
  deleteCollection,
} from "../../services/collectionService";
import NavigateButton from "@/components/common/NavigateButton";

export default function SavedRecipes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collections, setCollections] = useState([]);
  const [currentRecipes, setCurrentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states for collection options
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeImageModal, setShowChangeImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      // Remove scroll handling since banner styles are not used
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
        loadUserCollections();
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

  // Collection options handlers
  const handleEditCollection = (collection) => {
    setSelectedCollection(collection);
    setShowEditModal(true);
  };

  const handleChangeCollectionImage = (collection) => {
    setSelectedCollection(collection);
    setShowChangeImageModal(true);
  };

  const handleDeleteCollection = (collection) => {
    setSelectedCollection(collection);
    setShowDeleteModal(true);
  };
  const handleUpdateCollection = async (updatedData) => {
    try {
      const response = await updateCollection(
        selectedCollection._id,
        updatedData
      );
      if (response.success) {
        toast.success("Cập nhật bộ sưu tập thành công!");
        setShowEditModal(false);
        setSelectedCollection(null);
        loadUserCollections();
      }
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.error("Không thể cập nhật bộ sưu tập");
    }
  };
  const handleUpdateCollectionImage = async (collectionId, imageUrl) => {
    try {
      const response = await updateCollectionImage(collectionId, imageUrl);
      if (response.success) {
        toast.success("Cập nhật ảnh bộ sưu tập thành công!");
        setShowChangeImageModal(false);
        setSelectedCollection(null);
        loadUserCollections();
      }
    } catch (error) {
      console.error("Error updating collection image:", error);
      toast.error("Không thể cập nhật ảnh bộ sưu tập");
    }
  };

  const handleConfirmDeleteCollection = async () => {
    try {
      const response = await deleteCollection(selectedCollection._id);
      if (response.success) {
        toast.success("Đã xóa bộ sưu tập thành công!");
        setShowDeleteModal(false);
        setSelectedCollection(null);

        // If deleted collection was active, switch to first available collection
        if (activeTab === selectedCollection._id) {
          const remainingCollections = collections.filter(
            (c) =>
              c._id !== selectedCollection._id && c._id !== "bo-suu-tap-moi"
          );
          if (remainingCollections.length > 0) {
            setActiveTab(remainingCollections[0]._id);
          } else {
            setActiveTab("");
          }
        }

        loadUserCollections();
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Không thể xóa bộ sưu tập");
    }
  };

  // Filter recipes based on active collection
  const getFilteredRecipes = () => {
    return currentRecipes;
  };

  return (
    <>
      {/* Header banner with gradient */}
      <div className="relative mt-4 overflow-hidden">
        {/* Background with multiple gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-400 to-purple-400"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/30 via-transparent to-blue-400/20"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center py-[50px] px-6">
          {/* Main title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center tracking-tight">
            Công thức đã lưu
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/90 text-center max-w-2xl leading-relaxed mb-8">
            Khám phá lại những công thức yêu thích mà bạn đã sưu tập
          </p>
        </div>

        {/* Bottom wave effect */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-12 fill-white"
          >
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
          </svg>
        </div>
      </div>
      <div className="my-4 mx-4 lg:mx-32">        {/* Collection Tabs */}
        <div className="flex gap-10 justify-start my-6">
          {collections.map((col) => {
            return (
              <div
                key={col._id}
                className={`flex flex-col items-center cursor-pointer relative ${
                  activeTab === col._id
                    ? "text-pink-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                <div className="relative">
                  <div
                    onClick={() => handleTabClick(col._id)}
                    className="flex flex-col items-center"
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
                    )}{" "}
                    <span className="mt-2 text-base font-semibold">
                      {col.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Collection Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {collections.find((c) => c._id === activeTab)?.name}
          </h2>          {/* Options dropdown - show only for custom collections (not default "Công thức của tôi" or "Yêu thích") */}
          {(() => {
            const activeCollection = collections.find(
              (c) => c._id === activeTab
            );
            
            // Check if this is a default collection
            const isDefaultCollection = activeCollection?.defaultType === "favorites" || 
                                      activeCollection?.defaultType === "created";

            return activeTab &&
              activeTab !== "bo-suu-tap-moi" &&
              activeCollection &&
              !isDefaultCollection ? (
              <CollectionOptionsDropdown
                collection={activeCollection}
                onEdit={() => handleEditCollection(activeCollection)}
                onChangeImage={() =>
                  handleChangeCollectionImage(activeCollection)
                }
                onDelete={() => handleDeleteCollection(activeCollection)}
              />
            ) : null;
          })()}
        </div>
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
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-700 text-xl font-semibold">
                  Chưa có công thức nào trong bộ sưu tập này
                </p>
                {(() => {
                  const activeCollection = collections.find(
                    (c) => c._id === activeTab
                  );
                  const isMyRecipesCollection =
                    activeCollection?.defaultType === "created";

                  return (
                    <>
                      <p className="text-gray-500 text-base">
                        {isMyRecipesCollection
                          ? "Hãy tạo công thức của bạn và trở thành đầu bếp chuyên nghiệp!"
                          : "Hãy thêm một số công thức yêu thích của bạn và biến bộ sưu tập này thành của riêng bạn!"}
                      </p>

                      {!isMyRecipesCollection && (
                        <button
                          className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full transition-colors"
                          onClick={() => navigate("/recipes")}
                        >
                          Khám phá công thức
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
        {(() => {
          const activeCollection = collections.find((c) => c._id === activeTab);
          return (
            activeCollection?.defaultType === "created" && (
              <div className="flex justify-end">
                <button
                  className="bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-full flex items-center gap-2 shadow-lg z-100"
                  onClick={() => navigate("/recipes/create")}
                >
                  <Plus size={20} />
                  <span>Tạo công thức mới</span>
                </button>
              </div>
            )
          );
        })()}
      </div>{" "}
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
      {/* Edit Collection Modal */}
      <EditCollectionModal
        showModal={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCollection(null);
        }}
        collection={selectedCollection}
        onUpdateCollection={handleUpdateCollection}
      />      {/* Change Collection Image Modal */}
      <ChangeCollectionImageModal
        showModal={showChangeImageModal}
        onClose={() => {
          setShowChangeImageModal(false);
          setSelectedCollection(null);
        }}
        collection={selectedCollection}
        onUpdateImage={handleUpdateCollectionImage}
      />
      {/* Delete Collection Modal */}
      <DeleteCollectionModal
        showModal={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCollection(null);
        }}
        onConfirmDelete={handleConfirmDeleteCollection}
        collectionName={selectedCollection?.name}
      />
    </>
  );
}
