import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaClock } from 'react-icons/fa';

const RecipeDetail = ({ id, title, image, category, chef, className }) => {
  // Default values for when props aren't provided
  const defaultTitle = "Tên công thức nấu ăn";
  const defaultImage = "https://via.placeholder.com/300";
  const defaultCategory = "Bữa sáng";
  const defaultChef = "Đầu bếp";

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className || ''}`}>
      <Link to={`/recipes/${id || 1}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image || defaultImage} 
            alt={title || defaultTitle} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md">
            <FaHeart className="text-gray-400 hover:text-[#ff4b4b] cursor-pointer transition-colors" />
          </div>
          <div className="absolute top-2 left-2 bg-white/80 rounded-full py-0.5 px-3 text-xs font-medium">
            {category || defaultCategory}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/recipes/${id || 1}`}>
          <h4 className="text-lg font-bold mb-2 hover:text-[#FF6363] transition-colors">{title || defaultTitle}</h4>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <FaClock className="text-gray-500" />
            <span className="text-sm text-gray-500">30 phút</span>
          </div>
          <Link to={`/profile/${chef}`} className="text-sm text-gray-600 hover:text-[#FF6363] transition-colors">
            {chef || defaultChef}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;