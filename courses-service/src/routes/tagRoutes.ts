import express from "express";
import {
  createTag,
  addTagToCourse,
  getAllTags,
} from "../controllers/tagController";

const router = express.Router();

router.post("/", createTag);
router.get("/", getAllTags);
router.post("/:tagId/courses/:courseId", addTagToCourse);

export default router;
