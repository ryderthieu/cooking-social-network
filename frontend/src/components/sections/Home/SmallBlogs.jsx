import React from "react";
import banh from "../../../assets/Blog/banh.jpg";
import botoi from "../../../assets/Blog/botoi.jpg";
import rc from "../../../assets/Blog/rc.jpg";
import salad from "../../../assets/Blog/salad.jpg";
import { Link } from "react-router-dom";
const featuredRecipes = [
  {
    name: "Cách làm bánh sừng bò (bánh croissant) thơm béo đúng chuẩn",
    author: "Trần Đỗ Phương Nhi",
    path: "/blog/1",
    image: banh,
  },
  {
    name: "Cách làm bánh mì bơ tỏi - Garlic Bread thơm ngon giòn rụm cho bữa ăn sáng",
    author: "Huỳnh Văn Thiệu",
    path: "/blog/2",
    image: botoi,
  },
  {
    name: "Cách làm bánh sinh nhật rau câu trái cây dễ làm, không cần máy đánh trứng",
    author: "Trịnh Thị Phương Quỳnh",
    path: "/blog/3",
    image: rc,
  },
  {
    name: "Cách làm salad tôm bơ nướng healthy chỉ với bếp ga đơn mini",
    author: "Trần Ngọc Anh Thơ",
    path: "/blog/bai-viet-noi-bat",
    image: salad,
  },
];

const SmallBlogs = () => {
  return (
    <div className="my-2">
      {featuredRecipes.map((recipe, index) => (
        <Link
          to={recipe.path}
          key={index}
          className="flex items-center gap-4 cursor-pointer my-4"
        >
          <img
            src={recipe.image}
            className="w-[160px] h-[110px] object-cover rounded-2xl"
            alt={recipe.name}
          />
          <div className="max-w-[400px]">
            <h4 className="font-semibold text-[14px]">{recipe.name}</h4>
            <div className="flex mt-4">
              <img src="" alt="" />
              <span className="text-[rgba(0,0,0,0.6)] text-[13px]">
                {recipe.author}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SmallBlogs;
