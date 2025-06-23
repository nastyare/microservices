import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Название курса обязательно."],
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: String,
  price: Number,
  category: String,
  level: String,
  image: String,
  author: String,
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

courseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);
export default Course;
