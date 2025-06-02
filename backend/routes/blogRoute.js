const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  getFeaturedBlogs,
  getRelatedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
} = require("../controllers/blogController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getAllBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/:id", getBlogById);
router.get("/:id/related", getRelatedBlogs);

// Protected routes
router.post("/", authenticateJWT, createBlog);
router.put("/:id", authenticateJWT, updateBlog);
router.delete("/:id", authenticateJWT, deleteBlog);
router.post("/:id/like", authenticateJWT, toggleLikeBlog);

module.exports = router;
