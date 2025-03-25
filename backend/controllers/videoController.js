const Video = require("../models/video");
const Recipe = require("../models/recipe");
const User = require("../models/user");

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả video:", error);
    res.status(404).json({ message: "Video không được tìm thấy" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
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

    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "email firstName lastName")
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

    if (!caption || !recipe || !videoUri) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const isValidUrl = /^(https?:\/\/)/.test(videoUri);
    if (!isValidUrl) {
      return res.status(400).json({ message: "URL video không hợp lệ" });
    }

    const newVideo = new Video({
      //author: req.user._id,
      author: "67d7d3258dec3a639c0321eb",
      caption,
      recipe,
      videoUri,
      likes: 0,
      comments: [],
      shares: 0,
    });

    await newVideo.save();
    res.status(201).json({ message: "Video upload thành công", newVideo });
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
    const { caption, recipe, videoUri } = req.body;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    video.caption = caption || video.caption;
    video.recipe = recipe || video.recipe;
    video.videoUri = videoUri || video.videoUri;

    if (!video.caption || !video.recipe || !video.videoUri) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const isValidUrl = /^(https?:\/\/)/.test(video.videoUri);
    if (!isValidUrl) {
      return res.status(400).json({ message: "URL video không hợp lệ" });
    }

    await video.save();
    res.status(200).json({ message: "Video cập nhật thành công", video });
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
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    video.likes += 1;
    await video.save();
    res.status(200).json({ message: "Video đã được like" });
  } catch (error) {
    console.error("Lỗi khi like video:", error);
    res.status(500).json({ message: "Video không thể like" });
  }
};

const commentVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user ? req.user._id : "67d7d3258dec3a639c0321eb";
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video không tồn tại" });
    }

    video.comments.push({ userId, comment, createdAt: new Date() });
    await video.save();
    res.status(200).json({ message: "Bình luận thành công" });
  } catch (error) {
    console.error("Lỗi khi bình luận video:", error);
    res.status(500).json({ message: "Không thể bình luận video" });
  }
};

const shareVideo = async (req, res) => {
  try {
    const { id } = req.params;
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
};
