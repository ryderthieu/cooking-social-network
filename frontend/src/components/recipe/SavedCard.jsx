import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="rounded-xl bg-[#FFF3ED] p-4 shadow hover:shadow-lg transition">
      <div className="relative">
        <img src={recipe.image} alt={recipe.title} className="rounded-xl h-48 w-full object-cover" />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">Tác giả: {recipe.author}</p>
        <h3 className="font-bold mt-1">{recipe.title}</h3>
        <div className="flex gap-4 mt-2 text-sm text-gray-600">
          <span>⏱ {recipe.time}</span>
          <span>🍽 {recipe.type}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
