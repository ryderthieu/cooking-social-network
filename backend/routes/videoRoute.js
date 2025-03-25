const express = require("express");
const router = express.Router();
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

router.get("/", getAllVideos);
router.get("/search", searchVideos);
router.get("/:id", getVideoById);
//router.post("/add-video", authenticateJWT, addVideo);
router.post("/add-video", addVideo);
//router.put("/edit-video/:id", authenticateJWT, editVideo);
router.put("/edit-video/:id", editVideo);
//router.delete("/delete-video/:id", authenticateJWT, deleteVideo);
router.delete("/delete-video/:id", deleteVideo);
//router.patch("/like-video/:id", authenticateJWT, likeVideo);
router.patch("/like-video/:id", likeVideo);
//router.patch("/comment-video/:id", authenticateJWT, commentVideo);
router.patch("/comment-video/:id", commentVideo);
//router.patch("/share-video/:id", authenticateJWT, shareVideo);
router.patch("/share-video/:id", shareVideo);

module.exports = router;
