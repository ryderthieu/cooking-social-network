import Hero from "../../../components/sections/Support/Hero";
import avatar1 from "../../../assets/avatar1.png";
import avatar2 from "../../../assets/avatar2.png";
import avatar from "../../../assets/avatar.png";

const FeedbacksPage = () => {
  const testimonials = [
    {
      quote:
        "Cộng đồng trên Oshisha thật sự rất tuyệt vời! Là một người nội trợ, tôi luôn muốn chia sẻ những món ăn gia đình mình yêu thích và học hỏi thêm từ người khác. Từ khi tham gia nền tảng này, tôi không chỉ tìm được vô số công thức món ăn đa dạng, mà còn được trò chuyện, kết bạn với những người có cùng sở thích nấu ăn. Mỗi ngày, tôi đều cảm thấy có thêm động lực để vào bếp và thử món mới. Giao diện dễ dùng, hình ảnh đẹp và tốc độ tải nhanh cũng là một điểm cộng lớn!",
      name: "Huỳnh Văn Thiệu",
      title: "Người nội trợ & Blogger ẩm thực",
      img: avatar,
    },
    {
      quote:
        "Tôi thực sự ấn tượng với cộng đồng trên Oshisha. Với tư cách là một đầu bếp chuyên nghiệp, tôi đã thử nhiều nền tảng chia sẻ công thức, nhưng Oshisha là nơi tôi cảm thấy gần gũi và dễ kết nối nhất. Việc chia sẻ món ăn, công thức, nhận phản hồi từ mọi người và thậm chí là học hỏi thêm từ các bạn nghiệp dư đầy sáng tạo giúp tôi có thêm nhiều ý tưởng mới cho thực đơn nhà hàng. Đây là không gian tuyệt vời để gắn kết cộng đồng yêu ẩm thực và phát triển chuyên môn.",
      name: "Trịnh Thị Phương Quỳnh",
      title: "Bếp trưởng nhà hàng KFood",
      img: avatar2,
    },
    {
      quote:
        "Oshisha giúp mình phát triển niềm đam mê nấu ăn rất nhiều. Trước đây mình chỉ nấu ăn theo bản năng, nhưng nhờ có các bài viết chi tiết, video hướng dẫn và feedback từ cộng đồng, mình đã cải thiện kỹ năng rất nhanh. Mình cũng thích cách nền tảng này tổ chức các thử thách nấu ăn hàng tuần – vừa vui, vừa học hỏi được nhiều thứ mới. Điều đặc biệt là mọi người ở đây cực kỳ thân thiện và hỗ trợ nhau hết mình, không hề có cảm giác cạnh tranh tiêu cực như ở nhiều mạng xã hội khác.",
      name: "Trần Đỗ Phương Nhi",
      title: "Sinh viên ngành Ẩm thực",
      img: avatar1,
    },
  ];

  return (
    <div>
      <Hero />
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <p className="text-md text-[#ff6f20] font-semibold uppercase mb-3">
            Chúng tôi lắng nghe
          </p>
          <h2 className="text-3xl font-bold mt-2 mb-3">
            Phản hồi từ cộng đồng
          </h2>
          <p className="text-gray-500 text-md mx-[100px] leading-7">
            Cùng lắng nghe cảm nhận từ những thành viên đã và đang đồng hành
            cùng Oshisha <br /> nơi kết nối, chia sẻ và lan tỏa đam mê ẩm thực
            mỗi ngày.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl shadow p-6 text-left"
            >
              <p className="mb-4 mx-1 leading-7 text-gray-500 text-justify">
                {item.quote}
              </p>
              <div className="flex items-center gap-3 border-t-2 pt-4 border-gray-100">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200 my-auto"
                />
                <div>
                  <p className="font-semibold text-[16px] mb-1">{item.name}</p>
                  <p className="text-[14px] text-gray-500">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[#FFF8EA] px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-sm text-[#ff6f20] font-semibold uppercase mb-2">
              Feedback
            </p>
            <h2 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-gray-500 mb-6">
              Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn để cùng xây dựng
              một cộng đồng nấu ăn năng động và sáng tạo hơn mỗi ngày.
            </p>

            <div className="mb-5">
              <p className="font-semibold mb-1">Our office</p>
              <p className="text-gray-500 text-sm">
                Lầu 5, Tòa nhà ABC Tower, 123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí
                Minh
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">Liên hệ</p>
              <p className="text-gray-500 text-sm mb-5">+123 456 789 0245</p>
              <p className="font-semibold mb-1">Email</p>
              <p className="text-gray-500 text-sm">chat@oshisha.com</p>
            </div>
          </div>

          <form className="bg-white rounded-xl shadow p-6 space-y-4 w-full">
            <h3 className="text-xl font-bold text-[#ff6f20]">Oshisha</h3>
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:text-[#ff6f20]"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:text-[#ff6f20]"
            />
            <textarea
              rows={4}
              placeholder="Phản hồi của bạn"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:text-[#ff6f20]"
            />
            <button
              type="submit"
              className="bg-[#ff6f20] text-white px-6 py-2 rounded-md hover:bg-[#ff6f22] transition"
            >
              Gửi
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default FeedbacksPage;
