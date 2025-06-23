import { Request, Response } from "express";
import Course from "../models/course";

const getAllCourses = async (req: Request, res: Response) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (req.query.search) {
      queryObj.title = { $regex: req.query.search as string, $options: "i" };
    }

    let query = Course.find(queryObj);

    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const courses = await query.exec();
    const total = await Course.countDocuments(queryObj);

    res.status(200).json({
      status: "success",
      results: courses.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: courses,
    });
  } catch {
    res.status(500).json({
      status: "error",
      message: "Ошибка при получении курсов",
    });
  }
};

const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("tags")
      .populate("lessons");

    if (!course) {
      res.status(404).json({
        status: "fail",
        message: "Курс не найден",
      });
    }
    res.status(200).json({
      status: "success",
      data: course,
    });
  } catch {
    res.status(500).json({
      status: "error",
      message: "Ошибка при получении курса",
    });
  }
};

export { getAllCourses, getCourseById };
