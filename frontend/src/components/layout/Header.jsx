import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar.png";
import { FaAngleDown, FaChevronDown } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";
import { Link } from "react-router-dom";
import { categories, search, supports } from "./MenuData";

const Header = () => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [selectedSupportIndex, setSelectedSupportIndex] = useState(0);
  const selectedCategory = categories[selectedCategoryIndex];
  const selectedSearch = search[selectedSearchIndex];
  const selectedSupport = supports[selectedSupportIndex];
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [active, setActive] = useState("Khám phá công thức");

  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      const isInsideNav = navRef.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);

      if (!isInsideNav) {
        setIsExploreOpen(false);
        setIsSearchOpen(false);
        setIsSupportOpen(false);
      }

      if (!isInsideDropdown) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-between px-[110px] py-[20px] fixed bg-white z-50 right-0 left-0">
      <Link to="/">
        <img src={logo} alt="Oshisha" />
      </Link>

      <div className="flex items-center gap-10" ref={navRef}>
        {/* KHÁM PHÁ CÔNG THỨC */}
        <div
          onClick={() => {
            setIsExploreOpen(!isExploreOpen);
            setIsSearchOpen(false);
            setIsSupportOpen(false);
            setActive("Khám phá công thức");
          }}
          className={`flex cursor-pointer relative items-center ${
            active === "Khám phá công thức"
              ? "text-[#FF6363]"
              : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[18px]">Khám phá</p>
          <FaAngleDown className="my-auto ml-2" />
          {isExploreOpen && (
            <div className="fixed left-0 top-[80px] z-20 flex bg-white shadow-xl w-full h-[390px] rounded-lg overflow-hidden">
              <div className="w-[20%] p-4 ml-[110px]">
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  {categories.map((category, index) => (
                    <li key={category.name}>
                      <div
                        className={`cursor-pointer text-[18px] pb-4 transition-all duration-200 font-medium ${
                          index === selectedCategoryIndex
                            ? "text-[#FF6363]"
                            : "hover:text-[#FF6363]"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategoryIndex(index);
                        }}
                      >
                        {category.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-[80%] grid grid-cols-3 gap-6 pr-[110px] p-4 bg-gradient-to-br from-[#fef2f2] to-[#fff7ed]">
                {selectedCategory.items.map((item) => (
                  <Link to={item.path} key={item.name} className="text-center">
                    <div className="h-[280px] rounded-2xl mb-4 overflow-hidden bg-pink-100 flex items-center justify-center">
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </div>
                    <p className="text-[18px] font-medium text-gray-700 hover:text-[#FF6363] transition-all duration-200">
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LƯỚT TIN */}
        <Link
          to="/"
          onClick={() => {
            setIsExploreOpen(false);
            setIsSearchOpen(false);
            setIsSupportOpen(false);
            setActive("Lướt tin");
          }}
          className={`flex cursor-pointer relative items-center ${
            active === "Lướt tin" ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[18px]">Lướt tin</p>
        </Link>

        {/* Bài đăng */}
        <Link
          to="/posts"
          onClick={() => {
            setIsExploreOpen(false);
            setIsSearchOpen(false);
            setIsSupportOpen(false);
            setActive("Bài đăng");
          }}
          className={`flex cursor-pointer relative items-center ${
            active === "Bài đăng" ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[18px]">Bài đăng</p>
        </Link>

        {/* TÌM KIẾM */}
        <div
          onClick={() => {
            setIsExploreOpen(false);
            setIsSearchOpen(!isSearchOpen);
            setIsSupportOpen(false);
            setActive("Tìm kiếm");
          }}
          className={`flex cursor-pointer relative items-center ${
            active === "Tìm kiếm" ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[18px]">Tìm kiếm</p>
          <FaAngleDown className="my-auto ml-2" />
          {isSearchOpen && (
            <div className="fixed left-0 top-[80px] z-20 flex bg-white shadow-xl w-full h-[390px] rounded-lg overflow-hidden">
              <div className="w-[20%] p-4 ml-[110px]">
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  {search.map((item, index) => (
                    <li key={item.name}>
                      <Link to={item.path}>
                        <div
                          className={`cursor-pointer text-[18px] pb-4 transition-all duration-200 font-medium ${
                            index === selectedSearchIndex
                              ? "text-[#FF6363]"
                              : "hover:text-[#FF6363]"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSearchIndex(index);
                          }}
                        >
                          {item.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-[80%] grid grid-cols-3 gap-6 pr-[110px] p-4 bg-gradient-to-br from-[#fef2f2] to-[#fff7ed]">
                {selectedSearch.items.map((item) => (
                  <Link to={item.path} key={item.name} className="text-center">
                    <div className="h-[280px] rounded-2xl mb-4 overflow-hidden bg-pink-100 flex items-center justify-center">
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </div>
                    <p className="text-[18px] font-medium text-gray-700 hover:text-[#FF6363] transition-all duration-200">
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* VỀ OSHISHA */}
        <Link
          to="/"
          onClick={() => {
            setIsExploreOpen(false);
            setIsSearchOpen(false);
            setIsSupportOpen(false);
            setActive("Về OSHISHA");
          }}
          className={`flex cursor-pointer relative items-center ${
            active === "Về OSHISHA" ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[18px]">Về OSHISHA</p>
        </Link>

        {/* HỖ TRỢ */}
        <div
          onClick={() => {
            setIsSupportOpen(!isSupportOpen);
            setIsSearchOpen(false);
            setIsExploreOpen(false);
            setActive("Hỗ trợ");
          }}
          className={`flex cursor-pointer relative items-center ${
            active === "Hỗ trợ" ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[18px]">Hỗ trợ</p>
          <FaAngleDown className="my-auto ml-2" />
          {isSupportOpen && (
            <div className="fixed left-0 top-[80px] z-20 flex bg-white shadow-xl w-full h-[390px] rounded-lg overflow-hidden">
              <div className="w-[20%] p-4 ml-[110px]">
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  {supports.map((item, index) => (
                    <li key={item.name}>
                      <div
                        className={`cursor-pointer text-[18px] pb-4 transition-all duration-200 font-medium ${
                          index === selectedSupportIndex
                            ? "text-[#FF6363]"
                            : "hover:text-[#FF6363]"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSupportIndex(index);
                        }}
                      >
                        {item.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-[80%] grid grid-cols-3 gap-6 pr-[110px] p-4 bg-gradient-to-br from-[#fef2f2] to-[#fff7ed]">
                {selectedSupport.items.map((item) => (
                  <Link to={item.path} key={item.name} className="text-center">
                    <div className="h-[280px] rounded-2xl mb-4 overflow-hidden bg-pink-100 flex items-center justify-center">
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </div>
                    <p className="text-[18px] font-medium text-gray-700 hover:text-[#FF6363] transition-all duration-200">
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={dropdownRef}>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="border-2 rounded-full p-2 border-[#04043F]">
              <BiSolidEdit className="w-6 h-6 text-[#04043F]" />
            </div>
            <div className="border-2 rounded-full p-2 border-[#04043F]">
              <FiBookmark className="w-6 h-6 text-[#04043F]" />
            </div>
            <div
              className="relative cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <img className="w-[42px] h-[42px]" src={avatar} alt="" />
              <div className="absolute -bottom-0.5 -right-0.5 w-[20px] h-[20px] bg-[#E2E5E9] rounded-full flex items-center justify-center text-[12px]">
                <FaChevronDown className="text-center text-white" />
              </div>
            </div>
            {isDropdownOpen && (
              <div className="absolute top-[87px] right-[70px] bg-white shadow-2xl rounded-lg w-[200px] text-[18px] z-10">
                <Link to="">
                  <div
                    to="/"
                    className="text-[#04043F] font-medium text-[18px] mb-2 cursor-pointer mx-6 my-3"
                  >
                    Đã lưu
                  </div>
                </Link>
                <Link to="">
                  <div
                    to="/tai-khoan"
                    className="text-[#04043F] font-medium text-[18px] mb-2 cursor-pointer mx-6 my-3"
                  >
                    Tài khoản
                  </div>
                </Link>
                <Link to="/login">
                  <div className="border-t-[1px] border-[#FBDCB0] my-3">
                    <p
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsDropdownOpen(false);
                      }}
                      className="text-[#FF6363] font-medium text-[18px] mb-3 cursor-pointer mx-6 mt-3"
                    >
                      Đăng xuất
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <div>
              <button
                onClick={() => setIsLoggedIn(!isLoggedIn)}
                className="font-medium text-[18px] text-white bg-[#04043F] py-2 px-6 rounded-[30px] ml-[80px]"
              >
                Đăng nhập
              </button>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
