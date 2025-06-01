import React from "react";
import Blogs from "@/components/sections/Home/Blogs.jsx";
import SmallBlogs from "@/components/sections/Home/SmallBlogs.jsx";

const AllBlogs = () => {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-gray-800 mb-2">
          Bài viết đặc sắc từ cộng đồng
        </h1>
        <div className="w-16 h-1 bg-gradient-to-br from-orange-500 to-amber-500 mb-6"></div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <Blogs />
        </div>
        <div className="lg:w-1/3">
          <div>
            <h2 className="font-bold text-lg text-gray-800 mb-4 pb-2 border-b">
              Đề xuất bài viết
            </h2>
            <SmallBlogs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;