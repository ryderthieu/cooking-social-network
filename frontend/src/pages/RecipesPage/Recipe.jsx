import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import image2 from "../../assets/Recipe/images/blog1.png";
import image3 from "../../assets/Recipe/images/blog2.png";
import image4 from "../../assets/Recipe/images/blog3.png";
import image5 from "../../assets/Recipe/images/blog4.png";
import Recipe from "../../components/common/Recipe.jsx";
import Banner from "../../components/recipe/Banner.jsx";
import { useState } from "react";
import { useEffect } from "react";
import BreadCrumb from "../../components/common/BreadCrumb.jsx";
import CategoryCard from "../../components/recipe/CategoriesCard.jsx";
import { Dessert, Korea1 } from "../../assets/Recipe/images/index.js";
import { useParams } from "react-router-dom";
import LinkCard from "../../components/recipe/LinkCard.jsx";

const Recipes = () => {
  const { categoryType, item } = useParams();
  const slugToVietnamese = {
    breakfast: "Bữa sáng",
    lunch: "Bữa trưa",
    dinner: "Bữa tối",
    snack: "Bữa xế",
    dessert: "Món tráng miệng",

    vietnamese: "Việt Nam",
    japanese: "Nhật Bản",
    korean: "Hàn Quốc",
    chinese: "Trung Quốc",
    thai: "Thái Lan",
    indian: "Ấn Độ",
    european: "Âu",
    american: "Mỹ",
    mexican: "Mexico",

    party: "Tiệc tùng",
    birthday: "Sinh nhật",
    holiday: "Ngày lễ Tết",
    vegetarian: "Ăn chay",
    "weather-based": "Món ăn ngày lạnh/nóng",

    vegan: "Thuần chay",
    keto: "Keto/Low-carb",
    "functional-food": "Thực phẩm chức năng",
    "gluten-free": "Không gluten",
    diet: "Ăn kiêng giảm cân",

    chicken: "Thịt gà",
    beef: "Thịt bò",
    pork: "Thịt heo",
    seafood: "Hải sản",
    egg: "Trứng",
    vegetables: "Rau củ",
    tofu: "Đậu phụ",

    fried: "Chiên",
    grilled: "Nướng",
    steamed: "Hấp",
    "stir-fried": "Xào",
    boiled: "Luộc",
    braised: "Hầm",
    soup: "Nấu súp",

    "air-fryer": "Nồi chiên không dầu",
    oven: "Lò nướng",
    "slow-cooker": "Nồi nấu chậm",
    "pressure-cooker": "Nồi áp suất",
    microwave: "Lò vi sóng",
  };

  const categoryTypeNames = {
    mealType: "Loại bữa ăn",
    cuisine: "Vùng ẩm thực",
    occasions: "Dịp đặc biệt",
    dietaryPreferences: "Chế độ ăn",
    mainIngredients: "Nguyên liệu chính",
    cookingMethod: "Phương pháp nấu",
    difficultyLevel: "Dụng cụ nấu",
    "meal-type": "Loại bữa ăn",
    dietary: "Chế độ ăn",
    "main-ingredients": "Nguyên liệu chính",
    "cooking-method": "Phương pháp nấu",
    utensils: "Dụng cụ nấu",
  };

  // Chuyển đổi slug về tên tiếng Việt hoặc decode URL
  const getDisplayName = (slug) => {
    return slugToVietnamese[slug] || decodeURIComponent(slug);
  };

  // Tạo category object cho CategoryCard
  const category = {
    title: categoryTypeNames[categoryType] || categoryType,
    background: "bg-[#FFE9E9]",
    color: "bg-[#c98c8b4e]",
  };

  const displayItemName = getDisplayName(item);

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
    const width = 100 - scrollProgress * 10;
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
      {/* Banner */}
      <div
        className="relative h-[520px]"
        style={getBannerStyles()}
      >
        {/* Background */}
        <div className="overflow-hidden relative w-full bg-gradient-to-tr from-[#fd3cb3] to-yellow-200 h-[400px] flex justify-center" style={getBannerStyles()}>
            <div className="absolute -top-20 size-[160px] blur-lg rounded-full bg-orange-400/50"></div>
        </div>
        <div className="absolute inset-0 bg-opacity-30">
          <div className="p-10 h-full">
            <BreadCrumb />
            <h1 className="text-white text-3xl md:text-5xl text-center font-extrabold py-5">
              Khám phá công thức
            </h1>
          </div>
          <div className="relative -mt-28 -translate-y-[220px] flex justify-center z-10">
            <CategoryCard
              item={displayItemName}
              description="Bữa trưa là thời điểm quan trọng để nạp năng lượng giữa ngày. Khám phá những món ăn trưa đa dạng từ cơm tấm, bún bò Huế, mì Quảng đến các món salad tươi mát, pasta Ý."
              category={category}
              imageSrc={Korea1}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto space-y-10 my-10">
        {/* Tin tức tổng hợp - Liên kết đến Blog*/}
        <div className="container mx-auto">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-6">
            Tin tức - kiến thức
          </h3>

          {/* Blog grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
            {/* Main blog post */}
            <div className="row-span-3 bg-white rounded-lg shadow-md p-4 flex flex-col">
              <img
                src={image2}
                alt="Ảnh minh họa"
                className="w-full object-cover"
              />
              <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 mt-4">
                Vì sao đã rất no ta vẫn có thể ăn thêm tráng miệng?
              </h4>
              <p className="text-gray-600 mb-4 text-base md:text-xl">
                Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqut enim
              </p>
              <div className="flex items-center space-x-3 mt-auto">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Author"
                  className="rounded-full w-8 h-8 md:w-10 md:h-10"
                />
                <p className="font-medium">Robert Fox</p>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <p className="text-gray-500 text-xs md:text-sm">
                  12 November 2021
                </p>
              </div>
            </div>

            {/* Side blog posts - will stack on mobile */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center">
              <img
                src={image3}
                alt="Dessert"
                className="w-1/3 h-24 md:h-auto object-cover"
              />
              <p className="p-3 font-bold text-sm md:text-base lg:text-xl">
                10 siêu phẩm tráng miệng bạn nên thử
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center">
              <img
                src={image4}
                alt="Chocolate desserts"
                className="w-1/3 h-24 md:h-auto object-cover"
              />
              <p className="p-3 font-bold text-sm md:text-base lg:text-xl">
                4 món tráng miệng kinh điển từ socola ai cũng làm được
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center">
              <img
                src={image5}
                alt="Matcha dessert"
                className="w-1/3 h-24 md:h-auto object-cover"
              />
              <p className="p-3 font-bold text-sm md:text-base lg:text-xl">
                Chotto Matcha - món tráng miệng đang gây sốt
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <a
              href="/blogs"
              className="px-6 md:px-8 py-2 md:py-3 bg-[#ff4b4b] text-white font-bold rounded-full border-2 border-transparent hover:bg-transparent hover:text-[#FF6363] hover:border-[#FF6363] transition duration-300"
            >
              Xem thêm
            </a>
          </div>
        </div>

        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 md:mb-8">
            Công thức phổ biến
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
          </div>
        </div>

        <div className="px-4 lg:px-[100px] pt-10 bg-[#a1c1622e] w-full">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 md:mb-8">
            Khám phá thêm
          </h3>
          <div className="h-[150px] md:h-[200px] grid grid-cols-4 gap-5">
             <LinkCard item="Hàn Quốc" category={category} imageSrc={Korea1} />
             <LinkCard item="Hàn Quốc" category={category} imageSrc={Korea1} />
             <LinkCard item="Hàn Quốc" category={category} imageSrc={Korea1} />
             <LinkCard item="Hàn Quốc" category={category} imageSrc={Korea1} />
          </div>
        </div>

        <div className="container mx-auto">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 md:mb-8">
            Tất cả công thức
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
            <Recipe />
          </div>
          <div className="flex justify-center mt-8">
            <button className="px-6 md:px-8 py-2 md:py-3 bg-[#ff4b4b] text-white font-bold rounded-full border-2 border-transparent hover:bg-transparent hover:text-[#FF6363] hover:border-[#FF6363] transition duration-300">
              Xem thêm
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Recipes;
