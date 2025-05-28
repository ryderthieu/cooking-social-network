import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
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
    <MainLayout>
      {/* Banner */}
      <div className="relative h-[520px]" style={getBannerStyles()}>
        <div
          className="overflow-hidden relative w-full bg-gradient-to-tr from-[#fd3cb3] to-yellow-200 h-[400px] flex justify-center"
          style={getBannerStyles()}
        >
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
    </MainLayout>
  );
};

export default Recipes;