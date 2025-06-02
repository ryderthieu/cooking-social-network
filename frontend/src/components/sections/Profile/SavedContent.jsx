import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { EmptyState, PostItem, VideoCard } from "../Profile";
import {
  getSavedRecipes,
  getSavedPost,
  getSavedReels,
  deleteSavedRecipe,
  deleteSavedPost,
  deleteSavedReel,
} from "../../../services/userService";
import SavedCard from "../Recipe/SavedCard";

function SavedContent({ type }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const serviceMap = React.useMemo(
    () => ({
      recipes: {
        fetch: getSavedRecipes,
        delete: deleteSavedRecipe,
        deleteKey: "recipeId",
        component: SavedCard,
        props: "recipe",
        responseKey: "savedRecipes",
      },
      posts: {
        fetch: getSavedPost,
        delete: deleteSavedPost,
        deleteKey: "postId",
        component: PostItem,
        props: "post",
        responseKey: "savedPosts", 
      },
      reels: {
        fetch: getSavedReels,
        delete: deleteSavedReel,
        deleteKey: "reelId",
        component: VideoCard,
        props: "video",
        responseKey: "savedReels",
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
        console.log("Saved content: ", response.data);

        const contentArray = response.data[service.responseKey] || [];
        setContent(contentArray);
      } catch (error) {
        console.error(`Error fetching saved ${type}:`, error);
        toast.error(`Không thể tải ${typeLabels[type]} đã lưu`);
        setContent([]);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

export default SavedContent;