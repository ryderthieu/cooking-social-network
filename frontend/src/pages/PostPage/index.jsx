import React, { useState, useRef, useEffect } from 'react';
import { FaRegThumbsUp, FaRegCommentDots, FaShare, FaUserFriends, FaTag, FaFire, FaTimes, FaCopy, FaFacebook, FaTwitter, FaPlusCircle, FaEllipsisH, FaEdit, FaTrash, FaBookmark, FaVideo, FaUser, FaBookmark as FaBookmarkSolid, FaUtensils, FaPlus, FaNewspaper, FaPlay, FaHeart, FaComment, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LeftSidebar, RightSidebar } from '../../components/sections/Post/Sidebar';
import { PostCard } from '../../components/common/Post';
import PostDetail from './PostDetail';
import { useNavigate } from 'react-router-dom';
import CommentList from '../../components/common/PostDetail/CommentList';
import CommentForm from '../../components/common/PostDetail/CommentForm';
import ReelCard from '../../components/common/ReelCard';
import ReelCommentPanel from '../../components/common/ReelCommentPanel';
import SharePopup from '../../components/common/SharePopup';

export const mockPosts = [
  {
    id: 1,
    user: {
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    date: '2024-06-01',
    content: 'Hôm nay mình vừa thử làm bánh mì Việt Nam, thành công ngoài mong đợi! Ai muốn công thức không nè? 🥖',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    ],
    likes: 12,
    comments: [
      { id: 1, user: 'Lê Minh', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', text: 'Nhìn ngon quá!' },
      { id: 2, user: 'Mai Hương', avatar: 'https://randomuser.me/api/portraits/women/46.jpg', text: 'Cho mình xin công thức với!' }
    ],
    shares: 1,
    liked: false,
  },
  {
    id: 2,
    user: {
      name: 'Trần Thị B',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    date: '2024-05-30',
    content: 'Phở bò nhà làm, nước dùng ngọt thanh, thơm phức! Mọi người thích ăn phở không? 🍜',
    images: [
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1573806439793-82aa612294b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1576749872435-ff88a71c1ae2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    likes: 25,
    comments: [
      { id: 1, user: 'Nguyễn Văn A', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Tuyệt vời quá!' }
    ],
    shares: 2,
    liked: true,
  },
  {
    id: 3,
    user: {
      name: 'Chef Hùng',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    },
    date: '2024-05-29',
    content: 'Gỏi cuốn tôm thịt cho bữa trưa nay. Chấm với nước mắm chua ngọt là số dzách! 🌯✨',
    images: [
      'https://images.unsplash.com/photo-1548811256-1627d99e7a4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1576577445504-6c2bb58f58d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    likes: 42,
    comments: [
      { id: 1, user: 'Lan Anh', avatar: 'https://randomuser.me/api/portraits/women/43.jpg', text: 'Nhìn đẹp quá anh ơi!' },
      { id: 2, user: 'Minh Tuấn', avatar: 'https://randomuser.me/api/portraits/men/44.jpg', text: 'Công thức với anh!' }
    ],
    shares: 5,
    liked: false,
  },
  {
    id: 4,
    user: {
      name: 'Foodie Linh',
      avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
    },
    date: '2024-05-28',
    content: 'Bánh xèo miền Tây đây ạ! Giòn rụm, ăn kèm rau sống và nước mắm chua ngọt. Ai muốn làm thử không? 🥞',
    images: [
      'https://images.unsplash.com/photo-1576577445504-6c2bb58f58d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1583385883634-00fa5e376d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1592285896110-8d88b5b3a5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1576749872435-ff88a71c1ae2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ],
    likes: 89,
    comments: [
      { id: 1, user: 'Thanh Thảo', avatar: 'https://randomuser.me/api/portraits/women/52.jpg', text: 'Nhìn hấp dẫn quá chị ơi!' },
      { id: 2, user: 'Văn Đức', avatar: 'https://randomuser.me/api/portraits/men/53.jpg', text: 'Công thức đi chị!' },
      { id: 3, user: 'Thu Hà', avatar: 'https://randomuser.me/api/portraits/women/54.jpg', text: 'Để em save lại!' }
    ],
    shares: 12,
    liked: true,
  }
];

const mockReels = [
  {
    id: 1,
    user: {
      name: 'Chef Tony',
      avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
    },
    date: '2024-06-01',
    title: 'Cách làm bánh mì Việt Nam tại nhà',
    video: 'https://www.youtube.com/shorts/KSt9oH2CYus?feature=share',
    likes: 1200,
    comments: [
      {
        id: 1,
        user: 'Lê Minh',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        text: 'Video hay quá!',
        likes: 5,
        time: '2 giờ trước',
        replies: []
      },
      {
        id: 2,
        user: 'Mai Hương',
        avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
        text: 'Cho mình xin công thức với!',
        likes: 3,
        time: '1 giờ trước',
        replies: []
      }
    ],
    shares: 45,
    liked: false,
  },
  {
    id: 2,
    user: {
      name: 'Foodie Linh',
      avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
    },
    date: '2024-05-30',
    title: 'Hướng dẫn làm phở bò truyền thống',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-pasta-in-a-pan-close-up-4294-large.mp4',
    likes: 2500,
    comments: [
      {
        id: 1,
        user: 'Thanh Hà',
        avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
        text: 'Phở nhìn ngon quá chị ơi!',
        likes: 8,
        time: '3 giờ trước',
        replies: [
          {
            id: 11,
            user: 'Foodie Linh',
            avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
            text: 'Cảm ơn em nha!',
            likes: 2,
            time: '2 giờ trước'
          }
        ]
      }
    ],
    shares: 78,
    liked: true,
  },
  {
    id: 3,
    user: {
      name: 'Master Chef',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    },
    date: '2024-05-29',
    title: 'Bí quyết làm nước dùng phở ngon',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-pasta-in-a-pan-close-up-4294-large.mp4',
    likes: 1800,
    comments: [
      {
        id: 1,
        user: 'Minh Tuấn',
        avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
        text: 'Cảm ơn anh đã chia sẻ!',
        likes: 4,
        time: '5 giờ trước',
        replies: []
      }
    ],
    shares: 65,
    liked: false,
  }
];

const mockFollowed = [
  { name: 'Nguyễn Văn C', avatar: 'https://randomuser.me/api/portraits/men/48.jpg' },
  { name: 'Phạm Thị D', avatar: 'https://randomuser.me/api/portraits/women/49.jpg' },
];
const mockSuggestFollow = [
  { name: 'Chef Tony', avatar: 'https://randomuser.me/api/portraits/men/50.jpg', followers: 12000 },
  { name: 'Foodie Linh', avatar: 'https://randomuser.me/api/portraits/women/51.jpg', followers: 9500 },
];

const mockHotDishes = [
  { name: 'Bánh mì chảo', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=60', posts: 120 },
  { name: 'Phở bò', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=100&q=60', posts: 98 },
];
const leftSidebar = {
  profile: {
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    posts: 12,
    followers: 340,
  },
  menu: [
    { label: 'Bài viết', icon: <FaNewspaper />, href: '#', active: true },
    { label: 'Reels', icon: <FaVideo />, href: '#', active: false },
    { label: 'Trang cá nhân', icon: <FaUser />, href: '/profile', active: false },
    { label: 'Bài viết đã lưu', icon: <FaBookmarkSolid />, href: '/saved', active: false },
    { label: 'Công thức của tôi', icon: <FaUtensils />, href: '/my-recipes', active: false },
  ]
}

const rightSidebar = {
  suggestFollow: mockFollowed,
  hotDishs: mockHotDishes
}

const PostPage = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [reels, setReels] = useState(mockReels);
  const [sharePopup, setSharePopup] = useState({ open: false, postId: null });
  const [activeTab, setActiveTab] = useState('posts');
  const [showReelComment, setShowReelComment] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);
  const navigate = useNavigate();

  const handleLike = (id) => {
    setPosts(posts => posts.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleReelLike = (id) => {
    setReels(reels => reels.map(reel =>
      reel.id === id
        ? { ...reel, liked: !reel.liked, likes: reel.liked ? reel.likes - 1 : reel.likes + 1 }
        : reel
    ));
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

    setReels(reels => reels.map(reel =>
      reel.id === selectedReel.id
        ? {
          ...reel,
          comments: Array.isArray(reel.comments)
            ? [newComment, ...reel.comments]
            : [newComment]
        }
        : reel
    ));

    setSelectedReel(prev => ({
      ...prev,
      comments: [newComment, ...(Array.isArray(prev.comments) ? prev.comments : [])]
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const reelId = parseInt(entry.target.dataset.reelId);
            const currentReel = reels.find(r => r.id === reelId);
            if (currentReel && showReelComment) {
              setSelectedReel(currentReel);
            }
          }
        });
      },
      {
        threshold: 0.7
      }
    );

    const reelElements = document.querySelectorAll('[data-reel-id]');
    reelElements.forEach(el => observer.observe(el));

    return () => {
      reelElements.forEach(el => observer.unobserve(el));
    };
  }, [reels, showReelComment]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF4D6] via-white to-[#FFF4D6] py-10 px-2 lg:px-8">
      <div className="max-w-7xl mx-auto flex gap-8 relative">
        <LeftSidebar
          data={leftSidebar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-2xl">
            {activeTab === 'posts' ? (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                  onComment={() => navigate(`/posts/${post.id}`)}
                  onShare={() => setSharePopup({ open: true, postId: post.id })}
                />
              ))
            ) : (
              <div className="h-[calc(100vh-120px)] overflow-y-auto snap-y snap-mandatory scrollbar-none">
                {reels.map(reel => (
                  <div key={reel.id} data-reel-id={reel.id} className="snap-start h-[calc(100vh-120px)] flex items-center justify-center">
                    <ReelCard
                      reel={reel}
                      onLike={() => handleReelLike(reel.id)}
                      onComment={() => handleOpenReelComment(reel)}
                      onShare={() => setSharePopup({ open: true, postId: reel.id })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar or Comment Panel */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          {!showReelComment && (
            <div className="sticky top-24">
              <RightSidebar data={rightSidebar} />
            </div>
          )}
          <ReelCommentPanel
            reel={selectedReel}
            open={showReelComment}
            onClose={handleCloseReelComment}
            onAddComment={handleAddReelComment}
          />
        </div>
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

export default PostPage;