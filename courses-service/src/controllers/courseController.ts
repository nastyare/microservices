import { Request, Response } from "express";
import Course from "../models/course";

const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, level, author } = req.body;
    const image = req.file?.filename;

    if (!title || !price || !category || !author) {
      res.status(400).json({
        message: "Не заполнены обязательные поля.",
        required: ["title", "price", "category", "author"],
      });
      return;
    }

    const newCourse = new Course({
      title,
      description,
      price,
      category,
      level,
      image,
      author,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Ошибка при создании курса:", error);
    res.status(500).json({ message: "Ошибка при создании курса", error });
  }
};

const updateCourse = async (req: Request, res: Response) => {
  try {
    const updatedFields = req.body;
    if (req.file) {
      updatedFields.image = req.file.filename;
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
      },
    );

    if (!course) {
      res.status(404).json({ message: "Курс не найден." });
      return;
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при обновлении курса:", error });
  }
};

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404).json({ message: "Курс не найден." });
      return;
    }
    res.json({ message: "Курс успешно удалён." });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении курса:", error });
  }
};

export { createCourse, updateCourse, deleteCourse };
