const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const {
  addVideo,
  editVideo,
  deleteVideo,
  likeVideo,
  commentVideo,
  shareVideo,
  searchVideos,
  getAllVideos,
  getVideoById,
} = require("../controllers/videoController");

const router = express.Router();

router.get("/", getAllVideos);
router.get("/search", searchVideos);
router.get("/:id", getVideoById);
router.post("/add-video", authenticateJWT, addVideo);
router.put("/edit-video/:id", authenticateJWT, editVideo);
router.delete("/delete-video/:id", authenticateJWT, deleteVideo);
router.patch("/like-video/:id", authenticateJWT, likeVideo);
router.patch("/comment-video/:id", authenticateJWT, commentVideo);
router.patch("/share-video/:id", authenticateJWT, shareVideo);

module.exports = router;
