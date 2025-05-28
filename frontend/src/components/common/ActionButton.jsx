import React from "react";

export default function ActionButton({title, bgColor, borderColor}) {
  return (
    <div className="flex justify-end my-8">
      
      <button className={`${bgColor} text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg hover:bg-transparent hover:${borderColor} hover:border-1 transition`}>
         {title}
      </button>
    </div>
  );
}
