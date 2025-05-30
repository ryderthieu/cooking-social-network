import React, { useState } from "react";
import BS from "../../../assets/Home/BuaSang.png";
import MC from "../../../assets/Home/MC.png";
import Banh from "../../../assets/Home/Banh.png";
import TM from "../../../assets/Home/TM.png";
import Thit from "../../../assets/Home/Thit.png";
import donuong from "../../../assets/Home/donuong.png";
import douong from "../../../assets/Home/douong.png";
import lau from "../../../assets/Home/lau.png";
import haisan from "../../../assets/Home/haisan.png";

const Menu = () => {
  const [isPaused, setIsPaused] = useState(false);

  const categories = [
    {
      id: 1,
      name: "Bữa sáng",
      image: BS,
      bgGradient: "bg-gradient-to-b from-white to-[#d9dbd3]",
      marginTop: "mt-[40px]",
    },
    {
      id: 2,
      name: "Món chay",
      image: MC,
      bgGradient: "bg-gradient-to-b from-white to-[#d4f1c6]",
      marginTop: "mt-[40px]",
    },
    {
      id: 3,
      name: "Bữa trưa",
      image: Thit,
      bgGradient: "bg-gradient-to-b from-white to-[#f4c9c5]",
      marginTop: "mt-[40px]",
    },
    {
      id: 4,
      name: "Tráng miệng",
      image: TM,
      bgGradient: "bg-gradient-to-b from-white to-[#ffdb97]",
      marginTop: "mt-[40px]",
    },
    {
      id: 5,
      name: "Ăn vặt",
      image: Banh,
      bgGradient: "bg-gradient-to-b from-white to-[#dfc6a8]",
      marginTop: "mt-[40px]",
    },
    {
      id: 6,
      name: "Thức uống",
      image: douong,
      bgGradient: "bg-gradient-to-b from-white to-[#c9daea]",
      marginTop: "mt-[40px]",
    },
    {
      id: 7,
      name: "Đồ nướng",
      image: donuong,
      bgGradient: "bg-gradient-to-b from-white to-[#e5c0ad]",
      marginTop: "mt-[40px]",
    },
    {
      id: 8,
      name: "Hải sản",
      image: haisan,
      bgGradient: "bg-gradient-to-b from-white to-[#c8e2d0]",
      marginTop: "mt-[40px]",
    },
    {
      id: 9,
      name: "Lẩu",
      image: lau,
      bgGradient: "bg-gradient-to-b from-white to-[#f0d3b8]",
      marginTop: "mt-[40px]",
    },
  ];

  return (
    <div className="w-full overflow-hidden mb-[60px]">
      <div className="overflow-hidden whitespace-nowrap">
        <div
          className={`inline-flex gap-6 w-max ${
            isPaused ? "" : "animate-marquee"
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...categories, ...categories].map((category, index) => (
            <div
              key={`${category.id}-${index}`}
              className={`flex-shrink-0 cursor-pointer ${category.bgGradient} w-[150px] p-4 rounded-[30px]`}
            >
              <img
                className="mx-auto w-[60%]"
                src={category.image || "/placeholder.svg"}
                alt={category.name}
              />
              <p
                className={`font-semibold text-center ${category.marginTop} text-[16px]`}
              >
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 80s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Menu;
