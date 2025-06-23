import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getCurrentUser, deleteUser } from "../controllers/userController";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.delete("/delete", authMiddleware, deleteUser);

export default router;