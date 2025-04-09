const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    caption: { type: String },
    recipe: { type: Schema.Types.ObjectId, required: true, ref: "Recipe" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    likeCount: { type: Number, default: 0 },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    shares: { type: Number, default: 0 },
    videoUri: { type: String, ref: "Video" },
    captionSlug: { type: String },
    recipeSlug: { type: String },
    authorSlug: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);
