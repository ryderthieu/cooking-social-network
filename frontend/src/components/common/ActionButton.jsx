import React from "react";

export default function ActionButton({title, bgColor, iconLeft}) {
  return (
    <div className="flex justify-end my-8">
      <button
        className={`${bgColor} text-white font-semibold rounded-full px-6 py-3 flex items-center gap-2 shadow-lg border-2 hover:-translate-y-1 transition-transform ease-in-out duration-300`}
      >
        {iconLeft && <span>{iconLeft}</span>}
        {title}
      </button>
    </div>
  );
}
