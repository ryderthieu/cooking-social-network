import { FaQuestionCircle, FaCogs, FaUsers } from "react-icons/fa";

const SupportsPage = () => {
  const items = [
    {
      icon: (
        <FaQuestionCircle className="text-[rgba(246,60,60,0.9)] text-2xl" />
      ),
      title: "Câu hỏi thường gặp",
      description:
        "Giải đáp những thắc mắc phổ biến của người dùng về nền tảng Cooking Social.",
    },
    {
      icon: <FaCogs className="text-[rgba(246,60,60,0.9)] text-2xl" />,
      title: "Tính năng và chức năng",
      description:
        "Tìm hiểu các tính năng nổi bật và cách sử dụng hiệu quả trên hệ thống.",
    },
    {
      icon: <FaUsers className="text-[rgba(246,60,60,0.9)] text-2xl" />,
      title: "Người dùng & Cộng tác",
      description:
        "Hướng dẫn mời bạn bè, tạo nhóm nấu ăn và chia sẻ công thức dễ dàng.",
    },
    {
      icon: <FaUsers className="text-[rgba(246,60,60,0.9)] text-2xl" />,
      title: "Người dùng & Cộng tác",
      description:
        "Hướng dẫn mời bạn bè, tạo nhóm nấu ăn và chia sẻ công thức dễ dàng.",
    },
    {
      icon: <FaUsers className="text-[rgba(246,60,60,0.9)] text-2xl" />,
      title: "Người dùng & Cộng tác",
      description:
        "Hướng dẫn mời bạn bè, tạo nhóm nấu ăn và chia sẻ công thức dễ dàng.",
    },
  ];

  return (
    <div className="min-h-screen mt-[20px] mx-[110px]">
      <div
        className=" text-white py-16 px-4 text-center h-[320px]  rounded-2xl"
        style={{
          background:
            "linear-gradient(30deg, rgba(246,60,60,0.9) 0%, rgba(255,175,1,0.75) 50%, rgba(255,225,1,0.6) 100%)",
        }}
      >
        <h1 className="text-3xl font-bold mb-2">
          Chào mừng! Bạn cần hỗ trợ gì?
        </h1>
        <p className="mb-6 text-lg">
          Tìm kiếm câu hỏi hoặc chủ đề trong trung tâm hỗ trợ của chúng tôi
        </p>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg">
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi hoặc chủ đề..."
              className="flex-1 outline-none px-2 text-black"
            />
            <button className="bg-[rgba(246,60,60,0.9)] text-white px-5 py-2 rounded-full font-semibold hover:bg-[rgba(255,175,1,0.75)]">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-12 px-4 space-y-6 mb-8">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white flex items-start p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="mr-4 my-auto">{item.icon}</div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportsPage;
