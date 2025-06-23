import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import {
  getAllCourses,
  getCourseById,
} from "../controllers/getCourseController";
import upload from "../utils/upload";
import processImage from "../utils/processImage";

const router = express.Router();

router.get("/allcourses", getAllCourses);
router.get("/:id", getCourseById);

router.post("/", upload.single("image"), processImage, createCourse);
router.put("/courses/:id", processImage, updateCourse);
router.delete("/courses/:id", deleteCourse);

export default router;
