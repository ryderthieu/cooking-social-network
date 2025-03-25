const express = require("express");
const router = express.Router();
const middlewares = require("../middlewares/authMiddleware");
const {
  addPost,
  editPost,
  deletePost,
  likePost,
  commentPost,
  sharePost,
  searchPosts,
  getAllPosts,
  getPostById,
} = require("../controllers/postController");

router.get("/", getAllPosts);
router.put("/edit-post/:id", editPost);
router.delete("/delete-post/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/comment-post/:id", commentPost);
router.patch("/share-post/:id", sharePost);
router.get("/search", searchPosts);
router.get("/:id", getPostById);
router.post("/add-post", addPost);

module.exports = router;
