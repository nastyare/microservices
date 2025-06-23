import { Request, Response } from "express";
import Tag from "../models/tag";
import Course from "../models/course";
import mongoose from "mongoose";

const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: "Ошибка создания тега:", error });
  }
};

const addTagToCourse = async (req: Request, res: Response) => {
  try {
    const { courseId, tagId } = req.params;

    const courseObjectId = new mongoose.Types.ObjectId(courseId.trim());
    const tagObjectId = new mongoose.Types.ObjectId(tagId.trim());

    const course = await Course.findById(courseObjectId);
    if (!course) {
      res.status(404).json({ message: "Такого курса не существует." });
      return;
    }

    const tag = await Tag.findById(tagObjectId);
    if (!tag) {
      res.status(404).json({ message: "Такого тэга не существует." });
      return;
    }

    if (!course.tags.includes(tagObjectId)) {
      course.tags.push(tagObjectId);
      await course.save();
    }
    if (!tag.courses.includes(courseObjectId)) {
      tag.courses.push(courseObjectId);
      await tag.save();
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Ошибка добавления тега:", error });
  }
};

const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(400).json({ message: "Ошибка получения тегов:", error });
  }
};

export { createTag, getAllTags, addTagToCourse };
