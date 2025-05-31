import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReelCard from '../../components/common/ReelCard';
import ReelCommentPanel from '../../components/common/ReelCommentPanel';
import SharePopup from '../../components/common/SharePopup';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { getAllVideos, getVideoById, likeVideo, commentVideo, shareVideo } from '@/services/videoService';

const Reels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const lastScrollTop = useRef(0);
  const { sendNotification } = useSocket();
  const { user } = useAuth();
  
  const [currentReel, setCurrentReel] = useState(null);
  const [prevReel, setPrevReel] = useState(null);
  const [nextReel, setNextReel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null });
  const [showReelComment, setShowReelComment] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const [allReels, setAllReels] = useState([]);

  // Lấy tất cả video khi component mount
  useEffect(() => {
    const fetchAllReels = async () => {
      try {
        const response = await getAllVideos();
        setAllReels(response.data);
      } catch (error) {
        console.error('Error fetching reels:', error);
      }
    };
    fetchAllReels();
  }, []);

  // Lấy video theo ID
  const fetchReelById = async (reelId) => {
    setIsLoading(true);
    try {
      const response = await getVideoById(reelId);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error fetching reel:', error);
      setIsLoading(false);
      return null;
    }
  };

  // Lấy video trước và sau
  const fetchAdjacentReels = async (reelId) => {
    const currentIndex = allReels.findIndex(r => r._id === reelId);
    if (currentIndex > 0) {
      setPrevReel(allReels[currentIndex - 1]);
    } else {
      setPrevReel(null);
    }
    
    if (currentIndex < allReels.length - 1) {
      setNextReel(allReels[currentIndex + 1]);
    } else {
      setNextReel(null);
    }
  };

  // Load video khi id trong URL thay đổi
  useEffect(() => {
    const loadReel = async () => {
      if (id) {
        const reel = await fetchReelById(id);
        if (reel) {
          setCurrentReel(reel);
          fetchAdjacentReels(id);
        } else {
          navigate('/explore/reels/1', { replace: true });
        }
      } else {
        navigate('/explore/reels/1', { replace: true });
      }
    };
    loadReel();
  }, [id, allReels]);

  const handleScroll = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;
    const scrollingDown = currentScrollTop > lastScrollTop.current;
    lastScrollTop.current = currentScrollTop;

    // Tìm index của video hiện tại trong danh sách
    const currentIndex = allReels.findIndex(r => r._id === id);
    
    // Xác định video tiếp theo dựa vào hướng cuộn
    let nextId;
    if (scrollingDown && currentIndex < allReels.length - 1) {
      nextId = allReels[currentIndex + 1]._id;
    } else if (!scrollingDown && currentIndex > 0) {
      nextId = allReels[currentIndex - 1]._id;
    }

    // Nếu có video tiếp theo và ID khác với ID hiện tại
    if (nextId && nextId !== id) {
      navigate(`/explore/reels/${nextId}`, { replace: true });
      const nextReel = allReels.find(r => r._id === nextId);
      if (nextReel) {
        setCurrentReel(nextReel);
        fetchAdjacentReels(nextId);
      }
    }
  };

  const handleReelLike = async (id) => {
    try {
      const response = await likeVideo(id);
      const updatedReel = response.data;
      const willLike = !currentReel.likes.includes(user._id);

      if (currentReel?._id === id) {
        setCurrentReel(updatedReel);
      }

      // Gửi thông báo khi like
      if (willLike && currentReel.author._id !== user._id) {
        sendNotification({
          receiverId: currentReel.author._id,
          type: 'like',
          videoId: currentReel._id,
        });
      }
    } catch (error) {
      console.error('Error liking reel:', error);
    }
  };

  const handleAddReelComment = async (text) => {
    if (!selectedReel) return;

    try {
      const response = await commentVideo(selectedReel._id, { text });
      const newComment = response.data;

      if (currentReel?._id === selectedReel._id) {
        setCurrentReel(reel => ({
          ...reel,
          comments: [newComment, ...(Array.isArray(reel.comments) ? reel.comments : [])]
        }));

        // Gửi thông báo khi comment
        if (currentReel.author._id !== user._id) {
          sendNotification({
            receiverId: currentReel.author._id,
            type: 'comment',
            videoId: currentReel._id,
            message: `${user.firstName} đã bình luận: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
          });
        }
      }

      setSelectedReel(prev => ({
        ...prev,
        comments: [newComment, ...(Array.isArray(prev.comments) ? prev.comments : [])]
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async () => {
    try {
      await shareVideo(currentReel._id);
      setSharePopup({ open: true, postId: currentReel._id });
      
      // Gửi thông báo khi share
      if (currentReel.author._id !== user._id) {
        sendNotification({
          receiverId: currentReel.author._id,
          type: 'share',
          videoId: currentReel._id,
        });
      }
    } catch (error) {
      console.error('Error sharing reel:', error);
    }
  };

  const handleOpenReelComment = (reel) => {
    if (selectedReel?.id === reel.id && showReelComment) {
      setShowReelComment(false);
      setTimeout(() => setSelectedReel(null), 500);
    } else {
      setSelectedReel(reel);
      setShowReelComment(true);
    }
  };

  const handleCloseReelComment = () => {
    setShowReelComment(false);
    setTimeout(() => setSelectedReel(null), 500);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFB800]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <div 
        ref={containerRef}
        className="h-[calc(100vh-120px)] overflow-y-auto snap-y snap-mandatory scrollbar-none"
      >
        {prevReel && (
          <div 
            data-reel-id={prevReel.id} 
            className="snap-start h-[calc(100vh-120px)] flex items-center justify-center"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ReelCard
              reel={prevReel}
              onLike={() => handleReelLike(prevReel.id)}
              onComment={() => handleOpenReelComment(prevReel)}
              onShare={() => handleShare()}
              isVisible={false}
            />
          </div>
        )}

        {currentReel && (
          <div 
            data-reel-id={currentReel.id} 
            className="snap-start h-[calc(100vh-120px)] flex items-center justify-center"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ReelCard
              reel={currentReel}
              onLike={() => handleReelLike(currentReel.id)}
              onComment={() => handleOpenReelComment(currentReel)}
              onShare={() => handleShare()}
              isVisible={true}
            />
          </div>
        )}

        {nextReel && (
          <div 
            data-reel-id={nextReel.id} 
            className="snap-start h-[calc(100vh-120px)] flex items-center justify-center"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ReelCard
              reel={nextReel}
              onLike={() => handleReelLike(nextReel.id)}
              onComment={() => handleOpenReelComment(nextReel)}
              onShare={() => handleShare()}
              isVisible={false}
            />
          </div>
        )}
      </div>

      <div className="w-80 flex-shrink-0 hidden lg:block absolute top-0 right-0">
        <ReelCommentPanel
          reel={selectedReel}
          open={showReelComment}
          onClose={handleCloseReelComment}
          onAddComment={handleAddReelComment}
        />
      </div>

      <SharePopup
        open={sharePopup.open}
        postId={sharePopup.postId}
        postTitle={currentReel?.content}
        onClose={() => setSharePopup({ open: false, postId: null })}
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