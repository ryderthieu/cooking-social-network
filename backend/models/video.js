const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    caption: { type: String },
    recipe: { type: Schema.Types.ObjectId, required: true, ref: "Recipe" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment', default: []}],
    shares: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    videoUri: { type: String, required: true},
    captionSlug: { type: String },
    recipeSlug: { type: String },
    authorSlug: { type: String },
    views: {type: Number, default: 0}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);
