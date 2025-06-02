import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import BreadCrumb from "../../components/common/BreadCrumb.jsx";
import CategoryCard from "../../components/sections/Recipe/CategoriesCard.jsx";
import RecipeGrid from "../../components/sections/Recipe/RecipeGrid.jsx";
import BlogSection from "../../components/sections/Recipe/BlogSection.jsx";
import ExploreSection from "../../components/sections/Recipe/ExploreSection.jsx";
import { Korea1 } from "../../assets/Recipe/images/index.js";
import { getAllRecipes, filterRecipes } from "../../services/recipeService.js";
import { getAllPosts } from "../../services/postService.js";
import categoryService from "../../services/categoryService.js";


const Recipes = () => {
  const { categoryType, item } = useParams();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [filteredPopularRecipes, setFilteredPopularRecipes] = useState([]);
  const [filteredAllRecipes, setFilteredAllRecipes] = useState([]);
  const [visibleRecipes, setVisibleRecipes] = useState(8);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const dietaryPreferences = queryParams.get('dietaryPreferences');
  const cookingMethod = queryParams.get('cookingMethod');
  const isQueryFiltering = dietaryPreferences || cookingMethod;

  // Filter recipes based on current category
  const filterRecipesByCategory = React.useCallback((recipes) => {
    if (!categoryType || !item || !currentCategory) {
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
            
            // If slug doesn't match, try matching by name from database
            if (categoryName === currentCategory.name) {
              return true;
            }
          }
        }
        
        return false;
      });
    });
  }, [categoryType, item, currentCategory]);
  // Fetch initial data (recipes, blogs, category info)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        
        // Handle different filtering scenarios
        let recipes = [];
        
        if (isQueryFiltering) {
          // Use query parameter filtering - call backend API with filters
          const filters = {};
          if (dietaryPreferences) filters.dietaryPreferences = dietaryPreferences;
          if (cookingMethod) filters.cookingMethod = cookingMethod;
          
          try {
            const recipeResponse = await filterRecipes(filters);
            recipes = recipeResponse.data.data || [];
          } catch (filterError) {
            console.warn('Failed to filter recipes, falling back to all recipes:', filterError);
            // Fallback to getting all recipes
            const recipeResponse = await getAllRecipes();
            recipes = recipeResponse.data.data || [];
          }
        } else {
          // Get all recipes for path parameter filtering or no filtering
          const recipeResponse = await getAllRecipes();
          recipes = recipeResponse.data.data || [];
        }
        
        setAllRecipes(recipes);
        
        // First, fetch category information if we have categoryType and item
        if (categoryType && item) {
          try {
            const categoryResponse = await categoryService.getCategoryBySlugAndType(categoryType, item);
            setCurrentCategory(categoryResponse.data.data);
          } catch (categoryError) {
            console.warn('Failed to load category info:', categoryError);
            setCurrentCategory(null);
          }
        }
        
        // Fetch blogs/posts
        try {
          const blogsResponse = await getAllPosts();
          const postsData = Array.isArray(blogsResponse.data) ? blogsResponse.data : [];
          // Transform posts to blog format if needed
          const formattedBlogs = postsData.slice(0, 4).map(post => ({
            id: post._id,
            title: post.caption || 'Bài viết mới',
            image: post.media?.[0]?.url || Korea1,
            author: post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Oshisha',
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
  }, [categoryType, item, dietaryPreferences, cookingMethod, isQueryFiltering]);
  // Filter recipes when currentCategory or allRecipes changes
  useEffect(() => {
    if (allRecipes.length > 0) {
      let filtered = allRecipes;
      
      // Apply path parameter filtering (category-based) if not using query filters
      if (!isQueryFiltering && (categoryType && item && currentCategory)) {
        filtered = filterRecipesByCategory(allRecipes);
      }
      // If using query filters, recipes are already filtered from backend
      
      setFilteredPopularRecipes(filtered.slice(0, 4));
      setFilteredAllRecipes(filtered);
    }
  }, [allRecipes, filterRecipesByCategory, isQueryFiltering, categoryType, item, currentCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Get category name for display
  const getCategoryDisplayName = () => {
    if (isQueryFiltering) {
      // Handle query parameter display names
      if (dietaryPreferences) {
        return `Chế độ ăn: ${dietaryPreferences}`;
      }
      if (cookingMethod) {
        return `Phương pháp nấu: ${cookingMethod}`;
      }
    }
    
    // Handle path parameter display names
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

  // Get display names from database or fallback
  const displayItemName = currentCategory?.name || item || '';
  const displayCategoryName = getCategoryDisplayName();
  const categoryDescription = currentCategory?.description || `Khám phá các công thức ${displayItemName.toLowerCase()} tuyệt vời! 
Từ những món ăn truyền thống đến hiện đại, 
chúng tôi mang đến cho bạn những trải nghiệm ẩm thực đa dạng và phong phú.`;

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
        {/* <div className="absolute top-4 left-4 z-40">
          <BreadCrumb />
        </div> */}
        
        {/* Gradient background layers */}
        <div className="absolute inset-0 bg-[#ffefd0]"></div>

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
              {categoryDescription}
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
                fill="#FF6B8A50"
                fillOpacity="0.85"
              />
              <path
                d="M1.23545 0H644.343C644.343 0 858.4 69.2099 825.577 205.309C792.755 341.408 691.334 281.114 631.722 281.114C572.11 281.114 521.615 346.743 596.12 378.892C670.626 411.042 602.744 568.339 516.638 503.407C430.532 438.476 439.639 558.408 286.469 476.671C133.3 394.934 200.363 507.227 134.127 476.671C67.8915 446.115 60.44 550.769 0 539.311L1.23545 0Z"
                fill="#FF6B8A50"
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
