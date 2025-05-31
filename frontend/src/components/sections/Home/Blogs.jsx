import React from "react";
import blog1 from "../../../assets/Home/blog2.png";
import blog2 from "../../../assets/Home/blog3.png";
import blog from "../../../assets/Home/blog1.png";
import avatar from "../../../assets/avatar.jpg";
import avatar1 from "../../../assets/avatar1.jpg";
import avatar2 from "../../../assets/avatar2.jpg";
import { Link } from "react-router-dom";
const featuredRecipes = [
  {
    name: "Bài viết phổ biến",
    author: "Trịnh Thị Phương Quỳnh",
    desc: "Khám phá những bài viết phổ biến nhất trong cộng đồng nấu ăn của chúng ta. Từ công thức đơn giản đến mẹo nấu ăn hữu ích, bạn sẽ tìm thấy nhiều thông tin thú vị.",
    date: "2023-10-01",
    path: "/blog/bai-viet-pho-bien",
    image: blog1,
    ava: avatar2,
  },
  {
    name: "Bài viết mới nhất",
    author: "Huỳnh Văn Thiệu",
    desc: "Cập nhật những bài viết mới nhất từ cộng đồng nấu ăn. Tìm hiểu các công thức mới, mẹo nấu ăn và xu hướng ẩm thực hiện đại.",
    path: "/blog/bai-viet-moi",
    image: blog,
    ava: avatar,
    date: "2023-10-05",
  },
  {
    name: "Bài viết nổi bật",
    author: "Trần Đỗ Phương Nhi",
    desc: "Khám phá những bài viết nổi bật trong cộng đồng nấu ăn. Những công thức độc đáo và mẹo nấu ăn sáng tạo đang chờ đón bạn.",
    path: "/blog/bai-viet-noi-bat",
    image: blog2,
    ava: avatar1,
    date: "2023-10-10",
  },
];

const Blogs = () => {
  return (
    <div>
      {featuredRecipes.map((recipe, index) => (
        <Link to={recipe.path} key={index} className="flex items-center gap-4">
          <div className="mt-4 flex gap-4">
            <img
              src={recipe.image}
              className="w-[240px] h-[180px] object-cover rounded-2xl"
              alt={recipe.name}
            />
            <div className="max-w-[550px] my-auto">
              <h4 className="font-semibold text-[20px]">{recipe.name}</h4>
              <p className="text-justify leading-6 text-[15px] text-gray-600 mt-2 font-light">
                {recipe.desc}
              </p>
              <div className="flex mt-4 items-center">
                {recipe.ava && (
                  <img
                    src={recipe.ava}
                    alt={recipe.author}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span className="mr-4 font-semibold">{recipe.author}</span>
                <p className="border-l-2 border-l-gray-200 pl-4 my-auto text-[14px] font-semibold text-[rgba(0,0,0,0.6)]">
                  {recipe.date}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Blogs;
