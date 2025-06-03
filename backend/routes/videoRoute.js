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
  getVideoByUserId,
  getMyVideos,
} = require("../controllers/videoController");

const router = express.Router();

router.get("/my-videos", authenticateJWT, getMyVideos);
router.get("/user/:userId", getVideoByUserId);  
router.get("/search", searchVideos);
router.get("/:id", getVideoById);
router.get("/", getAllVideos);

router.post("/add-video", authenticateJWT, addVideo);
router.put("/edit-video/:id", authenticateJWT, editVideo);
router.delete("/delete-video/:id", authenticateJWT, deleteVideo);
router.patch("/like-video/:id", authenticateJWT, likeVideo);
router.patch("/comment-video/:id", authenticateJWT, commentVideo);
router.patch("/share-video/:id", authenticateJWT, shareVideo);

module.exports = router;
