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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      const isInsideNav = navRef.current?.contains(target);
      const isInsideDropdown = dropdownRef.current?.contains(target);
      const isInsideSearch = searchRef.current?.contains(target);

      if (!isInsideNav) {
        setIsExploreOpen(false);
        setIsSupportOpen(false);
      }

      if (!isInsideDropdown) {
        setIsDropdownOpen(false);
      }

      if (!isInsideSearch) {
        setIsSearchOpen(false);
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
            setIsExploreOpen(false);
            setIsSearchOpen(false);
            setIsSupportOpen(false);
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
            setIsSearchOpen(false);
            setIsSupportOpen(false);
          }}
          className={`flex cursor-pointer relative items-center ${
            active == 1 ? "text-[#FF6363]" : "text-[#211E2E]"
          }`}
        >
          <p className="font-semibold text-[17px] transform scale-y-[1.05]">
            Công thức
          </p>
          <FaAngleDown className="my-auto ml-2" />
          {isExploreOpen && (
            <div className="fixed left-0 top-[80px] z-20 flex bg-white shadow-xl w-full h-[390px] rounded-lg overflow-hidden">
              <div className="w-[20%] p-4 ml-[110px]">
                {
                  <ul className=" text-gray-700 font-medium">
                    {dynamicCategories.map((category, index) => (
                      <li key={category.name}>
                        <div
                          className={`cursor-pointer text-[17px] scale-y-105 pb-4 transition-all duration-200 font-medium ${
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
                }
                <a 
                  href="/recipes"
                  onClick={() => setIsExploreOpen(false)}
                  className="mt-4 inline-block"
                >
                  <div className="cursor-pointer text-[17px] font-medium text-sky-600 hover:text-sky-700 transition-all duration-200 relative group">
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
                        className="h-[280px] rounded-2xl mb-4 overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
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
                            <div className="text-6xl mb-4">🍴</div>
                            <span className="text-[17px] font-medium">
                              {item.name}
                            </span>
                            {item.count && (
                              <div className="text-sm text-gray-400 mt-2">
                                {item.count} công thức
                              </div>
                            )}
                          </div>
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

        <a
          href="/explore"
          onClick={() => {
            setIsExploreOpen(false);
            setIsSearchOpen(false);
            setIsSupportOpen(false);
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
            setIsExploreOpen(false);
            setIsSearchOpen(false);
            setIsSupportOpen(false);
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
            setIsSearchOpen(false);
            setIsExploreOpen(false);
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
                        className={`cursor-pointer scale-y-105 pb-4 transition-all duration-200 font-medium ${
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
                isSearchOpen ? "w-[300px]" : "w-10"
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
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer ml-2"
                  >
                    <FaTimes className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <IoSearchOutline className="w-6 h-6 text-slate-700" />
                </div>
              )}
            </div>

            {/* Notifications */}
            <div>
              <NotificationDropdown />
            </div>

            {/* Messages */}
            <div>
              <MessageDropdown />
            </div>

            <a href="/recipes/saved">
              <div className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border border-gray-600 hover:border-gray-700">
                <Bookmark className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
              </div>
            </a>

            {/* User Avatar */}
            <div
              className="relative cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    user.avatar ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#FFB800]"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-[20px] h-[20px] bg-[#E2E5E9] rounded-full flex items-center justify-center text-[12px]">
                <FaChevronDown
                  className={`text-center text-white transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-[91px] right-[100px] bg-white shadow-2xl rounded-lg w-[200px] text-[18px] z-10 border border-gray-100 overflow-hidden">
                <div className="p-2">
                  <a href={`/profile/${user._id}`} className="text-[#04043F] font-medium text-[18px] mb-2 cursor-pointer mx-4 my-3 hover:text-[#FF6363] transition-colors duration-200">
                    Trang cá nhân
                  </a>
                  <div
                    onClick={() => navigate("/account")}
                    className="text-[#04043F] font-medium text-[18px] mb-2 cursor-pointer mx-4 my-3 hover:text-[#FF6363] transition-colors duration-200"
                  >
                    Tài khoản
                  </div>
                  <div className="border-t-[1px] border-[#FBDCB0] my-3">
                    <p
                      onClick={() => {
                        logout();
                        navigate("/login");
                        setIsDropdownOpen(false);
                      }}
                      className="text-[#FF6363] font-medium text-[18px] mb-3 cursor-pointer mx-4 mt-3 hover:text-red-600 transition-colors duration-200"
                    >
                      Đăng xuất
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-[17px] text-white bg-[#04043F] hover:bg-[#03032d] py-2 px-6 rounded-[30px] ml-[80px] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-[#04043F]/50"
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
