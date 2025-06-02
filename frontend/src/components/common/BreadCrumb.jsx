import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function BreadCrumb({ category }) {
  const location = useLocation();

  // Tạo mảng breadcrumb từ URL
  const pathnames = location.pathname.split("/").filter((x) => x);
  // Mapping tên hiển thị cho các route
  const routeNames = {
    recipes: "Khám phá công thức",
    profile: "Hồ sơ",
    about: "Về chúng tôi",
    contact: "Liên hệ",
    saved: "Công thức đã lưu",
    breakfast: "Bữa sáng",
    lunch: "Bữa trưa",
    dinner: "Bữa tối",
    mealType: "Loại bữa ăn",
    cuisine: "Vùng ẩm thực",
    occasions: "Dịp đặc biệt",
    dietaryPreferences: "Chế độ ăn",
    mainIngredients: "Nguyên liệu chính",
    cookingMethod: "Phương pháp nấu",
    timeBased: "Thời gian",
    difficultyLevel: "Mức độ khó",
    create: "Tạo công thức",
  };

  const isRecipeDetail = pathnames.includes("recipes") && pathnames.length > 1;

  return (
    <nav className="flex items-center space-x-2 text-sm text-black mb-4 mt-4">
      {/* Trang chủ */}
      <Link
        to="/"
        className="hover:text-pink-600 font-bold underline text-[17px] transition-colors text-black"
      >
        Trang chủ
      </Link>

      {/* Nếu là trang recipe detail và có category */}
      {isRecipeDetail && category ? (
        <>
          {" "}
          <span className="text-black font-bold text-[17px]">{">"}</span>
          <Link
            to="/recipes"
            className="hover:text-pink-600 underline font-bold text-[17px] transition-colors text-black"
          >
            Khám phá công thức
          </Link>
          <span className="text-black font-bold text-[17px]">{">"}</span>
          <span className="text-slate-800 text-[17px] font-bold">{category}</span>
        </>
      ) : (
        /* Các breadcrumb items bình thường */
        pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNames[name] || decodeURIComponent(name);

          return (
            <React.Fragment key={name}>
              <span className="text-black font-bold text-[17px]">{">"}</span>
              {isLast ? (
                <span className="text-slate-800 text-[17px] font-bold">
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-pink-600 underline font-bold text-[17px] transition-colors text-black"
                >
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })
      )}
    </nav>
  );
}
