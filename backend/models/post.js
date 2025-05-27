const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    caption: { type: String },
    recipe: { type: Schema.Types.ObjectId, required: true, ref: "Recipe" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment", default: []}],
    shares: { type: Schema.Types.ObjectId, ref: "User", default: [] },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true },
      },
    ],
    captionSlug: { type: String },
    recipeSlug: { type: String },
    authorSlug: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
