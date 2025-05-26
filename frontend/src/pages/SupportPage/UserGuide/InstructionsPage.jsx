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
  TbCircleNumber8Filled,
} from "react-icons/tb";

const instructionContent = [
  {
    icon: <TbCircleNumber1Filled className="h-10 w-10" />,
    title: "Trang chủ",
    content: (
      <>
        Trang chủ là điểm tiếp cận đầu tiên của người dùng với website, đóng vai
        trò như một bản tóm tắt và giới thiệu toàn bộ nội dung chính. Thiết kế
        trang chủ phải đảm bảo sinh động, trực quan, truyền cảm hứng cho người
        dùng bắt đầu hành trình nấu ăn. Một số thành phần quan trọng trên trang
        chủ gồm:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Banner giới thiệu: hiển thị các chiến dịch nổi bật (ví dụ: “Tuần lễ
            ẩm thực Nhật Bản”, “Món ngon cho người ăn chay”), hình ảnh hấp dẫn
            thu hút người xem.
          </li>
          <li>
            Slider công thức nổi bật: tự động hiển thị các công thức được nhiều
            người xem hoặc đánh giá cao.
          </li>
          <li>
            Công thức mới nhất: hiển thị các công thức vừa được đăng bởi người
            dùng hoặc biên tập viên.
          </li>
          <li>
            Gợi ý theo sở thích: dành cho người dùng đã đăng nhập, hiển thị công
            thức theo lịch sử truy cập hoặc công thức cùng nguyên liệu.
          </li>
          <li>
            Video hướng dẫn: đề xuất các video nấu ăn phổ biến trong tuần.
          </li>
          <li>
            Blog hoặc bài viết nổi bật: hiển thị các bài blog hay mẹo nhà bếp
            đang được nhiều người đọc.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber2Filled className="h-10 w-10" />,
    title: "Danh mục công thức",
    content: (
      <>
        Chức năng này giúp hệ thống tổ chức và phân loại hàng trăm đến hàng ngàn
        công thức một cách khoa học và dễ truy cập. Danh mục có thể được phân
        theo nhiều chiều:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Theo loại món ăn: món chính, món phụ, món ăn vặt, món chay, món ăn
            cho bé, món tráng miệng,...
          </li>
          <li>
            Theo nguyên liệu chính: thịt gà, thịt heo, cá, rau củ, đậu hủ,...
          </li>
          <li>
            Theo vùng miền/quốc gia: Bắc – Trung – Nam, Nhật Bản, Hàn Quốc,
            Trung Quốc, Châu Âu,...
          </li>
          <li>Theo dịp lễ: Tết, Giáng sinh, Trung thu, Sinh nhật,...</li>
          <li>
            Theo chế độ ăn uống: low-carb, keto, eat-clean, không gluten,...
          </li>
          <li>Theo mức độ: dễ, trung bình, khó.</li>
          <li>Theo thời gian nấu: 15 phút, 30 phút, 1 tiếng,...</li>
        </ul>
        Người dùng có thể click vào từng danh mục để xem toàn bộ công thức liên
        quan. Giao diện cần rõ ràng, có hình ảnh đại diện đẹp mắt, mô tả ngắn và
        số lượng công thức hiển thị trong mỗi mục.
      </>
    ),
  },
  {
    icon: <TbCircleNumber3Filled className="h-10 w-10" />,
    title: "Chi tiết công thức ",
    content: (
      <>
        Trang chi tiết là trung tâm chính nơi người dùng tiếp cận nội dung chính
        của công thức. Mỗi trang bao gồm:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>Tên công thức và ảnh đại diện chất lượng cao.</li>
          <li>
            Giới thiệu ngắn: món ăn dành cho ai, xuất xứ món ăn, cảm hứng từ
            đâu.
          </li>
          <li>
            Thông tin tổng quát: Thời gian chuẩn bị, thời gian nấu, khẩu phần
            ăn, độ khó, lượt xem, lượt thích
          </li>
          <li>
            Danh sách nguyên liệu: được trình bày theo thứ tự, có thể cho phép
            điều chỉnh theo số người ăn (tự động thay đổi lượng nguyên liệu).
          </li>
          <li>
            Các bước thực hiện: được đánh số thứ tự, kèm hình ảnh minh hoạ hoặc
            video clip (nếu có).
          </li>
          <li>Lưu ý, mẹo nấu ăn hoặc biến tấu khác.</li>
          <li>
            Thông tin dinh dưỡng: calo, protein, chất béo, vitamin, phù hợp với
            người ăn kiêng hay không.
          </li>
          <li>
            Chức năng chia sẻ: cho phép chia sẻ công thức qua Facebook, Zalo,
            Instagram, hoặc copy link.
          </li>
          <li>Chức năng đánh giá, bình luận</li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber4Filled className="h-10 w-10" />,
    title: "Tìm kiếm và lọc",
    content: (
      <>
        Đây là chức năng quan trọng, giúp người dùng tiết kiệm thời gian trong
        việc tìm đúng công thức mình muốn. Website cần:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Tìm kiếm theo từ khoá: hỗ trợ gợi ý khi người dùng nhập từ khoá
            (auto-suggest).
          </li>
          <li>
            Tìm kiếm theo nguyên liệu: ví dụ người dùng nhập “trứng + hành +
            tỏi”, hệ thống sẽ trả về các công thức phù hợp.
          </li>
          <li>
            Bộ lọc nâng cao: Loại món ăn, nguyên liệu chính, độ khó, chế độ ăn,
            quốc gia, thời gian nấu
          </li>
          <li>
            Tìm kiếm bằng giọng nói (nếu triển khai mobile): người dùng có thể
            đọc tên món và hệ thống nhận diện.
          </li>
          <li>
            Giao diện tìm kiếm thân thiện, kết quả hiển thị kèm ảnh, lượt xem,
            thời gian nấu,...
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber5Filled className="h-10 w-10" />,
    title: "Tài khoản người dùng",
    content: (
      <>
        Người dùng có thể đăng ký và đăng nhập bằng email hoặc mạng xã hội
        (Google, Facebook). Các tính năng chính của tài khoản gồm:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Thông tin cá nhân: ảnh đại diện, tên hiển thị, bio ngắn (ví dụ: “Mẹ
            bỉm yêu nấu ăn”).
          </li>
          <li>Danh sách yêu thích: lưu lại các công thức muốn nấu sau.</li>
          <li>Lịch sử nấu ăn: các công thức đã xem, đã nấu, đã đánh giá.</li>
          <li>
            Theo dõi người dùng khác: tạo cộng đồng mini, theo dõi công thức của
            người khác.
          </li>
          <li>
            Quản lý công thức đã đăng: chỉnh sửa, cập nhật, xoá công thức của
            chính mình.
          </li>
          <li>
            Thông báo: khi có bình luận mới, người khác thích công thức của
            mình, admin duyệt bài,...
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <TbCircleNumber6Filled className="h-10 w-10" />,
    title: "Đăng và chia sẻ công thức",
    content: (
      <>
        Chức năng này khuyến khích người dùng trở thành người sáng tạo nội dung.
        Biểu mẫu chia sẻ công thức có thể bao gồm:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>Tên món</li>
          <li>Danh mục</li>
          <li>
            Nguyên liệu (có thể chia nhóm: phần thịt, phần gia vị, phần topping)
          </li>
          <li>Các bước nấu</li>
          <li>Mẹo riêng</li>
          <li>Ảnh món ăn</li>
          <li>Video (tùy chọn)</li>
        </ul>
        Sau khi gửi, công thức sẽ được gửi vào hệ thống chờ xét duyệt. Người
        dùng có thể xem trạng thái (đang xét duyệt / đã xuất bản / bị từ chối
        kèm lý do).
      </>
    ),
  },
  {
    icon: <TbCircleNumber7Filled className="h-10 w-10" />,
    title: "Đánh giá và bình luận",
    content: (
      <>
        Cộng đồng là điểm mạnh của website. Sau khi thử nấu, người dùng có thể:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>Đánh giá món ăn từ 1–5 sao.</li>
          <li>Viết bình luận cảm nhận, góp ý, mẹo cải tiến món ăn.</li>
          <li>Gắn ảnh món ăn đã nấu để chia sẻ với người khác.</li>
          <li>Trả lời bình luận của người khác.</li>
          <li>
            Báo cáo bình luận sai quy định (spam, không liên quan, ngôn ngữ phản
            cảm).
          </li>
        </ul>
        Mỗi công thức sẽ hiển thị số sao trung bình và bình luận nổi bật nhất.
      </>
    ),
  },
  {
    icon: <TbCircleNumber8Filled className="h-10 w-10" />,
    title: "Video hướng dẫn và blog",
    content: (
      <>
        Không chỉ dừng lại ở công thức chữ viết, website sẽ có khu vực riêng
        cho:
        <ul className="list-disc ml-10 text-[rgba(0,0,0,0.6)] my-2">
          <li>
            Video học nấu ăn: series “Học nấu ăn cho người mới”, “30 phút nấu
            xong”, “Món Nhật đơn giản mỗi ngày”.
          </li>
          <li>
            Blog: bài viết về nguồn gốc món ăn, xu hướng ẩm thực, kiến thức về
            nguyên liệu, mẹo vặt, trải nghiệm du lịch ẩm thực,...
          </li>
          <li>
            Phân loại blog/video theo chủ đề: món ăn, dinh dưỡng, lifestyle,...
          </li>
          <li>Giao diện hiển thị đẹp, hỗ trợ bình luận và chia sẻ.</li>
        </ul>
      </>
    ),
  },
];

const InstructionsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = instructionContent[activeIndex];

  return (
    <div>
      <Hero />
      <div className="mx-[110px] my-[40px] flex gap-10">
        <div className="max-w-[35%]">
          <h2 className="text-[28px] font-bold pb-2">Danh mục</h2>
          {instructionContent.map((item, index) => (
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

export default InstructionsPage;
