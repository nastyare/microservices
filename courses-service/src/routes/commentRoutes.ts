import express from "express";
import authMiddleware from "../../../src/middlewares/authMiddleware";
import {
  createComment,
  getLessonComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController";

const router = express.Router();

router.use(authMiddleware);

router.post("/:lessonId", createComment);
router.get("/:lessonId", getLessonComments);
router.put("/update/:commentId", updateComment);
router.delete("/delete/:commentId", deleteComment);

export default router;
