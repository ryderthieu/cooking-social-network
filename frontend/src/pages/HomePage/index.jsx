import React, { useState } from "react";
import Explore from "../../components/sections/Home/Explore.jsx";
import Recipe from "../../components/common/Recipe.jsx";
import Menu from "../../components/sections/Home/Menu.jsx";
import Contact from "../../components/sections/Home/Contact.jsx";
import { IoSearchSharp } from "react-icons/io5";
import Hero from "../../components/sections/Home/Hero.jsx";
import VideoShorts from "../../components/sections/Home/VideoShorts.jsx";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", search);
  };
  return (
    <div>
      <Hero />
      <div className="px-[110px] pt-[40px]">
        <div className="flex items-center max-w-[100%] bg-white border-2 border-[#FFA663] rounded-[30px] px-4 py-2 mb-[50px]">
          <IoSearchSharp className="w-6 h-6 mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Hôm nay bạn muốn ăn gì?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-[16px] placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            className="bg-[#FF37A5] text-white font-semibold py-2 px-6 rounded-[30px] ml-2"
          >
            TÌM KIẾM
          </button>
        </div>
        <Menu />
        <Explore />
        <VideoShorts />
        <div className="mt-[50px]">
          <div className="flex justify-between items-center">
            <p className="font-bold text-[22px]">
              Khám phá các công thức đỉnh cao
            </p>
            <Link
              to="/recipes"
              className="text-[#A46000] text-[16px] font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-8 mb-8">
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
          </div>
        </div>
      </div>
      <Contact />
    </div>
  );
};

export default HomePage;
