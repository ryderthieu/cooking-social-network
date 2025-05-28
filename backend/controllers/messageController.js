// controllers/messageController.js
const Message = require('../models/message');
const Conversation = require('../models/conversation');

  // Tạo tin nhắn mới
  const createMessage = async (req, res) => {
    try {
      const { conversationId, type, text, image, sticker, sharedType, sharedId } = req.body;
      const sender = req.user._id;

      // Kiểm tra conversation có tồn tại và user có quyền
      const conversation = await Conversation.findById(conversationId);
      console.log(conversation.members)
      if (!conversation || !conversation.members.includes(sender)) {
        return res.status(403).json({ 
          success: false,
          message: 'Không có quyền truy cập cuộc trò chuyện' 
        });
      }

      const newMessage = new Message({
        conversationId,
        sender,
        type,
        text,
        image,
        sticker,
        sharedType,
        sharedId
      });

      await newMessage.save();
      await newMessage.populate([
        { path: 'sender', select: 'firstName lastName avatar' },
        { path: 'sharedId' }
      ]);

      // Cập nhật thời gian conversation
      conversation.updatedAt = new Date();
      await conversation.save();

      res.status(201).json({
        success: true,
        data: newMessage,
        message: 'Tạo tin nhắn thành công'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Lấy tin nhắn theo conversation
  const getMessagesByConversation = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user._id;

      // Kiểm tra quyền truy cập
      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.members.includes(userId)) {
        return res.status(403).json({ 
          success: false,
          message: 'Không có quyền truy cập' 
        });
      }

      const messages = await Message.find({ conversationId })
        .populate('sender', 'firstName lastName avatar')
        .populate('sharedId')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalMessages = await Message.countDocuments({ conversationId });

      res.json({
        success: true,
        data: {
          messages: messages.reverse(),
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalMessages / limit),
            totalMessages,
            hasNextPage: page < Math.ceil(totalMessages / limit),
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

  // Tìm kiếm tin nhắn
  const searchMessages = async (req, res) => {
    try {
      const { query, conversationId } = req.query;
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user._id;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
        });
      }

      let searchFilter = {
        type: 'text',
        text: { $regex: query.trim(), $options: 'i' }
      };

      // Nếu có conversationId, tìm trong conversation cụ thể
      if (conversationId) {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.members.includes(userId)) {
          return res.status(403).json({
            success: false,
            message: 'Không có quyền truy cập cuộc trò chuyện'
          });
        }
        searchFilter.conversationId = conversationId;
      } else {
        // Tìm trong tất cả conversations mà user tham gia
        const userConversations = await Conversation.find({ members: userId }).select('_id');
        const conversationIds = userConversations.map(conv => conv._id);
        searchFilter.conversationId = { $in: conversationIds };
      }

      const messages = await Message.find(searchFilter)
        .populate('sender', 'firstName lastName avatar')
        .populate('conversationId', 'name members')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalMessages = await Message.countDocuments(searchFilter);

      res.json({
        success: true,
        data: {
          messages,
          searchQuery: query,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalMessages / limit),
            totalMessages,
            hasNextPage: page < Math.ceil(totalMessages / limit),
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

  // Lấy tin nhắn theo ID
  const getMessageById = async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.user._id;

      const message = await Message.findById(messageId)
        .populate('sender', 'firstName lastName avatar')
        .populate('conversationId', 'members')
        .populate('sharedId');

      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tin nhắn'
        });
      }

      // Kiểm tra quyền truy cập
      if (!message.conversationId.members.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập tin nhắn này'
        });
      }

      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Sửa tin nhắn
  const updateMessage = async (req, res) => {
    try {
      const { messageId } = req.params;
      const { text } = req.body;
      const userId = req.user._id;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tin nhắn'
        });
      }

      if (message.sender.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền sửa tin nhắn này'
        });
      }

      if (message.type !== 'text') {
        return res.status(400).json({
          success: false,
          message: 'Chỉ có thể sửa tin nhắn văn bản'
        });
      }

      message.text = text;
      await message.save();
      await message.populate('sender', 'firstName lastName avatar');

      res.json({
        success: true,
        data: message,
        message: 'Cập nhật tin nhắn thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa tin nhắn
  const deleteMessage = async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.user._id;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tin nhắn'
        });
      }

      if (message.sender.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xóa tin nhắn này'
        });
      }

      await Message.findByIdAndUpdate(messageId, {type: 'text', text: "Tin nhắn này đã bị xóa"});
      
      res.json({ 
        success: true, 
        message: 'Đã xóa tin nhắn thành công' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Lấy tin nhắn gần đây của user
  const getRecentMessages = async (req, res) => {
    try {
      const userId = req.user._id;
      const { limit = 50 } = req.query;

      // Lấy các conversation của user
      const conversations = await Conversation.find({ members: userId }).select('_id');
      const conversationIds = conversations.map(conv => conv._id);

      const recentMessages = await Message.find({ 
        conversationId: { $in: conversationIds }
      })
        .populate('sender', 'firstName lastName avatar')
        .populate('conversationId', 'name members')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json({
        success: true,
        data: recentMessages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


module.exports = {createMessage, getMessagesByConversation, searchMessages, getMessageById, updateMessage, deleteMessage, getRecentMessages};