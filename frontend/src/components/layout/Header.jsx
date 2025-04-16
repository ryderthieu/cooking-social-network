import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { FaAngleDown, FaChevronDown } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between px-[110px] py-[30px] fixed bg-white z-50 right-0 left-0">
      <img src={logo} alt="" />

      <div className="flex items-center gap-12 ml-[100px]" ref={navRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex cursor-pointer relative "
        >
          <p className="font-semibold text-[22px] text-[#211E2E]">
            Khám phá công thức
          </p>
          <FaAngleDown className="my-auto ml-2" />
          {isOpen && (
            <div className="fixed left-0 top-[100px] z-20 flex bg-white shadow-xl w-[100%] h-[390px] rounded-lg overflow-hidden">
              <div className="w-[20%] p-4  ml-[110px]">
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  <li className="hover:text-orange-500 cursor-pointer text-[18px] pb-4">
                    Món mặn
                  </li>
                  <li className="hover:text-orange-500 cursor-pointer text-[18px] pb-4">
                    Món chay
                  </li>
                  <li className="hover:text-orange-500 cursor-pointer text-[18px] pb-4">
                    Món Âu
                  </li>
                  <li className="hover:text-orange-500 cursor-pointer text-[18px] pb-4">
                    Thức uống
                  </li>
                  <li className="hover:text-orange-500 cursor-pointer text-[18px] pb-4">
                    Ăn vặt
                  </li>
                </ul>
              </div>

              <div className="w-[80%] grid grid-cols-3 gap-6 pr-[110px] p-4 bg-gradient-to-br from-[#fef2f2] to-[#fff7ed]">
                {Array(3)
                  .fill()
                  .map((_, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-pink-100 h-[280px] rounded-2xl mb-4"></div>
                      <p className="text-[18px] font-medium">
                        Sườn xào chua ngọt
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-[22px] text-[#211E2E]">Lướt tin</p>
        </div>
        <div>
          <p className="font-semibold text-[22px] text-[#211E2E]">Tìm kiếm</p>
        </div>
        <div>
          <p className="font-semibold text-[22px] text-[#211E2E]">Về SHISHA</p>
        </div>
        <div className="flex">
          <p className="font-semibold text-[22px] text-[#211E2E]">Hỗ trợ</p>
          <FaAngleDown className="my-auto ml-2" />
        </div>
      </div>

      <div>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="border-2 rounded-full p-2 border-[#04043F]">
              <BiSolidEdit className="w-6 h-6 text-[#04043F]" />
            </div>
            <div className="border-2 rounded-full p-2 border-[#04043F]">
              <FiBookmark className="w-6 h-6 text-[#04043F]" />
            </div>
            <div
              ref={dropdownRef}
              className="relative cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img className="w-[46px] h-[46px]" src={avatar} alt="" />
              <div className="absolute -bottom-0.5 -right-0.5 w-[20px] h-[20px] bg-[#E2E5E9] rounded-full flex items-center justify-center text-[12px]">
                <FaChevronDown className="text-center text-white" />
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute top-[90px] right-[70px] bg-white shadow-2xl rounded-lg w-[200px] text-[20px] z-10">
                <p className="text-[#04043F] font-semibold text-[16px] mb-2 cursor-pointer mx-6 my-3">
                  Đã lưu
                </p>
                <p className="text-[#04043F] font-semibold text-[16px] mb-2 cursor-pointer mx-6 my-3">
                  Tài khoản
                </p>
                <div className="border-t-[1px] border-[#FBDCB0] my-3">
                  <p
                    onClick={() => setIsLoggedIn(!isLoggedIn)}
                    className="text-[#FF6363] font-semibold text-[16px] mb-3 cursor-pointer mx-6 mt-3"
                  >
                    Đăng xuất
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="font-semibold text-[18px] text-white bg-[#04043F] py-2 px-6 rounded-[30px] ml-[100px]"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
