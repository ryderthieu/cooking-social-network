const mongoose = require("mongoose");
const Video = require("../models/video");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const slugify = require("slugify");

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("author", "avatar firstName lastName").sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả video:", error);
    res.status(404).json({ message: "Video không được tìm thấy" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const video = await Video.findById(id).populate('author', 'avatar lastName firstName');
    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error("Lỗi khi lấy video theo ID:", error);
    res.status(404).json({ message: "Video không được tìm thấy" });
  }
};

const searchVideos = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Vui lòng nhập từ khóa" });
    }
    console.log(keyword)
    const slug = slugify(keyword, { lower: true, locale: "vi" });
    const filter = {
      $or: [
        { captionSlug: { $regex: slug, $options: "i" } },
        { recipeSlug: { $regex: slug, $options: "i" } },
        { authorSlug: { $regex: slug, $options: "i" } },
      ],
    };

    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "avatar firstName lastName")
      .populate("recipe", "name");

    res.status(200).json({ message: "Kết quả tìm kiếm", videos });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm video:", error);
    res.status(404).json({ message: "Lỗi khi tìm kiếm video" });
  }
};

const addVideo = async (req, res) => {
  try {
    const { caption, recipe, videoUri } = req.body;

    if (!caption || !videoUri) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const captionSlug = slugify(caption, { lower: true, locale: "vi" });
    let recipeSlug
    if (recipe) {
      const recipeDoc = await Recipe.findById(recipe);
      if (!recipeDoc) {
        return res.status(404).json({ message: "Công thức không tồn tại" });
      }
      recipeSlug = slugify(recipeDoc.name, { lower: true, locale: "vi" });
    }
    
    const user = await User.findById(req.user._id);
    const authorName = `${user.firstName} ${user.lastName}`;
    const authorSlug = slugify(authorName, {
      lower: true,
      locale: "vi",
    });

    const isValidUrl = /^(https?:\/\/)/.test(videoUri);
    if (!isValidUrl) {
      return res.status(400).json({ message: "URL video không hợp lệ" });
    }

    const newVideo = new Video({
      author: req.user._id,
      caption,
      recipe,
      videoUri,
      likes: [],
      comments: [],
      shares: [],
      view: 0,
      captionSlug,
      recipeSlug,
      authorSlug,
    });

    await newVideo.save();
    const video = await Video.findById(newVideo._id)
      .populate("author", "firstName lastName avatar")
      .populate("recipe", "name");

    res.status(201).json({ message: "Video upload thành công", video });
  } catch (error) {
    console.error("Lỗi khi upload video:", error);
    res
      .status(500)
      .json({ message: "Video upload thất bại", error: error.message });
  }
};

const editVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const { caption, recipe, videoUri } = req.body;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    if (caption !== undefined) {
        video.caption = caption;
        video.captionSlug = slugify(caption, { lower: true, locale: "vi" });
    }

    if (recipe !== undefined) {
        if (recipe) {
            if (!mongoose.Types.ObjectId.isValid(recipe)) {
                return res.status(400).json({ message: "ID công thức không hợp lệ." });
            }
            const recipeDoc = await Recipe.findById(recipe);
            if (!recipeDoc) {
                return res.status(404).json({ message: "Công thức được chỉ định không tìm thấy." });
            }
            video.recipe = recipeDoc._id;
            video.recipeSlug = slugify(recipeDoc.name, { lower: true, locale: "vi" });
        } else {
            video.recipe = null;
            video.recipeSlug = null;
        }
    }
    
    if (videoUri !== undefined) {
        video.videoUri = videoUri;
    }

    if (!video.caption || !video.recipe || !video.videoUri) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin (phụ đề, công thức, URL video)." });
    }

    const isValidUrl = /^(https?:\/\/)/.test(video.videoUri);
    if (!isValidUrl) {
      return res.status(400).json({ message: "URL video không hợp lệ" });
    }

    await video.save();
    const updatedVideo = await Video.findById(video._id)
        .populate("author", "email firstName lastName avatar")
        .populate("recipe", "name");

    res.status(200).json({ message: "Video cập nhật thành công", video: updatedVideo });
  } catch (error) {
    console.error("Lỗi khi cập nhật video:", error);
    res
      .status(500)
      .json({ message: "Video cập nhật thất bại", error: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    await Video.findByIdAndDelete(id);
    res.status(200).json({ message: "Video xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa video:", error);
    res
      .status(500)
      .json({ message: "Video xóa thất bại", error: error.message });
  }
};

const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const video = await Video.findById(id).populate('author', 'avatar firstName lastName');
    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    if (!video.likes) {
      video.likes = [];
    }

    const isAlreadyLiked = video.likes.some((like) => like.equals(userId));

    if (isAlreadyLiked) {
      video.likes = video.likes.filter((like) => !like.equals(userId));
      video.likeCount = Math.max(video.likeCount - 1, 0);
    } else {
      video.likes.push(userId);
      video.likeCount += 1;
    }
    await video.save();
    res.status(200).json({
      message: isAlreadyLiked ? "Đã bỏ like" : "Đã like bài viết",
      likeCount: video.likeCount,
      video,
    });
  } catch (error) {
    console.error("Lỗi khi like video:", error);
    res.status(500).json({ message: "Video không thể like" });
  }
};

const commentVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    video.comments.push({ userId, comment, createdAt: new Date() });
    await video.save();
    const updateVideo = await Video.findById(id).populate(
      "comments.userId",
      "firstName lastName"
    );
    res.status(200).json({ message: "Bình luận thành công", updateVideo });
  } catch (error) {
    console.error("Lỗi khi bình luận video:", error);
    res.status(500).json({ message: "Không thể bình luận video" });
  }
};

const shareVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    video.shares += 1;
    await video.save();
    res.status(200).json({ message: "Video đã được chia sẻ" });
  } catch (error) {
    console.error("Lỗi khi chia sẻ video:", error);
    res.status(500).json({ message: "Video không thể chia sẻ" });
  }
};

const getVideoByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ" });
    }

    const videos = await Video.find({ author: userId })
      .populate("author", "avatar firstName lastName")
      .populate("recipe", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Lỗi khi lấy video theo user ID:", error);
    res.status(500).json({ message: "Không thể lấy video", error: error.message });
  }
};

const getMyVideos = async (req, res) => {
  try {
    const userId = req.user._id;
    const videos = await Video.find({ author: userId })
      .populate("author", "avatar firstName lastName")
      .populate("recipe", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Lỗi khi lấy video của tôi:", error);
    res.status(500).json({ message: "Không thể lấy video", error: error.message });
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  searchVideos,
  addVideo,
  editVideo,
  deleteVideo,
  likeVideo,
  commentVideo,
  shareVideo,
  getVideoByUserId,
  getMyVideos
};
