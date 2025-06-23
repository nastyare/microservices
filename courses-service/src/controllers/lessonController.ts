import { Request, Response } from "express";
import Lesson from "../models/lesson";
import Course from "../models/course";

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, content, videoUrl, course, order } = req.body;
    if (!title || !course) {
      res.status(400).json({ message: "Поле title и course обязательны." });
      return;
    }

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      course,
      order,
    });

    await Course.findByIdAndUpdate(course, {
      $push: { lessons: lesson._id },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Ошибка при создании урока:", error);
    res.status(500).json({ message: "Ошибка при создании урока.", error });
  }
};

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find().populate("course", "title");
    res.status(200).json(lessons);
  } catch (error) {
    console.error("Ошибка при получении уроков:", error);
    res.status(500).json({ message: "Ошибка при получении уроков.", error });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate(
      "course",
      "title",
    );
    if (!lesson) {
      res.status(404).json({ message: "Урок не найден." });
      return;
    }
    res.status(200).json(lesson);
  } catch (error) {
    console.error("Ошибка при получении урока:", error);
    res.status(500).json({ message: "Ошибка при получении урока.", error });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const updated = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ message: "Урок не найден." });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Ошибка при обновлении урока:", error);
    res.status(500).json({ message: "Ошибка при обновлении урока.", error });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const deleted = await Lesson.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Урок не найден." });
      return;
    }
    res.status(200).json({ message: "Урок удалён." });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).json({ message: "Ошибка при удалении урока.", error });
  }
};
