import React from "react";
import { Link } from "react-router-dom";

const LinkCard = ({ item, category, imageSrc }) => {
  return (
    <Link
      className={`relative flex w-full max-w-[300px] ${category.background} py-8 px-6 h-[120px] rounded-2xl shadow-lg shadow-gray-300 ring-2 ring-white/50 hover:-translate-y-2 transition-transform ease-in-out duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      to={`/recipes/${category}/${item}`}
    >
      {/* Image */}
      <div className="absolute right-6 bottom-3 rounded-full grid place-items-center size-[6em] shadow-lg border border-gray-100">
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

      {/* Title */}
      <span className="font-bold text-blue-950 max-w-[150px] text-xl z-10">
        {item}
      </span>
    </Link>
  );
};

export default LinkCard;
