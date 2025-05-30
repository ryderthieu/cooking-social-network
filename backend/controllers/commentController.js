// controllers/commentController.js
const Comment = require('../models/comment');
const Post = require('../models/post');
const Video = require('../models/video');
const Notification = require('../models/notification');

  // Tạo comment mới
  const createComment = async (req, res) => {
    try {
      const { targetId, targetType, text, sticker, replyOf } = req.body;
      const userId = req.user._id;

      // Kiểm tra target có tồn tại
      let target;
      if (targetType === 'post') {
        target = await Post.findById(targetId);
      } else if (targetType === 'video') {
        target = await Video.findById(targetId);
      }

      if (!target) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Kiểm tra parent comment nếu là reply
      if (replyOf) {
        const parentComment = await Comment.findById(replyOf);
        if (!parentComment || parentComment.targetId.toString() !== targetId) {
          return res.status(400).json({
            success: false,
            message: 'Comment gốc không hợp lệ'
          });
        }
      }

      const newComment = new Comment({
        targetId,
        targetType,
        userId,
        text,
        sticker,
        replyOf
      });

      await newComment.save();
      await newComment.populate('userId', 'firstName lastName avatar');

      // Thêm comment vào target
      target.comments.push(newComment._id);
      await target.save();

      // // Tạo thông báo cho chủ bài viết (nếu không phải chính mình)
      // if (target.author.toString() !== userId) {
      //   const notification = new Notification({
      //     receiver: target.author,
      //     sender: userId,
      //     type: replyOf ? 'reply' : 'comment',
      //     postId: targetType === 'post' ? targetId : undefined,
      //     videoId: targetType === 'video' ? targetId : undefined,
      //     commentId: newComment._id
      //   });
      //   await notification.save();
      // }

      // // Tạo thông báo cho chủ comment gốc (nếu là reply)
      // if (replyOf) {
      //   const parentComment = await Comment.findById(replyOf);
      //   if (parentComment && parentComment.userId.toString() !== userId) {
      //     const notification = new Notification({
      //       receiver: parentComment.userId,
      //       sender: userId,
      //       type: 'reply',
      //       postId: targetType === 'post' ? targetId : undefined,
      //       videoId: targetType === 'video' ? targetId : undefined,
      //       commentId: newComment._id
      //     });
      //     await notification.save();
      //   }
      // }

      res.status(201).json({
        success: true,
        data: newComment,
        message: 'Tạo comment thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy comments theo target
  const getCommentsByTarget = async (req, res) => {
    try {
      const { targetId, targetType } = req.params;
      const { page = 1, limit = 10, sortBy = 'newest' } = req.query;

      // Kiểm tra target có tồn tại
      let target;
      if (targetType === 'post') {
        target = await Post.findById(targetId);
      } else if (targetType === 'video') {
        target = await Video.findById(targetId);
      }

      if (!target) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      // Xác định cách sắp xếp
      let sortOptions;
      switch (sortBy) {
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'newest':
        default:
          sortOptions = { createdAt: -1 };
          break;
      }

      const comments = await Comment.find({ 
        targetId, 
        targetType,
        replyOf: null // Chỉ lấy comment gốc
      })
        .populate('userId', 'firstName lastName avatar')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Lấy replies cho mỗi comment
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await Comment.find({ replyOf: comment._id })
            .populate('userId', 'firstName lastName avatar')
            .sort({ createdAt: 1 })
            .limit(5); // Giới hạn 5 reply đầu tiên
          
          const totalReplies = await Comment.countDocuments({ replyOf: comment._id });
          
          return {
            ...comment.toObject(),
            replies,
            totalReplies,
            hasMoreReplies: totalReplies > 5
          };
        })
      );

      const totalComments = await Comment.countDocuments({ 
        targetId, 
        targetType, 
        replyOf: null 
      });

      res.json({
        success: true,
        data: {
          comments: commentsWithReplies,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalComments / limit),
            totalComments,
            hasNextPage: page < Math.ceil(totalComments / limit),
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy replies của một comment
  const getReplies = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy comment'
        });
      }

      const replies = await Comment.find({ replyOf: commentId })
        .populate('userId', 'firstName lastName avatar')
        .sort({ createdAt: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalReplies = await Comment.countDocuments({ replyOf: commentId });

      res.json({
        success: true,
        data: {
          replies,
          parentComment: {
            _id: parentComment._id,
            text: parentComment.text,
            userId: parentComment.userId
          },
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalReplies / limit),
            totalReplies,
            hasNextPage: page < Math.ceil(totalReplies / limit),
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Tìm kiếm comments
  const searchComments = async (req, res) => {
    try {
      const { query, targetId, targetType } = req.query;
      const { page = 1, limit = 10 } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
        });
      }

      let searchFilter = {
        text: { $regex: query.trim(), $options: 'i' }
      };

      // Nếu có targetId và targetType, tìm trong target cụ thể
      if (targetId && targetType) {
        searchFilter.targetId = targetId;
        searchFilter.targetType = targetType;
      }

      const comments = await Comment.find(searchFilter)
        .populate('userId', 'firstName lastName avatar')
        .populate('targetId')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalComments = await Comment.countDocuments(searchFilter);

      res.json({
        success: true,
        data: {
          comments,
          searchQuery: query,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalComments / limit),
            totalComments,
            hasNextPage: page < Math.ceil(totalComments / limit),
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy comment theo ID
  const getCommentById = async (req, res) => {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId)
        .populate('userId', 'firstName lastName avatar')
        .populate('targetId');

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy comment'
        });
      }

      // Lấy replies nếu có
      const replies = await Comment.find({ replyOf: commentId })
        .populate('userId', 'firstName lastName avatar')
        .sort({ createdAt: 1 });

      res.json({
        success: true,
        data: {
          ...comment.toObject(),
          replies
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Sửa comment
  const updateComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { text, sticker } = req.body;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy comment'
        });
      }

      if (comment.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền sửa comment này'
        });
      }

      comment.text = text;
      comment.sticker = sticker;
      await comment.save();

      await comment.populate('userId', 'firstName lastName avatar');
      
      res.json({
        success: true,
        data: comment,
        message: 'Cập nhật comment thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa comment
  const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy comment'
        });
      }

      if (comment.userId.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xóa comment này'
        });
      }

      // Xóa tất cả replies
      await Comment.deleteMany({ replyOf: commentId });

      // Xóa comment khỏi target
      let target;
      if (comment.targetType === 'post') {
        target = await Post.findById(comment.targetId);
      } else if (comment.targetType === 'video') {
        target = await Video.findById(comment.targetId);
      }

      if (target) {
        target.comments = target.comments.filter(id => id.toString() !== commentId);
        await target.save();
      }

      // Xóa thông báo liên quan
      await Notification.deleteMany({ commentId: commentId });

      await Comment.findByIdAndDelete(commentId);
      
      res.json({ 
        success: true, 
        message: 'Đã xóa comment thành công' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

module.exports = {createComment, getCommentsByTarget, getReplies, searchComments, getCommentById, updateComment, deleteComment};