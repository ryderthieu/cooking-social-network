const Comment = require('../models/comment');
const Post = require('../models/post');
const Video = require('../models/video');

exports.createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetId, targetType, text, sticker, replyOf } = req.body;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    if (replyOf && !mongoose.Types.ObjectId.isValid(replyOf)) {
      return res.status(400).json({ message: 'Reply ID không hợp lệ' });
    }

    const comment = await Comment.create({
      userId,
      targetId,
      targetType,
      text,
      sticker,
      replyOf: replyOf || null
    });

    if (targetType === 'post') {
      await Post.findByIdAndUpdate(targetId, { $push: { comments: comment._id } });
    } else if (targetType === 'video') {
      await Video.findByIdAndUpdate(targetId, { $push: { comments: comment._id } });
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCommentsByTarget = async (req, res) => {
  const { targetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(targetId)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  try {
    const comments = await Comment.find({ targetId })
      .populate('userId', 'firstName lastName avatar')
      .populate('replyOf');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment không tồn tại' });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa comment này' });
    }

    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
