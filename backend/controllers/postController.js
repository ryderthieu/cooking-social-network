const Post = require("../models/post");
const User = require("../models/user");
const Recipe = require("../models/recipe");

const addPost = async (req, res) => {
  try {
    const { caption, recipe, videoUri, imgUri } = req.body;

    if (!caption || !recipe) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    let media = [];
    if (videoUri && typeof videoUri === "string") {
      const isValidUrl = /^(https?:\/\/)/.test(videoUri);
      if (!isValidUrl) {
        return res.status(400).json({ message: "URL video không hợp lệ" });
      }
      media.push({ url: videoUri, type: "video" });
    }

    if (Array.isArray(imgUri)) {
      imgUri.forEach((img) => {
        if (typeof img === "string" && /^(https?:\/\/)/.test(img)) {
          media.push({ url: img, type: "image" });
        }
      });
    }

    const newPost = new Post({
      author: req.user._id,
      caption,
      recipe,
      media,
      likes: 0,
      comments: [],
      shares: 0,
    });

    await newPost.save();
    const post = await Post.find();
    res.status(201).json({ message: "Post upload thành công", post });
  } catch (error) {
    console.error("Lỗi khi upload post:", error);
    res
      .status(500)
      .json({ message: "Post upload thất bại", error: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, recipe, videoUri, imgUri } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post không tồn tại" });
    }

    let media = [...post.media];

    if (videoUri) {
      const isValidUrl = /^(https?:\/\/)/.test(videoUri);
      if (!isValidUrl) {
        return res.status(400).json({ message: "URL video không hợp lệ" });
      }
      media = media.filter((item) => item.type !== "video");
      media.push({ url: videoUri, type: "video" });
    }

    if (imgUri && Array.isArray(imgUri)) {
      imgUri.forEach((img) => {
        const isValidUrl = /^(https?:\/\/)/.test(img);
        if (!isValidUrl) {
          return res.status(400).json({ message: "URL ảnh không hợp lệ" });
        }
      });
      media = media.filter((item) => item.type !== "image");
      imgUri.forEach((img) => media.push({ url: img, type: "image" }));
    }

    if (caption) post.caption = caption;
    if (recipe) post.recipe = recipe;
    if (media.length > 0) post.media = media;

    await post.save();
    res.status(200).json({ message: "Post cập nhật thành công", post });
  } catch (error) {
    console.error("Lỗi khi cập nhật post:", error);
    res
      .status(500)
      .json({ message: "Post cập nhật thất bại", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post không tồn tại" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post đã bị xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa post:", error);
    res
      .status(500)
      .json({ message: "Post xóa thất bại", error: error.message });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { keyword, userName, recipeName } = req.query;

    if (!keyword && !userName && !recipeName) {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa" });
    }

    let filter = {};

    if (keyword) {
      filter.caption = { $regex: keyword, $options: "i" };
    }

    if (userName) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: userName, $options: "i" } },
          { lastName: { $regex: userName, $options: "i" } },
        ],
      });

      if (users.length > 0) {
        const userIds = users.map((user) => user._id);
        filter.author = { $in: userIds };
      } else {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
    }

    if (recipeName) {
      const recipes = await Recipe.find({
        name: { $regex: recipeName, $options: "i" },
      });

      if (recipes.length > 0) {
        const recipeIds = recipes.map((recipe) => recipe._id);
        filter.recipe = { $in: recipeIds };
      } else {
        return res.status(404).json({ message: "Không tìm thấy công thức" });
      }
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "email firstName lastName")
      .populate("recipe", "name");

    res.status(200).json({
      message: "Kết quả tìm kiếm",
      posts,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm post:", error);
    res
      .status(500)
      .json({ message: "Tìm kiếm post thất bại", error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post không tồn tại" });
    }

    post.likes += 1;
    await post.save();
    res.status(200).json({ message: "Post đã được like", post });
  } catch (error) {
    console.error("Lỗi khi like post:", error);
    res
      .status(500)
      .json({ message: "Post like thất bại", error: error.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post không tồn tại" });
    }

    post.comments.push({ userId, comment });
    await post.save();
    res.status(200).json({ message: "Bình luận thành công", post });
  } catch (error) {
    console.error("Lỗi khi bình luận post:", error);
    res
      .status(500)
      .json({ message: "Bình luận thất bại", error: error.message });
  }
};

const sharePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post không tồn tại" });
    }

    post.shares += 1;
    await post.save();
    res.status(200).json({ message: "Post đã được share", post });
  } catch (error) {
    console.error("Lỗi khi share post:", error);
    res
      .status(500)
      .json({ message: "Post share thất bại", error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả post:", error);
    res.status(500).json({ message: "Lấy tất cả post thất bại" });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post không được tìm thấy" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Lỗi khi lấy post theo id:", error);
    res.status(500).json({ message: "Lấy post thất bại" });
  }
};

module.exports = {
  addPost,
  editPost,
  deletePost,
  likePost,
  commentPost,
  sharePost,
  searchPosts,
  getAllPosts,
  getPostById,
};
