import React from "react";
import Blogs from "@/components/sections/Home/Blogs.jsx";
import SmallBlogs from "@/components/sections/Home/SmallBlogs.jsx";
const AllBlogs = () => {
  return (
    <div>
      <div className="mt-[50px]">
        <p className="font-bold text-[24px]">Bài viết đặc sắc từ cộng đồng</p>
        <div className="flex">
          <div className="w-[70%]">
            <Blogs />
          </div>
          <div className="w-[30%]">
            <div>
              <p className="font-bold text-[18px] mb-4">Đề xuất bài viết</p>
              <SmallBlogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBlogs;
