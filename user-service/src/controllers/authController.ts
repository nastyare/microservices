import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import generateToken from "../utils/jwt";
import { Types } from "mongoose";

declare module "express" {
  interface Request {
    user?: {
      userId: Types.ObjectId;
    };
  }
}

const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, login, password, role } = req.body;

    if (!firstName || !lastName || !login || !password || !role) {
      res.status(400).json({ message: "Все поля обязательны для заполнения." });
      return;
    }

    const existingUserByUsername = await User.findOne({ login });
    if (existingUserByUsername) {
      res
        .status(400)
        .json({ message: "Пользователь с таким логином уже существует." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      login,
      password: hashedPassword,
      role,
    });

    await User.syncIndexes();
    await newUser.save();

    res.status(201).json({ message: "Пользователь успешно зарегистрирован." });
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    res
      .status(500)
      .json({ message: "Ошибка при регистрации пользователя", error });
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) {
      res.status(400).json({ message: "Пользователь не найден." });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Неверный пароль." });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({ token });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка при авторизации:", error });
  }
};

export { registerUser, loginUser };
