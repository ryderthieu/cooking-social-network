import React from "react";
import logo from "../../assets/SHISHA.png";
import youtube from "../../assets/IconSocial/youtube.png";
import facebook from "../../assets/IconSocial/fb.png";
import instagram from "../../assets/IconSocial/ins.png";
import tiktok from "../../assets/IconSocial/tiktok.png";
import linkedin from "../../assets/IconSocial/linkedin.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#03051A]">
      <img src={logo} alt="logo" className="py-[50px] px-[120px]" />

      <div className="grid grid-cols-4 text-white pb-8 px-[120px]">
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

        <div className="ml-[30px] mr-[20px]">
          <h1 className="text-[20px] font-bold">Các mục nổi bật</h1>
          <a href="/">
            <p className="pt-4 hover:text-white text-[#FFFFFF] text-opacity-50">
              Trang chủ
            </p>
          </a>
          <a href="/recipes">
            <p className="pt-4 hover:text-white text-[#FFFFFF] text-opacity-50">
              Công thức
            </p>
          </a>
          <a href="/explore/posts">
            <p className="pt-4 hover:text-white text-[#FFFFFF] text-opacity-50">
              Lướt tin
            </p>
          </a>
          <a href="/about">
            <p className="pt-4 hover:text-white text-[#FFFFFF] text-opacity-50">
              Về chúng tôi
            </p>
          </a>
        </div>

        <div>
          <h1 className="text-[20px] font-bold">Blog ẩm thực</h1>
          <a href="/blog/bai-viet-moi">
            <p className="pt-4 hover:text-white text-[#FFFFFF] text-opacity-50">
              Bài viết mới nhất
            </p>
          </a>
          <a href="/blog/bai-viet-noi-bat">
            <p className="pt-4 hover:text-white text-[#FFFFFF] text-opacity-50">
              Bài viết nổi bật
            </p>
          </a>
          <a href="/blog/bai-viet-pho-bien">
            <p className="pt-4 hover:text-white text-[#FFFFFF] text-opacity-50">
              Bài viết phổ biến
            </p>
          </a>
        </div>

        <div>
          <h1 className="text-[20px] font-bold">Hỗ trợ</h1>
          <a
            href="/support/huong-dan"
            className="block pt-4 text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Hướng dẫn sử dụng
          </a>
          <a
            href="/support/dieu-kien"
            className="block pt-4 text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Điều kiện & điều khoản
          </a>
          <a
            href="/support/cau-hoi"
            className="block pt-4 text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Câu hỏi thường gặp
          </a>
          <a
            href="/support/lien-he"
            className="block pt-4 text-[#FFFFFF] text-opacity-50 hover:text-white"
          >
            Liên hệ
          </a>
        </div>
      </div>

      <div className="border-t border-[rgba(77,120,146,0.54)] text-white flex justify-between">
        <div className="flex px-[120px] py-8">
          <img
            onClick={() => window.open("https://facebook.com", "_blank")}
            className="pr-2 cursor-pointer"
            src={facebook}
            alt="facebook"
          />
          <img
            onClick={() => window.open("https://instagram.com", "_blank")}
            className="px-2 cursor-pointer"
            src={instagram}
            alt="instagram"
          />
          <img
            onClick={() => window.open("https://tiktok.com", "_blank")}
            className="px-2 cursor-pointer"
            src={tiktok}
            alt="tiktok"
          />
          <img
            onClick={() => window.open("https://youtube.com", "_blank")}
            className="px-2 cursor-pointer"
            src={youtube}
            alt="youtube"
          />
          <img
            onClick={() => window.open("https://linkedin.com", "_blank")}
            className="px-2 cursor-pointer"
            src={linkedin}
            alt="linkedin"
          />
        </div>

        <div className="font-semibold pr-[100px] text-[16px] py-8">
          © Bản quyền 2025 thuộc về OSHISHA.vn
        </div>
      </div>
    </div>
  );
};

export default Footer;
