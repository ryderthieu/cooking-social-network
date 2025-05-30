import React from "react";
import Recipe from "../../common/Recipe";

const RecipeGrid = ({ title, recipes, showLoadMore, onLoadMore }) => {
  return (
    <div className="container mx-auto px-4">
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-6 md:mb-8">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
        {recipes?.map((recipe, index) => (
          <Recipe key={recipe.id || index} data={recipe} />
        ))}
      </div>
      {showLoadMore && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={onLoadMore}
            className="px-6 md:px-8 py-2 md:py-3 bg-[#ff4b4b] text-white font-bold rounded-full border-2 border-transparent hover:bg-transparent hover:text-[#FF6363] hover:border-[#FF6363] transition duration-300"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;