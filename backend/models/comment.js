const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema ({
    targetId: {type: Schema.Types.ObjectId, required: true},
    targetType: {type: String, enum: ['post', 'video']},
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    text: {type: String},
    sticker: {type: String},
    replyOf: {type: Schema.Types.ObjectId, ref: 'Comment', default: null},
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, {
    timestamps: true
})

commentSchema.pre('validate', function (next) {
  if (!this.text && !this.sticker) {
    this.invalidate('text', 'Ít nhất phải có text hoặc sticker');
    this.invalidate('sticker', 'Ít nhất phải có text hoặc sticker');
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema)