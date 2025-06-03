import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReelCard from "../../components/common/ReelCard";
import ReelCommentPanel from "../../components/common/ReelCommentPanel";
import SharePopup from "../../components/common/SharePopup";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import {
  getAllVideos,
  getVideoById,
  likeVideo,
  shareVideo,
} from "@/services/videoService";
import { createComment, getCommentsByTarget } from "@/services/commentService";
import { toast } from "react-toastify";
import Spinner from "../../components/common/Spinner";
import { formatRelativeTime } from "../MessagePage";

const Reels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { sendNotification } = useSocket();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const [currentReel, setCurrentReel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sharePopup, setSharePopup] = useState({ open: false, videoId: null, reel: null });
  const [showReelComment, setShowReelComment] = useState(false);
  const [allReels, setAllReels] = useState([]);
  const [reelCommentRefreshKey, setReelCommentRefreshKey] = useState(0);

  // Lấy tất cả video khi component mount
  useEffect(() => {
    const fetchAllReels = async () => {
      try {
        setIsLoading(true);
        const response = await getAllVideos();
        console.log('Response from getAllVideos:', response);

        const videos = response.data;
        console.log('Videos:', videos);

        if (Array.isArray(videos)) {
          const allReels = videos.map((v) => ({
            ...v,
            liked: v.likes?.includes(user?._id),
          }));

          console.log('Processed reels:', allReels);
          setAllReels(allReels);

          // Nếu không có ID và có videos, chuyển đến video đầu tiên
          if (!id && allReels.length > 0) {
            navigate(`/explore/reels/${allReels[0]._id}`);
            setCurrentReel(allReels[0]);
            setCurrentIndex(0);
          }
          // Nếu có ID, tìm video tương ứng
          else if (id && allReels.length > 0) {
            const index = allReels.findIndex(reel => reel._id === id);
            if (index === -1) {
              // Nếu không tìm thấy video với ID đã cho, chuyển đến video đầu tiên
              navigate(`/explore/reels/${allReels[0]._id}`);
              setCurrentReel(allReels[0]);
              setCurrentIndex(0);
            } else {
              setCurrentIndex(index);
              setCurrentReel(allReels[index]);
              // Cuộn đến video hiện tại
              setTimeout(() => {
                containerRef.current?.scrollTo({
                  top: index * containerRef.current.clientHeight,
                  behavior: 'auto'
                });
              }, 100);
            }
          }
        } else {
          console.error('Invalid response format:', videos);
          toast.error("Không thể tải video");
        }
      } catch (error) {
        console.error('Error fetching all reels:', error);
        toast.error("Đã xảy ra lỗi khi tải video");
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    fetchAllReels();
  }, [id, user, navigate]);

  // Xử lý cuộn video
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      if (!containerRef.current || isScrolling) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const index = Math.round(scrollTop / itemHeight);

      if (index !== currentIndex && allReels[index]) {
        setIsScrolling(true);
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
          setCurrentIndex(index);
          setCurrentReel(allReels[index]);
          navigate(`/explore/reels/${allReels[index]._id}`, { replace: true });
          setIsScrolling(false);
        }, 50); // Đợi 50ms sau khi cuộn dừng lại mới cập nhật
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, [currentIndex, allReels, navigate, isScrolling]);

  // Xử lý phím mũi tên
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        setCurrentReel(allReels[newIndex]);
        navigate(`/explore/reels/${allReels[newIndex]._id}`, { replace: true });
        containerRef.current?.scrollTo({
          top: newIndex * containerRef.current.clientHeight,
          behavior: 'smooth'
        });
      } else if (e.key === 'ArrowDown' && currentIndex < allReels.length - 1) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        setCurrentReel(allReels[newIndex]);
        navigate(`/explore/reels/${allReels[newIndex]._id}`, { replace: true });
        containerRef.current?.scrollTo({
          top: newIndex * containerRef.current.clientHeight,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allReels, navigate]);

  const handleLike = async (reelId) => {
    try {
      const res = await likeVideo(reelId);
      const updatedReel = res.data;
      const isLiking = updatedReel.likes?.includes(user?._id);

      // Cập nhật state cho cả danh sách và video hiện tại
      setAllReels(prevReels =>
        prevReels.map(reel => {
          if (reel._id === reelId) {
            return {
              ...updatedReel,
              liked: updatedReel.likes?.includes(user?._id)
            };
          }
          return reel;
        })
      );
      
      setCurrentReel(prevReel =>
        prevReel._id === reelId ? {
          ...updatedReel,
          liked: updatedReel.likes?.includes(user?._id)
        } : prevReel
      );

      // Gửi thông báo khi like
      if (isLiking && updatedReel.author._id !== user._id) {
        sendNotification({
          receiverId: updatedReel.author._id,
          type: 'like',
          videoId: reelId,
        });
        toast.success("Đã thích video");
      } else {
        toast.success("Đã bỏ thích video");
      }
    } catch (error) {
      console.error('Error liking reel:', error);
      toast.error("Đã xảy ra lỗi khi thích video");
    }
  };

  const handleShare = () => {
    try {
      setSharePopup({
        open: true,
        videoId: currentReel._id,
        postTitle: currentReel.title,
      });

      // Gửi thông báo khi share
      if (currentReel?.author?._id !== user._id) {
        sendNotification({
          receiverId: currentReel.author._id,
          type: 'share',
          videoId: currentReel._id,
          message: `${user.firstName} đã chia sẻ video của bạn`,
        });
      }
      toast.success("Đã mở cửa sổ chia sẻ");
    } catch (error) {
      console.error('Error sharing video:', error);
      toast.error("Không thể mở cửa sổ chia sẻ");
    }
  };

  const handleOpenReelComment = async (reel) => {
    try {
      setShowReelComment(true);
    } catch (error) {
      console.error('Error opening comment panel:', error);
      toast.error("Không thể mở bảng bình luận");
    }
  };

  const handleCloseReelComment = () => {
    try {
      setShowReelComment(false);
    } catch (error) {
      console.error('Error closing comment panel:', error);
      toast.error("Không thể đóng bảng bình luận");
    }
  };

  const handleAddComment = async (text) => {
    if (!currentReel || !text.trim()) {
      toast.error("Video hiện tại không tồn tại hoặc vui lòng nhập nội dung bình luận");
      return;
    }

    try {
      toast.info("Đang thêm bình luận...");
      const response = await createComment({
        targetId: currentReel._id,
        targetType: 'video',
        text: text.trim()
      });

      if (response.data) {
        // Fetch updated reel data to get the new comment count
        try {
          const updatedReelResponse = await getVideoById(currentReel._id);
          const videoData = updatedReelResponse.data;

          setCurrentReel(videoData);

          setAllReels(prevReels =>
            prevReels.map(reel =>
              reel._id === currentReel._id
                ? videoData
                : reel
            )
          );

        } catch (fetchError) {
          console.error("Error fetching updated reel data after comment:", fetchError);
        }

        setReelCommentRefreshKey(prev => prev + 1); // Trigger CommentList refresh

        // Gửi thông báo
        if (currentReel.author._id !== user._id) {
          sendNotification({
            receiverId: currentReel.author._id,
            type: 'comment',
            videoId: currentReel._id,
            message: `${user.firstName} đã bình luận: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
          });
        }

        toast.success('Đã thêm bình luận thành công');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Không thể thêm bình luận. Vui lòng thử lại sau');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!isInitialized || allReels.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Không có video nào</p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <div
        ref={containerRef}
        className="h-[calc(100vh-120px)] overflow-y-auto snap-y snap-mandatory scrollbar-none"
      >
        {allReels?.map((reel, index) => (
          <div
            key={reel._id}
            className="snap-start h-[calc(100vh-120px)]"
          >
            <ReelCard
              reel={reel}
              onLike={() => handleLike(reel._id)}
              onComment={() => handleOpenReelComment(reel)}
              onShare={handleShare}
            />
          </div>
        ))}
      </div>

      <ReelCommentPanel
        reel={currentReel}
        open={showReelComment}
        onClose={handleCloseReelComment}
        onAddComment={handleAddComment}
        refreshKey={reelCommentRefreshKey}
      />

      <SharePopup
        open={sharePopup.open}
        videoId={sharePopup.videoId}
        postTitle={sharePopup.postTitle}
        onClose={() => setSharePopup({ open: false, videoId: null, postTitle: null })}
        type="video"
      />

      <style jsx>{`
        .scrollbar-none {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Reels;
