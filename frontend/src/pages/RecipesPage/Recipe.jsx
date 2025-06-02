import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb.jsx";
import CategoryCard from "../../components/sections/Recipe/CategoriesCard.jsx";
import RecipeGrid from "../../components/sections/Recipe/RecipeGrid.jsx";
import BlogSection from "../../components/sections/Recipe/BlogSection.jsx";
import ExploreSection from "../../components/sections/Recipe/ExploreSection.jsx";
import { Korea1 } from "../../assets/Recipe/images/index.js";
import { getAllRecipes } from "../../services/recipeService.js";
import { getAllPosts } from "../../services/postService.js";

// Move slug mapping outside component for performance and reusability
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

// Move getDisplayName outside component to fix dependency issues
const getDisplayName = (slug) => {
  return slugToVietnamese[slug] || decodeURIComponent(slug);
};

const Recipes = () => {
  const { categoryType, item } = useParams();
  const [scrollY, setScrollY] = useState(0);
  const [filteredPopularRecipes, setFilteredPopularRecipes] = useState([]);
  const [filteredAllRecipes, setFilteredAllRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(8);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  // Filter recipes based on current category
  const filterRecipesByCategory = React.useCallback((recipes) => {
    if (!categoryType || !item) {
      return recipes;
    }
    
    return recipes.filter(recipe => {
      if (!recipe.categories || !Array.isArray(recipe.categories)) return false;
      
      // Check if any of the recipe's categories match the current filter
      return recipe.categories.some(category => {
        // Handle populated category objects
        if (typeof category === 'object' && category !== null) {
          const categoryTypeField = category.type;
          const categorySlug = category.slug;
          const categoryName = category.name;
          
          // Check if the category type matches
          if (categoryTypeField === categoryType) {
            // Try to match by slug first (most accurate)
            if (categorySlug === item) {
              return true;
            }
            
            // If slug doesn't match, try matching by converted Vietnamese name
            const targetCategoryName = getDisplayName(item);
            if (categoryName === targetCategoryName) {
              return true;
            }
          }
        }
        
        return false;
      });
    });
  }, [categoryType, item]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Fetch recipes
        let recipeResponse;
        
        if (item && categoryType) {
          // Build search parameters based on categoryType and item
          const searchParams = {};
          
          // Map categoryType to the correct API parameter (now using camelCase directly)
          const categoryMapping = {
            'mealType': 'mealType',
            'cuisine': 'cuisine',
            'occasions': 'occasions',
            'dietaryPreferences': 'dietaryPreferences',
            'mainIngredients': 'mainIngredients',
            'cookingMethod': 'cookingMethod',
            'timeBased': 'timeBased',
            'difficultyLevel': 'difficultyLevel'
          };
          
          const apiParam = categoryMapping[categoryType];
          if (apiParam) {
            // Convert English slug to Vietnamese name for API
            const vietnameseName = getDisplayName(item);
            searchParams[apiParam] = vietnameseName;
          } else {
            // Fallback to keyword search
            searchParams.keyword = item;
          }
          
          try {
            // For now, skip search API and use getAllRecipes to avoid category name mismatch
            recipeResponse = await getAllRecipes();
          } catch (searchError) {
            // If search fails (e.g., authentication issue), fall back to getAllRecipes
            console.warn('Search failed, falling back to getAllRecipes:', searchError);
            recipeResponse = await getAllRecipes();
          }
        } else {
          // Get all recipes if no specific category
          recipeResponse = await getAllRecipes();        }
        
        const recipes = recipeResponse.data.data || [];
        console.log("Fetched recipes from API:", recipes);
        console.log("First recipe categories:", recipes[0]?.categories);
        
        // Filter recipes for current category
        const filtered = filterRecipesByCategory(recipes);
        setFilteredPopularRecipes(filtered.slice(0, 4));
        setFilteredAllRecipes(filtered);
        
        // Fetch blogs/posts
        try {
          const blogsResponse = await getAllPosts();
          const postsData = Array.isArray(blogsResponse.data) ? blogsResponse.data : [];
          // Transform posts to blog format if needed
          const formattedBlogs = postsData.slice(0, 4).map(post => ({
            id: post._id,
            title: post.caption || 'Bài viết mới',
            image: post.media?.[0]?.url || Korea1,
            author: post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Tác giả ẩn danh',
            date: post.createdAt,
            path: `/posts/${post._id}`
          }));
          setBlogs(formattedBlogs);
        } catch (blogError) {
          console.warn('Failed to load blogs:', blogError);
          setBlogs([]);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
        // Fallback to empty arrays
        setFilteredPopularRecipes([]);
        setFilteredAllRecipes([]);
        setBlogs([]);
      }
    };
    
    fetchData();
  }, [item, categoryType, filterRecipesByCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get category name for display
  const getCategoryDisplayName = () => {
    const categoryTypeMap = {
      'mealType': 'Loại bữa ăn',
      'cuisine': 'Vùng ẩm thực',
      'occasions': 'Dịp đặc biệt',
      'dietaryPreferences': 'Chế độ ăn',
      'mainIngredients': 'Nguyên liệu chính',
      'cookingMethod': 'Phương pháp nấu',
      'timeBased': 'Thời gian',
      'difficultyLevel': 'Mức độ khó'
    };
    return categoryTypeMap[categoryType] || categoryType;
  };

  const displayItemName = getDisplayName(item);
  const displayCategoryName = getCategoryDisplayName();

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
    setVisibleRecipes((prev) => Math.min(prev + 8, filteredAllRecipes.length));
  };


  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[580px] overflow-hidden mt-4" style={getBannerStyles()}>
        {/* BreadCrumb navigation */}
        <div className="absolute top-4 left-4 z-40">
          <BreadCrumb />
        </div>
        
        {/* Gradient background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B8A] via-[#FF8E9B] to-[#FFB5C1]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/30 via-transparent to-blue-400/20"></div>

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
          className="absolute bottom-10 right-1/4 w-24 z-20"
          style={{ transform: "translateX(-50%)" }}
        />

        {/* Main content */}
        <div className="relative z-30 flex flex-row items-center justify-between h-full pl-[110px]">
          {/* Left text section */}
          <div className="max-w-lg">
            <h1 className="text-white text-5xl font-bold mb-2 flex items-center gap-2">
              {displayCategoryName}
            </h1>
            <h2 className="text-white text-4xl font-bold mb-4">{displayItemName.toUpperCase()}</h2>
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              Khám phá các công thức {displayItemName.toLowerCase()} tuyệt vời! 
              Từ những món ăn truyền thống đến hiện đại, 
              chúng tôi mang đến cho bạn những trải nghiệm ẩm thực đa dạng và phong phú.
            </p>
          </div>

          {/* Right smoothie bowl */}
          <div className="relative flex mr-[100px]">
            <img
              src="https://pngimg.com/d/smoothie_PNG18.png"
              alt="Smoothie Bowl"
              className="w-96 h-96 rounded-full shadow-2xl object-cover p-2 border-8 border-white"
            />
          </div>
        </div>

        {/* Big wavy shape top-left */}
        <div className="absolute -top-10 -left-5 z-0 pointer-events-none w-full h-full">
          <svg
            width="833"
            height="556"
            viewBox="0 0 833 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 8px 32px #FF6B8A55)" }}
          >
            <g filter="url(#filter0_d_66_4)">
              <path
                d="M0 539.311L1.23565 485.838C1.23565 485.838 0 575.741 0 539.311Z"
                fill="#FF6B8A"
                fillOpacity="0.85"
              />
              <path
                d="M1.23545 0H644.343C644.343 0 858.4 69.2099 825.577 205.309C792.755 341.408 691.334 281.114 631.722 281.114C572.11 281.114 521.615 346.743 596.12 378.892C670.626 411.042 602.744 568.339 516.638 503.407C430.532 438.476 439.639 558.408 286.469 476.671C133.3 394.934 200.363 507.227 134.127 476.671C67.8915 446.115 60.44 550.769 0 539.311L1.23545 0Z"
                fill="#FF6B8A"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_66_4"
                x="-4"
                y="0"
                width="837"
                height="556"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_66_4"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_66_4"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Bottom ellipse */}
        <div className="absolute -bottom-40 -right-40 ">
          <svg
            width="512"
            height="405"
            viewBox="0 0 512 405"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_69_2)">
              <ellipse cx="305.5" cy="299" rx="296.5" ry="290" fill="#FF6B8A90" />
            </g>
            <defs>
              <filter
                id="filter0_d_69_2"
                x="0"
                y="0"
                width="603"
                height="590"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-4" dy="-4" />
                <feGaussianBlur stdDeviation="2.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_69_2"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_69_2"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      <div className="mx-auto space-y-10 my-10">
        {/* Blog Section */}
        <BlogSection blogs={blogs} />

        {/* Popular Recipes Section */}
        <RecipeGrid
          title="Công thức phổ biến"
          recipes={filteredPopularRecipes}
          showLoadMore={false}
        />

        {/* Explore More Section */}
        <ExploreSection categoryType={categoryType} currentItem={item} />

        {/* All Recipes Section */}
        <RecipeGrid
          title="Tất cả công thức"
          recipes={filteredAllRecipes.slice(0, visibleRecipes)}
          showLoadMore={visibleRecipes < filteredAllRecipes.length}
          onLoadMore={handleLoadMoreRecipes}
        />
      </div>
    </>
  );
};

export default Recipes;
