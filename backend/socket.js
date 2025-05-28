const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Message = require("./models/message");
const Conversation = require("./models/conversation");
const Notification = require("./models/notification");

const onlineUsers = new Map();

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // điều chỉnh nếu client ở domain khác
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("No token provided"));

      // Loại bỏ 'Bearer ' nếu có
      const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      const decoded = jwt.verify(actualToken, process.env.SECRET);
      const user = await User.findById(decoded._id);
      if (!user) return next(new Error("User not found"));

      socket.userId = decoded._id;
      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.firstName} (${socket.id})`);

    onlineUsers.set(socket.userId, socket.id);
    socket.broadcast.emit("user_online", socket.userId);

    // Join all conversations
    socket.on("join_conversations", async () => {
      const conversations = await Conversation.find({ members: socket.userId });
      conversations.forEach((c) => socket.join(c._id.toString()));
    });

    socket.on("send_message", async (data) => {
      try {
        const { conversationId, type, text, image, sticker, sharedType, sharedId } = data;
        console.log('Received message data:', data);
        console.log('Socket user:', socket.userId);

        const conversation = await Conversation.findById(conversationId);
        console.log('Found conversation:', conversation);
        
        if (!conversation) {
          console.error('Conversation not found:', conversationId);
          socket.emit("error", { message: "Cuộc trò chuyện không tồn tại." });
          return;
        }

        if (!conversation.members.includes(socket.userId)) {
          console.error('User not in conversation members:', {
            userId: socket.userId,
            members: conversation.members
          });
          socket.emit("error", { message: "Bạn không có quyền gửi tin nhắn." });
          return;
        }

        const newMessage = new Message({
          conversationId,
          sender: socket.userId,
          type,
          text: type === 'text' ? text : undefined,
          image: type === 'image' ? image : undefined,
          sticker: type === 'sticker' ? sticker : undefined,
          sharedType: type === 'share' ? sharedType : undefined,
          sharedId: type === 'share' ? sharedId : undefined
        });

        console.log('Created new message:', newMessage);
        await newMessage.save();
        await newMessage.populate("sender", "firstName lastName avatar");
        console.log('Saved and populated message:', newMessage);

        io.to(conversationId).emit("new_message", { message: newMessage, conversationId });

        const others = conversation.members.filter(id => id.toString() !== socket.userId);
        for (const memberId of others) {
          const notification = new Notification({
            receiver: memberId,
            sender: socket.userId,
            type: "message",
            message: `${socket.user.firstName} đã gửi tin nhắn`
          });
          await notification.save();
          await notification.populate("sender", "firstName lastName avatar");

          const receiverSocketId = onlineUsers.get(memberId.toString());
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("new_notification", notification);
          }
        }
      } catch (error) {
        console.error("Send message error:", error);
        let errorMessage = "Không thể gửi tin nhắn";
        
        if (error.name === 'ValidationError') {
          errorMessage = "Dữ liệu tin nhắn không hợp lệ";
        } else if (error.name === 'CastError') {
          errorMessage = "ID cuộc trò chuyện không hợp lệ";
        }
        
        socket.emit("error", { message: errorMessage, details: error.message });
      }
    });

    socket.on("typing_start", ({ conversationId }) => {
      socket.to(conversationId).emit("user_typing", {
        userId: socket.userId,
        userName: socket.user.firstName,
        conversationId
      });
    });

    socket.on("typing_stop", ({ conversationId }) => {
      socket.to(conversationId).emit("user_stop_typing", {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on("mark_as_read", async ({ conversationId }) => {
      await Message.updateMany(
        { conversationId, sender: { $ne: socket.userId } },
        { isRead: true }
      );
      socket.to(conversationId).emit("messages_read", {
        conversationId,
        readBy: socket.userId
      });
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

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new_notification", notification);
        }
      } catch (err) {
        console.error("Send notification error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.firstName}`);
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit("user_offline", socket.userId);
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
