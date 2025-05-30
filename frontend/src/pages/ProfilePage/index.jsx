import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  EmptyState,
  ProfileHeader,
  PostsTab,
  RecipesTab,
  VideosTab,
  RecipeCard,
  PostItem,
  VideoCard,
  ProfileSidebar,
} from "../../components/sections/Profile";
import {
  getUserById,
  toggleFollow,
  getSavedRecipes,
  getSavedPost,
  getSavedReels,
  deleteSavedRecipe,
  deleteSavedPost,
  deleteSavedReel,
  getUserStats,
  editProfile,
} from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import EditProfileModal from "../../components/common/Modal/Profile/EditProfileModal";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("posts");
  const [savedTab, setSavedTab] = useState("recipes");
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isOwnProfile = currentUser && userId === currentUser._id;

  // Helper function to check follow status
  const checkFollowStatus = useCallback(
    (followers) => {
      if (!currentUser || !followers) return false;
      return followers.some((follower) => {
        const followerId =
          typeof follower === "object"
            ? follower._id || follower.toString()
            : follower;
        return followerId.toString() === currentUser._id.toString();
      });
    },
    [currentUser]
  );

  // Error handling helper
  // const handleFetchError = useCallback(
  //   (error) => {
  //     if (error.response) {
  //       switch (error.response.status) {
  //         case 401:
  //           toast.error("Vui lòng đăng nhập để xem trang này");
  //           navigate("/login");
  //           break;
  //         case 404:
  //           toast.error("Không tìm thấy người dùng");
  //           navigate("/404");
  //           break;
  //         default:
  //           toast.error("Đã xảy ra lỗi khi tải thông tin người dùng");
  //       }
  //     } else {
  //       toast.error("Không thể kết nối đến máy chủ");
  //     }
  //   },
  //   [navigate]
  // );

  useEffect(() => {
    console.log(currentUser)
  }, [])

  // Fetch user data and stats
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const [userResponse, statsResponse] = await Promise.all([
          getUserById({ userId }),
          getUserStats(userId),
        ]);

        if (userResponse.status === 200) {
          setUserData(userResponse.data);

          // Check follow status for other users' profiles
          if (currentUser && userId !== currentUser._id) {
            setIsFollowing(checkFollowStatus(userResponse.data.followers));
          }
        }

        if (statsResponse.status === 200) {
          setUserStats(statsResponse.data.stats);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        // handleFetchError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId, currentUser, navigate, checkFollowStatus]);

  // Handle follow/unfollow action for main profile
  const handleToggleFollow = async () => {
    if (!userId || !currentUser) {
      toast.info("Vui lòng đăng nhập để theo dõi người dùng này");
      navigate("/login");
      return;
    }

    const willFollow = !isFollowing;
    const originalFollowersCount = userStats?.followers?.count || 0;

    // Optimistic update
    setIsFollowing(willFollow);
    setUserStats((prev) => ({
      ...prev,
      followers: {
        ...prev?.followers,
        count: willFollow
          ? originalFollowersCount + 1
          : originalFollowersCount - 1,
      },
    }));

    try {
      const response = await toggleFollow({
        followingId: userId,
        action: willFollow ? "follow" : "unfollow",
      });

      if (response.status === 200) {
        toast.success(
          willFollow
            ? `Đã theo dõi ${userData.firstName}`
            : `Đã hủy theo dõi ${userData.firstName}`
        );

        // Update with backend response if available
        if (response.data && typeof response.data.isFollowing !== "undefined") {
          setIsFollowing(response.data.isFollowing);
        }

        // Refresh stats
        const statsResponse = await getUserStats(userId);
        setUserStats(statsResponse.data.stats);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);

      // Revert changes on error
      setIsFollowing(!willFollow);
      setUserStats((prev) => ({
        ...prev,
        followers: {
          ...prev?.followers,
          count: originalFollowersCount,
        },
      }));

      // Handle specific errors
      if (error.response?.status === 400) {
        await refreshUserData();
        toast.info("Trạng thái đã được đồng bộ. Vui lòng thử lại.");
      } else {
        toast.error("Không thể thực hiện thao tác. Vui lòng thử lại sau.");
      }
    }
  };

  // Handle follow/unfollow action for users in modal list
  const handleToggleFollowInModal = async (targetUserId) => {
    if (!targetUserId || !currentUser) {
      toast.info("Vui lòng đăng nhập để theo dõi người dùng này");
      navigate("/login");
      return;
    }

    // Check if currently following this user
    const isCurrentlyFollowing =
      userStats?.following?.data?.some(
        (followedUser) => followedUser._id === targetUserId
      ) || false;

    const willFollow = !isCurrentlyFollowing;

    try {
      const response = await toggleFollow({
        followingId: targetUserId,
        action: willFollow ? "follow" : "unfollow",
      });

      if (response.status === 200) {
        toast.success(
          willFollow ? "Đã theo dõi người dùng" : "Đã hủy theo dõi người dùng"
        );

        // Refresh stats to update the lists
        const statsResponse = await getUserStats(userId);
        setUserStats(statsResponse.data.stats);
      }
    } catch (error) {
      console.error("Error toggling follow in modal:", error);
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại sau.");
    }
  };

  // Refresh user data helper
  const refreshUserData = async () => {
    try {
      const userResponse = await getUserById({ userId });
      if (userResponse.status === 200) {
        setUserData(userResponse.data);
        setIsFollowing(checkFollowStatus(userResponse.data.followers));
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Handle edit profile
  const handleEditProfile = async (formData) => {
    try {
      setIsEditModalOpen(true);

      // Gọi API cập nhật profile (cần tạo service)
      const response = await editProfile(userId, formData);

      if (response.status === 200) {
        // Cập nhật state local ngay lập tức
        setUserData((prevData) => ({
          ...prevData,
          ...formData,
        }));

        toast.success("Cập nhật hồ sơ thành công!");

        // Refresh data từ server để đảm bảo sync
        await refreshUserData();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      // Gọi API để update profile
      console.log('Saving profile:', formData);
      // await updateUserProfile(formData);
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-amber-300 mb-4"></div>
          <div className="h-4 w-32 bg-amber-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-amber-100 rounded"></div>
        </div>
      </div>
    );
  }

  // User not found state
  if (!userData) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Người dùng không tồn tại</h2>
          <p className="text-gray-600 mb-4">
            Không thể tìm thấy thông tin người dùng này
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
           {/* Left Sidebar */}
           <div className="sticky">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              userData={userData}
              userStats={userStats}
              isOwnProfile={isOwnProfile}
              user={userData}
              stats={userStats}
              isFollowing={isFollowing}
              onToggleFollow={handleToggleFollow}
              onEditProfile={handleEditProfile}
              currentUserId={currentUser?._id}
              onToggleFollowInModal={handleToggleFollowInModal}
            />
           </div>
            
          {/* Main Content */}
          <div className="col-span-2">
            <div className="">
              <ProfileHeader
                user={userData}
                stats={userStats}
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                onToggleFollow={handleToggleFollow}
                onEditProfile={handleEditProfile}
                currentUserId={currentUser?._id}
                onToggleFollowInModal={handleToggleFollowInModal}
              />
            </div>

            <div className="w-full mt-6">
              <div className="mt-4">
                {activeTab === "posts" && <PostsTab userId={userId} />}
                {activeTab === "recipes" && <RecipesTab userId={userId} />}
                {activeTab === "videos" && <VideosTab userId={userId} />}
                {isOwnProfile && activeTab === "saved" && (
                  <SavedContentSection
                    savedTab={savedTab}
                    setSavedTab={setSavedTab}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-80 pr-6 space-y-6 sticky top-24 h-[300px]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              ...
            </div>
          </div>
          {isEditModalOpen && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={userData}
            onSave={handleSaveProfile}
          />
        )}
        </div>
      </div>
    </div>
  );
}

// Separate component for saved content section
function SavedContentSection({ savedTab, setSavedTab }) {
  const savedTabs = [
    { key: "recipes", label: "Công thức" },
    { key: "posts", label: "Bài viết" },
    { key: "reels", label: "Video" },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex space-x-4 mb-6 border-b pb-4">
        {savedTabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              savedTab === tab.key
                ? "bg-amber-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setSavedTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <SavedContent type={savedTab} />
    </div>
  );
}

// Optimized SavedContent component
function SavedContent({ type }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Service mapping for better maintainability - using useMemo to avoid dependency issues
  const serviceMap = React.useMemo(
    () => ({
      recipes: {
        fetch: getSavedRecipes,
        delete: deleteSavedRecipe,
        deleteKey: "recipeId",
        component: RecipeCard,
        props: "recipe",
      },
      posts: {
        fetch: getSavedPost,
        delete: deleteSavedPost,
        deleteKey: "postId",
        component: PostItem,
        props: "post",
      },
      reels: {
        fetch: getSavedReels,
        delete: deleteSavedReel,
        deleteKey: "reelId",
        component: VideoCard,
        props: "video",
      },
    }),
    []
  );

  const typeLabels = React.useMemo(
    () => ({
      recipes: "công thức",
      posts: "bài viết",
      reels: "video",
    }),
    []
  );

  useEffect(() => {
    const fetchSavedContent = async () => {
      setLoading(true);
      try {
        const service = serviceMap[type];
        const response = await service.fetch();
        setContent(response.data || []);
      } catch (error) {
        console.error(`Error fetching saved ${type}:`, error);
        toast.error(`Không thể tải ${typeLabels[type]} đã lưu`);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedContent();
  }, [type, serviceMap, typeLabels]);

  const handleRemoveSaved = async (itemId) => {
    try {
      const service = serviceMap[type];
      const response = await service.delete({ [service.deleteKey]: itemId });

      if (response.status === 200) {
        setContent((prevContent) =>
          prevContent.filter((item) => item._id !== itemId)
        );
        toast.success("Đã xóa khỏi danh sách đã lưu");
      }
    } catch (error) {
      console.error(`Error removing saved ${type}:`, error);
      toast.error("Không thể xóa khỏi danh sách đã lưu");
    }
  };

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full bg-amber-300 mb-3"></div>
          <div className="h-3 w-24 bg-amber-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <EmptyState
        icon="🔖"
        title={`Chưa có ${typeLabels[type]} đã lưu`}
        description={`Các ${typeLabels[type]} bạn lưu sẽ hiển thị ở đây`}
      />
    );
  }

  const service = serviceMap[type];
  const Component = service.component;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {content.map((item) => (
        <Component
          key={item._id}
          {...{ [service.props]: item }}
          onRemove={() => handleRemoveSaved(item._id)}
          showRemoveOption
        />
      ))}
    </div>
  );
}
