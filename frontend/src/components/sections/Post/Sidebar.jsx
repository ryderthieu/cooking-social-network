import {
  FaUserFriends,
  FaFire,
  FaNewspaper,
  FaVideo,
  FaUser,
  FaBookmark,
  FaUtensils,
  FaPlus,
  FaUserCheck,
} from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CreatePostModal from "../../common/Modal/CreatePostModal";
import { useAuth } from "@/context/AuthContext";
import { getUserById, toggleFollow } from "@/services/userService";
import { getRecipeById } from "@/services/recipeService";
import { toast } from "react-toastify";


export const LeftSidebar = ({
  activeTab,
  onTabChange,
  onAdd,
}) => {
  const { user } = useAuth();
  console.log("user", user);
  const data = {
    menu: [
      { label: "Bài viết", icon: <FaNewspaper />, href: "/explore/posts" },
      { label: "Reels", icon: <FaVideo />, href: "/explore/reels" },
      { label: "Trang cá nhân", icon: <FaUser />, href: `/profile/${user._id}` },
      { label: "Bài viết đã lưu", icon: <FaBookmark />, href: "/saved" },
      { label: "Công thức của tôi", icon: <FaUtensils />, href: "/recipes/saved" },
    ],
  };
  return (
    <>
      <aside className="hidden lg:block w-72 pr-4 space-y-6 sticky top-24 h-fit">
        <div className="bg-white rounded-2xl shadow p-6 mb-2">
          {/* Profile Section */}
          {user && (
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user.avatar}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-800">
                  {user.lastName} {user.firstName}
                </h3>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <ul className="space-y-2">
            {data.menu.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${(item.label === "Bài viết" && activeTab === "posts") ||
                    (item.label === "Reels" && activeTab === "reels")
                    ? "bg-[#F5F5F5] text-[#FF6363] font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Add Post Button */}
          <button
            onClick={onAdd}
            className="mt-6 w-full bg-[#FF6363] text-white py-3 rounded-xl font-semibold hover:bg-[#ff4f4f] transition flex items-center justify-center gap-2"
          >
            <FaPlus /> Tạo bài viết mới
          </button>
        </div>
      </aside>
    </>
  );
};

export const RightSidebar = () => {
  const { user: currentUser } = useAuth();
  const [suggestFollow, setSuggestFollow] = useState([]);
  const [hotDishs, setHotDishs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userIds = ['67e4ca33b8383fe96ef7652e', '683b3ae123099bb3054d4309', '683dc62bdb8cced1ff0a51b9'];
        const recipeIds = ['683d9751629d13395571d087', '683d9750629d13395571d080', '683d962130f548ffeaaa4821']
        
        const usersPromises = userIds.map(id => getUserById({ userId: id }));
        const recipesPromises = recipeIds.map(id => getRecipeById(id));
        
        const responses = await Promise.all([...usersPromises, ...recipesPromises]);

        const users = responses.slice(0, userIds.length)
          .map(res => res.data)
          .filter(user => user && user._id !== currentUser._id); // Lọc ra người dùng hiện tại
        const recipes = responses.slice(userIds.length).map(res => res.data.data);
        
        // Khởi tạo trạng thái following cho mỗi user
        const initialFollowingStatus = {};
        users.forEach(user => {
          initialFollowingStatus[user._id] = user.followers?.includes(currentUser._id) || false;
        });
        setFollowingStatus(initialFollowingStatus);
        
        setSuggestFollow(users.filter(Boolean));
        setHotDishs(recipes.filter(Boolean));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser._id]);

  const handleFollow = async (userId) => {
    try {
      const action = followingStatus[userId] ? 'unfollow' : 'follow';
      const response = await toggleFollow({followingId: userId, action});
      if (response.status === 200) {
        // Cập nhật trạng thái following cho user này
        setFollowingStatus(prev => ({
          ...prev,
          [userId]: !prev[userId]
        }));
        
        // Cập nhật số lượng followers trong danh sách
        setSuggestFollow(prev => 
          prev.map(user => {
            if (user._id === userId) {
              const newFollowers = followingStatus[userId] 
                ? user.followers.filter(id => id !== currentUser._id)
                : [...user.followers, currentUser._id];
              return { ...user, followers: newFollowers };
            }
            return user;
          })
        );

        toast.success(followingStatus[userId] 
          ? "Đã hủy theo dõi người dùng" 
          : "Đã theo dõi người dùng"
        );
      }
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Không thể thực hiện. Vui lòng thử lại sau.");
    }
  };

  return (
    <aside className="hidden lg:block w-72 pl-4 space-y-6 sticky top-24 h-fit">
      <div className="bg-white rounded-2xl shadow p-6 mb-2">
        <div className="flex items-center mb-4 text-[#FF6363] font-bold text-lg">
          <FaUserFriends className="mr-2" /> Gợi ý theo dõi
        </div>
        {isLoading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : suggestFollow.length > 0 ? (
          <ul className="space-y-3">
            {suggestFollow.map((user) => (
              <li
                key={user._id}
                className="flex items-center gap-3 justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#FF6363]"
                  />
                  <div className="flex flex-col">
                    <Link 
                      to={`/profile/${user._id}`} 
                      className="text-gray-700 font-medium text-sm hover:text-[#FFB800] transition-colors cursor-pointer"
                    >
                      {user.lastName + ' ' + user.firstName}
                    </Link>
                    <span className="text-xs text-gray-500">
                      {user.followers?.length || 0} theo dõi
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleFollow(user._id)}
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold transition flex items-center justify-center ${
                    followingStatus[user._id]
                      ? 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      : 'bg-[#FF6363] text-white hover:bg-[#ff4f4f]'
                  }`}
                >
                  {followingStatus[user._id] ? <FaUserCheck size={16} /> : <MdLibraryAdd size={16} />}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">Không có gợi ý nào</div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center mb-4 text-[#FF6363] font-bold text-lg">
          <FaFire className="mr-2" /> Món ăn hot
        </div>
        {isLoading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : hotDishs.length > 0 ? (
          <ul className="space-y-3">
            {hotDishs.map((dish) => (
              <li key={dish._id} className="flex items-center gap-3">
                <Link 
                  to={`/recipes/${dish._id}`} 
                  className="flex flex-row gap-2 items-center hover:scale-105 transition-transform duration-200 w-full"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-10 h-10 rounded object-cover border border-[#FF6363]"
                  />
                  <span className="text-gray-700 font-medium text-sm line-clamp-2 hover:text-[#FFB800] transition-colors cursor-pointer">
                    {dish.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">Không có món ăn nào</div>
        )}
      </div>
    </aside>
  );
}