const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Message = require("./models/message");
const Conversation = require("./models/conversation");
const Notification = require("./models/notification");

// onlineUsers sẽ lưu trữ: Map<userId, Set<socketId>>
const onlineUsers = new Map(); 

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("No token provided"));
      const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = jwt.verify(actualToken, process.env.SECRET);
      const user = await User.findById(decoded._id).select('-password'); // Exclude password
      if (!user) return next(new Error("User not found"));

      socket.userId = decoded._id.toString(); // Ensure it's a string for Map keys
      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.firstName} (${socket.id}), userId: ${socket.userId}`);

    // Quản lý user online
    if (!onlineUsers.has(socket.userId)) {
      onlineUsers.set(socket.userId, new Set());
    }
    const userSocketIds = onlineUsers.get(socket.userId);
    
    // Chỉ emit 'user_online' nếu đây là kết nối đầu tiên của user này
    if (userSocketIds.size === 0) {
      socket.broadcast.emit("user_online", socket.userId);
      console.log(`${socket.userId} is now online (first connection). Emitting user_online.`);
    }
    userSocketIds.add(socket.id);
    
    console.log('Current online users:', Array.from(onlineUsers.keys())); // Log userIds that have active connections

    // Gửi danh sách người dùng đang online cho client vừa kết nối
    // Lấy danh sách các userId đang có ít nhất 1 socketId hoạt động
    const activeOnlineUserIds = Array.from(onlineUsers.entries())
                                .filter(([userId, socketIds]) => socketIds.size > 0)
                                .map(([userId, socketIds]) => userId);
    socket.emit("initial_online_users", activeOnlineUserIds);
    console.log(`Sent initial_online_users to ${socket.userId}: ${activeOnlineUserIds}`);


    // Join all conversations
    socket.on("join_conversations", async () => {
      try {
        const conversations = await Conversation.find({ members: socket.userId });
        conversations.forEach((c) => socket.join(c._id.toString()));
        console.log(`${socket.userId} joined rooms for their conversations.`);
      } catch (error) {
        console.error(`Error joining conversations for ${socket.userId}:`, error);
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { conversationId, type, text, image, sticker, sharedType, sharedId, replyTo } = data;
        
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          return socket.emit("error", { message: "Cuộc trò chuyện không tồn tại." });
        }
        if (!conversation.members.map(id => id.toString()).includes(socket.userId)) {
          return socket.emit("error", { message: "Bạn không có quyền gửi tin nhắn." });
        }

        const newMessage = new Message({
          conversationId,
          sender: socket.userId,
          type,
          text: type === 'text' ? text : undefined,
          image: type === 'image' ? image : undefined,
          sticker: type === 'sticker' ? sticker : undefined,
          sharedType: type === 'share' ? sharedType : undefined,
          sharedId: type === 'share' ? sharedId : undefined,
          reactions: [],
          readBy: [{ // Tự động đánh dấu là đã đọc bởi người gửi
            userId: socket.userId,
            readAt: new Date()
          }]
        });

        if (replyTo) {
          newMessage.replyTo = replyTo;
        }

        await newMessage.save();

        // Đếm lại số tin nhắn chưa đọc cho mỗi thành viên
        const unreadCounts = {};
        for (const memberId of conversation.members) {
          if (memberId.toString() !== socket.userId) {
            const count = await Message.countDocuments({
              conversationId,
              sender: { $ne: memberId },
              'readBy.userId': { $ne: memberId }
            });
            unreadCounts[memberId.toString()] = count;
          } else {
            unreadCounts[memberId.toString()] = 0;
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
        
        await newMessage.populate(
            { path: "sender", select: "firstName lastName avatar _id" }
        );

        let populatedMessage = newMessage.toObject();

        if (populatedMessage.replyTo) {
            try {
                const originalMessage = await Message.findById(populatedMessage.replyTo)
                                                 .populate('sender', 'firstName _id')
                                                 .select('text content sender recalled');
                if (originalMessage) {
                    populatedMessage.replyTo = {
                        id: originalMessage._id,
                        content: originalMessage.recalled ? "Tin nhắn này đã bị xóa" : (originalMessage.text || originalMessage.content),
                        sender: originalMessage.sender
                    };
                } else {
                    populatedMessage.replyTo = null; 
                }
            } catch (populateError) {
                console.error("Error populating replyTo message:", populateError);
                populatedMessage.replyTo = null;
            }
        }

        io.to(conversationId.toString()).emit("new_message", { message: populatedMessage, conversationId });
        console.log(`Message sent in conversation ${conversationId} by ${socket.userId}`);

        // Create notifications for other members
        const otherMembers = conversation.members.filter(id => id.toString() !== socket.userId);
        for (const memberIdStr of otherMembers) {
          const notification = new Notification({
            receiver: memberIdStr,
            sender: socket.userId,
            type: "message",
            contentObject: newMessage._id,
            contentType: 'Message',
            message: `${socket.user.firstName} đã gửi cho bạn một tin nhắn.`
          });
          await notification.save();
          await notification.populate("sender", "firstName lastName avatar");
          
          const memberSocketIds = onlineUsers.get(memberIdStr);
          if (memberSocketIds) {
            memberSocketIds.forEach(socketId => {
                io.to(socketId).emit("new_notification", notification);
            })
          }
        }
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Không thể gửi tin nhắn", details: error.message });
      }
    });
    
    socket.on("delete_message", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          return socket.emit("error", { message: "Tin nhắn không tìm thấy." });
        }
        if (message.sender.toString() !== socket.userId) {
          return socket.emit("error", { message: "Bạn không có quyền xóa tin nhắn này." });
        }
        
        message.text = "Tin nhắn này đã bị xóa";
        message.recalled = true;
        // Optionally clear other fields like image, sticker if needed
        // message.image = undefined; 
        await message.save();
        
        io.to(message.conversationId.toString()).emit("message_recalled", {
          messageId: message._id,
          conversationId: message.conversationId.toString()
        });
        console.log(`Message ${messageId} recalled by ${socket.userId}`);
      } catch (error) {
        console.error("Error recalling message:", error);
        socket.emit("error", { message: "Lỗi khi thu hồi tin nhắn.", details: error.message });
      }
    });

    socket.on("react_to_message", async ({ messageId, type: reactionType }) => {
        try {
            const message = await Message.findById(messageId).populate('sender', '_id');
            if (!message) {
                return socket.emit("error", { message: "Tin nhắn không tìm thấy." });
            }

            if (message.sender && message.sender._id.toString() === socket.userId) {
                console.log(`User ${socket.userId} attempted to react to their own message ${messageId}. Denied.`);
                return;
            }

            const userIdStr = socket.userId;

            if (!Array.isArray(message.reactions)) {
                message.reactions = [];
            }
            
            // Tìm reaction hiện tại của user này trên tin nhắn này (nếu có)
            const userExistingReactionIndex = message.reactions.findIndex(
                r => r.userId && r.userId.toString() === userIdStr
            );

            let userCurrentReactionType = null;
            if (userExistingReactionIndex > -1) {
                userCurrentReactionType = message.reactions[userExistingReactionIndex].type;
                // Gỡ bỏ reaction hiện tại của user
                message.reactions.splice(userExistingReactionIndex, 1);
            }

            // Nếu reactionType mới khác với reaction hiện tại (hoặc user chưa có reaction nào),
            // thì thêm reaction mới. Nếu giống (tức là click lại vào cái đã chọn), thì không thêm lại (đã gỡ ở trên).
            if (userCurrentReactionType !== reactionType) {
                message.reactions.push({ type: reactionType, userId: socket.userId });
            }
            
            await message.save();

            // Transform message.reactions for client emission (logic này giữ nguyên)
            const populatedReactionsForClient = [];
            if (Array.isArray(message.reactions) && message.reactions.length > 0) {
                const reactionGroups = {};
                message.reactions.forEach(r => {
                    if (!r || !r.type || !r.userId) return;
                    reactionGroups[r.type] = reactionGroups[r.type] || [];
                    reactionGroups[r.type].push(r.userId);
                });

                for (const type of Object.keys(reactionGroups)) {
                    const userIdsInGroup = reactionGroups[type];
                    const users = await User.find({ _id: { $in: userIdsInGroup } })
                                            .select('_id firstName lastName avatar')
                                            .lean();
                    if (users.length > 0) { // Chỉ push nếu có user được populate
                        populatedReactionsForClient.push({
                            type: type,
                            users: users
                        });
                    }
                }
            }
            
            io.to(message.conversationId.toString()).emit("message_reaction", {
                messageId,
                conversationId: message.conversationId.toString(),
                reactions: populatedReactionsForClient
            });
            console.log(`User ${socket.userId} reacted with '${reactionType}' on message ${messageId}. Final client reactions: `, JSON.stringify(populatedReactionsForClient, null, 2));
        } catch (error) {
            console.error("Error reacting to message:", error);
            socket.emit("error", { message: "Lỗi khi thả cảm xúc.", details: error.message });
        }
    });


    socket.on("user_typing", ({ conversationId }) => {
      socket.to(conversationId.toString()).emit("user_typing", {
        userId: socket.userId,
        userName: socket.user.firstName,
        conversationId
      });
    });

    socket.on("user_stop_typing", ({ conversationId }) => {
      socket.to(conversationId.toString()).emit("user_stop_typing", {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on("mark_messages_as_seen", async ({ conversationId }) => {
      try {
        // Cập nhật tất cả tin nhắn chưa đọc trong cuộc trò chuyện mà user hiện tại chưa đọc
        const messagesToUpdate = await Message.find({
          conversationId,
          sender: { $ne: socket.userId },
          'readBy.userId': { $ne: socket.userId } // Chưa được đọc bởi user hiện tại
        });

        if (messagesToUpdate.length > 0) {
          const updatePromises = messagesToUpdate.map(message => 
            Message.findByIdAndUpdate(
              message._id,
              {
                $push: {
                  readBy: {
                    userId: socket.userId,
                    readAt: new Date()
                  }
                }
              },
              { new: true } // Optional: trả về document đã update
            )
          );
          await Promise.all(updatePromises);
        }

        // Đếm lại số tin nhắn chưa đọc cho CHÍNH USER VỪA ĐÁNH DẤU XEM
        const newUnreadCountForCurrentUser = await Message.countDocuments({
          conversationId,
          sender: { $ne: socket.userId },       // Tin nhắn không phải của họ
          'readBy.userId': { $ne: socket.userId } // Và họ vẫn chưa đọc (sau khi đã push ở trên, con số này thường là 0)
        });

        // Cập nhật trường unreadCounts.{userId} trong conversation model
        const updateQuery = { $set: {} };
        updateQuery.$set[`unreadCounts.${socket.userId}`] = newUnreadCountForCurrentUser;
        
        await Conversation.findByIdAndUpdate(
          conversationId,
          updateQuery
        );

        // Thông báo cho tất cả client trong cuộc trò chuyện
        io.to(conversationId.toString()).emit("messages_seen", {
          conversationId,
          seenBy: socket.userId,
          unreadCount: newUnreadCountForCurrentUser // Gửi unread count mới của user vừa xem
        });

        console.log(`Messages marked as seen in conversation ${conversationId} by ${socket.userId}. Their new unread count: ${newUnreadCountForCurrentUser}`);
      } catch (error) {
        console.error("Error marking messages as seen:", error);
        socket.emit("error", { message: "Lỗi khi đánh dấu tin nhắn đã xem", details: error.message });
      }
    });

    socket.on("send_notification", async (data) => {
      try {
        const { receiverId, type, postId, videoId, commentId, message } = data;
        const notification = new Notification({
          receiver: receiverId,
          sender: socket.userId,
          type,
          postId,
          videoId,
          commentId,
          message: message || getNotificationMessage(type, socket.user.firstName)
        });
        await notification.save();
        await notification.populate("sender", "firstName lastName avatar");

        const receiverSocketIds = onlineUsers.get(receiverId.toString());
        if (receiverSocketIds) {
          receiverSocketIds.forEach(socketId => {
            io.to(socketId).emit("new_notification", notification);
          });
        }
      } catch (err) {
        console.error("Send notification error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.firstName} (${socket.id}), userId: ${socket.userId}`);
      const userSocketIds = onlineUsers.get(socket.userId);
      if (userSocketIds) {
        userSocketIds.delete(socket.id);
        if (userSocketIds.size === 0) {
          onlineUsers.delete(socket.userId);
          socket.broadcast.emit("user_offline", socket.userId);
          console.log(`${socket.userId} is now offline (last connection closed). Emitting user_offline.`);
        }
      }
      console.log('Current online users (after disconnect):', Array.from(onlineUsers.keys()));
    });
  });
};

function getNotificationMessage(type, senderName) {
  switch (type) {
    case "like": return `${senderName} đã thích bài viết của bạn`;
    case "comment": return `${senderName} đã bình luận bài viết của bạn`;
    case "reply": return `${senderName} đã trả lời bình luận của bạn`;
    case "share": return `${senderName} đã chia sẻ bài viết của bạn`;
    case "follow": return `${senderName} đã theo dõi bạn`;
    case "mention": return `${senderName} đã nhắc đến bạn`;
    default: return `${senderName} đã tương tác với bạn`;
  }
}

module.exports = socketServer;
