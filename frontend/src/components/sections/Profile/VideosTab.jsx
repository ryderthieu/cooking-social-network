import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { ReelCardReview } from "@/components/common/ReelCard";
import { getSavedReels } from "@/services/userService";
import { getMyVideos, getVideoByUserId } from "@/services/videoService";
import { useAuth } from "@/context/AuthContext";
export default function VideosTab({userId}) {
  // Dữ liệu mẫu cho videos

  const [reels, setReels] = useState([]);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response;

        if (userId) {
          response = await getVideoByUserId(userId);
        } else if (currentUser?._id) {
          response = await getMyVideos(currentUser._id);
        } else {
          setError("User information is not available");
          return;
        }
        // Extract the posts array from the response
        setReels(response.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, [userId, currentUser]);
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 text-center">
        {error}
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-3xl text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Chưa có video nào
        </h3>
        <p className="text-gray-600">
          Hãy chia sẻ những món ăn và công thức nấu ăn yêu thích của bạn!
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reels.map((video) => (
        <ReelCardReview key={video.id} reel={video} />
      ))}
    </div>
  );
}
