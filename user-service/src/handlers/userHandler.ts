import User from "../models/user";
import bcrypt from "bcrypt";

export const handleUserMessage = async (msg: any) => {
  try {
    const { type, payload } = JSON.parse(msg.content.toString());

    switch (type) {
      case "REGISTER_USER": {
        const { firstName, lastName, login, password, role } = payload;

        if (!firstName || !lastName || !login || !password || !role) {
          console.warn("Пропущены обязательные поля при регистрации");
          return;
        }

        const existingUser = await User.findOne({ login });
        if (existingUser) {
          console.warn("Пользователь с таким логином уже существует:", login);
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

        console.log("Зарегистрирован пользователь:", newUser.login);
        break;
      }

      case "DELETE_USER": {
        const { userId } = payload;

        if (!userId) {
          console.warn("userId обязателен для удаления пользователя");
          return;
        }

        const deleted = await User.findByIdAndDelete(userId);
        if (!deleted) {
          console.warn("Пользователь не найден для удаления:", userId);
          return;
        }

        console.log("Пользователь удалён:", userId);
        break;
      }

      case "GET_USER_BY_ID": {
        const { userId } = payload;

        if (!userId) {
          console.warn("userId обязателен для получения пользователя");
          return;
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
          console.warn("Пользователь не найден:", userId);
          return;
        }

        console.log("Пользователь найден:", user);
        break;
      }

      case "UPDATE_USER_ROLE": {
        const { userId, role } = payload;

        if (!userId || !role) {
          console.warn("userId и role обязательны для обновления роли");
          return;
        }

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { role },
          { new: true }
        );

        if (!updatedUser) {
          console.warn("Пользователь не найден для обновления роли:", userId);
          return;
        }

        console.log("Роль пользователя обновлена:", updatedUser.login);
        break;
      }

      default:
        console.warn("Неизвестный тип сообщения:", type);
    }
  } catch (err) {
    console.error("Ошибка обработки сообщения:", err);
  }
};
