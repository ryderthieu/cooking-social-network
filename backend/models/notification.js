const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  sender: { type: Schema.Types.ObjectId, ref: 'User' }, 

  type: {
    type: String,
    enum: ['like', 'comment', 'reply', 'share', 'follow', 'mention'],
    required: true
  },

  // liên kết đến nội dung liên quan
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  videoId: { type: Schema.Types.ObjectId, ref: 'Video' },
  commentId: { type: Schema.Types.ObjectId, ref: 'Comment' },

  isRead: { type: Boolean, default: false },
},
{
  timestamps: true  
});

module.exports = mongoose.model('Notification', notificationSchema);
