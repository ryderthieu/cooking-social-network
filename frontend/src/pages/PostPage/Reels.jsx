import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReelCard from '../../components/common/ReelCard';
import ReelCommentPanel from '../../components/common/ReelCommentPanel';
import SharePopup from '../../components/common/SharePopup';
import { mockReels } from './mockData';

const Reels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const lastScrollTop = useRef(0);
  
  const [currentReel, setCurrentReel] = useState(null);
  const [prevReel, setPrevReel] = useState(null);
  const [nextReel, setNextReel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null });
  const [showReelComment, setShowReelComment] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);

  // Hàm giả lập việc lấy video từ API
  const fetchReelById = async (reelId) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const reel = mockReels.find(r => r.id === parseInt(reelId));
    setIsLoading(false);
    return reel;
  };

  // Hàm giả lập việc lấy video tiếp theo/trước đó
  const fetchAdjacentReels = async (reelId) => {
    const currentIndex = mockReels.findIndex(r => r.id === parseInt(reelId));
    if (currentIndex > 0) {
      setPrevReel(mockReels[currentIndex - 1]);
    } else {
      setPrevReel(null);
    }
    
    if (currentIndex < mockReels.length - 1) {
      setNextReel(mockReels[currentIndex + 1]);
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
  }, [id]);

  const handleScroll = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;
    const scrollingDown = currentScrollTop > lastScrollTop.current;
    lastScrollTop.current = currentScrollTop;

    // Tìm index của video hiện tại trong danh sách
    const currentIndex = mockReels.findIndex(r => r.id === parseInt(id));
    
    // Xác định video tiếp theo dựa vào hướng cuộn
    let nextId;
    if (scrollingDown && currentIndex < mockReels.length - 1) {
      nextId = mockReels[currentIndex + 1].id;
    } else if (!scrollingDown && currentIndex > 0) {
      nextId = mockReels[currentIndex - 1].id;
    }

    // Nếu có video tiếp theo và ID khác với ID hiện tại
    if (nextId && nextId !== parseInt(id)) {
      navigate(`/explore/reels/${nextId}`, { replace: true });
      const nextReel = mockReels.find(r => r.id === nextId);
      if (nextReel) {
        setCurrentReel(nextReel);
        fetchAdjacentReels(nextId);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      let scrollTimeout;
      
      const handleScrollWithDebounce = (e) => {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
          handleScroll(e);
        }, 50); // Debounce 50ms
      };

      container.addEventListener('scroll', handleScrollWithDebounce);
      return () => {
        container.removeEventListener('scroll', handleScrollWithDebounce);
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
      };
    }
  }, [id]);

  const handleReelLike = (id) => {
    if (currentReel?.id === id) {
      setCurrentReel(reel => ({
        ...reel,
        liked: !reel.liked,
        likes: reel.liked ? reel.likes - 1 : reel.likes + 1
      }));
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

  const handleAddReelComment = (text) => {
    if (!selectedReel) return;

    const newComment = {
      id: Date.now(),
      user: 'Bạn',
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      text,
      likes: 0,
      time: 'Vừa xong',
      replies: []
    };

    if (currentReel?.id === selectedReel.id) {
      setCurrentReel(reel => ({
        ...reel,
        comments: [newComment, ...(Array.isArray(reel.comments) ? reel.comments : [])]
      }));
    }

    setSelectedReel(prev => ({
      ...prev,
      comments: [newComment, ...(Array.isArray(prev.comments) ? prev.comments : [])]
    }));
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
              onShare={() => setSharePopup({ open: true, postId: prevReel.id })}
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
              onShare={() => setSharePopup({ open: true, postId: currentReel.id })}
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
              onShare={() => setSharePopup({ open: true, postId: nextReel.id })}
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