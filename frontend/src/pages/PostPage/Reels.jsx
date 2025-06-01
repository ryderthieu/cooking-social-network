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

const Reels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { sendNotification } = useSocket();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        
        if (response.success && response.data) {
          const formattedReels = response.data.map(reel => ({
            ...reel,
            user: {
              name: `${reel.author?.firstName || ''} ${reel.author?.lastName || ''}`.trim(),
              avatar: reel.author?.avatar,
              _id: reel.author?._id
            },
            video: reel.videoUri || reel.video,
            title: reel.caption || reel.title,
            date: new Date(reel.createdAt).toLocaleDateString(),
            likes: Array.isArray(reel.likes) ? reel.likes.length : 0,
            commentCount: Array.isArray(reel.comments) ? reel.comments.length : 0,
            shares: reel.shares?.length || 0,
            liked: Array.isArray(reel.likes) ? reel.likes.includes(user?._id) : false,
            _id: reel._id
          }));
          console.log('Formatted reels:', formattedReels);
          
          setAllReels(formattedReels);
          
          if (!id && formattedReels.length > 0) {
            navigate(`/explore/reels/${formattedReels[0]._id}`);
          } else if (id && formattedReels.length > 0) {
            const index = formattedReels.findIndex(reel => reel._id === id);
            if (index === -1) {
              navigate(`/explore/reels/${formattedReels[0]._id}`);
            } else {
              setCurrentIndex(index);
            }
          }
        } else {
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
  }, []);

  // Xử lý cuộn video
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const index = Math.round(scrollTop / itemHeight);

      if (index !== currentIndex && allReels[index]) {
        setCurrentIndex(index);
        navigate(`/explore/reels/${allReels[index]._id}`, { replace: true });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex, allReels]);

  // Cập nhật reel hiện tại khi id thay đổi
  useEffect(() => {
    if (!isInitialized || !allReels?.length) return;

    const currentReel = allReels.find(reel => reel._id === id);
    if (currentReel) {
      setCurrentReel(currentReel);
      const index = allReels.findIndex(reel => reel._id === id);
      if (index !== -1) {
        setCurrentIndex(index);
        // Cuộn đến video hiện tại
        containerRef.current?.scrollTo({
          top: index * containerRef.current.clientHeight,
          behavior: 'smooth'
        });
      }
    } else if (allReels.length > 0) {
      // Nếu không tìm thấy video với id hiện tại, chuyển hướng đến video đầu tiên
      navigate(`/explore/reels/${allReels[0]._id}`);
    }
  }, [id, allReels, isInitialized]);

  const handleLike = async (reelId) => {
    try {
      const res = await likeVideo(reelId);
      const updatedReel = res.data.video;
      const isLiking = res.data.message === "Đã like video";

      // Cập nhật state cho cả danh sách và video hiện tại
      setAllReels(prevReels =>
        prevReels.map(reel => {
          if (reel._id === reelId) {
            return {
              ...reel,
              likes: updatedReel.likes.length,
              liked: updatedReel.likes.includes(user?._id)
            };
          }
          return reel;
        })
      );
      setCurrentReel(prevReel => 
        prevReel._id === reelId ? updatedReel : prevReel
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
        postTitle: currentReel.title 
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
          if (updatedReelResponse.success && updatedReelResponse.data) {
            const videoData = updatedReelResponse.data;
            const updatedReelFromServer = {
              ...videoData,
              user: { 
                name: `${videoData.author?.firstName || ''} ${videoData.author?.lastName || ''}`.trim(),
                avatar: videoData.author?.avatar,
                _id: videoData.author?._id
              },
              video: videoData.videoUri || videoData.video,
              title: videoData.caption || videoData.title,
              date: new Date(videoData.createdAt).toLocaleDateString(),
              likes: Array.isArray(videoData.likes) ? videoData.likes.length : 0,
              commentCount: Array.isArray(videoData.comments) ? videoData.comments.length : 0,
              shares: videoData.shares?.length || 0, 
              liked: Array.isArray(videoData.likes) ? videoData.likes.includes(user?._id) : false,
              _id: videoData._id
            };

            setCurrentReel(updatedReelFromServer);

            setAllReels(prevReels =>
              prevReels.map(reel =>
                reel._id === currentReel._id
                  ? updatedReelFromServer
                  : reel
              )
            );
          } else {
            // Fallback: if fetching updated reel fails, try to optimistically update count
            setCurrentReel(prev => ({ 
              ...prev, 
              commentCount: (prev.commentCount !== undefined ? prev.commentCount : (Array.isArray(prev.comments) ? prev.comments.length : 0)) + 1 
            }));
            setAllReels(prevReels =>
              prevReels.map(reel =>
                reel._id === currentReel._id
                  ? { ...reel, commentCount: (reel.commentCount !== undefined ? reel.commentCount : (Array.isArray(reel.comments) ? reel.comments.length : 0)) + 1 }
                  : reel
              )
            );
          }
        } catch (fetchError) {
          console.error("Error fetching updated reel data after comment:", fetchError);
          // Fallback: optimistically update count even if fetch fails
          setCurrentReel(prev => ({ 
            ...prev, 
            commentCount: (prev.commentCount !== undefined ? prev.commentCount : (Array.isArray(prev.comments) ? prev.comments.length : 0)) + 1 
          }));
          setAllReels(prevReels =>
            prevReels.map(reel =>
              reel._id === currentReel._id
                ? { ...reel, commentCount: (reel.commentCount !== undefined ? reel.commentCount : (Array.isArray(reel.comments) ? reel.comments.length : 0)) + 1 }
                : reel
            )
          );
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

  // Xử lý phím mũi tên
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        navigate(`/explore/reels/${allReels[newIndex]._id}`, { replace: true });
        containerRef.current?.scrollTo({
          top: newIndex * containerRef.current.clientHeight,
          behavior: 'smooth'
        });
      } else if (e.key === 'ArrowDown' && currentIndex < allReels.length - 1) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        navigate(`/explore/reels/${allReels[newIndex]._id}`, { replace: true });
        containerRef.current?.scrollTo({
          top: newIndex * containerRef.current.clientHeight,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allReels]);

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
              isVisible={index === currentIndex}
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
