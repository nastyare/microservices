import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import {
  deleteEnrollment,
  enrollInCourse,
  getUserEnrollments,
} from "../../controllers/enrollment/enrollmentController";

const router = express.Router();

router.use(authMiddleware);

router.post("/:courseId", enrollInCourse);
router.get("/", getUserEnrollments);
router.delete("/:courseId", deleteEnrollment);

export default router;
