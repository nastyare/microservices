import { Request, Response } from "express";
import Enrollment from "../../models/enrollment";
import Lesson from "../../models/lesson";

const completeLesson = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { courseId, lessonId } = req.params;

  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { $addToSet: { completedLessons: lessonId } },
      { new: true },
    );

    if (!enrollment) {
      res.status(404).json({ message: "Вы не записаны на этот курс." });
      return;
    }

    res
      .status(200)
      .json({ message: "Урок отмечен как пройденный.", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при отметке прогресса.", error });
  }
};

const getProgress = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { courseId } = req.params;

  try {
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });
    if (!enrollment) {
      res.status(404).json({ message: "Запись не найдена." });
      return;
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completedCount = enrollment.completedLessons.length;

    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res
      .status(200)
      .json({ progress, completed: completedCount, total: totalLessons });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении прогресса.", error });
  }
};

export { completeLesson, getProgress };
