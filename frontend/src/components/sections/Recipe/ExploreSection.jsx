import React, { useState, useEffect } from "react";
import { getCategoryItems, mockCategoryItems } from "../../../services/mockData";
import RecipeCard from "./RecipeCard";

const ExploreSection = ({ categoryType, currentItem }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Lấy items của category type hiện tại, loại bỏ item hiện tại
  const items = getCategoryItems(categoryType, currentItem);
  const categoryData = mockCategoryItems[categoryType];

  const slugMap = {};
  items.forEach(item => {
    if (item.slug) {
      slugMap[item.name] = item.slug;
    }
  });

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const nextSlide = () => {
    if (currentSlide < items.length - slidesToShow) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div
      className={`px-4 lg:px-[130px] pt-10 pb-10 ${categoryData.color} w-full`}
    >
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-6 md:mb-8">
        Khám phá thêm trong danh mục này
      </h3>

      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-6 mb-2"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.slug || index}
              className="min-w-[calc(100%-24px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] xl:min-w-[calc(25%-18px)]"
            >
              <RecipeCard
                item={item}
                slugMap={slugMap}
                category={categoryData}
                categoryType={categoryType}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {items.length > slidesToShow && (
          <>
            {currentSlide === 0 ? null : (
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-999"
                disabled={currentSlide === 0}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {currentSlide >= items.length - slidesToShow ? null : (
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                disabled={currentSlide >= items.length - slidesToShow}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Dots indicator */}
      {items.length > slidesToShow && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from(
            { length: Math.ceil(items.length / slidesToShow) },
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index * slidesToShow)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  Math.floor(currentSlide / slidesToShow) === index
                    ? "bg-[#ff4b4b]"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreSection;
