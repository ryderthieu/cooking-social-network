import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb.jsx";
import CategoryCard from "../../components/sections/Recipe/CategoriesCard.jsx";
import RecipeGrid from "../../components/sections/Recipe/RecipeGrid.jsx";
import BlogSection from "../../components/sections/Recipe/BlogSection.jsx";
import ExploreSection from "../../components/sections/Recipe/ExploreSection.jsx";
import { Korea1 } from "../../assets/Recipe/images/index.js";
import { 
  mockBlogs, 
  getRecipesByCategory,
  getRandomRecipes 
} from "../../services/mockData.js";

const Recipes = () => {
  const { categoryType, item } = useParams();
  const [scrollY, setScrollY] = useState(0);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(7);

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

  useEffect(() => {
    // Load recipes based on category or get random ones
    if (item) {
      const categoryRecipes = getRecipesByCategory(item);
      setPopularRecipes(categoryRecipes.slice(0, 8));
      setAllRecipes(categoryRecipes);
    } else {
      const randomRecipes = getRandomRecipes(16);
      setPopularRecipes(randomRecipes.slice(0, 8));
      setAllRecipes(randomRecipes);
    }
  }, [item]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const getBannerStyles = () => {
    const maxScroll = 200;
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

  const handleLoadMoreRecipes = () => {
    setVisibleRecipes(prev => Math.min(prev + 8, allRecipes.length));
  };
  return (
    <>
      <div className="relative h-[600px] overflow-hidden mt-4">
  {/* Gradient background layers */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B8A] via-[#FF8E9B] to-[#FFB5C1]"></div>
  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/30 via-transparent to-blue-400/20"></div>

  {/* Decorative nuts (top center) */}
  <img
    src="https://pngimg.com/d/nuts_PNG18.png"
    alt="Nuts"
    className="absolute left-1/2 top-0 -translate-x-1/2 w-40 z-20"
    style={{ transform: "translate(-50%, -40%)" }}
  />

  {/* Decorative raspberry (top right) */}
  <img
    src="https://pngimg.com/d/raspberry_PNG104.png"
    alt="Raspberry"
    className="absolute top-8 right-8 w-20 z-20"
  />

  {/* Decorative strawberry (bottom center) */}
  <img
    src="https://pngimg.com/d/strawberry_PNG2637.png"
    alt="Strawberry"
    className="absolute bottom-10 left-1/2 w-24 z-20"
    style={{ transform: "translateX(-50%)" }}
  />

  {/* Main content */}
  <div className="relative z-30 flex flex-row items-center justify-between h-full px-16">
    {/* Left text section */}
    <div className="max-w-lg">
      <h1 className="text-white text-5xl font-bold mb-2 flex items-center gap-2">
        SM
        <span className="inline-block">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="20" fill="#FF6B8A" />
          </svg>
        </span>
        OTHIES
      </h1>
      <h2 className="text-white text-4xl font-bold mb-4">RASPBERRY</h2>
      <p className="text-white/90 text-lg leading-relaxed mb-8">
        Treat yourself to the rich taste of our blackberry smoothies! Blended with fresh blackberries and nutritious ingredients, they offer a refreshing and healthy boost whenever you need it.
      </p>
      {/* Small circular images */}
      <div className="flex gap-4">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-white/30">
            <img
              src="https://pngimg.com/d/raspberry_PNG104.png"
              alt="Smoothie"
              className="w-10 h-10 object-cover"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Right smoothie bowl */}
    <div className="relative flex items-center justify-center">
      <img
        src="https://pngimg.com/d/smoothie_PNG18.png"
        alt="Smoothie Bowl"
        className="w-96 h-96 rounded-full shadow-2xl object-cover border-8 border-white bg-white"
      />
    </div>
  </div>
{/* Big wavy shape top-left */}
<div className="absolute top-0 left-0 z-0 pointer-events-none">
  <svg width="600" height="500" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="
        M0,0 
        Q120,100 40,220 
        Q0,320 200,350 
        Q400,380 350,200 
        Q320,80 600,0 
        L600,0 L0,0 Z
      "
      fill="red"
      opacity="0.22"
    />
  </svg>
</div>
  {/* Bottom wave effect */}
  <div className="absolute bottom-0 left-0 w-full">
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="relative block w-full h-12 fill-white"
    >
      <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
    </svg>
  </div>
</div>


      <div className="mx-auto space-y-10 my-10">
        {/* Blog Section */}
        <BlogSection blogs={mockBlogs} />

        {/* Popular Recipes Section */}
        <RecipeGrid
          title="Công thức phổ biến"
          recipes={popularRecipes}
          showLoadMore={false}
        />

        {/* Explore More Section */}
        <ExploreSection 
          categoryType={categoryType} 
          currentItem={item}
        />

        {/* All Recipes Section */}
        <RecipeGrid
          title="Tất cả công thức"
          recipes={allRecipes.slice(0, visibleRecipes)}
          showLoadMore={visibleRecipes < allRecipes.length}
          onLoadMore={handleLoadMoreRecipes}
        />
      </div>
    </>
  );
};

export default Recipes;