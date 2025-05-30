import React from "react";
import blog9 from "../../../assets/Blog/blog9.png";
import blog1 from "../../../assets/Blog/blog1.png";
import blog8 from "../../../assets/Blog/blog8.png";
import blog from "../../../assets/Home/blog1.png";
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

const SmallBlogs = () => {
  return (
    <div className="mt-4 flex justify-center items-center gap-4">
      <img
        src={blog}
        className="w-[160px] h-[110px] object-cover rounded-2xl"
        alt=""
      />
      <div className="max-w-[400px]">
        <h4 className="font-semibold text-[14px]">
          Crochet Projects for Noodle Lovers
        </h4>
        <div className="flex mt-4">
          <img src="" alt="" />
          <span className="text-[rgba(0,0,0,0.6)] text-[13px]">
            Wade Warren
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmallBlogs;
