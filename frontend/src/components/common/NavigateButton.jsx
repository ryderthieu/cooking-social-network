import React from 'react'

export default function NavigateButton() {
  return (
    <div className="flex justify-end mt-5">
      <a
        href="/blogs"
        className={`px-4 md:px-6 py-2 bg-[#ff4b4b] text-white font-bold rounded-full border-2 hover:bg-transparent hover:text-[#FF6363] hover:border-[#FF6363] transition duration-300 text-sm md:text-base shadow-md hover:shadow-lg`}
      >
        Xem thêm
      </a>
    </div>
  );
}

