import blog9 from "../../assets/Blog/blog9.png";
import blog1 from "../../assets/Blog/blog1.png";
import blog8 from "../../assets/Blog/blog8.png";
import { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import avatar1 from "../../assets/avatar1.png";
import avatar2 from "../../assets/avatar2.png";
import avatar from "../../assets/avatar.png";

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

const AboutPage = () => {
  const userCount = useCountUp(500000, 4000);
  const recipeCount = useCountUp(10000, 4000);
  const viewCount = useCountUp(1000000, 4000);

  const blogs = [
    {
      name: "Bài viết mới",
      path: "/blog/bai-viet-moi",
      src: blog1,
      desc: "Khám phá những công thức và xu hướng ẩm thực mới nhất từ cộng đồng Oshisha.",
    },
    {
      name: "Bài viết nổi bật",
      path: "/blog/bai-viet-noi-bat",
      src: blog8,
      desc: "Tổng hợp các bài viết được yêu thích và đánh giá cao bởi người dùng.",
    },
    {
      name: "Bài viết phổ biến",
      path: "/blog/bai-viet-pho-bien",
      src: blog9,
      desc: "Những chủ đề, mẹo vặt và công thức nấu ăn được chia sẻ nhiều nhất.",
    },
  ];

  const teamMembers = [
    {
      name: "Huỳnh Văn Thiệu",
      role: "creative leader",
      img: avatar,
    },
    {
      name: "Trần Đỗ Phương Nhi",
      role: "sales manager",
      img: avatar1,
    },
    {
      name: "Trịnh Thị Phương Quỳnh",
      role: "sales manager",
      img: avatar2,
    },
  ];

  return (
    <section className="bg-white py-12 px-4 md:px-20 text-gray-800 mx-[110px]">
      <div className="text-center mb-16">
        <p className="text-lg max-w-2xl mx-auto leading-8">
          Chúng tôi kết nối những người yêu ẩm thực qua các công thức nấu ăn,
          câu chuyện và trải nghiệm nấu nướng tuyệt vời.
        </p>
        <img
          src="/images/about-hero.png"
          alt="Oshisha Hero"
          className="mx-auto mt-6 rounded-xl shadow-md w-full max-w-xl"
        />
      </div>

      {/* Team Intro */}
      <div className="text-center mb-16">
        <h2 className="text-2xl font-semibold mb-4">Đội ngũ của chúng tôi</h2>
        <p className="leading-7 text-gray-600 mx-[120px] mb-10">
          Chúng tôi là một đội ngũ yêu công nghệ và ẩm thực đến từ Việt Nam,
          mong muốn tạo ra những ảnh hưởng tích cực qua từng món ăn và công nghệ
          hiện đại.
        </p>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full mb-4"
                />
                <p className="text-sm text-gray-400 mb-1">{member.role}</p>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-500 text-sm mt-1 mb-2 px-4">
                  Glavi amet ritnsi libero molestie ante ut fringilla purus eros
                  quis quis guavid from dolor amet iquam lorem bibendum
                </p>
                <div className="flex gap-3">
                  <a href="#" className="text-blue-500 hover:text-blue-600">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="text-sky-400 hover:text-sky-500">
                    <FaTwitter />
                  </a>
                  <a href="#" className="text-pink-500 hover:text-pink-600">
                    <FaInstagram />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-10 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Sứ mệnh của chúng tôi</h2>
        <p className="leading-7 text-gray-600">
          Sứ mệnh của chúng tôi là tạo ra một cộng đồng nơi mọi người có thể
          chia sẻ niềm đam mê nấu ăn, học hỏi và lan tỏa yêu thương qua từng món
          ăn.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-orange-50 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">🍳</div>
          <h3 className="font-semibold text-lg mb-1">
            Chia sẻ công thức dễ dàng
          </h3>
          <p className="text-sm leading-6">
            Nơi bạn có thể đăng, tìm và lưu lại những công thức nấu ăn yêu
            thích.
          </p>
        </div>
        <div className="text-center p-6 bg-orange-50 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">🫱‍🫲</div>
          <h3 className="font-semibold text-lg mb-1">Kết nối cộng đồng</h3>
          <p className="text-sm leading-6">
            Tạo nhóm, tham gia sự kiện và kết bạn với những người cùng đam mê.
          </p>
        </div>
        <div className="text-center p-6 bg-orange-50 rounded-2xl shadow-md">
          <div className="text-3xl mb-2">💡</div>
          <h3 className="font-semibold text-lg mb-1">Trung tâm cảm hứng</h3>
          <p className="text-sm leading-6">
            Cập nhật video, bài viết và mẹo nấu ăn mỗi ngày.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid md:grid-cols-3 gap-6 text-center mb-16">
        <div>
          <h3 className="text-3xl font-bold text-pink-500">{userCount}+</h3>
          <p className="text-sm">Người dùng trên toàn thế giới</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-pink-500">{recipeCount}+</h3>
          <p className="text-sm">Công thức đã chia sẻ</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-pink-500">{viewCount}+</h3>
          <p className="text-sm">Lượt truy cập hàng tháng</p>
        </div>
      </div>

      {/* Blog Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Khám phá các bài viết mới nhất
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 block"
            >
              <img
                src={item.src}
                alt={item.name}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="leading-6 text-gray-600 ">{item.desc}</p>
                <span className="mt-3 font-semibold text-[16px] inline-block text-pink-500 hover:text-pink-600 transition-colors duration-300">
                  Xem thêm
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <section className="py-16 bg-orange-50">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Người dùng nói gì về Oshisha?
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Lắng nghe cảm nhận thực tế từ cộng đồng nấu ăn yêu thích Oshisha.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            {
              name: "Thiện Nhi",
              avatar: "/images/user1.jpg",
              content:
                "Oshisha giúp mình học nấu nhiều món mới và kết nối với bạn bè có cùng đam mê.",
            },
            {
              name: "Nhật Trường",
              avatar: "/images/user2.jpg",
              content:
                "Thiết kế đẹp, dễ sử dụng và có rất nhiều công thức món ăn độc đáo.",
            },
            {
              name: "Anh Thơ",
              avatar: "/images/user3.jpg",
              content:
                "Mỗi ngày đều có cảm hứng mới để vào bếp nhờ Oshisha. Thật tuyệt vời!",
            },
          ].map((user, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <h4 className="font-semibold text-gray-800">{user.name}</h4>
              </div>
              <p className="text-gray-600 italic">“{user.content}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center mt-[30px]">
        <h2 className="text-xl font-semibold mb-2">
          Tham gia cộng đồng Oshisha ngay hôm nay!
        </h2>
        <button className="mt-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg transition-all">
          Đăng ký ngay
        </button>
      </div>
    </section>
  );
};

export default AboutPage;
