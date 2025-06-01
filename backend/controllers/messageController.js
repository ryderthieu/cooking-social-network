// controllers/messageController.js
const Message = require('../models/message');
const Conversation = require('../models/conversation');
const User = require('../models/user');

  // Tạo tin nhắn mới
  const createMessage = async (req, res) => {
    try {
      const { conversationId, type, text, image, sticker, sharedType, sharedId } = req.body;
      const sender = req.user._id;

      // Kiểm tra conversation có tồn tại và user có quyền
      const conversation = await Conversation.findById(conversationId);
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
        text: type === 'text' ? text : undefined,
        image: type === 'image' ? image : undefined,
        sticker: type === 'sticker' ? sticker : undefined,
        sharedType: type === 'share' ? sharedType : undefined,
        sharedId: type === 'share' ? sharedId : undefined,
        readBy: [{ // Tự động đánh dấu là đã đọc bởi người gửi
          userId: sender,
          readAt: new Date()
        }]
      });

      await newMessage.save();
      await newMessage.populate([
        { path: 'sender', select: 'firstName lastName avatar' },
        { path: 'sharedId' }
      ]);

      // Đếm lại số tin nhắn chưa đọc cho mỗi thành viên
      const unreadCounts = {};
      for (const memberId of conversation.members) {
        if (memberId.toString() !== sender.toString()) {
          const count = await Message.countDocuments({
            conversationId,
            sender: { $ne: memberId },
            'readBy.userId': { $ne: memberId }
          });
          unreadCounts[memberId.toString()] = count;
        }
      }

      // Cập nhật conversation với số tin nhắn chưa đọc mới nhất và tin nhắn cuối
      await Conversation.findByIdAndUpdate(
        conversationId,
        { 
          $set: { 
            unreadCounts,
            lastMessage: newMessage._id,
            updatedAt: new Date()
          }
        }
      );

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

      const messagesFromDb = await Message.find({ conversationId })
        .populate('sender', 'firstName lastName avatar _id')
        .populate('sharedId')
        .populate({
          path: 'replyTo',
          select: 'text content sender recalled type',
          populate: {
            path: 'sender',
            select: 'firstName _id'
          }
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .lean();

      // Đánh dấu tin nhắn đã đọc
      const unreadMessages = messagesFromDb.filter(msg => 
        msg.sender._id.toString() !== userId.toString() && 
        !msg.readBy.some(read => read.userId.toString() === userId.toString())
      );

      if (unreadMessages.length > 0) {
        const updatePromises = unreadMessages.map(msg =>
          Message.findByIdAndUpdate(
            msg._id,
            {
              $push: {
                readBy: {
                  userId,
                  readAt: new Date()
                }
              }
            }
          )
        );
        await Promise.all(updatePromises);

        // Cập nhật số tin nhắn chưa đọc trong conversation
        const unreadCount = await Message.countDocuments({
          conversationId,
          sender: { $ne: userId },
          'readBy.userId': { $ne: userId }
        });

        await Conversation.findByIdAndUpdate(
          conversationId,
          { 
            $set: { unreadCount }
          }
        );
      }

      const messagesWithPopulatedReactions = await Promise.all(
        messagesFromDb.map(async (msg) => {
          if (!msg.reactions || msg.reactions.length === 0) {
            return { ...msg, reactions: [] };
          }

          const populatedReactionsForClient = [];
          const reactionGroups = {};
          
          msg.reactions.forEach(r => {
            if (!r || !r.type || !r.userId) return;
            reactionGroups[r.type] = reactionGroups[r.type] || [];
            reactionGroups[r.type].push(r.userId.toString());
          });

          for (const type of Object.keys(reactionGroups)) {
            const userIdsInGroup = reactionGroups[type];
            const users = await User.find({ _id: { $in: userIdsInGroup } })
                                  .select('_id firstName lastName avatar')
                                  .lean();
            
            if (users.length > 0) {
              populatedReactionsForClient.push({
                type: type,
                users: users
              });
            }
          }
          
          return { ...msg, reactions: populatedReactionsForClient };
        })
      );

      const totalMessages = await Message.countDocuments({ conversationId });

      res.json({
        success: true,
        data: {
          messages: messagesWithPopulatedReactions.reverse(),
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalMessages / parseInt(limit)),
            totalMessages,
            hasNextPage: parseInt(page) < Math.ceil(totalMessages / parseInt(limit)),
            hasPrevPage: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Error in getMessagesByConversation:', error);
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

      // if (!query || query.trim().length < 2) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
      //   });
      // }

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
  const reactToMessage = async (req, res) => {
    try {
      const { messageId, type: reactionType } = req.body;
      const userId = req.user._id;

      const message = await Message.findById(messageId).populate('sender', '_id');
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy tin nhắn'
        });
      }

      if (message.sender._id.toString() === userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Không thể thả cảm xúc cho tin nhắn của chính mình'
        });
      }

      // Tìm và xóa reaction cũ nếu có
      const existingReactionIndex = message.reactions.findIndex(
        r => r.userId.toString() === userId.toString()
      );

      let currentReactionType = null;
      if (existingReactionIndex > -1) {
        currentReactionType = message.reactions[existingReactionIndex].type;
        message.reactions.splice(existingReactionIndex, 1);
      }

      // Thêm reaction mới nếu khác với reaction cũ
      if (currentReactionType !== reactionType) {
        message.reactions.push({ type: reactionType, userId });
      }

      await message.save();

      // Transform reactions for client
      const reactionGroups = {};
      message.reactions.forEach(r => {
        if (!r || !r.type || !r.userId) return;
        reactionGroups[r.type] = reactionGroups[r.type] || [];
        reactionGroups[r.type].push(r.userId);
      });

      const populatedReactionsForClient = [];
      for (const type of Object.keys(reactionGroups)) {
        const userIdsInGroup = reactionGroups[type];
        const users = await User.find({ _id: { $in: userIdsInGroup } })
                              .select('_id firstName lastName avatar')
                              .lean();
        if (users.length > 0) {
          populatedReactionsForClient.push({
            type: type,
            users: users
          });
        }
      }

      res.json({
        success: true,
        data: {
          messageId,
          reactions: populatedReactionsForClient
        },
        message: 'Thả cảm xúc thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


module.exports = {createMessage, getMessagesByConversation, searchMessages, getMessageById, updateMessage, deleteMessage, getRecentMessages, reactToMessage };