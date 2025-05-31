import React from "react";
import BunQuay from "../../../assets/Home/Bunquay.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; 
import { Nglieu1, Nglieu2, Nglieu3, Nglieu4 } from "@/assets/Home";

const Explore = () => {
  const { user } = useAuth();
const isLoggedIn = !!user;
  return (
    <div className="flex flex-row gap-10 py-2 px-4 bg-[#F8F5F2] rounded-2xl">
      <div className="ml-6 my-4 max-w-[680px]">
        <h1 className="font-birthstone text-[48px]">Khám phá</h1>
        <p className="font-bold text-[36px]">Công thức bún quậy</p>

        <div className="py-5 ml-4 ">
          <h3 className="text-[20px] font-medium mb-4 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-[#592500] rounded-sm mr-2"></span>
            Nguyên liệu
          </h3>
          <div className="flex gap-4 mt-[15px]">
            <div className="size-20 rounded-full">
              <img
                className="border-[#D9D9D9] border-4 rounded-full"
                src={Nglieu1}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">
                Bún tươi
              </p>
            </div>

            <div className="size-20 rounded-full">
              <img
                className="border-[#262626] rounded-full border-4"
                src={Nglieu2}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">Tôm</p>
            </div>

            <div className="size-20 rounded-full">
              <img
                className="border-[#9DBD5A] rounded-full border-4"
                src={Nglieu3}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">
                Hành lá
              </p>
            </div>

            <div className="size-20 rounded-full">
              <img
                className="border-[#FFD5C3] rounded-full border-4"
                src={Nglieu4}
                alt=""
              />
              <p className="text-center mt-2 text-[15px] font-medium">Mực</p>
            </div>
          </div>
        </div>
        <div className="mt-[30px] pl-4">
          <h3 className="text-[20px] font-medium mb-4 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-[#592500] rounded-sm mr-2"></span>
            Cách làm
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-[#592500] text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 flex-shrink-0">
                1
              </div>
              <p className="text-[#7F7F7F] text-sm">
                <span className="font-medium text-[#592500]">
                  Chuẩn bị nguyên liệu:
                </span>{" "}
                Bún tươi, tôm tươi, mực tươi và hành lá thái nhỏ. Tôm và mực rửa
                sạch với nước muối loãng.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-[#592500] text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 flex-shrink-0">
                2
              </div>
              <p className="text-[#7F7F7F] text-sm">
                <span className="font-medium text-[#592500]">
                  Nấu nước dùng:
                </span>{" "}
                Xào tỏi với phần đầu tôm, sau đó đổ nước vào đun sôi và nêm nếm
                gia vị để tạo nước dùng đậm đà.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#592500] text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 flex-shrink-0">
                3
              </div>
              <p className="text-[#7F7F7F] text-sm">
                <span className="font-medium text-[#592500]">
                  Chế biến hải sản:
                </span>{" "}
                Tôm và mực chần qua trong nước dùng đang sôi đến khi chín.
              </p>
            </div>

            <div className="flex items-start gap-4 mt-2">
              <div className="bg-[#592500] text-white rounded-full w-6 h-6 flex items-center justify-center mt-1 flex-shrink-0">
                4
              </div>
              <p className="text-[#7F7F7F] text-sm">
                <span className="font-medium text-[#592500]">Hoàn thiện:</span>{" "}
                Cho bún vào tô, chan nước dùng, thêm tôm, mực và rắc hành lá lên
                trên. Dùng nóng kèm rau sống và nước mắm chua ngọt.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-10 mb-4">
          {!isLoggedIn && (
            <Link to="/login">
              <button className="rounded-3xl bg-[#592500] text-white font-semibold py-3 px-10 hover:bg-[#7A3D00] transition duration-300 ease-in-out text-[14px]">
                Đăng nhập
              </button>
            </Link>
          )}
          <Link to="/">
            <button 
              className={`rounded-3xl font-semibold py-3 text-[14px] transition duration-300 ease-in-out ${
                isLoggedIn 
                  ? "bg-[#592500] text-white px-20 hover:bg-[#7A3D00]" 
                  : "border-[#592500] border-2 px-10 text-[#592500] hover:bg-white"
              }`}
            >
              Xem thêm
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="relative p-1">
          <div className="absolute -inset-0 bg-amber-600/30 blur-xl z-0"></div>
          <img
            className="p-2 h-[500px] relative z-10 rounded-3xl"
            src={BunQuay}
            alt="Món bún quậy Phú Quốc"
          />
          <p className="mt-4 text-xs italic text-[#7F7F7F] max-w-[450px]">
            *Món ăn này có xuất xứ từ bún tôm của Bình Định, theo chân những
            người ngư dân vào Phú Quốc và dần hình thành nên món bún quậy đặc
            sắc, mang đậm hồn biển cả.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Explore;