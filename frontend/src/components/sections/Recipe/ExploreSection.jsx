import React, { useState, useEffect } from "react";
import { getAllFormattedCategories } from "../../../services/categoryService";
import RecipeCard from "./RecipeCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../../ui/carousel";

const ExploreSection = ({ categoryType, currentItem }) => {
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use category items from backend
  const items = categoryItems;
  const currentCategoryData = categoryData;

  console.log(`🎯 ExploreSection props:`, { categoryType, currentItem });
  useEffect(() => {
    const fetchCategoryItems = async () => {
      if (!categoryType || !currentItem) {
        console.log(`⚠️ Missing required props:`, {
          categoryType,
          currentItem,
        });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log(
          `🎯 Starting fetch for categoryType: ${categoryType}, currentItem: ${currentItem}`
        );

        // Get all formatted categories to find the current category data
        const categoriesResponse = await getAllFormattedCategories();
        let foundCategory = null;

        if (categoriesResponse.data?.success) {
          const allCategories = categoriesResponse.data.data;
          console.log(
            `📂 All categories:`,
            allCategories.map((cat) => ({
              key: cat.key,
              items: cat.items?.length,
            }))
          );

          foundCategory = allCategories.find((cat) => cat.key === categoryType);

          if (foundCategory) {
            setCategoryData(foundCategory);
            console.log(`✅ Found category:`, {
              key: foundCategory.key,
              itemsCount: foundCategory.items?.length,
            });

            // Filter out the current item and set the remaining category items
            const otherCategoryItems =
              foundCategory.items?.filter(
                (item) => item.slug !== currentItem
              ) || [];

            console.log(
              `📍 Found ${otherCategoryItems.length} other category items`
            );
            console.log(
              `📋 Category items:`,
              otherCategoryItems.map((item) => item.name)
            );
            setCategoryItems(otherCategoryItems);
          } else {
            console.warn(
              `⚠️ Could not find category with key: ${categoryType}`
            );
            setCategoryItems([]);
          }
        } else {
          console.error(`❌ Failed to fetch categories:`, categoriesResponse);
          setError("Không thể tải dữ liệu danh mục");
          setCategoryItems([]);
        }
      } catch (err) {
        console.error("❌ Error fetching category items:", err);
        setError(err.message);
        setCategoryItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryItems();
  }, [categoryType, currentItem]);
  return (
    <div
      className="relative w-full px-[140px] pt-10 pb-16"
      style={{
        backgroundColor: currentCategoryData?.background 
          ? currentCategoryData.background.includes('[') 
            ? currentCategoryData.background.match(/\[(.*?)\]/)?.[1] + '70'
            : '#f3f4f630' 
          : '#f3f4f630'
      }}
    >
      <div className="relative z-10">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-black mb-6 md:mb-8">
          Khám phá thêm trong danh mục này
        </h3>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải danh mục tương tự...</p>
          </div>
        )}
        
        {error && !items.length && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Không thể tải dữ liệu. Vui lòng thử lại sau.
            </p>
          </div>
        )}
        
        {items.length === 0 && !error && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy danh mục tương tự.</p>
          </div>
        )}
        
        {items.length > 0 && (
          <>
            {items.length > 4 ? (
              // Use carousel for more than 4 items
              <Carousel
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full relative z-20"
              >
                <CarouselContent className="-ml-2 md:-ml-4 p-3">
                  {items.map((item, index) => (
                    <CarouselItem
                      key={item.slug || item._id || index}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 relative z-30"
                    >                      <div className="z-40">
                        <RecipeCard 
                          item={item} 
                          categoryType={categoryType}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-[50px] z-50" />
                <CarouselNext className="-right-[50px] z-50" />
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 relative z-20">
                {items.map((item, index) => (
                  <div key={item.slug || item._id || index} className="z-30">                    <RecipeCard
                      item={item}
                      categoryType={categoryType}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExploreSection;
