const Blog = require("../models/blog");
const User = require("../models/user");

// Get all blogs with pagination and filters
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      category,
      tag,
      author,
      featured,
      search,
      status = "published"
    } = req.query;

    // Build filter object
    let filter = { status };

    if (category) filter.categories = { $in: [category] };
    if (tag) filter.tags = { $in: [tag] };
    if (author) filter.author = author;
    if (featured !== undefined) filter.featured = featured === "true";

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    const blogs = await Blog.find(filter)
      .populate("author", "firstName lastName avatar")
      .populate("relatedRecipes", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error getting blogs:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách blog",
      error: error.message,
    });
  }
};

// Get blog by ID or slug
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ObjectId first, then by slug
    let blog = await Blog.findById(id)
      .populate("author", "firstName lastName avatar bio")
      .populate("relatedRecipes", "name image cookingTime difficulty");

    if (!blog) {
      blog = await Blog.findOne({ slug: id })
        .populate("author", "firstName lastName avatar bio")
        .populate("relatedRecipes", "name image cookingTime difficulty");
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy bài viết",
      error: error.message,
    });
  }
};

// Get featured blogs
const getFeaturedBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const blogs = await Blog.find({ 
      status: "published", 
      featured: true 
    })
      .populate("author", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error getting featured blogs:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy blog nổi bật",
      error: error.message,
    });
  }
};

// Get related blogs (by categories/tags)
const getRelatedBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 3;

    const currentBlog = await Blog.findById(id);
    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    // Find blogs with similar categories or tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: id },
      status: "published",
      $or: [
        { categories: { $in: currentBlog.categories } },
        { tags: { $in: currentBlog.tags } }
      ]
    })
      .populate("author", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: relatedBlogs,
    });
  } catch (error) {
    console.error("Error getting related blogs:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy blog liên quan",
      error: error.message,
    });
  }
};

// Create new blog
const createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id,
    };

    const blog = new Blog(blogData);
    await blog.save();

    const populatedBlog = await Blog.findById(blog._id)
      .populate("author", "firstName lastName avatar");

    res.status(201).json({
      success: true,
      data: populatedBlog,
      message: "Tạo blog thành công",
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo blog",
      error: error.message,
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền chỉnh sửa bài viết này",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "firstName lastName avatar");

    res.status(200).json({
      success: true,
      data: updatedBlog,
      message: "Cập nhật blog thành công",
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật blog",
      error: error.message,
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    // Check if user is author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa bài viết này",
      });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Xóa blog thành công",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa blog",
      error: error.message,
    });
  }
};

// Toggle like blog
const toggleLikeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      data: {
        isLiked: !isLiked,
        likesCount: blog.likes.length,
      },
      message: isLiked ? "Đã bỏ thích" : "Đã thích bài viết",
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Không thể thích/bỏ thích bài viết",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  getFeaturedBlogs,
  getRelatedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
};
