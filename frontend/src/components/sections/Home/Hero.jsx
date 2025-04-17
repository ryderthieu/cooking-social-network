import React, { useState } from "react";
import Banner1 from "../../../assets/Home/Banner1.png";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const Hero = () => {
  const images = [
    {
      src: Banner1,
      alt: "Image 1",
      title: "Khám phá công thức ngon chia sẻ niềm vui nấu nướng",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ",
    },
    {
      src: Banner1,
      alt: "Image 2",
      title: "Khám phá công thức ngon chia sẻ niềm vui nấu nướng",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore ",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex justify-center items-center">
      <img
        className="pt-[120px] transition-all duration-500"
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
      />
      <div className="absolute pt-[80px] left-[80px] pl-[120px] max-w-[50%]">
        <h1 className="text-[40px] font-bold text-white mb-2">
          {images[currentIndex].title}
        </h1>
        <p className="text-[20px] font-semibold text-white">
          {images[currentIndex].description}
        </p>
        <button className="bg-[#FF37A5] text-white font-semibold mt-8 py-2 px-6 text-center rounded-[30px] hover:bg-[#de067d] ">
          TÌM HIỂU THÊM
        </button>
      </div>
      <div className="mt-[40px]">
        <FaChevronCircleLeft
          className="ml-[120px] absolute left-4 w-10 h-10 cursor-pointer text-[#5d3e18]"
          onClick={prevImage}
        />
      </div>
      <div className="mt-[40px]">
        <FaChevronCircleRight
          className="mr-[120px] absolute right-4 w-10 h-10 cursor-pointer text-[#5d3e18]"
          onClick={nextImage}
        />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === currentIndex ? "bg-white" : "bg-[#5d3e18]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
