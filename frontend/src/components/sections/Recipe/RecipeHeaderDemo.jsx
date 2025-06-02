import React, { useState } from "react";
import RecipeHeader from "./RecipeHeader";

const RecipeHeaderDemo = () => {
  const [currentCategory, setCurrentCategory] = useState("mealType");
  const [scrollY, setScrollY] = useState(0);

  https://www.pngall.com/wp-content/uploads/2/Blueberry-PNG-Photo.png
  https://pngimg.com/d/strawberry_PNG2637.png

  const categoryData = {
    mealType: {
      displayCategoryName: "Loại bữa ăn",
      displayItemName: "Bữa sáng",
      categoryDescription: "Khám phá các món ăn sáng ngon miệng và bổ dưỡng để bắt đầu ngày mới tràn đầy năng lượng.",
      currentCategory: {
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=400&fit=crop"
      }
    },
    cuisine: {
      displayCategoryName: "Vùng ẩm thực",
      displayItemName: "Ẩm thực Ý",
      categoryDescription: "Thưởng thức hương vị đặc trưng của ẩm thực Ý với pizza, pasta và các món truyền thống.",
      currentCategory: {
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop"
      }
    },
    occasions: {
      displayCategoryName: "Dịp đặc biệt",
      displayItemName: "Sinh nhật",
      categoryDescription: "Tạo những kỷ niệm đáng nhớ với các món ăn và bánh ngọt dành cho tiệc sinh nhật.",
      currentCategory: {
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
      }
    },
    dietaryPreferences: {
      displayCategoryName: "Chế độ ăn",
      displayItemName: "Thuần chay",
      categoryDescription: "Khám phá thế giới ẩm thực thuần chay đầy màu sắc và hương vị tự nhiên.",
      currentCategory: {
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop"
      }
    },
    mainIngredients: {
      displayCategoryName: "Nguyên liệu chính",
      displayItemName: "Thịt bò",
      categoryDescription: "Những công thức chế biến thịt bò ngon và đa dạng từ Á đến Âu.",
      currentCategory: {
        image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop"
      }
    },
    cookingMethod: {
      displayCategoryName: "Phương pháp nấu",
      displayItemName: "Nướng",
      categoryDescription: "Kỹ thuật nướng hoàn hảo cho những món ăn thơm ngon và hấp dẫn.",
      currentCategory: {
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop"
      }
    }
  };

  const currentData = categoryData[currentCategory];

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Selector */}
      <div className="p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Test RecipeHeader với các Category</h2>
        <div className="flex flex-wrap gap-2">
          {Object.keys(categoryData).map((categoryType) => (
            <button
              key={categoryType}
              onClick={() => setCurrentCategory(categoryType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentCategory === categoryType
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {categoryData[categoryType].displayCategoryName}
            </button>
          ))}
        </div>
      </div>

      {/* RecipeHeader Component */}
      <RecipeHeader
        scrollY={scrollY}
        displayCategoryName={currentData.displayCategoryName}
        displayItemName={currentData.displayItemName}
        categoryDescription={currentData.categoryDescription}
        categoryType={currentCategory}
        currentCategory={currentData.currentCategory}
      />

      {/* Demo Content để test scroll */}
      <div className="p-8 space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-2xl font-bold mb-4">Demo Category: {currentCategory}</h3>
          <p className="text-gray-600 mb-4">
            Màu sắc và hình decorative sẽ thay đổi theo từng category type:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>mealType:</strong> Màu vàng cam với bánh mì, cà phê, trứng</li>
            <li><strong>cuisine:</strong> Màu hồng đỏ với pizza, sushi, taco</li>
            <li><strong>occasions:</strong> Màu tím với bánh sinh nhật, cupcake, quà tặng</li>
            <li><strong>dietaryPreferences:</strong> Màu xanh lá với salad, bơ, bông cải xanh</li>
            <li><strong>mainIngredients:</strong> Màu nâu với thịt, cá, gà</li>
            <li><strong>cookingMethod:</strong> Màu xanh dương với chảo, nồi, lò nướng</li>
          </ul>
        </div>

        {/* Thêm nội dung để test scroll effect */}
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-xl font-semibold mb-2">Section {num}</h4>
            <p className="text-gray-600">
              Scroll để xem hiệu ứng thay đổi kích thước và border-radius của header.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeHeaderDemo;
