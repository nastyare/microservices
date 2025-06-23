import { Request, Response } from "express";
import Comment from "../models/comment";

const createComment = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ message: "Текст комментария обязателен." });
      return;
    }

    const comment = await Comment.create({
      user: req.user?.userId,
      lesson: lessonId,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Ошибка при создании комментария:", error);
    res.status(500).json({ message: "Ошибка создания комментария.", error });
  }
};

const getLessonComments = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;

    const comments = await Comment.find({ lesson: lessonId }).populate(
      "user",
      "firstName lastName",
    );

    res.status(200).json(comments);
  } catch (error) {
    console.error("Ошибка при получении комментариев:", error);
    res.status(500).json({ message: "Ошибка получения комментариев.", error });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: req.user?.userId },
      { text },
      { new: true },
    );

    if (!comment) {
      res.status(404).json({
        message: "Комментарий не найден или не принадлежит пользователю.",
      });
      return;
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("Ошибка при обновлении комментария:", error);
    res.status(500).json({ message: "Ошибка обновления комментария.", error });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const deleted = await Comment.findOneAndDelete({
      _id: commentId,
      user: req.user?.userId,
    });

    if (!deleted) {
      res.status(404).json({
        message: "Комментарий не найден или не принадлежит пользователю.",
      });
      return;
    }

    res.status(200).json({ message: "Комментарий удален." });
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    res.status(500).json({ message: "Ошибка удаления комментария.", error });
  }
};

export { createComment, updateComment, getLessonComments, deleteComment };
