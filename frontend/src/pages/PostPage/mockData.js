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
  }
];

export const mockReels = [
  {
    id: 1,
    user: {
      name: 'Chef Tony',
      avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
    },
    date: '2024-03-20',
    title: 'Cách làm bánh mì Việt Nam tại nhà',
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    video: 'https://www.youtube.com/shorts/KSt9oH2CYus?feature=share',
    likes: '1.7M',
    comments: [
      {
        id: 1,
        user: 'Lê Minh',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        text: 'Video hay quá!',
        likes: 5,
        time: '2 giờ trước',
        replies: []
      }
    ],
    shares: 45,
    liked: false
  },
  {
    id: 2,
    user: {
      name: 'Chef Anna',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    date: '2024-03-19',
    title: 'Bí quyết làm sushi ngon tại nhà',
    thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    video: 'https://www.youtube.com/shorts/abc123',
    likes: '4.9K',
    comments: [],
    shares: 28,
    liked: false
  }
];

export const mockFollowed = [
  { name: 'Nguyễn Văn C', avatar: 'https://randomuser.me/api/portraits/men/48.jpg' },
  { name: 'Phạm Thị D', avatar: 'https://randomuser.me/api/portraits/women/49.jpg' },
];

export const mockSuggestFollow = [
  { name: 'Chef Tony', avatar: 'https://randomuser.me/api/portraits/men/50.jpg', followers: 12000 },
  { name: 'Foodie Linh', avatar: 'https://randomuser.me/api/portraits/women/51.jpg', followers: 9500 },
];

export const mockHotDishes = [
  { name: 'Bánh mì chảo', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=60', posts: 120 },
  { name: 'Phở bò', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=100&q=60', posts: 98 },
];

export const leftSidebarData = {
  profile: {
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    posts: 12,
    followers: 340,
  },
  menu: [
    { label: 'Bài viết', icon: 'FaNewspaper', href: '/posts', active: true },
    { label: 'Reels', icon: 'FaVideo', href: '/reels', active: false },
    { label: 'Trang cá nhân', icon: 'FaUser', href: '/profile', active: false },
    { label: 'Bài viết đã lưu', icon: 'FaBookmark', href: '/saved', active: false },
    { label: 'Công thức của tôi', icon: 'FaUtensils', href: '/my-recipes', active: false },
  ]
};

export const rightSidebarData = {
  suggestFollow: mockFollowed,
  hotDishes: mockHotDishes
}; 