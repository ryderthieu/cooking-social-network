import React from "react";
import SavedCard from "./SavedCard";

const RecipeGrid = ({ title, recipes, showLoadMore, onLoadMore }) => {
  return (
    <div className="container mx-auto px-4">
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-6 md:mb-8">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {recipes?.map((recipe, index) => (
          <SavedCard 
            key={recipe._id || recipe.id || index} 
            recipe={recipe}
            showRemoveOption={false}
          />
        ))}
      </div>
      {showLoadMore && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={onLoadMore}
            className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold rounded-full border-2 border-transparent hover:from-orange-500 hover:to-yellow-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Xem thêm
          </button>
        </div>
      )}
      {recipes?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy công thức nào.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;
