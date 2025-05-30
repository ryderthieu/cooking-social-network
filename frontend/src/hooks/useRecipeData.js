import { useState, useEffect } from 'react';

// Import các hình ảnh tạm để test (sau này sẽ thay bằng API)
import image2 from "../assets/Recipe/images/blog1.png";
import image3 from "../assets/Recipe/images/blog2.png";
import image4 from "../assets/Recipe/images/blog3.png";
import image5 from "../assets/Recipe/images/blog4.png";
import { Korea1 } from "../assets/Recipe/images/index.js";

export const useRecipeData = (categoryType, item) => {
  // State để lưu tất cả data
  const [data, setData] = useState({
    blogs: [],
    popularRecipes: [],
    allRecipes: [],
    categories: [],
    loading: true,
    error: null
  });

  // State để quản lý phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    hasMore: true
  });

  // Fake data 
  const mockData = {
    blogs: [
      {
        id: 1,
        title: "Vì sao đã rất no ta vẫn có thể ăn thêm tráng miệng?",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        image: image2,
        publishedAt: "2024-11-12",
        author: {
          name: "Robert Fox",
          avatar: "https://via.placeholder.com/40"
        }
      },
      {
        id: 2,
        title: "10 siêu phẩm tráng miệng bạn nên thử",
        excerpt: "Khám phá những món tráng miệng độc đáo",
        image: image3,
        publishedAt: "2024-11-10",
        author: {
          name: "Jane Doe",
          avatar: "https://via.placeholder.com/40"
        }
      },
      {
        id: 3,
        title: "4 món tráng miệng kinh điển từ socola ai cũng làm được",
        excerpt: "Hướng dẫn làm các món tráng miệng socola",
        image: image4,
        publishedAt: "2024-11-08",
        author: {
          name: "John Smith",
          avatar: "https://via.placeholder.com/40"
        }
      },
      {
        id: 4,
        title: "Chotto Matcha - món tráng miệng đang gây sốt",
        excerpt: "Xu hướng matcha trong ẩm thực hiện đại",
        image: image5,
        publishedAt: "2024-11-05",
        author: {
          name: "Sarah Wilson",
          avatar: "https://via.placeholder.com/40"
        }
      }
    ],
    categories: [
      { id: 1, title: "Hàn Quốc", image: Korea1, slug: "korean" },
      { id: 2, title: "Nhật Bản", image: Korea1, slug: "japanese" },
      { id: 3, title: "Việt Nam", image: Korea1, slug: "vietnamese" },
      { id: 4, title: "Thái Lan", image: Korea1, slug: "thai" },
      { id: 5, title: "Trung Quốc", image: Korea1, slug: "chinese" },
      { id: 6, title: "Ấn Độ", image: Korea1, slug: "indian" },
      { id: 7, title: "Âu", image: Korea1, slug: "european" },
      { id: 8, title: "Mỹ", image: Korea1, slug: "american" },
      { id: 9, title: "Mexico", image: Korea1, slug: "mexican" },
      { id: 10, title: "Ý", image: Korea1, slug: "italian" },
      { id: 11, title: "Pháp", image: Korea1, slug: "french" },
      { id: 12, title: "Đức", image: Korea1, slug: "german" }
    ]
  };

  // Effect để load data khi component mount hoặc khi categoryType/item thay đổi
  useEffect(() => {
    fetchData();
  }, [categoryType, item]);

  // Hàm fetch data chính
  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tạo mock recipes dựa trên categoryType và item
      const mockRecipes = Array.from({ length: 16 }, (_, index) => ({
        id: index + 1,
        title: `Công thức ${categoryType || 'recipe'} ${index + 1}`,
        image: Korea1,
        cookTime: `${Math.floor(Math.random() * 60) + 15} phút`,
        difficulty: ['Dễ', 'Trung bình', 'Khó'][Math.floor(Math.random() * 3)],
        rating: (Math.random() * 2 + 3).toFixed(1), // Rating từ 3-5
        category: item || 'general'
      }));

      setData({
        blogs: mockData.blogs,
        popularRecipes: mockRecipes.slice(0, 8),
        allRecipes: mockRecipes.slice(0, 8),
        categories: mockData.categories,
        loading: false,
        error: null
      });

      setPagination({
        page: 1,
        limit: 8,
        hasMore: mockRecipes.length > 8
      });

    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Có lỗi xảy ra khi tải dữ liệu'
      }));
    }
  };

  // Hàm load thêm recipes cho phân trang
  const loadMoreRecipes = async () => {
    try {
      const nextPage = pagination.page + 1;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Tạo thêm mock data
      const newRecipes = Array.from({ length: 8 }, (_, index) => ({
        id: pagination.page * 8 + index + 1,
        title: `Công thức ${categoryType || 'recipe'} ${pagination.page * 8 + index + 1}`,
        image: Korea1,
        cookTime: `${Math.floor(Math.random() * 60) + 15} phút`,
        difficulty: ['Dễ', 'Trung bình', 'Khó'][Math.floor(Math.random() * 3)],
        rating: (Math.random() * 2 + 3).toFixed(1),
        category: item || 'general'
      }));

      setData(prev => ({
        ...prev,
        allRecipes: [...prev.allRecipes, ...newRecipes]
      }));

      setPagination(prev => ({
        ...prev,
        page: nextPage,
        hasMore: nextPage < 3 // Giới hạn 3 trang để test
      }));

    } catch (error) {
      console.error('Error loading more recipes:', error);
    }
  };

  // Return tất cả data và functions
  return {
    // Data
    blogs: data.blogs,
    popularRecipes: data.popularRecipes,
    allRecipes: data.allRecipes,
    categories: data.categories,
    
    // Loading states
    loading: data.loading,
    error: data.error,
    
    // Pagination
    pagination,
    
    // Functions
    loadMoreRecipes,
    refetch: fetchData
  };
};