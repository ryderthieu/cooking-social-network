import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeaturedBlogs } from "@/services/blogService";
import { Clock, Eye } from "lucide-react";

export default function RelatedRecipes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedBlogs(3); // Get 3 featured blogs for sidebar
        setBlogs(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Không thể tải bài viết");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [id]);

  if (loading) {
    return (
      <div>
        <h3 className="font-semibold mb-6 text-lg text-gray-800">
          Bài viết nổi bật
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-lg h-24 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !blogs || blogs.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-6 text-lg text-gray-800">
          Bài viết nổi bật
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            {error || "Không có bài viết nào."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-6 text-lg text-gray-800">
        Bài viết nổi bật
      </h3>      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => navigate(`/blog/${blog._id}`)}
            className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={blog.image || "/placeholder.svg?height=64&width=80"}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=64&width=80";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                {blog.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                {blog.excerpt}
              </p>
              
              {/* Blog metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{blog.readTime || 5} phút đọc</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{blog.views || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View all blogs link */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <a
          href="/blogs"
          className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
        >
          Xem tất cả bài viết →
        </a>
      </div>
    </div>
  );
}
