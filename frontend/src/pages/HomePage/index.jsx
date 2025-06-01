import React, { useState } from "react";
import Explore from "../../components/sections/Home/Explore.jsx";
import Recipe from "../../components/common/Recipe.jsx";
import Menu from "../../components/sections/Home/Menu.jsx";
import Contact from "../../components/sections/Home/Contact.jsx";
import { IoSearchSharp } from "react-icons/io5";
import VideoShorts from "../../components/sections/Home/VideoShorts.jsx";
import { Link, useNavigate } from "react-router-dom";
import CarouselPlugin from "../../components/sections/Home/CarouselHero.jsx";
import AllBlogs from "../../components/sections/Home/AllBlogs.jsx";
import TopRecipes from "@/components/sections/Home/TopRecipes.jsx";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div>
      <CarouselPlugin />
      <div className="px-[120px] pt-[40px]">
        <form
          onSubmit={handleSearch}
          className="flex items-center max-w-[100%] bg-white border-2 border-[#FFA663] rounded-[30px] px-4 py-2 mb-[50px]"
        >
          <IoSearchSharp className="w-6 h-6 mr-2 text-gray-400" />
          <input
            type="text"
            placeholder="Hôm nay bạn muốn ăn gì?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-[16px] placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-[#FF37A5] text-white font-semibold py-3 px-6 rounded-[30px] ml-2 text-[14px] hover:bg-[#FF2A8F] transition-colors duration-300"
          >
            TÌM KIẾM
          </button>
        </form>
        <Menu />
        <Explore />
        <VideoShorts />
        <TopRecipes />
        <AllBlogs />
      </div>
      <Contact />
    </div>
  );
};

export default HomePage;
