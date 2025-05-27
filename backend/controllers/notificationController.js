const Notification = require('../models/notification');

exports.getUserNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;

  try {
    await Notification.findOneAndUpdate({ _id: notificationId, user: userId }, { isRead: true });
    res.json({ message: 'Đã đánh dấu là đã đọc' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
