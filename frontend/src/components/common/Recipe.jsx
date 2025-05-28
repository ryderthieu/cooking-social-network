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
    <div className="bg-[#FEF1DF] max-w-[300px] p-2 rounded-3xl">
      <div className="relative">
        <img className="rounded-2xl" src={recipe} alt="" />
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
      <h2 className="font-semibold text-[16px] py-6 pl-2">Bún đậu mắm tôm</h2>
      <div className="flex mt-4 mb-2 pl-2">
        <div className="flex mr-4">
          <img className="mr-1 text-[8px]" src={timer} alt="" />
          <span className="text-[13px] my-auto">30 Minutes</span>
        </div>
        <div className="flex">
          <img className="mr-1 text-[8px]" src={fork} alt="" />
          <span className="text-[13px]  my-auto">Snack</span>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
