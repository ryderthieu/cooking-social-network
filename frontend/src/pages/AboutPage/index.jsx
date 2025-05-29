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

// Sample data
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
    <div className="mx-[90px]">
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
                  className="w-full h-12 pl-5 pr-12 rounded-full border-0 bg-white/95 shadow-md text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center"
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
                src={cmnt1}
                alt="Món ăn đặc sắc"
                className="rounded-xl shadow-lg w-full h-auto max-w-xs md:max-w-md"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-6 mt-10">
        <div className="bg-orange-50 rounded-2xl p-6 md:p-8">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-[22px] font-bold text-gray-900 mb-4">
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
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {userCount}+
                </div>
                <p className="text-xs text-gray-500">Người dùng</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-pink-500 mb-1">
                  {recipeCount}+
                </div>
                <p className="text-xs text-gray-500">Công thức</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {viewCount}+
                </div>
                <p className="text-xs text-gray-500">Lượt xem</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="p-[40px]">
        <div className="flex items-center justify-between mb-6 mx-4">
          <h2 className="text-[22px] font-semibold text-gray-900">
            Đội ngũ của chúng tôi
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-[10px]">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={member.img || "/placeholder.svg"}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-orange-500 text-[15px] font-semibold mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-6">{member.desc}</p>
                <div className="flex mt-4 space-x-3">
                  <FaFacebook className="w-6 h-6 text-[#3B5998]" />
                  <FaPinterest className="w-6 h-6 text-red-500" />
                  <FaInstagramSquare className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-semibold text-gray-900">
            Các bài viết nổi bật
          </h2>
          <a
            href="/recipes"
            className="text-orange-500 text-sm font-medium hover:underline"
          >
            Xem tất cả
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <img
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {recipe.name}
                </h3>
                <p className="text-gray-500 text-[13px] mb-2">
                  Đăng bởi {recipe.author}
                </p>

                <div className="mt-4">
                  <Link
                    to={recipe.path}
                    className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-200"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-semibold text-gray-900">
            Người dùng nói gì về Oshisha?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((user, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl p-6">
              <div className="flex items-center mb-4">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                />
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-900">{user.name}</h4>
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
              <p className="text-gray-600 text-[15px] leading-6">
                "{user.content}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 mb-8">
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #fb923c 0%, #ec4899 100%)",
          }}
        >
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
              Tham gia cộng đồng Oshisha ngay hôm nay!
            </h2>
            <p className="text-white/90 text-sm mb-6 max-w-lg mx-auto">
              Khám phá thế giới ẩm thực đầy màu sắc và kết nối với hàng ngàn
              người yêu nấu ăn khác.
            </p>
            <Link to="/explore">
              <button className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-300">
                Khám phá ngay
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
