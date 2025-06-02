import React, { useState, useEffect } from "react";
import BreadCrumb from "../../components/common/BreadCrumb";
import { getAllFormattedCategories } from "../../services/categoryService";
import RecipeCard from "../../components/sections/Recipe/RecipeCard";

export default function RecipeCategories() {
  const [categories, setCategories] = useState({});
  const [, setError] = useState(null);

  const [scrollY, setScrollY] = useState(0);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {      try {
        setError(null);
        const response = await getAllFormattedCategories();
        
        console.log("API Response:", response);
        
        if (response.data && response.data.success) {
          console.log("Categories data:", response.data.data);
          
          // Transform array to object structure expected by frontend
          const formattedCategories = {};
          response.data.data.forEach((category) => {
            formattedCategories[category.key] = {
              title: category.name,
              items: category.items,
              background: category.background,
              color: category.color,
            };
          });
          
          console.log("Formatted categories:", formattedCategories);
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
        // Fallback to empty categories
        setCategories({});
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const getBannerStyles = () => {
    const maxScroll = 200; // Scroll 200px để hoàn thành animation
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    const width = 100 - scrollProgress * 15;
    const borderRadius = scrollProgress * 48;

    return {
      width: `${width}%`,
      borderRadius: `${borderRadius}px`,
      transition: "width 0.5s ease-out, border-radius 0.5s ease-out",
      margin: "0 auto",
    };
  };
  // Smooth scroll function với hiệu ứng mượt mà
  const scrollToCategory = (categoryKey) => {
    const element = document.getElementById(categoryKey);
    if (element) {
      const headerOffset = 120; // Offset để tránh header che khuất
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Sử dụng requestAnimationFrame để tạo smooth scroll tùy chỉnh
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = 1200; // 1.2 giây
      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressPercentage = Math.min(progress / duration, 1);
        
        // Easing function để tạo hiệu ứng mượt mà hơn
        const easeInOutCubic = (t) => 
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        
        const easedProgress = easeInOutCubic(progressPercentage);
        
        window.scrollTo(0, startPosition + distance * easedProgress);

        if (progress < duration) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  };
  return (
    <>
      <div className="mx-auto w-full">
        {/* Banner */}
        <div className="relative overflow-hidden" style={getBannerStyles()}>
          {/* Background */}
          <div className="w-full bg-gradient-to-tr from-[#fd3cb3] to-yellow-200 h-[400px]"></div>
          <div className="absolute inset-0 bg-opacity-30">
            <div className="px-10 pt-20 h-full">
            
              <div className="flex justify-center h-full">
                <h1 className="text-white text-3xl md:text-5xl text-center font-extrabold">
                  Khám phá công thức
                </h1>
                {/* Category finder */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-7xl">
                  <div className="bg-white/70 backdrop-blur-lg p-6 md:p-10 rounded-xl shadow-lg">
                    <h2 className="text-xl mb-4 font-semibold text-gray-800">
                      Tìm kiếm công thức theo danh mục
                    </h2>
                    <p className="mb-4 text-gray-700">
                      Chọn một trong các danh mục bên dưới để khám phá các công
                      thức phù hợp với nhu cầu của bạn.
                    </p>                    <nav className="flex flex-wrap gap-3">
                      {Object.entries(categories).map(([key, category]) => (
                        <button
                          key={key}
                          onClick={() => scrollToCategory(key)}
                          className="px-4 py-2 bg-white hover:bg-[#FF6363] hover:text-white rounded-full border border-gray-200 transition-all duration-500 ease-in-out text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6363] focus:ring-offset-2 hover:shadow-md hover:scale-105 active:scale-95"
                          aria-label={`Chuyển đến danh mục ${category.title}`}
                        >
                          {category.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories section */}
        <main className="my-12 mx-4 lg:mx-[100px]">
          {Object.keys(categories).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Không có danh mục nào để hiển thị.
              </p>
            </div>
          ) : (
            Object.entries(categories).map(([categoryType, category]) => (              <section
                key={categoryType}
                id={categoryType}
                className="rounded-lg p-6 scroll-mt-24 relative mb-8 transition-all duration-700 ease-out opacity-100 transform translate-y-0"
              >
                <h2 className="text-[24px] font-bold text-blue-950 mb-6">
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {category.items.map((item) => (
                    <RecipeCard
                      key={item.name}
                      item={item}
                      categoryType={categoryType}
                      category={category}
                    />
                  ))}
                </div>
              </section>
            ))
          )}{" "}
        </main>
      </div>
    </>
  );
}
