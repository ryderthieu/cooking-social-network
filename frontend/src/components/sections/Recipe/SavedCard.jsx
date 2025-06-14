import React, { useEffect, useState } from "react";
import { Clock, Heart, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserById } from "../../../services/userService";
import {
  toggleRecipeInFavorites,
  checkRecipeInFavorites,
} from "../../../services/collectionService";
import { deleteRecipe } from "../../../services/recipeService";
import { useAuth } from "../../../context/AuthContext";
import CollectionDropdown from "../../common/Modal/Recipe/CollectionDropdown";
import DeleteRecipeModal from "../../common/Modal/Recipe/DeleteRecipeModal";
import { toast } from "react-toastify";

const SavedCard = ({ recipe, onRemove, showRemoveOption, onRecipeDeleted }) => {
  const [authorData, setAuthorData] = useState(null);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  // Check if current user is the author of this recipe
  const isAuthor = user && recipe.author && (
    (typeof recipe.author === 'string' && recipe.author === user._id) ||
    (typeof recipe.author === 'object' && recipe.author._id === user._id)
  );
  // Get difficulty level (1-3)
  const getDifficultyLevel = () => {
    // First check if difficulty is directly on recipe object
    const difficulty = recipe.difficultyLevel || recipe.difficulty;

    // If not found, check inside categories object
    const categoryDifficulty = recipe.categories?.difficultyLevel;    const finalDifficulty = difficulty || categoryDifficulty;

    if (!finalDifficulty) return 2; // Default to medium
    
    const difficultyMap = {
      "Dễ": 1,
      "dễ": 1,
      "Easy": 1,
      "easy": 1,
      "Trung bình": 2,
      "trung bình": 2,
      "Medium": 2,
      "medium": 2,
      "Khó": 3,
      "khó": 3,
      "Hard": 3,
      "hard": 3,
    };
    
    // Also handle numeric values
    let mappedLevel = difficultyMap[finalDifficulty];
    
    // If not found in map, try to parse as number
    if (!mappedLevel && !isNaN(parseInt(finalDifficulty))) {
      const numericLevel = parseInt(finalDifficulty);
      if (numericLevel >= 1 && numericLevel <= 3) {
        mappedLevel = numericLevel;
      }
    }
    
    return mappedLevel || 2;
  };
  // Fetch author data if we only have the author ID
  useEffect(() => {
    const fetchAuthorData = async () => {
      // If recipe already has author as object with firstName, use that
      if (
        recipe.author &&
        typeof recipe.author === "object" &&
        recipe.author.firstName
      ) {
        setAuthorData(recipe.author);
        return;
      }

      // If author is just an ID, fetch the author data
      if (recipe.author && typeof recipe.author === "string") {
        try {
          const response = await getUserById({ userId: recipe.author });
          if (response.status === 200) {
            setAuthorData(response.data);
          }
        } catch (error) {
          console.error("Error fetching author data:", error);
        }
      }
    };

    fetchAuthorData();
  }, [recipe.author]);

  // Check if recipe is in favorites
  useEffect(() => {
    const checkFavorites = async () => {
      if (isLoggedIn && recipe._id) {
        try {
          const response = await checkRecipeInFavorites(recipe._id);
          if (response.success) {
            setIsInFavorites(response.isInFavorites);
          }
        } catch (error) {
          console.error("Error checking favorites:", error);
        }
      }
    };

    checkFavorites();
  }, [recipe._id, isLoggedIn]);

  const handleToggleFavorites = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để lưu công thức");
      return;
    }

    try {
      const response = await toggleRecipeInFavorites(recipe._id);
      if (response.success) {
        setIsInFavorites(response.isInFavorites);
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
      toast.error("Không thể cập nhật yêu thích");
    }
  };
  const handleShowCollections = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để lưu công thức");
      return;
    }

    setShowCollectionDropdown(true);
  };

  const handleEditRecipe = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/recipes/edit/${recipe._id || recipe.id}`);
  };

  const handleDeleteRecipe = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDeleteRecipe = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteRecipe(recipe._id || recipe.id);
      
      if (response.status === 200 && response.data.success) {
        toast.success("Xóa công thức thành công!");
        setShowDeleteModal(false);
        
        // Call parent callback if provided
        if (onRecipeDeleted) {
          onRecipeDeleted(recipe._id || recipe.id);
        }
        
        // Refresh the page or redirect
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa công thức"
      );
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCollectionSuccess = () => {
    // Refresh favorites status
    if (isLoggedIn && recipe._id) {
      checkRecipeInFavorites(recipe._id).then((response) => {
        if (response.success) {
          setIsInFavorites(response.isInFavorites);
        }
      });
    }
  };

  const difficultyLevel = getDifficultyLevel();

  // Helper to get the recipe title
  const getTitle = () => recipe.title || recipe.name || "Công thức nấu ăn";

  // Helper to render author name properly
  const renderAuthorName = () => {
    if (authorData) {
      if (authorData.firstName && authorData.lastName) {
        return `${authorData.firstName} ${authorData.lastName}`;
      }
      if (authorData.firstName) return authorData.firstName;
      if (authorData.name) return authorData.name;
    }

    return "Oshisha";
  };

  // Helper to get recipe cooking time
  const getCookingTime = () => recipe.cookingTime || recipe.time || "30";
  // Get current page context
  const getCurrentPageContext = () => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "recipes" && pathParts[2] && pathParts[3]) {
      return {
        categoryType: pathParts[2],
        item: pathParts[3],
        itemName: decodeURIComponent(pathParts[3]),
      };
    }
    return null;
  };

  // Helper to get categories for display (max 2, prioritize current page category)
  const getDisplayCategories = () => {
    const currentContext = getCurrentPageContext();
    let allCategories = [];

    // Extract all categories from recipe using real database data
    if (recipe.categories && Array.isArray(recipe.categories)) {
      // New structure: array of populated category objects from database
      allCategories = recipe.categories
        .map((cat) => {
          if (typeof cat === "object" && cat !== null) {
            // Use the actual name from database category object
            if (cat.name) {
              return cat.name;
            } else if (cat.slug) {
              // If name is not available, use slug as fallback
              return cat.slug;
            } else {
              return null;
            }
          } else if (typeof cat === "string") {
            // Direct string category name
            return cat;
          } else {
            return null;
          }
        })
        .filter(Boolean);
    } else if (recipe.categories && typeof recipe.categories === "object") {
      // Old structure: categories object with arrays
      const {
        mealType,
        cuisine,
        mainIngredients,
        cookingMethod,
        dietaryPreferences,
      } = recipe.categories;
      [
        mealType,
        cuisine,
        mainIngredients,
        cookingMethod,
        dietaryPreferences,
      ].forEach((categoryArray) => {
        if (Array.isArray(categoryArray)) {
          allCategories.push(...categoryArray);
        }
      });
    }

    // Remove duplicates and filter out invalid entries
    allCategories = [...new Set(allCategories)].filter(
      (cat) => cat && typeof cat === "string" && cat.trim() !== ""
    );

    // If we're on a recipes page, prioritize the current category
    if (currentContext && currentContext.itemName) {
      const currentCategoryIndex = allCategories.findIndex(
        (cat) => cat === currentContext.itemName
      );
      if (currentCategoryIndex > -1) {
        // Move current category to front
        const currentCategory = allCategories.splice(
          currentCategoryIndex,
          1
        )[0];
        allCategories.unshift(currentCategory);
      }
    }

    // Return max 2 categories
    return allCategories.slice(0, 1);
  };
  return (
    <div
      className="block group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200 cursor-pointer"
    >
      {/* Recipe Image Container */}
      <div className="relative h-56 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
        {/* Main image */}
        <img
          src={
            recipe.image &&
            Array.isArray(recipe.image) &&
            recipe.image.length > 0
              ? recipe.image[0]
              : recipe.image || "/placeholder.svg"
          }
          alt={getTitle()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />    
        {/* Top action buttons - Only show when logged in */}
        {isLoggedIn && (
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            {/* Edit/Delete buttons for recipe author */}
            {isAuthor && (
              <>                <button
                  onClick={handleEditRecipe}
                  className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-blue-50 hover:scale-110 transition-all duration-300 shadow-lg"
                  title="Chỉnh sửa công thức"
                >
                  <Edit size={16} className="text-blue-600" />
                </button>
                <button
                  onClick={handleDeleteRecipe}
                  className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-red-50 hover:scale-110 transition-all duration-300 shadow-lg"
                  title="Xóa công thức"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </>
            )}

            {/* Heart button for favorites */}
            <button
              onClick={
                showRemoveOption
                  ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemove && onRemove();
                    }
                  : (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleFavorites(e);
                    }
              }
              className={`p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg ${
                showRemoveOption
                  ? "hover:bg-red-50"
                  : isInFavorites
                  ? "hover:bg-red-50"
                  : "hover:bg-orange-50"
              }`}
              title={
                showRemoveOption
                  ? "Bỏ lưu công thức"
                  : isInFavorites
                  ? "Bỏ khỏi yêu thích"
                  : "Thêm vào yêu thích"
              }
            >
              <Heart
                size={16}
                className={
                  showRemoveOption
                    ? "text-red-500"
                    : isInFavorites
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }
                fill={
                  isInFavorites || showRemoveOption ? "currentColor" : "none"
                }
              />
            </button>

            {/* More options button for collection dropdown */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleShowCollections(e);
              }}
              className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
              title="Lưu vào bộ sưu tập"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>
          </div>
        )}
        {/* Recipe categories badges */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex flex-wrap gap-2">
            {getDisplayCategories().map((category, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-md rounded-full text-xs font-semibold text-orange-700 shadow-lg border border-orange-100"
              >
                {category}
              </span>
            ))}
            {getDisplayCategories().length === 0 && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-md rounded-full text-xs font-semibold text-orange-700 shadow-lg border border-orange-100">
                Món ăn
              </span>
            )}
          </div>
        </div>
        {/* Author info */}
        <div className="absolute bottom-2 right-2 z-30">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-lg rounded-full shadow-lg border border-white group-hover:shadow-orange-200/50 transition-all duration-500">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-orange-100 shadow-sm transform group-hover:scale-105 transition-transform duration-500">
              <img
                src={authorData?.avatar || "/avatars/default.png"}
                alt="avatar"
                onError={(e) => {
                  // Create a fallback with user initials
                  const name = authorData?.firstName || "U";
                  e.target.src = `https://ui-avatars.com/api/?name=${name}&background=f97316&color=fff`;
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-orange-800 whitespace-nowrap">
              {renderAuthorName()}
            </p>
          </div>
        </div>
      </div>{" "}
      {/* Content Section */}
      <div className="p-6">
        <div className="block group">
          <h3 className="font-medium text-lg text-gray-900 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
            {getTitle()}
          </h3>
        </div>{" "}
        {/* Recipe stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="p-1.5 bg-gray-100 rounded-lg">
              <Clock size={14} className="text-gray-500" />
            </div>
            <span className="text-sm font-medium">{getCookingTime()} phút</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-500">
              <span className="text-xs">Độ khó:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`w-1.5 h-1.5 rounded-full ${
                      level <= difficultyLevel ? "bg-orange-400" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>{" "}
          </div>
        </div>
        {/* Action button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/recipes/${recipe._id || recipe.id}`;
            }}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-sm font-semibold rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Xem công thức
          </button>
        </div>
      </div>
      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-300/10 to-yellow-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />      {/* Collection Dropdown */}
      <CollectionDropdown
        isOpen={showCollectionDropdown}
        onClose={() => setShowCollectionDropdown(false)}
        recipeId={recipe._id}
        onSuccess={handleCollectionSuccess}
      />

      {/* Delete Recipe Modal */}
      <DeleteRecipeModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteRecipe}
        recipeName={getTitle()}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SavedCard;
