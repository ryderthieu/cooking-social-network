import React, { useState } from "react";
import Hero from "../../../components/sections/Support/Hero";
import { FaPlay } from "react-icons/fa6";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  TbCircleNumber4Filled,
  TbCircleNumber5Filled,
  TbCircleNumber6Filled,
  TbCircleNumber7Filled,
} from "react-icons/tb";

const questionContent = [
  {
    icon: <TbCircleNumber1Filled className="h-10 w-10" />,
    title: "Làm sao đăng công thức?",
    content: (
      <>
        Để đăng công thức nấu ăn của bạn, bạn cần có một tài khoản trên website.
        Sau khi đăng nhập, hãy vào mục “Chia sẻ công thức” hoặc nút “Tạo mới”
        thường nằm ở góc trên bên phải giao diện. Tại đây, bạn có thể nhập tên
        món ăn, danh sách nguyên liệu, từng bước hướng dẫn chi tiết, thời gian
        nấu, độ khó, khẩu phần và thêm hình ảnh minh họa. Bạn cũng có thể đính
        kèm video hoặc mẹo nấu riêng để món ăn thêm đặc sắc. Sau khi hoàn tất,
        công thức sẽ được gửi lên hệ thống để kiểm duyệt về nội dung, chính tả,
        bố cục trước khi chính thức hiển thị trên trang. Việc chia sẻ công thức
        không chỉ giúp bạn lưu giữ món ngon của mình mà còn lan tỏa niềm đam mê
        ẩm thực đến cộng đồng.
      </>
    ),
  },
  {
    icon: <TbCircleNumber2Filled className="h-10 w-10" />,
    title: "Có thể lưu công thức không?",
    content: (
      <>
        Có, bạn có thể dễ dàng lưu lại bất kỳ công thức nào mà bạn yêu thích
        hoặc muốn thử sau. Chỉ cần đăng nhập, sau đó nhấn vào biểu tượng "Lưu"
        (thường là hình trái tim hoặc bookmark) ngay bên dưới tiêu đề công thức.
        Các công thức đã lưu sẽ được tập hợp trong mục “Công thức yêu thích”
        hoặc “Bộ sưu tập cá nhân” trong trang hồ sơ của bạn. Bạn có thể sắp xếp
        lại chúng theo chủ đề, loại món ăn, hoặc gắn thẻ để tìm kiếm nhanh hơn
        sau này. Tính năng này cực kỳ tiện lợi, nhất là khi bạn đang lên kế
        hoạch nấu nướng cho tuần mới hoặc cho một bữa tiệc đặc biệt.
      </>
    ),
  },
  {
    icon: <TbCircleNumber3Filled className="h-10 w-10" />,
    title: "Tìm món theo nguyên liệu thế nào?",
    content: (
      <>
        Đôi khi bạn chỉ còn vài nguyên liệu trong tủ lạnh và không biết nấu gì?
        Đừng lo, website có tính năng tìm kiếm món ăn theo nguyên liệu. Bạn chỉ
        cần nhập vào những nguyên liệu có sẵn như “trứng, cà chua, hành lá” và
        hệ thống sẽ gợi ý các món phù hợp mà bạn có thể thực hiện ngay. Tính
        năng này đặc biệt hữu ích trong những ngày bạn muốn tiết kiệm thời gian,
        sử dụng hết nguyên liệu tồn đọng mà vẫn đảm bảo bữa ăn ngon miệng. Ngoài
        ra, bạn có thể lọc kết quả theo mức độ khó, thời gian chế biến, hoặc sở
        thích ăn chay, không gluten, ăn kiêng,...
      </>
    ),
  },
  {
    icon: <TbCircleNumber4Filled className="h-10 w-10" />,
    title: "Có thể bình luận hoặc đánh giá không?",
    content: (
      <>
        Có, website rất khuyến khích người dùng tương tác và chia sẻ trải nghiệm
        nấu ăn của mình. Sau khi thử một công thức nào đó, bạn có thể để lại
        bình luận phía dưới để chia sẻ cảm nhận, đánh giá chất lượng món ăn hoặc
        đóng góp thêm mẹo vặt riêng của bạn. Ngoài ra, bạn cũng có thể đánh giá
        món ăn bằng cách chấm sao (từ 1 đến 5 sao), giúp những người khác dễ
        dàng nhận biết công thức nào được cộng đồng yêu thích. Những đánh giá và
        góp ý chân thật sẽ giúp công thức ngày càng hoàn thiện hơn, đồng thời
        tạo ra một môi trường học hỏi và truyền cảm hứng giữa những người yêu ẩm
        thực.
      </>
    ),
  },
  {
    icon: <TbCircleNumber5Filled className="h-10 w-10" />,
    title: "Công thức có kiểm duyệt không?",
    content: (
      <>
        Có, mọi công thức do người dùng đăng tải sẽ được kiểm duyệt bởi đội ngũ
        quản trị viên để đảm bảo nội dung rõ ràng, chính xác và tuân thủ các
        tiêu chuẩn cộng đồng. Quá trình này giúp loại bỏ các công thức không đầy
        đủ, có nội dung phản cảm hoặc gây hiểu nhầm, đồng thời đảm bảo mỗi công
        thức hiển thị đều hữu ích và dễ làm theo. Nhờ vậy, bạn có thể yên tâm
        khi tham khảo các món ăn trên website mà không cần phải lo lắng về độ
        tin cậy hay chất lượng hướng dẫn.
      </>
    ),
  },
  {
    icon: <TbCircleNumber6Filled className="h-10 w-10" />,
    title: "Có thể đăng ký nhận thông báo không?",
    content: (
      <>
        Có, bạn có thể đăng ký nhận thông báo từ website để không bỏ lỡ bất kỳ
        công thức mới nào. Chỉ cần vào phần “Cài đặt thông báo” trong tài khoản
        của bạn và chọn các loại thông báo mà bạn muốn nhận, chẳng hạn như công
        thức mới, mẹo nấu ăn, hoặc các chương trình khuyến mãi đặc biệt. Bạn có
        thể nhận thông báo qua email hoặc ứng dụng di động, tùy theo sở thích.
        Điều này giúp bạn luôn cập nhật những xu hướng ẩm thực mới nhất và không
        bỏ lỡ bất kỳ món ăn ngon nào.
      </>
    ),
  },
  {
    icon: <TbCircleNumber7Filled className="h-10 w-10" />,
    title: "Có thể liên hệ hỗ trợ không?",
    content: (
      <>
        Có, nếu bạn gặp bất kỳ vấn đề gì trong quá trình sử dụng website, bạn có
        thể liên hệ với đội ngũ hỗ trợ khách hàng thông qua mục “Liên hệ” hoặc
        “Trợ giúp” thường nằm ở cuối trang. Bạn có thể gửi câu hỏi, phản hồi
        hoặc yêu cầu hỗ trợ kỹ thuật. Đội ngũ sẽ phản hồi nhanh chóng để giúp
        bạn giải quyết vấn đề một cách hiệu quả nhất. Ngoài ra, website cũng có
        phần Câu hỏi thường gặp (FAQ) để bạn có thể tìm kiếm câu trả lời cho
        những thắc mắc phổ biến.
      </>
    ),
  },
];

const QuestionsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = questionContent[activeIndex];

  return (
    <div>
      <Hero />
      <div className="mx-[110px] my-[40px] flex gap-10">
        <div className="max-w-[35%]">
          <h2 className="text-[28px] font-bold pb-2">Danh mục</h2>
          {questionContent.map((item, index) => (
            <div
              key={index}
              className={`flex gap-4 mt-4 pb-4 border-b-2 cursor-pointer leading-7 ${
                activeIndex === index
                  ? "text-[#FF9700]"
                  : "text-[rgba(0,0,0,0.6)] hover:text-[#FF9700]"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <FaPlay className="my-auto w-5 h-5" />
              <span className="ml-1 text-[18px] font-medium">{item.title}</span>
            </div>
          ))}
        </div>

        <div className="max-w-[65%] ml-[60px]">
          <div className="flex text-[#FF9700] mb-2">
            {current.icon}
            <h2 className="text-[28px] font-bold pb-2 ml-4">{current.title}</h2>
          </div>
          <div className="text-justify leading-7 ml-[56px] text-[rgba(0,0,0,0.6)]">
            {current.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
