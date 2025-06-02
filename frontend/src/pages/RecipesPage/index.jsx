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
    const fetchCategories = async () => {
      try {
        setError(null);

        const response = await getAllFormattedCategories();

        if (response.data && response.data.success) {
          // Transform backend data to match frontend structure
          const formattedCategories = {};
          response.data.data.forEach((category) => {
            formattedCategories[category.key] = {
              title: category.name,
              items: category.items.map((item) => ({
                name: item.name,
                slug: item.slug,
                description:
                  item.description ||
                  `Khám phá các món ăn ${item.name.toLowerCase()}`,
                image:
                  item.image ||
                  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300",
                count: item.count || 0,
                path:
                  item.path ||
                  `/recipes?${category.key}=${encodeURIComponent(item.name)}`,
                backgroundColor:
                  item.backgroundColor && item.backgroundColor.startsWith("bg-")
                    ? item.backgroundColor
                    : item.backgroundColor
                    ? `bg-[${item.backgroundColor}]`
                    : category.background && category.background.startsWith("bg-")
                    ? category.background
                    : "bg-[#ffefd0]",
                color:
                  item.textColor && item.textColor.startsWith("bg-")
                    ? item.textColor
                    : item.textColor
                    ? `bg-[${item.textColor}]`
                    : category.color && category.color.startsWith("bg-")
                    ? category.color
                    : "bg-[#FFD0A1]",
              })),
              background: category.background || "bg-[#ffefd0]",
              color: category.color || "bg-[#FFD0A1]",
            };
          });

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
                    </p>

                    <nav className="flex flex-wrap gap-3">
                      {Object.entries(categories).map(([key, category]) => (
                        <a
                          key={key}
                          href={`#${key}`}
                          className="px-4 py-2 bg-white hover:bg-[#FF6363] hover:text-white rounded-full border border-gray-200 transition-colors duration-300 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6363] focus:ring-offset-2"
                          aria-label={`Chuyển đến danh mục ${category.title}`}
                        >
                          {category.title}
                        </a>
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
            Object.entries(categories).map(([categoryType, category]) => (
              <section
                key={categoryType}
                id={categoryType}
                className="rounded-lg p-6 scroll-mt-24 relative mb-8"
              >
                <h2 className="text-[24px] font-bold text-blue-950 mb-6">
                  {category.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {" "}
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
