import React from 'react';
import RecipeCard from './RecipeCard';
import Recipe from '../../common/Recipe'

export default function RecipesTab() {
  // Dữ liệu mẫu cho công thức
  const recipes = [
    {
      id: 1,
      title: "Bánh mì Việt Nam",
      description: "Công thức làm bánh mì giòn, thơm ngon đúng vị truyền thống",
      image: "/images/recipe-1.jpg",
      difficulty: "Dễ làm",
      time: "30 phút"
    },
    {
      id: 2,
      title: "Phở bò Hà Nội",
      description: "Công thức nấu phở bò thơm ngon với nước dùng trong veo",
      image: "/images/recipe-2.jpg",
      difficulty: "Trung bình",
      time: "2 giờ"
    },
    {
      id: 3,
      title: "Bánh xèo miền Trung",
      description: "Cách làm bánh xèo giòn ngon theo phong cách miền Trung",
      image: "/images/recipe-3.jpg",
      difficulty: "Dễ làm",
      time: "45 phút"
    },
    {
      id: 4,
      title: "Cá kho tộ",
      description: "Cá kho tộ đậm đà thơm ngon kiểu miền Bắc",
      image: "/images/recipe-4.jpg",
      difficulty: "Dễ làm",
      time: "1 giờ"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Recipe />
    </div>
  );
}