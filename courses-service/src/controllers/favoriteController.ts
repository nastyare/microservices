import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Course from "../models/course";

const addToFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ message: "Сначала авторизуйтесь." });
      return;
    }

    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      res.status(404).json({ message: "Курс не найден." });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { favorites: courseId } },
      { new: true },
    ).populate("favorites");

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден." });
      return;
    }

    res.status(200).json({
      message: "Курс добавлен в избранное.",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { $pull: { favorites: courseId } },
      { new: true },
    ).populate("favorites");

    res.status(200).json({
      message: "Курс удален из избранного.",
      favorites: user!.favorites,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при удалении из избранного:", error });
  }
};

const getFavorites = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).populate({
      path: "favorites",
      populate: {
        path: "author",
        select: "firstName lastName",
      },
    });

    res.status(200).json(user!.favorites);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении избранного курса:", error });
  }
};

export { removeFromFavorites, addToFavorites, getFavorites };
