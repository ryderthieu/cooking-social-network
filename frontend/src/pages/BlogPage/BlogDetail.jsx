import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogById, getRelatedBlogs } from "../../services/blogService";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Recipes from "@/components/sections/Home/Recipes";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch blog details
        const blogResponse = await getBlogById(id);
        const blogData = blogResponse.data;
        setBlog(blogData);

        // Fetch related blogs
        try {
          const relatedResponse = await getRelatedBlogs(id, 4);
          setRelatedBlogs(relatedResponse.data || []);
        } catch (relatedError) {
          console.warn("Could not fetch related blogs:", relatedError);
          setRelatedBlogs([]);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    }  }, [id]);
  
  if (loading) {
    return (
      <div className="px-[300px] pt-[20px] pb-[20px]">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-8 animate-pulse"></div>
          <div className="h-[350px] bg-gray-200 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }  if (error || !blog) {
    return (
      <div className="px-[300px] pt-[20px] pb-[20px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Bài viết không tồn tại"}
          </h2>
          <p className="text-gray-600 mb-6">
            Xin lỗi, chúng tôi không thể tìm thấy bài viết bạn đang tìm kiếm.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#FF37A5] text-white font-semibold py-3 px-8 rounded-[30px] text-[14px] hover:bg-[#FF2A8F] transition-colors duration-300"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }  return (
    <div className="px-[300px] pt-[20px] pb-[20px]">
      <h1 className="font-semibold text-center text-[30px]">
        {blog.title}
      </h1>
      
      <div className="flex justify-center items-center gap-10 mt-[25px]">
        <div className="flex items-center gap-4">
          <img 
            className="w-12 h-12 rounded-full" 
            src={blog.author?.avatar || "https://via.placeholder.com/48"} 
            alt="Author" 
          />
          <p className="text-[16px] font-bold">
            {blog.author?.name || 
             (blog.author?.firstName && blog.author?.lastName 
               ? `${blog.author.firstName} ${blog.author.lastName}`
               : "Oshisha")}
          </p>
        </div>
        <div className="text-[16px] text-[rgba(0,0,0,0.6)] border-l-2 border-gray-200 pl-8 font-medium">
          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </div>
      </div>

      {blog.tags && blog.tags.length > 0 && (
        <p className="my-4 text-[16px] text-center text-[rgba(0,0,0,0.6)]">
          {blog.tags.join(", ")}
        </p>
      )}

      {blog.image && (
        <img
          className="mb-[30px] h-[350px] w-full object-cover rounded-3xl"
          src={blog.image}
          alt={blog.title}
        />
      )}

      <div className="flex">
        <div className="w-[70%]">
          {blog.excerpt && (
            <div className="mb-6">
              <p className="text-[rgba(0,0,0,0.6)] leading-7 text-justify">
                {blog.excerpt}
              </p>
            </div>
          )}          <div className="text-[rgba(0,0,0,0.6)] leading-7 text-justify">
            {blog.content ? (
              <div className="whitespace-pre-line space-y-4">
                {blog.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-7 text-justify">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Nội dung bài viết đang được cập nhật...</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-[30%] flex flex-col items-center gap-4">
          <h3 className="font-semibold my-2">Chia sẻ với</h3>
          <FaFacebookF className="w-8 h-8 my-2 cursor-pointer" />
          <FaTwitter className="w-8 h-8 my-2 cursor-pointer" />
          <FaInstagram className="w-8 h-8 my-2 cursor-pointer" />
        </div>
      </div>

      {relatedBlogs.length > 0 && (
        <div className="mb-8 mt-10">
          <Recipes />
          <Link to="/recipes" className="flex justify-center">
            <button className="bg-[#FF37A5] text-white font-semibold py-3 px-8 rounded-[30px] text-[14px] hover:bg-[#FF2A8F] transition-colors duration-300">
              Xem tất cả
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
