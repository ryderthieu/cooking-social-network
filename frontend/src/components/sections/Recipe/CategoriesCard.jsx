import React from "react";

const CategoryCard = ({ item, category, description, imageSrc }) => {
  return (
    <div
      className={`relative flex flex-col justify-center w-full max-w-[80%] ${category.background} p-8 lg:p-16 h-[300px] rounded-[48px] shadow-lg shadow-gray-300 ring-2 ring-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      {/* Image */}
      <div className="absolute right-10 md:right-12 lg:right-20 bottom-8 lg:bottom-3 rounded-full grid place-items-center size-[12em] md:size[14em] lg:size-[16em] shadow-lg border border-gray-100">
        <img
          src={imageSrc}
          alt={`Hình ảnh minh họa cho ${item}`}
          className="w-[90%] h-[90%] object-cover rounded-full"
        />
      </div>

      {/* Glowing circles */}
      <div
        className={`rounded-full size-12 ${category.color} absolute blur-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
        aria-hidden="true"
      ></div>
      <div
        className={`rounded-full size-8 ${category.color} absolute blur-lg bottom-0 right-0`}
        aria-hidden="true"
      ></div>
      <div
        className={`rounded-full size-8 ${category.color} absolute blur-lg bottom-8 left-0`}
        aria-hidden="true"
      ></div>

      {/* Content */}
      <div className="z-10 w-1/2 md:w-2/3  max-w-[600px]">
        {/* Category Item */}
        <h2 className="font-bold text-blue-950 text-3xl lg:text-4xl leading-tight mb-6">
          {item}
        </h2>
        {/* Category Description */}
        <p className="font-medium  text-blue-950/70 text-xs sm:text-sm lg:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;