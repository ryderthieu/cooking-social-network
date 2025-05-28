import React from 'react'

export default function NavigateButton({ title, linkTo, bgColor, textColor, borderColor }) {
  return (
    <div className="flex justify-end mt-5">
      <a
        href={linkTo}
        className={`px-4 md:px-6 py-2 ${bgColor} text-white font-bold rounded-full border-2 border-transparent hover:bg-transparent hover:${textColor} hover:${borderColor} transition duration-300 text-sm md:text-base shadow-md hover:shadow-lg`}
      >
        {title}
      </a>
    </div>
  );
}

