import { Heart, Clock, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSimilarRecipes } from "@/services/recipeService";
import { getUserById } from "@/services/userService";
import {
  toggleRecipeInFavorites,
  checkRecipeInFavorites,
} from "@/services/collectionService";
import { useAuth } from "@/context/AuthContext";
import CollectionDropdown from "../../../common/Modal/Recipe/CollectionDropdown";
import { toast } from "react-toastify";
import Logo from "../../../../assets/orange-logo.svg";

export default function MoreRecipes() {
  const { id } = useParams();
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorsData, setAuthorsData] = useState({});
  const [favoritesStatus, setFavoritesStatus] = useState({});
  const [showCollectionDropdown, setShowCollectionDropdown] = useState({});

  const { user } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getSimilarRecipes(id, 6);
        setSimilarRecipes(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching similar recipes:", err);
        setError("Không thể tải công thức tương tự");
        // Fallback to empty array if error
        setSimilarRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarRecipes();
  }, [id]);

  // Fetch author data for recipes
  useEffect(() => {
    const fetchAuthorsData = async () => {
      const authorsMap = {};

      for (const recipe of similarRecipes) {
        if (
          recipe.author &&
          typeof recipe.author === "string" &&
          !authorsMap[recipe.author]
        ) {
          try {
            const response = await getUserById({ userId: recipe.author });
            if (response.status === 200) {
              authorsMap[recipe.author] = response.data;
            }
          } catch (error) {
            console.error("Error fetching author data:", error);
          }
        } else if (recipe.author && typeof recipe.author === "object") {
          authorsMap[recipe.author._id || recipe.author.id] = recipe.author;
        }
      }

      setAuthorsData(authorsMap);
    };

    if (similarRecipes.length > 0) {
      fetchAuthorsData();
    }
  }, [similarRecipes]);

  // Check favorites status for all recipes
  useEffect(() => {
    const checkAllFavorites = async () => {
      if (!isLoggedIn) return;

      const favoritesMap = {};

      for (const recipe of similarRecipes) {
        try {
          const response = await checkRecipeInFavorites(recipe._id);
          if (response.success) {
            favoritesMap[recipe._id] = response.isInFavorites;
          }
        } catch (error) {
          console.error("Error checking favorites:", error);
        }
      }

      setFavoritesStatus(favoritesMap);
    };

    if (similarRecipes.length > 0) {
      checkAllFavorites();
    }
  }, [similarRecipes, isLoggedIn]);
  // Helper functions
  const getDifficultyLevel = (recipe) => {
    // Check multiple possible difficulty sources
    const difficulty =
      recipe.difficultyLevel ||
      recipe.difficulty ||
      recipe.categories?.difficultyLevel;

    if (!difficulty) return null; // Return null instead of default

    const difficultyMap = {
      "Dễ": 1,
      Easy: 1,
      easy: 1,
      "Trung bình": 2,
      Medium: 2,
      medium: 2,
      "Khó": 3,
      Hard: 3,
      hard: 3,
    };

    return difficultyMap[difficulty] || null;
  };

  const getTitle = (recipe) => {
    // Only return actual title/name, no default fallback
    return recipe.title || recipe.name || "";
  };

  const renderAuthorName = (recipe) => {
    const authorId =
      typeof recipe.author === "string"
        ? recipe.author
        : recipe.author?._id || recipe.author?.id;
    const authorData = authorsData[authorId] || recipe.author;

    if (authorData && typeof authorData === "object") {
      if (authorData.firstName && authorData.lastName) {
        return `${authorData.firstName} ${authorData.lastName}`;
      }
      if (authorData.firstName) return authorData.firstName;
      if (authorData.lastName) return authorData.lastName;
      if (authorData.name) return authorData.name;
    }

    // Return null if no valid author name found
    return null;
  };

  const getCookingTime = (recipe) => {
    // Check multiple time fields and only return if valid
    const time =
      recipe.cookingTime || recipe.time || recipe.prepTime || recipe.totalTime;
    return time && !isNaN(parseInt(time)) ? parseInt(time) : null;
  };

  const getRecipeImage = (recipe) => {
    // Handle different image formats
    if (recipe.image) {
      if (Array.isArray(recipe.image) && recipe.image.length > 0) {
        return recipe.image[0];
      }
      if (typeof recipe.image === "string") {
        return recipe.image;
      }
    }
    return null; // Return null instead of placeholder
  };

  const getAuthorAvatar = (recipe) => {
    const authorId =
      typeof recipe.author === "string"
        ? recipe.author
        : recipe.author?._id || recipe.author?.id;
    const authorData = authorsData[authorId] || recipe.author;

    if (authorData && typeof authorData === "object") {
      return authorData.avatar || null;
    }
    return null;
  };

  const getDisplayCategories = (recipe) => {
    let allCategories = [];

    if (recipe.categories && Array.isArray(recipe.categories)) {
      allCategories = recipe.categories
        .map((cat) => {
          if (typeof cat === "object" && cat !== null) {
            return cat.name || cat.slug || null;
          } else if (typeof cat === "string") {
            return cat;
          }
          return null;
        })
        .filter(Boolean);
    } else if (recipe.categories && typeof recipe.categories === "object") {
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

    allCategories = [...new Set(allCategories)].filter(
      (cat) => cat && typeof cat === "string" && cat.trim() !== ""
    );

    return allCategories.slice(0, 2);
  };

  const handleToggleFavorites = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để lưu công thức");
      return;
    }

    try {
      const response = await toggleRecipeInFavorites(recipeId);
      if (response.success) {
        setFavoritesStatus((prev) => ({
          ...prev,
          [recipeId]: response.isInFavorites,
        }));
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
      toast.error("Không thể cập nhật yêu thích");
    }
  };

  const handleShowCollections = (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.info("Vui lòng đăng nhập để lưu công thức");
      return;
    }

    setShowCollectionDropdown((prev) => ({
      ...prev,
      [recipeId]: true,
    }));
  };

  const handleCollectionSuccess = (recipeId) => {
    if (isLoggedIn && recipeId) {
      checkRecipeInFavorites(recipeId).then((response) => {
        if (response.success) {
          setFavoritesStatus((prev) => ({
            ...prev,
            [recipeId]: response.isInFavorites,
          }));
        }
      });
    }
  };
  // Show loading state
  if (loading) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Khám phá thêm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-56 bg-gray-300"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-300 rounded mb-3"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Show empty state if no similar recipes
  if (!similarRecipes || similarRecipes.length === 0) {
    return (
      <div className="my-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Khám phá thêm</h2>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error ? "Có lỗi xảy ra" : "Chưa có công thức tương tự"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {error ||
              "Hiện tại chưa có công thức nào tương tự được tìm thấy. Hãy thử khám phá các công thức khác nhé!"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Khám phá thêm</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {" "}
        {similarRecipes
          .map((recipe) => {
            const isInFavorites = favoritesStatus[recipe._id] || false;
            const difficultyLevel = getDifficultyLevel(recipe);
            const displayCategories = getDisplayCategories(recipe);
            const recipeTitle = getTitle(recipe);
            const authorName = renderAuthorName(recipe);
            const cookingTime = getCookingTime(recipe);
            const recipeImage = getRecipeImage(recipe);
            const authorAvatar = getAuthorAvatar(recipe);

            // Skip rendering if essential data is missing
            if (!recipeTitle || !recipe._id) {
              return null;
            }

            return (
              <a
                href={`/recipes/${recipe._id}`}
                key={recipe._id}
                className="block group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-gray-200 cursor-pointer"
              >
                {/* Recipe Image Container */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />

                  {/* Main image - only render if image exists */}
                  {recipeImage ? (
                    <img
                      src={recipeImage}
                      alt={recipeTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg
                            className="w-8 h-8 text-orange-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                        <p className="text-orange-600 text-sm font-medium">
                          Công thức
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Top action buttons - Only show when logged in */}
                  {isLoggedIn && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      {/* Heart button for favorites */}
                      <button
                        onClick={(e) => handleToggleFavorites(e, recipe._id)}
                        className={`p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg ${
                          isInFavorites
                            ? "hover:bg-red-50"
                            : "hover:bg-orange-50"
                        }`}
                        title={
                          isInFavorites
                            ? "Bỏ khỏi yêu thích"
                            : "Thêm vào yêu thích"
                        }
                      >
                        <Heart
                          size={16}
                          className={
                            isInFavorites
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }
                          fill={isInFavorites ? "currentColor" : "none"}
                        />
                      </button>

                      {/* More options button for collection dropdown */}
                      <button
                        onClick={(e) => handleShowCollections(e, recipe._id)}
                        className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                        title="Lưu vào bộ sưu tập"
                      >
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  )}

                  {/* Recipe categories badges - Only show if categories exist */}
                  {displayCategories.length > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="flex flex-wrap gap-2">
                        {displayCategories.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-md rounded-full text-xs font-semibold text-orange-700 shadow-lg border border-orange-100"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Author info - Only show if author name exists */}
                  {authorName && (
                    <div className="absolute bottom-2 right-2 z-30">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-lg rounded-full shadow-lg border border-white group-hover:shadow-orange-200/50 transition-all duration-500">
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-orange-100 shadow-sm transform group-hover:scale-105 transition-transform duration-500">
                          {authorAvatar ? (
                            <img
                              src={authorAvatar}
                              alt="avatar"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const name = authorName.charAt(0).toUpperCase();
                                e.target.src = `https://ui-avatars.com/api/?name=${name}&background=f97316&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {authorName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-orange-800 whitespace-nowrap">
                          {authorName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>{" "}
                {/* Content Section */}
                <div className="p-6">
                  <div className="block group/link">
                    <h3 className="font-medium text-lg text-gray-900 line-clamp-2 mb-3 group-hover/link:text-orange-600 transition-colors duration-300 leading-tight">
                      {recipeTitle}
                    </h3>
                  </div>

                  {/* Recipe stats */}
                  <div className="flex items-center justify-between">
                    {/* Cooking time - Only show if available */}
                    {cookingTime && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <Clock size={14} className="text-gray-500" />
                        </div>
                        <span className="text-sm font-medium">
                          {cookingTime} phút
                        </span>
                      </div>
                    )}

                    {/* Difficulty level - Only show if available */}
                    {difficultyLevel && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-500">
                          <span className="text-xs">Độ khó:</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((level) => (
                              <div
                                key={level}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  level <= difficultyLevel
                                    ? "bg-orange-400"
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* If neither cooking time nor difficulty, show a placeholder */}
                    {!cookingTime && !difficultyLevel && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <span className="text-sm">Thông tin đang cập nhật</span>
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/recipes/${recipe._id}`;
                      }}
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-sm font-semibold rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Xem công thức
                    </button>
                  </div>
                </div>
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-300/10 to-yellow-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {/* Collection Dropdown */}
                <CollectionDropdown
                  isOpen={showCollectionDropdown[recipe._id] || false}
                  onClose={() =>
                    setShowCollectionDropdown((prev) => ({
                      ...prev,
                      [recipe._id]: false,
                    }))
                  }
                  recipeId={recipe._id}
                  onSuccess={() => handleCollectionSuccess(recipe._id)}
                />
              </a>
            );
          })
          .filter(Boolean)}{" "}
        {/* Filter out null values */}
      </div>
    </div>
  );
}
