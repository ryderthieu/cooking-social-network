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

      const messagesWithPopulatedReactions = await Promise.all(
        messagesFromDb.map(async (msg) => {
            console.log(`Processing message ID: ${msg._id}, Original DB reactions:`, JSON.stringify(msg.reactions, null, 2));

            if (!msg.reactions || msg.reactions.length === 0) {
                console.log(`Message ID: ${msg._id} has no reactions or empty, returning [] for reactions.`);
                return { ...msg, reactions: [] };
            }

            const populatedReactionsForClient = [];
            const reactionGroups = {};
            
            msg.reactions.forEach(r => {
                if (!r || !r.type || !r.userId) {
                    console.warn(`Message ID: ${msg._id}, Invalid reaction object in DB:`, r);
                    return;
                }
                const userIdStr = r.userId.toString();
                reactionGroups[r.type] = reactionGroups[r.type] || [];
                reactionGroups[r.type].push(userIdStr);
            });
            
            console.log(`Message ID: ${msg._id}, Grouped reactions:`, JSON.stringify(reactionGroups, null, 2));

            if (Object.keys(reactionGroups).length === 0 && msg.reactions.length > 0) {
                 console.error(`Message ID: ${msg._id}, reactionGroups is empty but msg.reactions was not! Original msg.reactions:`, JSON.stringify(msg.reactions));
            }

            for (const type of Object.keys(reactionGroups)) {
                const userIdsInGroup = reactionGroups[type];
                console.log(`Message ID: ${msg._id}, Type: ${type}, User IDs to populate:`, userIdsInGroup);

                const users = await User.find({ _id: { $in: userIdsInGroup } })
                                        .select('_id firstName lastName avatar')
                                        .lean();
                
                console.log(`Message ID: ${msg._id}, Type: ${type}, Populated users:`, JSON.stringify(users, null, 2));
                
                if (users.length > 0) {
                    populatedReactionsForClient.push({
                        type: type,
                        users: users
                    });
                } else if (userIdsInGroup.length > 0) {
                    console.warn(`Message ID: ${msg._id}, Type: ${type}, Could not populate users for IDs:`, userIdsInGroup, "Original users from DB for this reaction type:", msg.reactions.filter(r => r.type === type).map(r => r.userId));
                }
            }
            
            console.log(`Message ID: ${msg._id}, Final populatedReactionsForClient:`, JSON.stringify(populatedReactionsForClient, null, 2));
            
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
      const { messageId, reaction } = req.body;
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
          message: 'Không có quyền phản hồi tin nhắn này'
        });
      }
      const existingReaction = message.reactions.find(r => r.userId.toString() === userId);
      if (existingReaction) {
        return res.status(400).json({
          success: false,
          message: 'Bạn đã phản hồi tin nhắn này rồi'
        });
      } 
      message.reactions.push({
        type: reaction,
        userId
      });
      await message.save();
      
      res.json({
        success: true,
        message: 'Phản hồi tin nhắn thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


module.exports = {createMessage, getMessagesByConversation, searchMessages, getMessageById, updateMessage, deleteMessage, getRecentMessages, reactToMessage };