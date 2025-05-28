import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { Korea1 } from "../../assets/Recipe/images";
import BreadCrumb from "../../components/common/BreadCrumb";
import { mockCategoryItems } from "../../services/mockData";
import RecipeCard from "../../components/sections/Recipe/RecipeCard";

export default function RecipeCategories() {
  const categories = mockCategoryItems;

  const slugMap = {
    "Bữa sáng": "breakfast",
    "Bữa trưa": "lunch",
    "Bữa tối": "dinner",
    "Bữa xế": "snack",
    "Món tráng miệng": "dessert",

    "Việt Nam": "vietnamese",
    "Nhật Bản": "japanese",
    "Hàn Quốc": "korean",
    "Trung Quốc": "chinese",
    "Thái Lan": "thai",
    "Ấn Độ": "indian",
    Âu: "european",
    Mỹ: "american",
    Mexico: "mexican",

    "Tiệc tùng": "party",
    "Sinh nhật": "birthday",
    "Ngày lễ Tết": "holiday",
    "Ăn chay": "vegetarian",
    "Món ăn ngày lạnh/nóng": "weather-based",

    "Thuần chay": "vegan",
    "Keto/Low-carb": "keto",
    "Thực phẩm chức năng": "functional-food",
    "Không gluten": "gluten-free",
    "Ăn kiêng giảm cân": "diet",

    "Thịt gà": "chicken",
    "Thịt bò": "beef",
    "Thịt heo": "pork",
    "Hải sản": "seafood",
    Trứng: "egg",
    "Rau củ": "vegetables",
    "Đậu phụ": "tofu",

    Chiên: "fried",
    Nướng: "grilled",
    Hấp: "steamed",
    Xào: "stir-fried",
    Luộc: "boiled",
    Hầm: "braised",
    "Nấu súp": "soup",

    "Nồi chiên không dầu": "air-fryer",
    "Lò nướng": "oven",
    "Nồi nấu chậm": "slow-cooker",
    "Nồi áp suất": "pressure-cooker",
    "Lò vi sóng": "microwave",
  };

  const [scrollY, setScrollY] = useState(0);

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
    <MainLayout>
      <div className="mx-auto w-full">
        {/* Banner */}
        <div className="relative overflow-hidden" style={getBannerStyles()}>
          {/* Background */}
          <div className="w-full bg-gradient-to-tr from-[#fd3cb3] to-yellow-200 h-[400px]"></div>
          <div className="absolute inset-0 bg-opacity-30">
            <div className="p-10 h-full">
              <BreadCrumb />

              <div className="flex justify-center h-full">
                <h1 className="text-white text-3xl md:text-5xl text-center font-extrabold">
                  Khám phá công thức
                </h1>
                {/* Category finder */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl">
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
          {Object.entries(categories).map(([categoryType, category]) => (
            <section
              key={categoryType}
              id={categoryType}
              className="rounded-lg p-6 scroll-mt-24 relative mb-8"
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
                    slugMap={slugMap}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </MainLayout>
  );
}
