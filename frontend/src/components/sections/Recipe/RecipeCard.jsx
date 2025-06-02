import React from "react";
import { Link } from "react-router-dom";

const RecipeCard = ({ item, categoryType }) => {
  // Handle missing or invalid item gracefully
  if (!item || typeof item !== 'object') {
    return (
      <div className="flex items-center justify-center w-full h-[120px] bg-gray-100 rounded-2xl text-gray-400">
        Không có dữ liệu công thức
      </div>
    );
  }

  // Use white background if forced, otherwise use item's background
  const backgroundClass =  (item.backgroundColor || "bg-[#ffefd0]");
  const colorClass = (item.textColor || "bg-[#ffefd0]");

  return (
    <a
      key={item.name}
      href={`/recipes/${categoryType}/${item.slug || encodeURIComponent(item.name)}`}
      className={`relative flex w-full z-999 max-w-[300px] bg-[${backgroundClass}] py-8 px-6 h-[120px] rounded-2xl shadow-lg shadow-gray-300 ring-2 ring-white/50 hover:-translate-y-2 transition-transform ease-in-out duration-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
      aria-label={`Xem công thức ${item.name}`}
    >
      <div className="absolute right-6 bottom-3 rounded-full grid place-items-center size-[6em] shadow-lg border border-gray-100 overflow-hidden">
        <div className="size-[5em] rounded-full">
          <img
            src={item.image}
            alt={`Hình ảnh minh họa cho ${item.name}`}
            className="size-full object-cover rounded-full"
          />
        </div>
      </div>
      <div
        className={`rounded-full size-12 bg-[${colorClass}] absolute blur-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
        aria-hidden="true"
      ></div>
      <div
        className={`rounded-full size-8 bg-[${colorClass}] absolute blur-lg bottom-0 right-0`}
        aria-hidden="true"
      ></div>
      <div
        className={`rounded-full size-8 bg-[${colorClass}] absolute blur-lg bottom-8 left-0`}
        aria-hidden="true"
      ></div>
      <span className="font-bold text-blue-950 max-w-[150px] text-xl z-10">
        {item.name}
      </span>
    </a>
  );
};

export default RecipeCard;
