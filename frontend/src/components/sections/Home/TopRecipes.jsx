import React, { useState, useEffect } from "react";
import SavedCard from "../../sections/Recipe/SavedCard";
import { getTopRecipes } from "../../../services/recipeService";

const TopRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRecipes = async () => {
      try {
        setLoading(true);
        const response = await getTopRecipes();
        console.log(response.data);

        setRecipes(response.data.data);
      } catch (error) {
        console.error("Error fetching top recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRecipes();
  }, []);

  return (
    <div className="mt-[80px]">
      <div className="flex justify-between items-center mb-2">
        <div className="">
          <p className="font-bold text-[24px]">
            Khám phá các công thức đỉnh cao
          </p>

          <div className="w-16 h-1 bg-gradient-to-br from-orange-500 to-amber-500 mb-6"></div>
        </div>
        <a href="/recipes">
          <button className="text-[#A46000] text-[16px] font-medium hover:underline transition-all duration-300">
            Xem tất cả
          </button>
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="h-80 bg-gray-100 animate-pulse rounded-2xl"
              ></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <SavedCard
                key={recipe._id || `recipe-${index}`}
                recipe={recipe}
                showRemoveOption={false}
              />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500 py-10">
              Không tìm thấy công thức nổi bật nào.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TopRecipes;
