import React, { useState } from "react";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  TbCircleNumber4Filled,
  TbCircleNumber5Filled,
  TbCircleNumber6Filled,
  TbCircleNumber7Filled,
} from "react-icons/tb";
import { FaPlay } from "react-icons/fa6";
import Hero from "../../../components/sections/Support/Hero";

const termContent = [
  {
    icon: <TbCircleNumber1Filled className="h-10 w-10" />,
    title: "Bản quyền và sở hữu nội dung",
    content: (
      <>
        Tất cả nội dung hiển thị trên website – bao gồm hình ảnh món ăn, video
        hướng dẫn, bài viết chuyên đề, công thức nấu ăn, thiết kế giao diện, mã
        nguồn – đều thuộc quyền sở hữu trí tuệ của chúng tôi hoặc đã được cấp
        phép sử dụng hợp pháp từ bên thứ ba.
        <br />
        Người dùng không được:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Tự ý sao chép, chỉnh sửa, phát tán, tái xuất bản, in ấn hoặc sử dụng
            lại nội dung cho mục đích thương mại mà không có sự đồng ý bằng văn
            bản từ ban quản trị website.
          </li>
          <li>
            Sử dụng nội dung để xây dựng nền tảng, website, ứng dụng có tính
            chất cạnh tranh hoặc gây nhầm lẫn với thương hiệu của chúng tôi.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber2Filled className="h-10 w-10" />,
    title: "Nội dung do người dùng đóng góp",
    content: (
      <>
        Chúng tôi khuyến khích người dùng chia sẻ công thức, hình ảnh món ăn tự
        thực hiện, hoặc để lại cảm nhận, góp ý. Khi bạn đóng góp nội dung, bạn
        đã đồng ý rằng:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Nội dung do bạn tạo ra không vi phạm bản quyền của cá nhân hoặc tổ
            chức khác.
          </li>
          <li>
            Bạn đồng ý cấp quyền không độc quyền, miễn phí bản quyền cho website
            để sử dụng, hiển thị, chỉnh sửa, hoặc quảng bá nội dung (có ghi
            nguồn bạn nếu cần).
          </li>
          <li>
            Chúng tôi có quyền từ chối, chỉnh sửa, làm mờ hoặc xóa các nội dung
            nếu phát hiện yếu tố vi phạm thuần phong mỹ tục, pháp luật, hoặc
            không phù hợp với định hướng nội dung.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber3Filled className="h-10 w-10" />,
    title: "Quy tắc ứng xử trong cộng đồng",
    content: (
      <>
        Chúng tôi mong muốn xây dựng một cộng đồng văn minh, tôn trọng, tích cực
        và truyền cảm hứng. Vì vậy, tất cả người dùng cần tuân thủ quy tắc ứng
        xử sau:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Giao tiếp lịch sự, dùng ngôn từ phù hợp, không lăng mạ, xúc phạm
            người khác.
          </li>
          <li>
            Không gây chia rẽ, kích động tranh luận tiêu cực, đả kích cá nhân.
          </li>
          <li>
            Không đăng thông tin sai lệch, gây hiểu nhầm hoặc ảnh hưởng đến danh
            dự người khác.
          </li>
          <li>Không spam, quảng cáo sản phẩm/dịch vụ một cách vô tội vạ.</li>
          <li>Tôn trọng sự đa dạng về khẩu vị, văn hóa ẩm thực, vùng miền.</li>
        </ul>
        Các vi phạm sẽ bị xử lý bằng cách ẩn bình luận, cảnh cáo, tạm khóa hoặc
        xóa vĩnh viễn tài khoản, tùy theo mức độ nghiêm trọng.
      </>
    ),
  },
  {
    icon: <TbCircleNumber4Filled className="h-10 w-10" />,
    title: "Giới hạn trách nhiệm",
    content: (
      <>
        Dù chúng tôi luôn nỗ lực cập nhật thông tin chính xác và hữu ích, nhưng
        bạn cần hiểu rằng:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Các giá trị dinh dưỡng, thời gian nấu, khẩu vị chỉ mang tính tham
            khảo chung. Tùy vào nguyên liệu, công cụ và tay nghề mà kết quả có
            thể khác nhau.
          </li>
          <li>
            Người dùng có trách nhiệm tự kiểm tra thành phần nguyên liệu nếu có
            dị ứng, bệnh lý, hoặc yêu cầu ăn kiêng đặc biệt.
          </li>
          <li>
            Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh
            từ việc bạn làm sai công thức, nấu không thành công, trục trặc thiết
            bị hoặc hiểu sai hướng dẫn.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber5Filled className="h-10 w-10" />,
    title: "Tạm ngưng hoặc chấm dứt dịch vụ",
    content: (
      <>
        Ban quản trị có toàn quyền:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Tạm dừng website để bảo trì hệ thống, nâng cấp tính năng hoặc xử lý
            sự cố kỹ thuật.
          </li>
          <li>
            Khóa hoặc xóa tài khoản nếu phát hiện hành vi vi phạm điều khoản,
            gây tổn hại cho website hoặc người dùng khác.
          </li>
        </ul>
        Chúng tôi sẽ thông báo trước nếu có thay đổi lớn về dịch vụ, trừ trường
        hợp khẩn cấp.
      </>
    ),
  },
  {
    icon: <TbCircleNumber6Filled className="h-10 w-10" />,
    title: "Thay đổi điều khoản sử dụng",
    content: (
      <>
        Chúng tôi có thể cập nhật các điều khoản sử dụng bất cứ lúc nào để phù
        hợp với luật pháp, công nghệ và nhu cầu vận hành. Khi có thay đổi:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>Thời điểm cập nhật sẽ được ghi rõ ở đầu trang.</li>
          <li>
            Việc tiếp tục sử dụng website đồng nghĩa với việc bạn đã đọc, hiểu
            và đồng ý với các điều khoản mới.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber7Filled className="h-10 w-10" />,
    title: "Cam kết giữa người dùng và đội ngũ phát triển",
    content: (
      <>
        <h4 className="font-medium text-[22px] my-4 text-black">
          Cam kết từ người dùng
        </h4>
        Khi sử dụng website này, bạn đồng ý:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Tôn trọng nội dung, cộng đồng, và các nguyên tắc đã đề ra trong Điều
            khoản sử dụng.
          </li>
          <li>
            Không sử dụng thông tin từ website để sao chép, phát tán, hoặc thực
            hiện bất kỳ hành vi nào có thể gây tổn hại đến uy tín, thương hiệu
            hoặc nội dung của website.
          </li>
          <li>
            Hợp tác trong quá trình sử dụng, bao gồm việc báo lỗi, phản hồi tính
            năng, hoặc góp ý xây dựng để cải thiện chất lượng dịch vụ.
          </li>
          <li>
            Tự chịu trách nhiệm với mọi nội dung bạn đăng tải (bao gồm hình ảnh,
            công thức, bình luận…), đảm bảo không vi phạm đạo đức, pháp luật
            hoặc quyền lợi của bất kỳ bên thứ ba nào.
          </li>
        </ul>
        <h4 className="font-medium text-[22px] my-4 text-black">
          Cam kết từ ban quản trị website
        </h4>
        Chúng tôi cam kết:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Đảm bảo trải nghiệm người dùng thân thiện: Thiết kế website đơn
            giản, dễ sử dụng, tương thích trên nhiều thiết bị và có khả năng mở
            rộng.
          </li>
          <li>
            Liên tục cập nhật và cải tiến nội dung: Đảm bảo các công thức luôn
            rõ ràng, dễ hiểu và có giá trị ứng dụng thực tế.
          </li>
          <li>
            Tôn trọng quyền riêng tư: Bảo vệ thông tin cá nhân của người dùng,
            không chia sẻ dữ liệu trái phép dưới bất kỳ hình thức nào.
          </li>
          <li>
            Lắng nghe và hỗ trợ: Phản hồi nhanh chóng các yêu cầu hỗ trợ, tiếp
            thu các góp ý và sẵn sàng điều chỉnh tính năng nếu phù hợp với định
            hướng phát triển chung.
          </li>
        </ul>
        <h4 className="font-medium text-[22px] my-4 text-black">
          Mục tiêu lâu dài
        </h4>
        Chúng tôi mong muốn xây dựng website này trở thành:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Một cộng đồng nấu ăn tích cực, truyền cảm hứng: Nơi mọi người có thể
            học hỏi, sáng tạo và chia sẻ niềm đam mê nấu ăn, dù là người mới bắt
            đầu hay đầu bếp chuyên nghiệp.
          </li>
          <li>
            Một thư viện ẩm thực sống: Tập hợp hàng ngàn công thức phong phú từ
            khắp nơi, dễ tìm kiếm, có minh họa cụ thể, có thể lưu trữ và cá nhân
            hóa theo khẩu vị của từng người.
          </li>
          <li>
            Một cầu nối văn hóa ẩm thực: Không chỉ chia sẻ món ăn Việt Nam mà
            còn kết nối với các món ăn quốc tế, qua đó góp phần lan tỏa giá trị
            văn hóa qua ẩm thực.
          </li>
        </ul>
      </>
    ),
  },
];
const TermsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = termContent[activeIndex];

  return (
    <div>
      <Hero />
      <div className="mx-[110px] my-[40px] flex gap-10">
        <div className="max-w-[35%]">
          <h2 className="text-[28px] font-bold pb-2">Danh mục</h2>
          {termContent.map((item, index) => (
            <div
              key={index}
              className={`flex gap-4 mt-4 pb-4 border-b-2 cursor-pointer ${
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

export default TermsPage;
