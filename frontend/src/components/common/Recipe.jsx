import React, { useState } from "react";
import recipe from "../../assets/recipe.png";
import fork from "../../assets/CommonIcon/ForkKnife.png";
import timer from "../../assets/CommonIcon/Timer.png";
import { GoHeartFill } from "react-icons/go";

const Recipe = () => {
  const [isLike, setIsLiked] = useState(false);
  const toggleLike = () => {
    setIsLiked(!isLike);
  };
  return (
    <div className="bg-[#FEF1DF] max-w-[310px] p-4 rounded-3xl">
      <div className="relative">
        <img src={recipe} alt="" />
        <div
          onClick={toggleLike}
          className="absolute top-4 right-4 bg-white rounded-full p-2 transition-transform active:scale-90 cursor-pointer"
        >
          {isLike ? (
            <GoHeartFill className="text-[#FF6363] size-6" />
          ) : (
            <GoHeartFill className="text-gray-300 size-6" />
          )}
        </div>
      </div>
      <h2 className="font-semibold text-[24px] py-6">Bún đậu mắm tôm</h2>
      <div className="flex mt-4 mb-2">
        <div className="flex mr-4">
          <img className="mr-1" src={timer} alt="" />
          <span>30 Minutes</span>
        </div>
        <div className="flex">
          <img className="mr-1" src={fork} alt="" />
          <span>Snack</span>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
