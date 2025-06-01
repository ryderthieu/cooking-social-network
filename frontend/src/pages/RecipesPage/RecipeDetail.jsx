import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "@/components/common/BreadCrumb";
import ReviewSection from "@/components/sections/Recipe/RecipeDetail/ReviewSection";
import RecipeHeader from "@/components/sections/Recipe/RecipeDetail/RecipeHeader";
import RecipeImageSection from "@/components/sections/Recipe/RecipeDetail/RecipeImageSection";
import NutritionPanel from "@/components/sections/Recipe/RecipeDetail/NutritionPanel";
import IngredientsSection from "@/components/sections/Recipe/RecipeDetail/IngredientsSection";
import InstructionsSection from "@/components/sections/Recipe/RecipeDetail/InstructionsSection";
import RelatedRecipes from "@/components/sections/Recipe/RecipeDetail/RelatedRecipes";
import MoreRecipes from "@/components/sections/Recipe/RecipeDetail/MoreRecipes";
import { getRecipeById } from "@/services/recipeService";
import { calculateNutrition } from "@/utils/recipeUtils";

export default function RecipeDetail({ className }) {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [servings, setServings] = useState(1);
  const [calculatedNutrition, setCalculatedNutrition] = useState(null);
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

        console.log(recipeData);
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
    if (recipe && recipe.ingredients) {
      const originalServings = recipe.servings || 1;
      const nutrition = calculateNutrition(recipe.ingredients);

      // Adjust nutrition based on serving size
      const servingRatio = servings / originalServings;
      const adjustedNutrition = {
        calories: Math.round(nutrition.calories * servingRatio * 10) / 10,
        protein: Math.round(nutrition.protein * servingRatio * 10) / 10,
        fat: Math.round(nutrition.fat * servingRatio * 10) / 10,
        carbs: Math.round(nutrition.carbs * servingRatio * 10) / 10,
        cholesterol: Math.round(nutrition.cholesterol * servingRatio * 10) / 10,
      };

      setCalculatedNutrition(adjustedNutrition);
    }
  }, [recipe, servings]);

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
      className={`max-w-7xl mx-auto bg-white px-4 sm:px-6 lg:px-8 ${
        className || ""
      }`}
    >
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 py-4">
        <BreadCrumb category="Chi tiết công thức" />
      </div>

      {/* Recipe Header */}
      <RecipeHeader recipe={recipe} />

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
    </div>
  );
}
