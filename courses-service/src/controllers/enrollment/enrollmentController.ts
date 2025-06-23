import { Request, Response } from "express";
import Enrollment from "../../models/enrollment";
import Course from "../../models/course";
import Lesson from "../../models/lesson";
import mongoose from "mongoose";

const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Неавторизованный доступ." });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: "Курс не найден." });
      return;
    }

    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      message: "Успешная запись на курс.",
      enrollment,
    });
  } catch (err) {
    const error = err as mongoose.Error & { code?: number };
    if (error.code === 11000) {
      res.status(400).json({ message: "Вы уже записаны на этот курс." });
    } else {
      console.error("Ошибка при записи:", error);
      res.status(500).json({ message: "Ошибка при записи на курс.", error });
    }
  }
};

const getUserEnrollments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const enrollments = await Enrollment.find({ user: userId }).populate(
      "course",
    );

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Ошибка:", error);
    res
      .status(500)
      .json({ message: "Ошибка получения записей на курсы.", error });
  }
};

const deleteEnrollment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { courseId } = req.params;

    const result = await Enrollment.findOneAndDelete({
      user: userId,
      course: courseId,
    });

    if (!result) {
      res.status(404).json({ message: "Запись не найдена." });
      return;
    }

    res.status(200).json({ message: "Вы отписались от курса." });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при отмене записи.", error });
  }
};

const getEnrollmentCount = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const count = await Enrollment.countDocuments({ course: courseId });
    res.status(200).json({ courseId, enrolledStudents: count });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при подсчёте студентов", error });
  }
};

const uncompleteLesson = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { courseId, lessonId } = req.params;

  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { $pull: { completedLessons: lessonId } },
      { new: true },
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Запись не найдена" });
    }

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completedCount = enrollment.completedLessons.length;
    const progress =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.status(200).json({
      message: "Урок помечен как не пройденный",
      progress,
      completed: completedCount,
      total: totalLessons,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при отмене прохождения урока", error });
  }
};

export {
  getEnrollmentCount,
  getUserEnrollments,
  enrollInCourse,
  deleteEnrollment,
  uncompleteLesson,
};
