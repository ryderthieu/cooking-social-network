import React from "react";
import nl1 from "../../../assets/Home/Nglieu1.png";
import nl2 from "../../../assets/Home/Nglieu2.png";
import nl3 from "../../../assets/Home/Nglieu3.png";
import nl4 from "../../../assets/Home/Nglieu4.png";
import BunQuay from "../../../assets/Home/Bunquay.png";
import { Link } from "react-router-dom";

const Explore = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-6 bg-[#F8F5F2] rounded-2xl">
      <div className="pl-[70px]">
        <h1 className="font-birthstone text-[40px]">Khám phá</h1>
        <p className="font-bold text-[22px]">Công thức bún quậy</p>

        <div className="pt-[40px] pl-4">
          <h3 className="text-[18px] font-medium">Nguyên liệu</h3>
          <div className="flex gap-4 mt-[15px] ml-4">
            <div>
              <img
                className="border-[#D9D9D9] border-4 rounded-full"
                src={nl1}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">
                Bún tươi
              </p>
            </div>

            <div>
              <img
                className="border-[#262626] rounded-full border-4"
                src={nl2}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">Tôm</p>
            </div>

            <div>
              <img
                className="border-[#9DBD5A] rounded-full border-4"
                src={nl3}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">
                Hành lá
              </p>
            </div>

            <div>
              <img
                className="border-[#FFD5C3] rounded-full border-4"
                src={nl4}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">Mực</p>
            </div>
          </div>
        </div>
        <div className="mt-[30px] pl-4">
          <h3 className="text-[18px] font-medium">Cách làm</h3>
          <p className="mt-[10px] text-justify text-[#7F7F7F] ml-4">
            Bún quậy Phú Quốc là một trong những món ăn độc đáo và đầy tinh tế,
            đại diện tiêu biểu cho nền ẩm thực phong phú của đảo ngọc. Món ăn
            này có xuất xứ từ bún tôm của Bình Định, theo chân những người ngư
            dân vào Phú Quốc trong hành trình mưu sinh. Qua thời gian, dưới bàn
            tay khéo léo của người dân địa phương, bún tôm được biến tấu để phù
            hợp với sản vật sẵn có trên đảo và dần hình thành nên món bún quậy –
            vừa dân dã, vừa đặc sắc, mang đậm hồn biển cả.
          </p>
        </div>

        <div className="mt-[40px] flex gap-10 mb-4">
          <Link to="/login">
            <button className="rounded-3xl bg-[#592500] text-white font-semibold py-3 px-10 hover:bg-[#7A3D00] transition duration-300 ease-in-out text-[14px]">
              Đăng nhập
            </button>
          </Link>
          <Link to="/">
            <button className="rounded-3xl border-[#592500] border-2 text-[#592500] font-semibold py-3 px-10 hover:bg-white transition duration-300 ease-in-out text-[14px]">
              Xem thêm
            </button>
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <img
          className=" p-2 drop-shadow-[0_40px_40px_#EBDDC9] h-[500px] rounded-3xl"
          src={BunQuay}
          alt=""
        />
      </div>
    </div>
  );
};

export default Explore;
