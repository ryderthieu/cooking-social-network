import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb.jsx";
import CategoryCard from "../../components/sections/Recipe/CategoriesCard.jsx";
import RecipeGrid from "../../components/sections/Recipe/RecipeGrid.jsx";
import BlogSection from "../../components/sections/Recipe/BlogSection.jsx";
import ExploreSection from "../../components/sections/Recipe/ExploreSection.jsx";
import RecipeHeader from "../../components/sections/Recipe/RecipeHeader.jsx";
import { getAllRecipes, filterRecipes } from "../../services/recipeService.js";
import categoryService from "../../services/categoryService.js";

const Recipes = () => {
  const { categoryType, item } = useParams();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [filteredPopularRecipes, setFilteredPopularRecipes] = useState([]);  const [filteredAllRecipes, setFilteredAllRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(8);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const dietaryPreferences = queryParams.get("dietaryPreferences");
  const cookingMethod = queryParams.get("cookingMethod");
  const isQueryFiltering = dietaryPreferences || cookingMethod;

  // Filter recipes based on current category
  const filterRecipesByCategory = React.useCallback(
    (recipes) => {
      if (!categoryType || !item || !currentCategory) {
        return recipes;
      }

      return recipes.filter((recipe) => {
        if (!recipe.categories || !Array.isArray(recipe.categories))
          return false;

        // Check if any of the recipe's categories match the current filter
        return recipe.categories.some((category) => {
          // Handle populated category objects
          if (typeof category === "object" && category !== null) {
            const categoryTypeField = category.type;
            const categorySlug = category.slug;
            const categoryName = category.name;

            // Check if the category type matches
            if (categoryTypeField === categoryType) {
              // Try to match by slug first (most accurate)
              if (categorySlug === item) {
                return true;
              }

              // If slug doesn't match, try matching by name from database
              if (categoryName === currentCategory.name) {
                return true;
              }
            }
          }

          return false;
        });
      });
    },
    [categoryType, item, currentCategory]
  );
  // Fetch initial data (recipes, blogs, category info)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // Handle different filtering scenarios
        let recipes = [];

        if (isQueryFiltering) {
          // Use query parameter filtering - call backend API with filters
          const filters = {};
          if (dietaryPreferences)
            filters.dietaryPreferences = dietaryPreferences;
          if (cookingMethod) filters.cookingMethod = cookingMethod;

          try {
            const recipeResponse = await filterRecipes(filters);
            recipes = recipeResponse.data.data || [];
          } catch (filterError) {
            console.warn(
              "Failed to filter recipes, falling back to all recipes:",
              filterError
            );
            // Fallback to getting all recipes
            const recipeResponse = await getAllRecipes();
            recipes = recipeResponse.data.data || [];
          }
        } else {
          // Get all recipes for path parameter filtering or no filtering
          const recipeResponse = await getAllRecipes();
          recipes = recipeResponse.data.data || [];
        }

        setAllRecipes(recipes);

        // First, fetch category information if we have categoryType and item
        if (categoryType && item) {
          try {
            const categoryResponse =
              await categoryService.getCategoryBySlugAndType(
                categoryType,
                item
              );
            setCurrentCategory(categoryResponse.data.data);
          } catch (categoryError) {
            console.warn("Failed to load category info:", categoryError);
            setCurrentCategory(null);
          }        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
        // Fallback to empty arrays
        setFilteredPopularRecipes([]);
        setFilteredAllRecipes([]);
      }
    };

    fetchData();
  }, [categoryType, item, dietaryPreferences, cookingMethod, isQueryFiltering]);
  // Filter recipes when currentCategory or allRecipes changes
  useEffect(() => {
    if (allRecipes.length > 0) {
      let filtered = allRecipes;

      // Apply path parameter filtering (category-based) if not using query filters
      if (!isQueryFiltering && categoryType && item && currentCategory) {
        filtered = filterRecipesByCategory(allRecipes);
      }
      // If using query filters, recipes are already filtered from backend

      setFilteredPopularRecipes(filtered.slice(0, 4));
      setFilteredAllRecipes(filtered);
    }
  }, [
    allRecipes,
    filterRecipesByCategory,
    isQueryFiltering,
    categoryType,
    item,
    currentCategory,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Get category name for display
  const getCategoryDisplayName = () => {
    if (isQueryFiltering) {
      // Handle query parameter display names
      if (dietaryPreferences) {
        return `Chế độ ăn: ${dietaryPreferences}`;
      }
      if (cookingMethod) {
        return `Phương pháp nấu: ${cookingMethod}`;
      }
    }

    // Handle path parameter display names
    const categoryTypeMap = {
      mealType: "Loại bữa ăn",
      cuisine: "Vùng ẩm thực",
      occasions: "Dịp đặc biệt",
      dietaryPreferences: "Chế độ ăn",
      mainIngredients: "Nguyên liệu chính",
      cookingMethod: "Phương pháp nấu",
      timeBased: "Thời gian",
      difficultyLevel: "Mức độ khó",
    };
    return categoryTypeMap[categoryType] || categoryType;
  };

  // Get display names from database or fallback
  const displayItemName = currentCategory?.name || item || "";
  const displayCategoryName = getCategoryDisplayName();
  const categoryDescription =
    currentCategory?.description ||
    `Khám phá các công thức ${displayItemName.toLowerCase()} tuyệt vời! 
Từ những món ăn truyền thống đến hiện đại, 
chúng tôi mang đến cho bạn những trải nghiệm ẩm thực đa dạng và phong phú.`;

  const handleLoadMoreRecipes = () => {
    setVisibleRecipes((prev) => Math.min(prev + 8, filteredAllRecipes.length));
  };

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <RecipeHeader
        scrollY={scrollY}
        displayCategoryName={displayCategoryName}
        displayItemName={displayItemName}
        categoryDescription={categoryDescription}
        categoryType={categoryType}
        currentCategory={currentCategory}
      />      <div className="mx-auto space-y-10 my-10">
        {/* Blog Section */}
        <BlogSection />

        {/* Popular Recipes Section */}
        <RecipeGrid
          title="Công thức phổ biến"
          recipes={filteredPopularRecipes}
          showLoadMore={false}
        />

        {/* Explore More Section */}
        <ExploreSection categoryType={categoryType} currentItem={item} />

        {/* All Recipes Section */}
        <RecipeGrid
          title="Tất cả công thức"
          recipes={filteredAllRecipes.slice(0, visibleRecipes)}
          showLoadMore={visibleRecipes < filteredAllRecipes.length}
          onLoadMore={handleLoadMoreRecipes}
        />
      </div>
    </>
  );
};

export default Recipes;
