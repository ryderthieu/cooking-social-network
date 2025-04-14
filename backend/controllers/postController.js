const mongoose = require("mongoose");
const Post = require("../models/post");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const slugify = require("slugify");

const addPost = async (req, res) => {
  try {
    const { caption, recipe, videoUri, imgUri } = req.body;

    if (!caption || !recipe) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const captionSlug = slugify(caption, { lower: true, locale: "vi" });
    const recipeDoc = await Recipe.findById(recipe);
    if (!recipeDoc) {
      return res.status(404).json({ message: "Công thức không tồn tại" });
    }

    const recipeSlug = slugify(recipeDoc.name, { lower: true, locale: "vi" });
    const user = await User.findById(req.user._id);
    const authorName = `${user.firstName} ${user.lastName}`;
    const authorSlug = slugify(authorName, {
      lower: true,
      locale: "vi",
    });

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
      likes: [],
      likeCount: 0,
      comments: [],
      shares: 0,
      captionSlug,
      recipeSlug,
      authorSlug,
    });

    await newPost.save();
    const post = await Post.findById(newPost._id)
      .populate("author", "email firstName lastName")
      .populate("recipe", "name");

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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
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
    const keyword = req.query.keyword;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa" });
    }

    const slug = slugify(keyword, { lower: true, locale: "vi" });
    const filter = {
      $or: [
        { captionSlug: { $regex: slug, $options: "i" } },
        { recipeSlug: { $regex: slug, $options: "i" } },
        { authorSlug: { $regex: slug, $options: "i" } },
      ],
    };

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
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post không tồn tại" });
    }

    if (!post.likes) {
      post.likes = [];
    }
    const isAlreadyLiked = post.likes.some((like) => like.equals(userId));

    if (isAlreadyLiked) {
      post.likes = post.likes.filter((like) => !like.equals(userId));
      post.likeCount = Math.max(post.likeCount - 1, 0);
    } else {
      post.likes.push(userId);
      post.likeCount += 1;
    }
    await post.save();
    res.status(200).json({
      message: isAlreadyLiked ? "Đã bỏ like" : "Đã like bài viết",
      likeCount: post.likeCount,
      post,
    });
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Vui lòng nhập bình luận" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post không tồn tại" });
    }
<<<<<<< HEAD
    post.comments.push({ userId, comment });
=======

    post.comments.push({ userId, comment, createdAt: new Date() });
>>>>>>> c7e3556f9919c00739efc97cf45679c535e4705c
    await post.save();

    const updatePost = await Post.findById(id).populate(
      "comments.userId",
      "firstName lastName"
    );

    res.status(200).json({ message: "Bình luận thành công", updatePost });
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
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
