// controllers/notificationController.js
const Notification = require("../models/notification");
const User = require("../models/user");

// Tạo thông báo mới
const createNotification = async (req, res) => {
  try {
    const { receiver, type, postId, videoId, commentId } = req.body;
    const sender = req.user._id;

    // Không tạo thông báo cho chính mình
    if (sender === receiver) {
      return res.status(400).json({
        success: false,
        message: "Không thể tạo thông báo cho chính mình",
      });
    }

    // Kiểm tra receiver có tồn tại
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người nhận",
      });
    }

    // Kiểm tra trùng lặp thông báo (trong vòng 1 phút)
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const existingNotification = await Notification.findOne({
      receiver,
      sender,
      type,
      postId,
      videoId,
      commentId,
      createdAt: { $gte: oneMinuteAgo },
    });

    if (existingNotification) {
      return res.status(409).json({
        success: false,
        message: "Thông báo đã tồn tại",
      });
    }

    const newNotification = new Notification({
      receiver,
      sender,
      type,
      postId,
      videoId,
      commentId,
    });

    await newNotification.save();
    await newNotification.populate([
      { path: "sender", select: "firstName lastName avatar" },
      { path: "postId", select: "caption media" },
      { path: "videoId", select: "caption videoUri" },
      { path: "commentId", select: "text" },
    ]);

    res.status(201).json({
      success: true,
      data: newNotification,
      message: "Tạo thông báo thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy thông báo của user
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, isRead, type } = req.query;

    let searchFilter = { receiver: userId };

    // Lọc theo trạng thái đã đọc
    if (isRead !== undefined) {
      searchFilter.isRead = isRead === "true";
    }

    // Lọc theo loại thông báo
    if (
      type &&
      ["like", "comment", "reply", "share", "follow", "mention"].includes(type)
    ) {
      searchFilter.type = type;
    }

    const notifications = await Notification.find(searchFilter)
      .populate("sender", "firstName lastName avatar")
      .populate("postId", "caption media")
      .populate("videoId", "caption videoUri")
      .populate("commentId", "text")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const unreadCount = await Notification.countDocuments({
      receiver: userId,
      isRead: false,
    });

    const totalNotifications = await Notification.countDocuments(searchFilter);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalNotifications / limit),
          totalNotifications,
          hasNextPage: page < Math.ceil(totalNotifications / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy thông báo theo ID
const getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId)
      .populate("sender", "firstName lastName avatar")
      .populate("postId", "caption media author")
      .populate("videoId", "caption videoUri author")
      .populate("commentId", "text");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    if (notification.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập thông báo này",
      });
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Tìm kiếm thông báo
const searchNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { query, page = 1, limit = 10, type } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Từ khóa tìm kiếm phải có ít nhất 2 ký tự",
      });
    }

    let searchFilter = { receiver: userId };

    // Lọc theo loại thông báo
    if (
      type &&
      ["like", "comment", "reply", "share", "follow", "mention"].includes(type)
    ) {
      searchFilter.type = type;
    }

    // Tìm kiếm theo tên người gửi
    const senders = await User.find({
      $or: [
        { firstName: { $regex: query.trim(), $options: "i" } },
        { lastName: { $regex: query.trim(), $options: "i" } },
      ],
    }).select("_id");

    const senderIds = senders.map((sender) => sender._id);
    searchFilter.sender = { $in: senderIds };

    const notifications = await Notification.find(searchFilter)
      .populate("sender", "firstName lastName avatar")
      .populate("postId", "caption media")
      .populate("videoId", "caption videoUri")
      .populate("commentId", "text")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalNotifications = await Notification.countDocuments(searchFilter);

    res.json({
      success: true,
      data: {
        notifications,
        searchQuery: query,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalNotifications / limit),
          totalNotifications,
          hasNextPage: page < Math.ceil(totalNotifications / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    if (notification.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: "Đã đánh dấu đã đọc",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Đánh dấu tất cả thông báo đã đọc
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
      },
      message: `Đã đánh dấu tất cả ${result.modifiedCount} thông báo đã đọc`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Đánh dấu thông báo chưa đọc
const markAsUnread = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    if (notification.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập",
      });
    }

    notification.isRead = false;
    await notification.save();

    res.json({
      success: true,
      message: "Đã đánh dấu chưa đọc",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {createNotification, getUserNotifications, getNotificationById, searchNotifications, markAsRead, markAllAsRead, markAsUnread}