import { useState } from "react";
import { Bookmark, Share2, Heart, MoreVertical, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import StarRating from "./StarRating";
import CollectionDropdown from "../../../common/Modal/Recipe/CollectionDropdown";
import { FaBookmark } from "react-icons/fa";

export default function RecipeHeader({ recipe, onShare, onLike, isLiked }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  const formatCookingTime = (time) => {
    if (time >= 60) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      return minutes > 0 ? `${hours} tiếng ${minutes} phút` : `${hours} tiếng`;
    }
    return `${time} phút`;
  };
  const getAuthorName = () => {
    return (
      `${recipe?.author?.firstName || ""} ${
        recipe?.author?.lastName || ""
      }`.trim() || "Oshisha"
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Dễ":
        return "bg-green-500";
      case "Trung bình":
        return "bg-yellow-500";
      case "Khó":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case "Dễ":
        return "🐣";
      case "Trung bình":
        return "😁";
      case "Khó":
        return "🔥";
      default:
        return "🐣";
    }
  };

  // Check if current user is the recipe owner
  const isRecipeOwner = user && recipe?.author?._id === user._id;

  const handleEditRecipe = () => {
    navigate(`/recipes/edit/${recipe._id}`);
  };

  return (
    <>
      {/* Recipe Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-tight">
        {recipe?.name || "Recipe Title"}
      </h1>

      {/* Author and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <img
                src={
                  recipe?.author?.avatar ||
                  "https://res.cloudinary.com/dfaq5hbmx/image/upload/v1748692877/sushi_x1k4mg.png"
                }
                alt={getAuthorName()}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {getAuthorName()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">
              Thời gian nấu: {formatCookingTime(recipe?.time || 60)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <StarRating
              rating={recipe?.averageRating || 0}
              readonly
              size="sm"
              showValue
            />
            {recipe?.totalReviews > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({recipe.totalReviews} đánh giá)
              </span>
            )}
          </div>
        </div>        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Edit Button - Only show for recipe owner */}
          {isRecipeOwner && (
            <button
              onClick={handleEditRecipe}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
              title="Chỉnh sửa công thức"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Chỉnh sửa</span>
            </button>
          )}

          <button
            onClick={onLike}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              isLiked
                ? "bg-gray-100  hover:bg-gray-200"
                : "bg-gray-100 hover:text-red-500 hover:bg-gray-200"
            } transition-colors`}
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              } transition-colors`}
            />
          </button>

          <button
            onClick={onShare}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setShowCollectionDropdown(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaBookmark className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Collection Dropdown */}
      <CollectionDropdown
        isOpen={showCollectionDropdown}
        onClose={() => setShowCollectionDropdown(false)}
        recipeId={recipe?._id}
      />
    </>
  );
}
