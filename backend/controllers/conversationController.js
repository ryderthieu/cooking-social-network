// controllers/conversationController.js
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');

  // Tạo cuộc trò chuyện mới
  const createConversation = async (req, res) => {
    try {
      const { members, name } = req.body;
      const userId = req.user._id;

      if (!members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Danh sách thành viên không hợp lệ'
        });
      }

      // Thêm user hiện tại vào danh sách members
      const allMembers = [...new Set([userId, ...members])];

      // Kiểm tra tất cả members có tồn tại
      const validMembers = await User.find({ _id: { $in: allMembers } }).select('_id');
      if (validMembers.length !== allMembers.length) {
        return res.status(400).json({
          success: false,
          message: 'Một số thành viên không tồn tại'
        });
      }

      // Kiểm tra cuộc trò chuyện đã tồn tại (chỉ với 2 người)
      if (allMembers.length === 2) {
        const existingConversation = await Conversation.findOne({
          members: { $all: allMembers, $size: 2 }
        }).populate('members', 'firstName lastName avatar');

        if (existingConversation) {
          return res.json({
            success: true,
            data: existingConversation,
            message: 'Cuộc trò chuyện đã tồn tại'
          });
        }
      }

      const newConversation = new Conversation({
        members: allMembers,
        name: name || ''
      });

      await newConversation.save();
      await newConversation.populate('members', 'firstName lastName avatar');

      res.status(201).json({
        success: true,
        data: newConversation,
        message: 'Tạo cuộc trò chuyện thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy danh sách cuộc trò chuyện của user
  const getUserConversations = async (req, res) => {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10, search } = req.query;

      let searchFilter = { members: userId };
      
      // Tìm kiếm theo tên cuộc trò chuyện
      if (search && search.trim()) {
        searchFilter.name = { $regex: search.trim(), $options: 'i' };
      }

      const conversations = await Conversation.find(searchFilter)
        .populate('members', 'firstName lastName avatar isOnline')
        .sort({ updatedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Lấy tin nhắn cuối cùng và đếm tin nhắn chưa đọc cho mỗi conversation
      const conversationsWithDetails = await Promise.all(
        conversations.map(async (conv) => {
          const lastMessage = await Message.findOne({ conversationId: conv._id })
            .sort({ createdAt: -1 })
            .populate('sender', 'firstName lastName avatar');

          // Đếm số tin nhắn chưa đọc
          const unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            sender: { $ne: userId },
            'readBy.userId': { $ne: userId }
          });

          // Lấy thông tin người dùng khác trong cuộc trò chuyện (để hiển thị nhanh)
          const otherUserMember = conv.members.find(
            member => member._id.toString() !== userId.toString()
          );

          const formattedOtherUser = otherUserMember ? {
            _id: otherUserMember._id,
            name: `${otherUserMember.firstName} ${otherUserMember.lastName}`.trim(),
            avatar: otherUserMember.avatar,
            isOnline: otherUserMember.isOnline || false // Sẽ được cập nhật bởi client qua socket
          } : null;

          // Format tin nhắn cuối cùng
          const formattedLastMessage = lastMessage ? {
            _id: lastMessage._id,
            type: lastMessage.type,
            text: lastMessage.text,
            createdAt: lastMessage.createdAt,
            sender: {
              _id: lastMessage.sender._id,
              name: `${lastMessage.sender.firstName} ${lastMessage.sender.lastName}`.trim(),
              avatar: lastMessage.sender.avatar
            }
          } : null;
          
          // Lấy danh sách members đã populate gọn nhẹ
          const populatedMembers = conv.members.map(member => ({
            _id: member._id,
            firstName: member.firstName,
            lastName: member.lastName,
            avatar: member.avatar
            // isOnline sẽ do client tự quản lý dựa trên socket events
          }));

          return {
            _id: conv._id,
            name: conv.name, // Thêm tên cuộc trò chuyện
            updatedAt: conv.updatedAt,
            createdAt: conv.createdAt,
            unreadCount,
            otherUser: formattedOtherUser, // User đối diện (trong chat 1-1)
            lastMessage: formattedLastMessage,
            members: populatedMembers // Danh sách đầy đủ các thành viên
          };
        })
      );

      const totalConversations = await Conversation.countDocuments(searchFilter);

      res.json({
        success: true,
        data: {
          conversations: conversationsWithDetails,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalConversations / limit),
            totalConversations,
            hasNextPage: page < Math.ceil(totalConversations / limit),
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy thông tin cuộc trò chuyện
  const getConversation = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      const conversation = await Conversation.findById(conversationId)
        .populate('members', 'firstName lastName avatar');

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cuộc trò chuyện'
        });
      }

      if (!conversation.members.some(member => member._id.toString() === userId)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập'
        });
      }

      // Thống kê cơ bản
      const messageCount = await Message.countDocuments({ conversationId: conversation._id });
      const lastMessage = await Message.findOne({ conversationId: conversation._id })
        .sort({ createdAt: -1 })
        .populate('sender', 'firstName lastName avatar');

      res.json({
        success: true,
        data: {
          ...conversation.toObject(),
          messageCount,
          lastMessage
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Thêm thành viên vào cuộc trò chuyện
  const addMembers = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { memberIds } = req.body;
      const userId = req.user._id;

      if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Danh sách thành viên không hợp lệ'
        });
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cuộc trò chuyện'
        });
      }

      if (!conversation.members.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền thực hiện'
        });
      }

      // Kiểm tra members có tồn tại
      const validMembers = await User.find({ _id: { $in: memberIds } }).select('_id');
      if (validMembers.length !== memberIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Một số thành viên không tồn tại'
        });
      }

      // Thêm members mới (tránh trùng lặp)
      const newMembers = memberIds.filter(id => !conversation.members.includes(id));
      conversation.members.push(...newMembers);
      await conversation.save();

      await conversation.populate('members', 'firstName lastName avatar');
      
      res.json({
        success: true,
        data: conversation,
        message: `Đã thêm ${newMembers.length} thành viên mới`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa thành viên khỏi cuộc trò chuyện
  const removeMember = async (req, res) => {
    try {
      const { conversationId, memberId } = req.params;
      const userId = req.user._id;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cuộc trò chuyện'
        });
      }

      if (!conversation.members.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền thực hiện'
        });
      }

      if (!conversation.members.includes(memberId)) {
        return res.status(400).json({
          success: false,
          message: 'Thành viên không có trong cuộc trò chuyện'
        });
      }

      if (conversation.members.length <= 2) {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa thành viên khi chỉ còn 2 người'
        });
      }

      conversation.members = conversation.members.filter(id => id.toString() !== memberId);
      await conversation.save();

      await conversation.populate('members', 'firstName lastName avatar');
      
      res.json({
        success: true,
        data: conversation,
        message: 'Đã xóa thành viên khỏi cuộc trò chuyện'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Rời khỏi cuộc trò chuyện
  const leaveConversation = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cuộc trò chuyện'
        });
      }

      if (!conversation.members.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Bạn không có trong cuộc trò chuyện này'
        });
      }

      if (conversation.members.length <= 2) {
        // Nếu chỉ còn 2 người, xóa luôn cuộc trò chuyện
        await Message.deleteMany({ conversationId: conversation._id });
        await Conversation.findByIdAndDelete(conversationId);
        
        return res.json({
          success: true,
          message: 'Đã xóa cuộc trò chuyện'
        });
      }

      conversation.members = conversation.members.filter(id => id.toString() !== userId);
      await conversation.save();
      
      res.json({
        success: true,
        message: 'Đã rời khỏi cuộc trò chuyện'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật tên cuộc trò chuyện
  const updateConversationName = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { name } = req.body;
      const userId = req.user._id;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cuộc trò chuyện'
        });
      }

      if (!conversation.members.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền thực hiện'
        });
      }

      conversation.name = name || '';
      await conversation.save();

      await conversation.populate('members', 'firstName lastName avatar');
      
      res.json({
        success: true,
        data: conversation,
        message: 'Cập nhật tên cuộc trò chuyện thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Tìm kiếm cuộc trò chuyện
  const searchConversations = async (req, res) => {
    try {
      const userId = req.user._id;
      const { query, page = 1, limit = 10 } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
        });
      }

      const searchFilter = {
        members: userId,
        $or: [
          { name: { $regex: query.trim(), $options: 'i' } }
        ]
      };

      const conversations = await Conversation.find(searchFilter)
        .populate('members', 'firstName lastName avatar')
        .sort({ updatedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      // Tìm kiếm theo tên thành viên
      const memberSearchConversations = await Conversation.find({ members: userId })
        .populate({
          path: 'members',
          match: {
            $or: [
              { firstName: { $regex: query.trim(), $options: 'i' } },
              { lastName: { $regex: query.trim(), $options: 'i' } }
            ]
          },
          select: 'firstName lastName avatar'
        })
        .sort({ updatedAt: -1 });

      // Lọc những conversation có member match
      const filteredMemberConversations = memberSearchConversations.filter(conv => 
        conv.members && conv.members.length > 0
      );

      // Gộp kết quả và loại bỏ trùng lặp
      const allConversations = [...conversations];
      filteredMemberConversations.forEach(conv => {
        if (!allConversations.find(existing => existing._id.toString() === conv._id.toString())) {
          allConversations.push(conv);
        }
      });

      const totalConversations = allConversations.length;

      res.json({
        success: true,
        data: {
          conversations: allConversations.slice((page - 1) * limit, page * limit),
          searchQuery: query,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalConversations / limit),
            totalConversations,
            hasNextPage: page < Math.ceil(totalConversations / limit),
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

  // Xóa cuộc trò chuyện
  const deleteConversation = async (req, res) => {
    try {
      const { conversationId } = req.params;
      const userId = req.user._id;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy cuộc trò chuyện'
        });
      }

      if (!conversation.members.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xóa cuộc trò chuyện này'
        });
      }

      // Xóa tất cả tin nhắn trong cuộc trò chuyện
      await Message.deleteMany({ conversationId: conversation._id });
      
      // Xóa cuộc trò chuyện
      await Conversation.findByIdAndDelete(conversationId);
      
      res.json({
        success: true,
        message: 'Đã xóa cuộc trò chuyện và tất cả tin nhắn'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }



module.exports = {createConversation, getUserConversations, getConversation, addMembers, removeMember, leaveConversation, updateConversationName, searchConversations, deleteConversation};