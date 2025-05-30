import React from 'react';

export default function RecipeCard({ recipe, index }) {
  // Nếu recipe là một số (index) thay vì object, dùng dữ liệu mẫu
  const recipeData = typeof recipe === 'object' 
    ? recipe 
    : {
        id: index,
        title: `Công thức món ngon số ${index}`,
        description: "Mô tả ngắn về công thức này...",
        image: `/images/recipe-${index}.jpg`,
        difficulty: "Dễ làm",
        time: "30 phút"
      };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={recipeData.image}
          alt={recipeData.title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-lg flex items-center">
          <span className="mr-1">👨‍🍳</span>
          {recipeData.difficulty}
        </span>
        <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg flex items-center">
          <span className="mr-1">⏱️</span>
          {recipeData.time}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          {recipeData.title}
        </h4>
        <p className="text-sm text-gray-600">
          {recipeData.description}
        </p>
      </div>
    </div>
  );
}