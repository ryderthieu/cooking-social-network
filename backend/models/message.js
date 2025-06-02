const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'image', 'sticker', 'share'], default: 'text' },
  text: { type: String }, // chỉ dùng nếu type === 'text'
  image: { type: String }, // nếu type === 'image'
  sticker: { type: String }, // nếu type === 'sticker'

  // Nếu là share
  sharedType: { type: String, enum: ['post', 'video', 'recipe'] },
  sharedId: { type: Schema.Types.ObjectId },

  // Thêm trường replyTo
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message', default: null }, // Tham chiếu đến tin nhắn gốc

  // Thay thế isRead boolean bằng mảng readBy để lưu thông tin người đọc
  readBy: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],

  reactions: [{
    type: {type: String},
    userId: {type: Schema.Types.ObjectId, ref: 'User'}
  }],
  recalled: {type: Boolean, default: false}
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema)