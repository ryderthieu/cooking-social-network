import { useState, useEffect } from "react";
import avatar1 from "../../assets/avatar1.jpg";
import avatar2 from "../../assets/avatar2.jpg";
import avatar from "../../assets/avatar.jpg";
import blog9 from "../../assets/Blog/blog9.png";
import blog1 from "../../assets/Blog/blog1.png";
import blog8 from "../../assets/Blog/blog8.png";
import cmnt1 from "../../assets/About/cmnt1.jpg";
import { FaPinterest, FaFacebook, FaInstagramSquare } from "react-icons/fa";
import { Link } from "react-router-dom";
import atho from "../../assets/About/atho.png";
import ntruong from "../../assets/About/ntruong.png";
import tnhi from "../../assets/About/tnhi.jpg";

import {
  Facebook,
  Instagram,
  Linkedin,
  Star,
  ArrowRight,
  Users,
  BookOpen,
  Eye,
} from "lucide-react";

function useCountUp(to, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = to / (duration / 16);
    const handle = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(handle);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(handle);
  }, [to, duration]);

  return count.toLocaleString();
}

// Sample data với images từ imports
const teamMembers = [
  {
    name: "Huỳnh Văn Thiệu",
    role: "Sáng lập",
    desc: "Chuyên gia ẩm thực và công nghệ, đam mê kết nối cộng đồng qua ẩm thực.",
    img: avatar,
  },
  {
    name: "Trần Đỗ Phương Nhi",
    role: "Đồng sáng lập",
    desc: "Chuyên gia truyền thông và marketing, mang đến những ý tưởng sáng tạo cho Oshisha.",
    img: avatar1,
  },
  {
    name: "Trịnh Thị Phương Quỳnh",
    role: "Đồng sáng lập",
    desc: "Kỹ sư phần mềm với kinh nghiệm phát triển ứng dụng, đảm bảo nền tảng hoạt động mượt mà.",
    img: avatar2,
  },
];

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
];

const testimonials = [
  {
    name: "Thiện Nhi",
    avatar: tnhi,
    content:
      "Oshisha giúp mình học nấu nhiều món mới và kết nối với bạn bè có cùng đam mê.",
  },
  {
    name: "Nhật Trường",
    avatar: ntruong,
    content:
      "Thiết kế đẹp, dễ sử dụng và có rất nhiều công thức món ăn độc đáo.",
  },
  {
    name: "Anh Thơ",
    avatar: atho,
    content:
      "Mỗi ngày đều có cảm hứng mới để vào bếp nhờ Oshisha. Thật tuyệt vời!",
  },
];

export default function AboutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const userCount = useCountUp(500000, 4000);
  const recipeCount = useCountUp(10000, 4000);
  const viewCount = useCountUp(1000000, 4000);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  return (
    <div className="mx-4 lg:mx-[90px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl mx-6 mt-6">
        <div
          className="relative rounded-2xl overflow-hidden px-[40px]"
          style={{
            background: "linear-gradient(135deg, #fb923c 0%, #ec4899 100%)",
          }}
        >
          <div className="relative z-10 px-12 md:py-10 text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:w-[60%] mb-8 md:mb-0">
              <h1 className="text-3xl font-bold text-white mb-4 leading-[45px]">
                Khám phá công thức nấu ăn <br />
                <span className="text-yellow-300">cùng cộng đồng Oshisha</span>
              </h1>
              <p className="text-white/90 text-sm md:text-base mb-6 max-w-md leading-6">
                Chúng tôi kết nối những người yêu ẩm thực qua các công thức nấu
                ăn, câu chuyện và trải nghiệm nấu nướng tuyệt vời.
              </p>
              <form onSubmit={handleSearch} className="relative max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm công thức, món ăn..."
                  className="w-full h-12 pl-5 pr-12 rounded-full border-0 bg-white/95 shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors duration-300"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>
            <div className="md:w-[40%] flex justify-center md:justify-end">
              <img
                src={cmnt1 || "/placeholder.svg"}
                alt="Món ăn đặc sắc"
                className="rounded-xl shadow-lg w-full h-auto max-w-xs md:max-w-md hover:scale-105 transition-transform duration-300"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-6 mt-10">
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 md:p-8 border border-orange-100">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-[22px] font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full mr-3"></div>
                Giới thiệu về Oshisha
              </h3>
              <p className="text-gray-600 leading-8 mb-4 text-justify">
                Oshisha là cộng đồng ẩm thực kết nối những người yêu nấu ăn trên
                khắp Việt Nam. Chúng tôi cung cấp nền tảng để chia sẻ công thức,
                kinh nghiệm và niềm đam mê với ẩm thực. <br /> Sứ mệnh của chúng
                tôi là tạo ra một cộng đồng nơi mọi người có thể chia sẻ niềm
                đam mê nấu ăn, học hỏi và lan tỏa yêu thương qua từng món ăn.
              </p>
            </div>
            <div className="md:w-1/2 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {userCount}+
                </div>
                <p className="text-xs text-gray-500">Người dùng</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100 group">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-pink-500 mb-1">
                  {recipeCount}+
                </div>
                <p className="text-xs text-gray-500">Công thức</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {viewCount}+
                </div>
                <p className="text-xs text-gray-500">Lượt xem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Uniform Design */}
      <section className="p-[40px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đội ngũ của chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gặp gỡ những con người đầy đam mê đứng sau Oshisha - những người
            luôn nỗ lực để mang đến trải nghiệm tuyệt vời nhất cho cộng đồng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-[10px]">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group"
            >
              {/* Header với gradient thống nhất */}
              <div className="h-24 bg-gradient-to-br from-orange-400 to-pink-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>
              </div>

              <div className="p-6 -mt-8 relative">
                {/* Avatar */}
                <div className="relative mb-4 flex justify-center">
                  <div className="relative">
                    <img
                      src={member.img || "/placeholder.svg"}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 font-semibold text-sm mb-3">
                    {member.role}
                  </p>
                </div>

                <p className="text-gray-600 text-sm leading-6 text-center mb-6">
                  {member.desc}
                </p>

                {/* Social links - thống nhất */}
                <div className="flex justify-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer group/social">
                    <Facebook className="w-5 h-5 text-blue-600 group-hover/social:text-white" />
                  </div>
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300 cursor-pointer group/social">
                    <Instagram className="w-5 h-5 text-pink-600 group-hover/social:text-white" />
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer group/social">
                    <Linkedin className="w-5 h-5 text-blue-700 group-hover/social:text-white" />
                  </div>
                </div>
              </div>

              {/* Hover effect overlay - thống nhất */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

                <button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Người dùng nói gì về Oshisha?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những phản hồi chân thực từ cộng đồng người dùng yêu thích Oshisha
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((user, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative">
                {/* Quote icon */}
                <div className="text-6xl text-orange-200 font-serif leading-none mb-4">
                  "
                </div>

                <p className="text-gray-600 text-base leading-7 mb-6 relative z-10">
                  {user.content}
                </p>

                {/* User info */}
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-3 border-orange-200 group-hover:border-orange-300 transition-colors duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 transition-colors duration-300">
                      {user.name}
                    </h4>
                    <div className="flex text-yellow-400 text-xs">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 mb-8">
        <div
          className="rounded-2xl overflow-hidden relative group"
          style={{
            background: "linear-gradient(135deg, #fb923c 0%, #ec4899 100%)",
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="absolute top-1/2 -right-8 w-32 h-32 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="absolute -bottom-6 left-1/3 w-20 h-20 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
          </div>

          <div className="relative p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Tham gia cộng đồng Oshisha ngay hôm nay!
            </h2>
            <p className="text-white/90 text-base mb-8 max-w-2xl mx-auto">
              Khám phá thế giới ẩm thực đầy màu sắc và kết nối với hàng ngàn
              người yêu nấu ăn khác. Bắt đầu hành trình ẩm thực của bạn ngay bây
              giờ!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-pink-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-full text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center group/btn">
                Khám phá ngay
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>

              <button className="border-2 border-white text-white hover:bg-white hover:text-pink-600 font-semibold px-8 py-4 rounded-full text-base transition-all duration-300 transform hover:scale-105">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
