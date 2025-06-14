const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require('google-auth-library');

const User = require("../models/user");
const Post = require("../models/post");
const Recipe = require("../models/recipe");
const Video = require("../models/video");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "30d" });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { email, password, lastName, firstName, gender, birthday } =
    req.body;
  try {
    const user = await User.register(
      email,
      password,
      lastName,
      firstName,
      gender,
      birthday,
    );
    console.log(user)
    res
      .status(200)
      .json({ message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục." });
  } catch (error) {
    console.log(error.message);

    res.status(400).json({ error: error.message });
  }
};

const sendOtpEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mã OTP Xác Nhận Đặt Lại Mật Khẩu",
    text: `Mã OTP của bạn để đặt lại mật khẩu là: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("OTP sent:", info.response);
    }
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email không tồn tại!");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 3600000;
    await user.save();

    sendOtpEmail(email, otp);

    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const confirmOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }
    console.log(otp);
    console.log(user.otp);
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Mã OTP không đúng!" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ error: "Mã OTP đã hết hạn!" });
    }
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Xác nhận OTP thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(402).json({ message: "OTP đã hết hạn" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "ID người dùng không hợp lệ!" });
    }

    const user = await User.findById(userId)
      .select("-password -otp -otpExpire -email")
      .populate("followers", "firstName lastName avatar _id")
      .populate("following", "firstName lastName avatar _id");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy người dùng:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("-password -otp -otpExpire")
      .populate("followers", "firstName lastName avatar _id")
      .populate("following", "firstName lastName avatar _id")
      .populate("savedRecipe", "title thumbnail");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi lấy người dùng:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const searchUser = async (req, res) => {
  try {
    const { key, page = 1, limit = 10 } = req.query;
    if (!key) {
      return res.status(400).json({ error: "Vui lòng nhập từ khóa tìm kiếm!" });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const keywords = key.trim().split(/\s+/);
    const regexPatterns = keywords.map((word) => new RegExp(word, "i"));

    const query = {
      $or: [
        { email: { $in: regexPatterns } },
        { firstName: { $in: regexPatterns } },
        { lastName: { $in: regexPatterns } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$lastName", " ", "$firstName"] },
              regex: keywords.join(".*"),
              options: "i",
            },
          },
        },
      ],
    };

    const users = await User.find(query)
      .select("-password -otp -otpExpire -email")
      .skip(skip)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
      users,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, gender, birthday, avatar, username, bio, location } =
      req.body;

    const user = await User.findById(userId).select(
      "-password -otp -otpExpire"
    );
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;
    if (birthday) user.birthday = birthday;
    if (avatar) user.avatar = avatar;
    if (username) user.username = username;
    if (bio) user.bio = bio
    if (location) user.location = location
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const saveRecipe = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    if (!user.savedRecipe.includes(recipeId)) {
      user.savedRecipe.push(recipeId);
      await user.save();
    }

    res.status(200).json({
      message: "Đã lưu công thức thành công!",
      savedRecipe: user.savedRecipe,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const deleteSavedRecipe = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Nguời dùng không tồn tại!" });
    }

    if (!user.savedRecipe.includes(recipeId)) {
      return res.status(404).json({ error: "Công thức chưa được lưu!" });
    }

    user.savedRecipe = user.savedRecipe.filter((v) => v != recipeId);
    await user.save();

    res.status(200).json({
      message: "Đã xóa khỏi công thức đã lưu thành công!",
      savedRecipe: user.savedRecipe,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const getSavedRecipe = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("savedRecipe _id")
      .populate("savedRecipe");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    res.status(200).json({ savedRecipes: user.savedRecipe });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách công thức đã lưu:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const getSavedPost = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("savedPost _id")
      .populate("savedPost");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    res.status(200).json({ savedPost: user.savedPost });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết đã lưu:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const getFollowers = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId)
      .select("followers")
      .populate("followers", "firstName lastName avatar _id");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách followers:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId)
      .select("following")
      .populate("following", "firstName lastName avatar _id");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách following:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const toggleFollow = async (req, res) => {
  try {
    const userId = req.user._id;
    const { followingId, action } = req.body;

    // Debug log
    console.log("Toggle follow request: ", {
      userId: userId ? userId.toString() : "undefined",
      followingId,
      action,
      requestBody: req.body,
      userFromToken: req.user,
    });

    if (!userId) {
      return res.status(400).json({ error: "User ID từ token không hợp lệ!" });
    }

    if (!followingId) {
      return res.status(400).json({ error: "followingId là bắt buộc!" });
    }

    if (!mongoose.Types.ObjectId.isValid(followingId)) {
      return res.status(400).json({ error: "ID người dùng không hợp lệ!" });
    }

    if (!["follow", "unfollow"].includes(action)) {
      return res.status(400).json({ error: "Hành động không hợp lệ!" });
    }

    if (userId.toString() === followingId) {
      return res.status(400).json({ error: "Không thể follow chính mình!" });
    }

    const user = await User.findById(userId).select("following");
    const followingUser = await User.findById(followingId).select("followers");

    if (!user || !followingUser) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    const isCurrentlyFollowing = user.following.includes(followingId);

    if (action === "follow") {
      if (isCurrentlyFollowing) {
        // Already following, return success but don't change anything
        return res.status(200).json({
          message: "Đã follow trước đó!",
          followersCount: followingUser.followers.length,
          followingCount: user.following.length,
          isFollowing: true,
        });
      }
      user.following.push(followingId);
      followingUser.followers.push(userId);
    } else {
      if (!isCurrentlyFollowing) {
        // Not following, return success but don't change anything
        return res.status(200).json({
          message: "Đã unfollow trước đó!",
          followersCount: followingUser.followers.length,
          followingCount: user.following.length,
          isFollowing: false,
        });
      }
      user.following = user.following.filter(
        (id) => id.toString() !== followingId
      );
      followingUser.followers = followingUser.followers.filter(
        (id) => id.toString() !== userId
      );
    }

    await user.save();
    await followingUser.save();

    res.status(200).json({
      message: `${action} thành công!`,
      followersCount: followingUser.followers.length,
      followingCount: user.following.length,
      isFollowing: action === "follow",
    });
  } catch (error) {
    console.error("Toggle follow error:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const deleteSavedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Nguời dùng không tồn tại!" });
    }

    if (!user.savedPost.includes(postId)) {
      return res.status(404).json({ error: "Bài viết chưa được lưu!" });
    }

    user.savedPost = user.savedPost.filter((v) => v != postId);
    await user.save();

    res.status(200).json({
      message: "Đã xóa khỏi bài viết đã lưu thành công!",
      savedPost: user.savedPost,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const getSavedVideo = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("savedVideo _id")
      .populate("savedVideo");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    res.status(200).json({ savedVideo: user.savedVideo });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết đã lưu:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const deleteSavedVideo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Nguời dùng không tồn tại!" });
    }

    if (!user.savedVideo.includes(videoId)) {
      return res.status(404).json({ error: "Video chưa được lưu!" });
    }

    user.savedVideo = user.savedVideo.filter((v) => v != videoId);
    await user.save();

    res.status(200).json({
      message: "Đã xóa khỏi video đã lưu thành công!",
      savedVideo: user.savedVideo,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const savePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;
    console.log(postId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    if (!user.savedPost.includes(postId)) {
      user.savedPost.push(postId);
      await user.save();
    }

    res.status(200).json({
      message: "Đã lưu bài viết thành công!",
      savedPost: user.savedPost,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const saveVideo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại!" });
    }

    if (!user.savedVideo.includes(videoId)) {
      user.savedVideo.push(videoId);
      await user.save();
    }

    res.status(200).json({
      message: "Đã lưu video thành công!",
      savedVideo: user.savedVideo,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("followers following")
      .populate("followers", "firstName lastName avatar _id")
      .populate("following", "firstName lastName avatar _id");

    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    // Đếm số posts của user
    const posts = await Post.find({ author: userId })
      .populate("author", "firstName lastName avatar _id")
      .sort({ createdAt: -1 });

    // Đếm số recipes của user
    const recipes = await Recipe.find({ author: userId })
      .populate("author", "firstName lastName avatar _id")
      .sort({ createdAt: -1 });

    const videos = await Video.find({ author: userId })
      .populate("author", "firstName lastName avatar _id")
      .sort({ createdAt: -1 });
    const stats = {
      posts: {
        count: posts.length,
        data: posts,
      },
      recipes: {
        count: recipes.length,
        data: recipes,
      },
      followers: {
        count: user.followers.length,
        data: user.followers,
      },
      following: {
        count: user.following.length,
        data: user.following,
      },
      videos: {
        count: videos.length,
        data: videos,
      },
    };

    res.status(200).json({ stats });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê người dùng: ", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại!" });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub: googleId } = payload;

    let user = await User.findOne({ googleId });
    
    if (!user) {
      // Kiểm tra xem email đã tồn tại chưa
      user = await User.findOne({ email });
      
      if (user) {
        // Nếu email đã tồn tại nhưng chưa có googleId, cập nhật googleId
        user.googleId = googleId;
        await user.save();
      } else {
        // Tạo user mới
        user = await User.create({
          email,
          firstName: given_name,
          lastName: family_name,
          avatar: picture,
          googleId,
          gender: "Nam", // Giá trị mặc định
          birthday: new Date(), // Giá trị mặc định
          isVerified: true
        });
      }
    }

    const token = createToken(user._id);
    res.status(200).json({ token });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ error: 'Đăng nhập bằng Google thất bại' });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  confirmOtp,
  getUserById,
  getUserInfo,
  getUserStats,
  searchUser,
  editProfile,
  saveRecipe,
  deleteSavedRecipe,
  getSavedRecipe,
  savePost,
  getSavedPost,
  deleteSavedPost,
  saveVideo,
  getSavedVideo,
  deleteSavedVideo,
  getFollowers,
  getFollowing,
  toggleFollow,
  googleLogin
};
