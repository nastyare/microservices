import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Неавторизованный доступ." });
      return;
    }

    const userProfile = await User.findById(req.user.userId)
      .select("-password")
      .populate("favorites");

    if (!userProfile) {
      res.status(404).json({ message: "Пользователь не найден." });
      return;
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    res
      .status(500)
      .json({ message: "Ошибка при получении данных пользователя" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Неавторизованный" });
      return;
    }
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Пользователь успешно удален" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res.status(500).json({ message: "Ошибка удаления пользователя" });
  }
};

const handleUserMessage = async (msg: any) => {
  if (msg.type === "REGISTER_USER") {
    const { firstName, lastName, login, password, role } = msg.payload;
    try {
      const user = await User.create({ firstName, lastName, login, password, role });
      console.log("Пользователь создан:", user.login);
    } catch (err) {
      console.error("Ошибка регистрации пользователя:", err);
    }
  }
};

export { deleteUser, getCurrentUser, handleUserMessage };
