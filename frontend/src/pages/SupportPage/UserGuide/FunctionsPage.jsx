import React, { useState } from "react";
import Hero from "../../../components/sections/Support/Hero";
import { BiSolidCategoryAlt, BiSolidVideos } from "react-icons/bi";
import { FaShare } from "react-icons/fa6";
import ajinomoto from "../../../assets/Support/ajinomoto.png";
import beptot from "../../../assets/Support/beptot.png";
import cooky from "../../../assets/Support/cooky.png";
import go from "../../../assets/Support/go.png";
import grabmart from "../../../assets/Support/grabmart.png";
import kitchenpro from "../../../assets/Support/kitchenpro.png";
import nestle from "../../../assets/Support/nestle.png";
import savourydays from "../../../assets/Support/savourydays.png";
import vietcetera from "../../../assets/Support/vietcetera.png";
import vinmart from "../../../assets/Support/vinmart.png";
import vtv3 from "../../../assets/Support/vtv3.png";

import { RiArrowDropDownLine } from "react-icons/ri";
const functions = [
  {
    icon: <BiSolidCategoryAlt className="text-[50px] text-[#ff6f20]" />,
    title: "Danh mục công thức",
    desc: "Chức năng này giúp người dùng dễ dàng tìm kiếm công thức theo từng nhóm như món chính, món phụ, món chay, ẩm thực theo quốc gia hoặc mức độ khó.",
  },
  {
    icon: <FaShare className="text-[50px] text-[#ff6f20]" />,
    title: "Chia sẻ & đánh giá",
    desc: "Cho phép người dùng đăng công thức, chia sẻ món ăn, bình luận, đánh giá chất lượng và học hỏi lẫn nhau.",
  },
  {
    icon: <BiSolidVideos className="text-[50px] text-[#ff6f20]" />,
    title: "Video hướng dẫn",
    desc: "Tích hợp video trực quan giúp người mới dễ theo dõi, thực hành, và cải thiện kỹ năng nấu ăn một cách sinh động.",
  },
];

const partners = [
  ajinomoto,
  beptot,
  cooky,
  go,
  grabmart,
  kitchenpro,
  nestle,
  savourydays,
  vietcetera,
  vinmart,
  vtv3,
];

const questions = [
  {
    title: "Tôi có thể tìm công thức món ăn như thế nào?",
    content:
      "Bạn có thể tìm công thức bằng cách nhập tên món ăn, nguyên liệu chính, hoặc chọn theo danh mục như món chính, món phụ, món ăn chay, món Nhật, Hàn, Việt,... trên thanh tìm kiếm hoặc trong phần danh mục.",
  },
  {
    title: "Làm sao để tôi chia sẻ công thức nấu ăn của riêng mình?",
    content:
      "Sau khi đăng nhập tài khoản, bạn có thể chọn mục 'Chia sẻ công thức', điền thông tin như nguyên liệu, cách làm, ảnh minh họa và video (nếu có), sau đó nhấn nút 'Đăng'.",
  },
  {
    title: "Tôi có thể đánh giá hoặc bình luận công thức của người khác không?",
    content:
      "Có! Bạn chỉ cần đăng nhập và chọn công thức mình muốn đánh giá. Ở cuối mỗi công thức sẽ có phần bình luận và đánh giá bằng sao.",
  },
  {
    title: "Video hướng dẫn có cần trả phí không?",
    content:
      "Tất cả video hướng dẫn trên OSHISHA đều hoàn toàn miễn phí và có thể xem trực tiếp ngay trên website. Chúng mình đang nỗ lực để làm video chi tiết và dễ hiểu nhất cho người mới bắt đầu.",
  },
  {
    title: "Tôi có thể lưu công thức yêu thích không?",
    content:
      "Có. Khi bạn nhấn vào biểu tượng trái tim hoặc nút 'Lưu', công thức sẽ được thêm vào mục 'Yêu thích' trong trang cá nhân của bạn.",
  },
  {
    title: "Tôi quên mật khẩu tài khoản thì phải làm sao?",
    content:
      "Bạn có thể nhấn vào liên kết 'Quên mật khẩu' ở trang đăng nhập và làm theo hướng dẫn để đặt lại mật khẩu thông qua email.",
  },
  {
    title:
      "Làm thế nào để phân loại công thức theo chế độ ăn (ăn kiêng, chay,…)?",
    content:
      "Ở phần bộ lọc công thức, bạn có thể chọn theo các tag như: ăn chay, ăn kiêng, không gluten, dành cho người tiểu đường, v.v.",
  },
];

const FunctionsPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <Hero />
      <div className="my-[40px] mb-[200px]">
        <div className="bg-[rgba(255,240,219,0.4)] mx-[120px] text-center pt-[60px] pb-[200px] relative">
          <h1 className="font-semibold text-[28px]">
            Các chức năng tiêu biểu của OSHISHA
          </h1>
          <p className="mt-4 mx-[110px] text-justify leading-8 text-[rgba(0,0,0,0.6)] text-[18px]">
            Website cung cấp các công thức nấu ăn đa dạng, phân loại rõ ràng
            theo món, nguyên liệu và chế độ ăn. Người dùng có thể tìm kiếm, lưu,
            đánh giá, bình luận công thức, cũng như chia sẻ món ăn của chính
            mình. Hệ thống hỗ trợ tài khoản cá nhân, blog mẹo nấu ăn, video
            hướng dẫn và giao diện đa ngôn ngữ, mang đến trải nghiệm học nấu ăn
            trực quan và tiện lợi.
          </p>
          <div className="absolute top-[260px] flex justify-center items-center gap-10">
            {functions.map((item, index) => (
              <div
                key={index}
                className="bg-white max-w-[25%] h-[360px] px-[30px] py-[40px] text-left shadow-xl"
              >
                {item.icon}
                <h3 className="font-semibold text-[22px] my-4 text-[#ff6f20]">
                  {item.title}
                </h3>
                <p className="text-[rgba(0,0,0,0.8)] leading-7 text-justify">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-[50px] px-[110px]">
        <h1 className="font-semibold text-[28px] text-center mb-8">
          Đơn vị đồng hành
        </h1>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-flex animate-marquee gap-10 w-max">
            {[...partners, ...partners].map((partner, index) => (
              <div key={index} className="text-center min-w-[100px]">
                <img
                  className="rounded-full w-[80px] h-[80px] object-cover mx-auto"
                  src={partner}
                  alt={`partner-${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[rgba(255,240,219,0.4)] mx-[110px] p-10 rounded-xl mb-[100px]">
        <h1 className="font-semibold text-[28px] text-center mb-6">
          Câu hỏi thường gặp
        </h1>
        <div className="mx-[200px]">
          {questions.map((question, index) => (
            <div key={index} className="bg-white mb-2 py-2 px-4">
              <div
                className="flex justify-between items-center cursor-pointer p-2"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="font-medium ">{question.title}</h3>
                <RiArrowDropDownLine
                  className={`text-[26px] text-[rgba(0,0,0,0.6)] transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              {activeIndex === index && (
                <div className="mt-2 text-[rgba(0,0,0,0.6)] font-normal leading-6 text-justify p-2">
                  {question.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FunctionsPage;
