const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
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
  getPostsByUserId
} = require("../controllers/postController");

const router = express.Router();

router.put("/edit-post/:id", authenticateJWT, editPost);
router.delete("/delete-post/:id", authenticateJWT, deletePost);
router.patch("/like-post/:id", authenticateJWT, likePost);
router.patch("/comment-post/:id", authenticateJWT, commentPost);
router.patch("/share-post/:id", authenticateJWT, sharePost);
router.post("/add-post", authenticateJWT, addPost);
router.get("/user/:userId", authenticateJWT, getPostsByUserId);

router.get("/search", searchPosts);
router.get("/:id", getPostById);
router.get("/", getAllPosts);

module.exports = router;
