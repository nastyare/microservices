import Course from "../models/course";

export const handleCourseMessage = async (msg: any) => {
  try {
    const { type, payload } = JSON.parse(msg.content.toString());

    switch (type) {
      case "CREATE_COURSE": {
        const { title, description, price, category, level, author, image } = payload;

        if (!title || !price || !category || !author) {
          console.warn("Не заполнены обязательные поля при создании курса");
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
        console.log("Курс создан:", newCourse.title);
        break;
      }

      case "UPDATE_COURSE": {
        const { id, updates } = payload;

        if (!id || !updates) {
          console.warn("ID и данные обновления обязательны");
          return;
        }

        const course = await Course.findByIdAndUpdate(id, updates, {
          new: true,
        });

        if (!course) {
          console.warn("Курс не найден для обновления:", id);
          return;
        }

        console.log("Курс обновлён:", course.title);
        break;
      }

      case "DELETE_COURSE": {
        const { id } = payload;

        if (!id) {
          console.warn("ID обязателен для удаления курса");
          return;
        }

        const course = await Course.findByIdAndDelete(id);
        if (!course) {
          console.warn("Курс не найден для удаления:", id);
          return;
        }

        console.log("Курс удалён:", course.title);
        break;
      }

      default:
        console.warn("Неизвестный тип сообщения:", type);
    }
  } catch (error) {
    console.error("Ошибка при обработке сообщения в courseHandler:", error);
  }
};
