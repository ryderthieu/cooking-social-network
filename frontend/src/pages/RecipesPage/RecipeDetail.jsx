import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "@/components/common/BreadCrumb";
import {
  ReviewSection,
  RecipeHeader,
  RecipeImageSection,
  NutritionPanel,
  IngredientsSection,
  InstructionsSection,
  RelatedRecipes,
  MoreRecipes
} from "@/components/sections/Recipe/RecipeDetail/index.js";
import { getRecipeById } from "@/services/recipeService";
import { calculateNutrition } from "@/utils/recipeUtils";
import SharePopup from "@/components/common/SharePopup";
import { checkRecipeInFavorites, toggleRecipeInFavorites } from "../../services/collectionService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function RecipeDetail({ className }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(1);
  const [calculatedNutrition, setCalculatedNutrition] = useState(null);
  
    // Calculate nutrition when recipe changes
  useEffect(() => {
    if (recipe && recipe.ingredients && recipe.ingredients.length > 0) {
      try {
        console.log('Recipe ingredients with nutrition:', recipe.ingredients);
        const nutrition = calculateNutrition(recipe.ingredients);
        setCalculatedNutrition(nutrition);
      } catch (error) {
        console.error('Error calculating nutrition:', error);
        setCalculatedNutrition(null);
      }
    } else {
      setCalculatedNutrition(null);
    }
  }, [recipe]);
  
  const [isLiked, setIsLiked] = useState(false);
  const [sharePopup, setSharePopup] = useState({
    open: false,
    recipeId: null,
    recipeTitle: "",
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // Validate if ID is a valid MongoDB ObjectId format (24 hex characters)
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(id)) {
          setError("Invalid recipe ID");
          return;
        }        
        const response = await getRecipeById(id);
        const recipeData = response.data.data;
        setRecipe(recipeData);
        setError(null);

        // Set servings to recipe's default servings when recipe is loaded
        if (recipeData?.servings) {
          setServings(recipeData.servings);
        } else {
          setServings(1); // Fallback to backend default
        }

        console.log('Full recipe data from API:', recipeData);
        console.log('Recipe ingredients structure:', recipeData?.ingredients);
        
        // Log each ingredient structure in detail
        if (recipeData?.ingredients) {
          recipeData.ingredients.forEach((ingredient, index) => {
            console.log(`Ingredient ${index}:`, ingredient);
            console.log(`- Name: ${ingredient.name || ingredient.ingredient?.name}`);
            console.log(`- Quantity: ${ingredient.quantity}`);
            console.log(`- Unit: ${ingredient.unit}`);
            console.log(`- Nutrition data:`, ingredient.nutrition || ingredient.ingredient?.nutrition);
          });
        }
      } catch (err) {
        setError("Failed to load recipe");
        console.error("Error fetching recipe:", err);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);
  // Recalculate nutrition when recipe or servings change
  useEffect(() => {
    if (recipe && recipe.ingredients && recipe.ingredients.length > 0) {
      try {
        console.log('Recipe ingredients:', recipe.ingredients);
        const originalServings = recipe.servings || 1;
        const nutrition = calculateNutrition(recipe.ingredients);
        console.log('Calculated base nutrition:', nutrition);

        // Adjust nutrition based on serving size
        const servingRatio = servings / originalServings;
        console.log('Serving ratio:', servingRatio, 'Original:', originalServings, 'Current:', servings);
        
        const adjustedNutrition = {
          calories: Math.round(nutrition.calories * servingRatio * 10) / 10,
          protein: Math.round(nutrition.protein * servingRatio * 10) / 10,
          fat: Math.round(nutrition.fat * servingRatio * 10) / 10,
          carbs: Math.round(nutrition.carbs * servingRatio * 10) / 10,
          cholesterol: Math.round(nutrition.cholesterol * servingRatio * 10) / 10,
        };

        console.log('Final adjusted nutrition:', adjustedNutrition);
        setCalculatedNutrition(adjustedNutrition);
      } catch (error) {
        console.error('Error calculating nutrition:', error);
        setCalculatedNutrition(null);
      }
    } else {
      console.log('No ingredients found, setting nutrition to null');
      setCalculatedNutrition(null);
    }
  }, [recipe, servings]);

  // Check if recipe is in favorites
  useEffect(() => {
    const checkFavorites = async () => {
      if (user && recipe?._id) {
        try {
          const response = await checkRecipeInFavorites(recipe._id);
          if (response.success) {
            setIsLiked(response.isInFavorites);
          }
        } catch (error) {
          console.error("Error checking favorites:", error);
        }
      }
    };

    checkFavorites();
  }, [recipe?._id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để lưu công thức");
      return;
    }

    try {
      const response = await toggleRecipeInFavorites(recipe._id);
      if (response.success) {
        setIsLiked(response.isInFavorites);
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error toggling favorites:", error);
      toast.error("Không thể cập nhật yêu thích");
    }
  };

  if (error || !recipe) {
    return (
      <div className="max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Recipe not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-7xl mx-auto bg-white${
        className || ""
      }`}
    >
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 py-4">

        {/* <BreadCrumb category="Chi tiết công thức" /> */}

       {/* <BreadCrumb
          items={[
             { label: "Trang chủ", link: "/" },
            { label: "Công thức", link: "/recipes" },
           { label: recipe?.name || "Chi tiết công thức" },
         ]}
      /> */}

      </div>

      {/* Recipe Header */}
      <RecipeHeader
        recipe={recipe}
        onShare={() => setSharePopup({
          open: true,
          recipeId: recipe._id,
          recipeTitle: recipe.name,
        })}
        onLike={handleLike}
        isLiked={isLiked}
      />

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Recipe Image */}
        <RecipeImageSection recipe={recipe} />

        {/* Nutritional Information */}
        <NutritionPanel calculatedNutrition={calculatedNutrition} />
      </div>

      {/* Recipe Description */}
      <p className="text-gray-600 mb-8 text-base leading-relaxed">
        {recipe?.description || "No description available."}
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Ingredients Section */}
          <IngredientsSection
            recipe={recipe}
            servings={servings}
            setServings={setServings}
          />

          {/* Cooking Instructions */}
          <InstructionsSection recipe={recipe} />

          {/* Rating Section */}
          <ReviewSection recipeId={id} />
        </div>

        <div className="lg:w-1/3">
          {/* Related Recipes */}
          <RelatedRecipes />
        </div>
      </div>

      {/* More Recipes Section */}
      <MoreRecipes />

      {/* Share Popup */}
      <SharePopup
        isOpen={sharePopup.open}
        onClose={() => setSharePopup({ open: false, recipeId: null, recipeTitle: "" })}
        recipeId={sharePopup.recipeId}
        recipeTitle={sharePopup.recipeTitle}
        type="recipe"
      />
    </div>
  );
}
