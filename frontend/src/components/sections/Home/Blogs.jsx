import React from "react";
import blog9 from "../../../assets/Blog/blog9.png";
import blog1 from "../../../assets/Blog/blog1.png";
import blog8 from "../../../assets/Blog/blog8.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const featuredRecipes = [
  {
    name: "Bài viết phổ biến",
    author: "Trịnh Thị Phương Quỳnh",
    path: "/blog/bai-viet-pho-bien",
    image: blog9,
  },
  {
    name: "Bài viết mới nhất",
    author: "Huỳnh Văn Thiệu",
    path: "/blog/bai-viet-moi",
    image: blog1,
  },
  {
    name: "Bài viết nổi bật",
    author: "Trần Đỗ Phương Nhi",
    path: "/blog/bai-viet-noi-bat",
    image: blog8,
  },
  {
    name: "Bài viết nổi bật",
    author: "Trần Đỗ Phương Nhi",
    path: "/blog/bai-viet-noi-bat",
    image: blog8,
  },
];

const Blogs = () => {
  return (
    <div>
      <section className=" py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[24px] font-bold text-gray-900 mb-1">
              Các bài viết nổi bật
            </h2>
            <p className="text-gray-600">
              Khám phá những nội dung được yêu thích nhất
            </p>
          </div>
          <button className="flex items-center text-orange-500 font-medium hover:text-orange-600 transition-colors duration-300 group">
            Xem tất cả
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredRecipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-orange-500 transition-colors duration-300">
                  {recipe.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {recipe.author.charAt(0)}
                    </span>
                  </div>
                  Đăng bởi {recipe.author}
                </p>

                <Link to={recipe.path}>
                  <button
                    className="w-full bg-gradient-to-r from-orange-500
                    to-pink-500 text-white font-semibold py-3 rounded-xl
                    hover:from-orange-600 hover:to-pink-600 transition-all
                    duration-300 transform hover:scale-105 shadow-lg
                    hover:shadow-xl"
                  >
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
