import express from "express";
import authMiddleware from "../../../src/middlewares/authMiddleware";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../controllers/favoriteController";

const router = express.Router();

router.use(authMiddleware);

router.post("/:courseId", addToFavorites);
router.delete("/:courseId", removeFromFavorites);
router.get("/", getFavorites);

export default router;
