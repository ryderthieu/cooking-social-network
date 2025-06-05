import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import { FaAngleDown, FaChevronDown, FaSearch, FaTimes } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { categories, search, supports } from "./MenuData";
import { IoNotifications, IoSearchOutline } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import NotificationDropdown from "../sections/Home/NotificationDropdown";
import MessageDropdown from "../sections/Home/MessageDropdown";
import { useAuth } from "../../context/AuthContext";
import { Bookmark } from "lucide-react";
import { getRecipeCategories } from "../../services/recipeService";
import { categoryService } from "../../services/categoryService";

const Header = () => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedSupportIndex, setSelectedSupportIndex] = useState(0);
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const selectedSupport = supports[selectedSupportIndex];
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        // Use new category service
        const response = await categoryService.getFormattedCategories();
        if (response.data && response.data.success) {
          setDynamicCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to original service if new one fails
        try {
          const fallbackResponse = await getRecipeCategories();
          if (fallbackResponse.data && fallbackResponse.data.success) {
            setDynamicCategories(fallbackResponse.data.data);
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          // Use static categories as last resort
          setDynamicCategories(categories);
        }
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setIsExploreOpen(false);
    setIsSupportOpen(false);
    setIsSearchOpen(false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      const isInsideNav = navRef.current?.contains(target);
      const isInsideSearch = searchRef.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);

      if (!isInsideNav) {
        setIsExploreOpen(false);
        setIsSupportOpen(false);
      }

      if (!isInsideSearch) {
        setIsSearchOpen(false);
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

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActive(0);
    } else if (path.startsWith("/recipes")) {
      setActive(1);
    } else if (path.startsWith("/explore")) {
      setActive(2);
    } else if (path.startsWith("/about")) {
      setActive(3);
    } else if (path.startsWith("/support")) {
      setActive(4);
    } else if (path.startsWith("/search")) {
      setActive(5);
    } else setActive("");
  }, [location]);

  return (
    <div className="flex justify-between items-center px-[110px] py-[20px] fixed bg-white z-50 right-0 left-0">
      <a href="/">
        <img src={logo} alt="Oshisha" className="h-9 w-auto" />
      </a>
      <div className="flex items-center gap-10" ref={navRef}>
        <a
          href="/"
          onClick={() => {
            closeAllDropdowns();
          }}
          className={`flex cursor-pointer relative items-center transition-all duration-300 ${
            active == 0 ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[17px] transform scale-y-[1.05] relative">
            Trang chủ
          </p>
        </a>
        {/* KHÁM PHÁ CÔNG THỨC */}
<div
  onClick={() => {
    setIsExploreOpen(!isExploreOpen);
    if (!isExploreOpen) {
      setIsSearchOpen(false);
      setIsSupportOpen(false);
      setIsDropdownOpen(false);
    }
  }}
  className={`flex cursor-pointer relative items-center ${
    active == 1 ? "text-[#FF6363]" : "text-[#211E2E]"
  }`}
>
  <p className="font-semibold text-[17px] leading-[1.2] scale-y-[1.05]">
    Công thức
  </p>
  <FaAngleDown className="my-auto ml-2" />
  {isExploreOpen && (
    <div className="fixed left-0 top-[80px] z-20 flex bg-white shadow-xl w-full h-[390px] rounded-lg overflow-hidden">
      <div className="w-[20%] p-4 ml-[110px]">
        <ul className="text-gray-700 font-medium text-[17px] leading-[1.4]">
          {dynamicCategories.map((category, index) => (
            <li key={category.name} className="pb-4 cursor-pointer">
              <div
                className={`transition-colors duration-200 ${
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
        <a
          href="/recipes"
          onClick={() => setIsExploreOpen(false)}
          className="mt-4 inline-block"
        >
          <div className="font-medium text-[17px] leading-[1.4] text-sky-600 hover:text-sky-700 transition-colors duration-200 relative group cursor-pointer">
            Xem tất cả
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-sky-600 transition-all duration-300 group-hover:w-full"></span>
          </div>
        </a>
      </div>

      <div className="w-[80%] grid grid-cols-3 gap-6 pr-[110px] p-4 bg-gradient-to-br from-[#fef2f2] to-[#fff7ed]">
        {!isLoadingCategories &&
          dynamicCategories[selectedCategoryIndex] &&
          dynamicCategories[selectedCategoryIndex].items.map((item) => (
            <a
              href={item.path}
              key={item.name}
              className="text-center group"
            >
              <div
                className="h-[280px] rounded-2xl mb-4 overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.05]"
                style={{
                  background:
                    dynamicCategories[selectedCategoryIndex]
                      .background || "bg-pink-100",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-center p-4">
                    <div className="text-6xl mb-4 leading-none">🍴</div>
                    <span className="text-[17px] font-medium leading-[1.3]">
                      {item.name}
                    </span>
                    {item.count && (
                      <div className="text-sm text-gray-400 mt-2 leading-tight">
                        {item.count} công thức
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[17px] font-medium text-gray-700 hover:text-[#FF6363] transition-colors duration-200 leading-[1.3]">
                {item.name}
              </p>
            </a>
          ))}
      </div>
    </div>
  )}
</div>


        <a
          href="/explore"
          onClick={() => {
            closeAllDropdowns();
          }}
          className={`flex cursor-pointer relative items-center ${
            active == 2 ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[17px] transform scale-y-[1.05]">
            Khám phá
          </p>
        </a>

        {/* VỀ OSHISHA */}
        <a
          href="/about"
          onClick={() => {
            closeAllDropdowns();
          }}
          className={`flex cursor-pointer relative items-center ${
            active == 3 ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[17px] transform scale-y-[1.05]">
            Về OSHISHA
          </p>
        </a>

        {/* HỖ TRỢ */}
        <div
          onClick={() => {
            setIsSupportOpen(!isSupportOpen);
            if (!isSupportOpen) {
              setIsSearchOpen(false);
              setIsExploreOpen(false);
              setIsDropdownOpen(false);
            }
          }}
          className={`flex cursor-pointer relative items-center ${
            active == 4 ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[17px] transform scale-y-[1.05]">
            Hỗ trợ
          </p>
          <FaAngleDown className="my-auto ml-2" />
          {isSupportOpen && (
            <div className="fixed left-0 top-[80px] z-20 flex bg-white shadow-xl w-full h-[390px] rounded-lg overflow-hidden">
              <div className="w-[20%] p-4 ml-[110px]">
                <ul className=" text-gray-700 font-medium">
                  {supports.map((item, index) => (
                    <li key={item.name}>
                      <div
                        className={`cursor-pointer scale-[1.05] pb-4 transition-all duration-200 font-medium ${
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
                  <a href={item.path} key={item.name} className="text-center">
                    <div className="h-[280px] rounded-2xl mb-4 overflow-hidden bg-pink-100 flex items-center justify-center">
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </div>
                    <p className="text-[17px] font-medium text-gray-700 hover:text-[#FF6363] transition-all duration-200">
                      {item.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - với search expandable */}
      <div ref={dropdownRef} className="flex items-center">
        {user ? (
          <div className="flex items-center gap-4">
            {/* Expandable Search */}
            <div
              className={`flex items-center transition-all duration-300 ease-in-out ${
                isSearchOpen ? "w-[250px]" : "w-10"
              }`}
              ref={searchRef}
            >
              {isSearchOpen ? (
                <div className="flex items-center w-full bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-[#FF6363] focus-within:shadow-md transition-all duration-200">
                  <a to={"/search"}>
                    <IoSearchOutline className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  </a>
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.key === "Enter")
                        navigate(`/search?q=${searchQuery}`);
                    }}
                  />
                  {/* {searchQuery && (
                    <div
                      onClick={() => setSearchQuery("")}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer ml-2"
                    >
                      <FaTimes className="w-3 h-3 text-gray-400" />
                    </div>
                  )} */}
                  <div
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  >
                    <FaTimes className="size-[14px] text-gray-500" />
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsExploreOpen(false);
                    setIsSupportOpen(false);
                    setIsDropdownOpen(false);
                  }}
                >
                  <IoSearchOutline className="size-5 text-slate-700" />
                </div>
              )}
            </div>

            {/* Notifications */}
            <div>
              <NotificationDropdown 
                onOpen={() => {
                  setIsDropdownOpen(false);
                  setIsExploreOpen(false);
                  setIsSupportOpen(false);
                  setIsSearchOpen(false);
                }}
              />
            </div>

            {/* Messages */}
            <div>
              <MessageDropdown 
                onOpen={() => {
                  setIsDropdownOpen(false);
                  setIsExploreOpen(false);
                  setIsSupportOpen(false);
                  setIsSearchOpen(false);
                }}
              />
            </div>

            <a href="/recipes/saved">
              <div className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border border-gray-600 hover:border-gray-700">
                <Bookmark className="size-5 text-gray-600" strokeWidth={1.5} />
              </div>
            </a>

            {/* User Avatar */}
            <div
              className="relative cursor-pointer group"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                if (!isDropdownOpen) {
                  setIsExploreOpen(false);
                  setIsSupportOpen(false);
                  setIsSearchOpen(false);
                }
              }}
            >
              <div className="flex items-center p-2 rounded-full hover:bg-gray-50 transition-all duration-300 ease-in-out">
                <div className="relative">
                  <img
                    src={
                      user.avatar ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt={user.name || "User avatar"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#FFB800] shadow-md transition-all duration-300 group-hover:border-[#FF6363] group-hover:shadow-lg group-hover:scale-105"
                  />
                  {/* Online status indicator - moved to top-right */}
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  {/* Chevron icon - bottom-right like Facebook */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-[#FF6363] to-[#FFB800] border-2 border-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                    <FaChevronDown className="w-2 h-2 text-white drop-shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            {isDropdownOpen && (
              <div 
                className="absolute top-[95px] right-[110px] bg-white rounded-xl w-[250px] shadow-lg border border-gray-100 z-10 overflow-hidden backdrop-blur-sm"
              >
                {/* User info header */}
                <div className="px-4 py-3  border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.avatar ||
                        "https://randomuser.me/api/portraits/men/32.jpg"
                      }
                      alt={user.name || "User avatar"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#FFB800]"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm leading-tight">
                        {user.name || "Người dùng"}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {user.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  {/* Trang cá nhân */}
                  <a
                    href={`/profile/${user._id}`}
                    className="flex items-center gap-3 text-[#04043F] font-medium text-[15px] py-3 px-3 rounded-lg hover:bg-gradient-to-r hover:from-[#FF6363]/10 hover:to-[#FFB800]/10 hover:text-[#FF6363] transition-all duration-200 group"
                  >
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-[#FF6363] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Trang cá nhân</span>
                  </a>
                  
                  {/* Tài khoản */}
                  <div
                    onClick={() => navigate("/account")}
                    className="flex items-center gap-3 text-[#04043F] font-medium text-[15px] py-3 px-3 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-[#FF6363]/10 hover:to-[#FFB800]/10 hover:text-[#FF6363] transition-all duration-200 group"
                  >
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-[#FF6363] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Cài đặt tài khoản</span>
                  </div>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2 mx-2"></div>
                  
                  {/* Đăng xuất */}
                  <div
                    onClick={() => {
                      logout();
                      navigate("/login");
                      closeAllDropdowns();
                    }}
                    className="flex items-center gap-3 text-[#FF6363] font-medium text-[15px] py-3 px-3 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                  >
                    <svg className="w-4 h-4 text-[#FF6363] group-hover:text-red-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-[16px] text-white bg-[#04043F] hover:bg-[#03032d] py-2 px-6 rounded-[30px] ml-[80px] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-[1.05] focus:ring-4 focus:ring-[#04043F]/50"
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
