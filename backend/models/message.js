const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['text', 'image', 'sticker', 'share'], default: 'text' },
  text: { type: String }, // chỉ dùng nếu type === 'text'
  image: { type: String }, // nếu type === 'image'
  sticker: { type: String }, // nếu type === 'sticker'

  // Nếu là share
  sharedType: { type: String, enum: ['post', 'video'] },
  sharedId: { type: Schema.Types.ObjectId },
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema)