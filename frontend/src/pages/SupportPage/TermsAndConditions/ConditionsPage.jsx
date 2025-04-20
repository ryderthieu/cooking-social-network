import React, { useState } from "react";
import Hero from "../../../components/sections/Support/Hero";
import { FaPlay } from "react-icons/fa6";
import {
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  TbCircleNumber4Filled,
} from "react-icons/tb";

const conditionItems = [
  "Đối tượng sử dụng",
  "Mục đích sử dụng",
  "Yêu cầu về truy cập và thiết bị",
  "Bảo mật thông tin cá nhân",
];

const conditionContent = [
  {
    icon: <TbCircleNumber1Filled className="h-10 w-10" />,
    title: "Đối tượng sử dụng",
    content: (
      <>
        Website nấu ăn này được xây dựng với mục tiêu phục vụ mọi đối tượng yêu
        thích việc nấu ăn, từ những người mới bắt đầu học nấu ăn cho đến những
        đầu bếp gia đình, người nội trợ, sinh viên, hay thậm chí là các đầu bếp
        chuyên nghiệp muốn tìm kiếm cảm hứng sáng tạo mới.
        <br />
        <br />
        Tuy nhiên, để sử dụng đầy đủ các tính năng tương tác trên website, người
        dùng phải từ 13 tuổi trở lên. Trường hợp người dùng dưới 13 tuổi, bạn
        chỉ được phép sử dụng website khi có sự giám sát, đồng ý và hướng dẫn
        của cha mẹ hoặc người giám hộ hợp pháp. Việc này nhằm đảm bảo an toàn
        khi truy cập và tránh việc tiếp cận nội dung không phù hợp với lứa tuổi.
        <br />
        <br />
        Chúng tôi đặc biệt khuyến khích các bậc phụ huynh cùng sử dụng website
        này như một cách để gắn kết gia đình thông qua việc nấu ăn tại nhà, đồng
        thời hướng dẫn trẻ em thói quen ăn uống lành mạnh và kỹ năng sinh hoạt
        cơ bản.
      </>
    ),
  },
  {
    icon: <TbCircleNumber2Filled className="h-10 w-10" />,
    title: "Mục đích sử dụng",
    content: (
      <>
        Website này được tạo ra với mục đích học hỏi, chia sẻ và lan tỏa tình
        yêu với ẩm thực. Vì vậy, bạn chỉ được phép sử dụng website cho các mục
        đích cá nhân, phi lợi nhuận. Các mục đích sử dụng bao gồm nhưng không
        giới hạn:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Tra cứu công thức nấu ăn được chia sẻ từ đội ngũ biên tập viên hoặc
            người dùng khác.
          </li>
          <li>
            Chia sẻ kinh nghiệm nấu nướng, mẹo vặt trong bếp, cách bảo quản thực
            phẩm.
          </li>
          <li>
            Đăng tải nhận xét, đánh giá, chia sẻ cảm nghĩ sau khi thực hiện một
            món ăn.
          </li>
          <li>
            Học hỏi kiến thức ẩm thực, tham gia thảo luận cùng cộng đồng những
            người yêu bếp núc.
          </li>
        </ul>
        Tuyệt đối cấm các hành vi sau:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Sử dụng nội dung website cho mục đích buôn bán, quảng cáo trá hình,
            tiếp thị sản phẩm mà không có sự đồng ý bằng văn bản từ chúng tôi.
          </li>
          <li>
            Phát tán nội dung gây hại, phản cảm, vi phạm pháp luật hoặc đạo đức
            xã hội.
          </li>
          <li>
            Gửi thư rác (spam), lừa đảo, tấn công hệ thống hoặc làm gián đoạn
            hoạt động của website.
          </li>
        </ul>
        Chúng tôi có quyền tạm khóa hoặc xóa vĩnh viễn tài khoản nếu phát hiện
        người dùng có hành vi sai mục đích nêu trên.
      </>
    ),
  },
  {
    icon: <TbCircleNumber3Filled className="h-10 w-10" />,
    title: "Yêu cầu về truy cập và thiết bị",
    content: (
      <>
        Để sử dụng website một cách mượt mà và đầy đủ chức năng, người dùng cần
        chuẩn bị các điều kiện kỹ thuật tối thiểu như sau:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Thiết bị truy cập: điện thoại thông minh, máy tính bảng, laptop hoặc
            máy tính để bàn.
          </li>
          <li>
            Trình duyệt hiện đại: Chrome, Firefox, Safari, Edge (phiên bản mới
            nhất được khuyến khích).
          </li>
          <li>
            Kết nối internet ổn định, tốc độ cao để tải nhanh hình ảnh, video
            hướng dẫn nấu ăn.
          </li>
        </ul>
        Một số tính năng nâng cao như: đăng công thức, lưu món ăn yêu thích,
        theo dõi người dùng khác, tham gia bình luận,… yêu cầu bạn phải đăng ký
        và đăng nhập tài khoản cá nhân. Việc này giúp đảm bảo trải nghiệm cá
        nhân hóa và bảo vệ an toàn thông tin của bạn.
      </>
    ),
  },
  {
    icon: <TbCircleNumber4Filled className="h-10 w-10" />,
    title: "Bảo mật thông tin cá nhân",
    content: (
      <>
        Chúng tôi luôn coi trọng quyền riêng tư và sự an toàn của người dùng.
        Khi đăng ký tài khoản, bạn sẽ cung cấp một số thông tin như: tên, email,
        ảnh đại diện,… Chúng tôi cam kết:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Không chia sẻ thông tin cá nhân của bạn cho bên thứ ba nếu không có
            sự đồng ý của bạn.
          </li>
          <li>
            Sử dụng thông tin với mục đích cải thiện trải nghiệm người dùng, hỗ
            trợ kỹ thuật và nâng cao chất lượng dịch vụ.
          </li>
        </ul>
        Người dùng có trách nhiệm:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>Giữ bảo mật thông tin đăng nhập (tên đăng nhập và mật khẩu).</li>
          <li>Không chia sẻ tài khoản cho người khác sử dụng.</li>
          <li>
            Thông báo ngay cho chúng tôi nếu phát hiện có dấu hiệu bị xâm nhập
            tài khoản trái phép hoặc nghi ngờ lộ thông tin.
          </li>
        </ul>
      </>
    ),
  },
];

const ConditionsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = conditionContent[activeIndex];

  return (
    <div>
      <Hero />
      <div className="mx-[110px] my-[40px] flex gap-10">
        <div className="max-w-[35%]">
          <h2 className="text-[28px] font-bold pb-2">Danh mục</h2>
          {conditionItems.map((item, index) => (
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
              <span className="ml-1 text-[18px] font-medium">{item}</span>
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

export default ConditionsPage;
