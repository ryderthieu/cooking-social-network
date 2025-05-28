import React from "react";
import logo from "../../assets/SHISHA.png";
import youtube from "../../assets/IconSocial/youtube.png";
import facebook from "../../assets/IconSocial/fb.png";
import instagram from "../../assets/IconSocial/ins.png";
import tiktok from "../../assets/IconSocial/tiktok.png";
import linkedin from "../../assets/IconSocial/linkedin.png";

const Footer = () => {
  return (
    <div className="bg-[#03051A]">
      <img src={logo} alt="logo" className="py-[50px] px-[110px]" />

      <div className="grid grid-cols-4 gap-6 text-white pb-8 px-[110px]">
        <div>
          <div>
            <h1 className="font-bold text-[20px]">ĐỊA CHỈ</h1>
            <p className="text-[#FFFFFF] text-opacity-50">
              Khu phố 6, Linh Trung, Thủ Đức, HCM
            </p>
          </div>
          <div>
            <h1 className="font-bold text-[20px] pt-8">HOTLINE</h1>
            <p className="text-[#FFFFFF] text-opacity-50">0 8386 8386</p>
          </div>
          <div>
            <h1 className="font-bold text-[20px] pt-8">EMAIL</h1>
            <p className="text-[#FFFFFF] text-opacity-50">chat@oshisha.com</p>
          </div>
        </div>

        <div>
          <h1 className="text-[20px] font-bold">Khám phá công thức</h1>
          <p className="pt-4 font-bold text-[#FFFFFF] text-opacity-50">
            Món mặn
          </p>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Món chay
          </p>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Món Âu
          </p>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Thức uống
          </p>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Ăn vặt
          </p>
        </div>

        <div>
          <h1 className="text-[20px] font-bold">Blog ẩm thực</h1>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Hướng dẫn sử dụng
          </p>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Điều kiện & điều khoản
          </p>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Câu hỏi thường gặp
          </p>
          <p className="pt-4 font-semibold text-[#FFFFFF] text-opacity-50">
            Liên hệ
          </p>
        </div>

        <div>
          <h1 className="text-[20px] font-bold">Hỗ trợ</h1>
          <a
            href="/support/huong-dan"
            className="block pt-4 font-semibold text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Hướng dẫn sử dụng
          </a>
          <a
            href="/support/dieu-kien"
            className="block pt-4 font-semibold text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Điều kiện & điều khoản
          </a>
          <a
            href="/support/cau-hoi"
            className="block pt-4 font-semibold text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Câu hỏi thường gặp
          </a>
          <a
            href="/support/lien-he"
            className="block pt-4 font-semibold text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Liên hệ
          </a>
        </div>
      </div>

      <div className="border-t border-[rgba(77,120,146,0.54)] text-white flex justify-between">
        <div className="flex px-[100px] py-8">
          <img className="pr-2" src={facebook} alt="" />
          <img className="px-2" src={instagram} alt="" />
          <img className="px-2" src={tiktok} alt="" />
          <img className="px-2" src={youtube} alt="" />
          <img className="px-2" src={linkedin} alt="" />
        </div>

        <div className="font-semibold pr-[100px] text-[16px] py-8">
          © Bản quyền 2025 thuộc về OSHISHA.vn
        </div>
      </div>
    </div>
  );
};

export default Footer;
