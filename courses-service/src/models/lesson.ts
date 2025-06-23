import mongoose from "mongoose";
import Course from "./course";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

lessonSchema.pre("findOneAndDelete", async function (next) {
  const lesson = await this.model.findOne(this.getFilter());
  if (lesson) {
    await Course.findByIdAndUpdate(lesson.course, {
      $pull: { lessons: lesson._id },
    });
  }
  next();
});

const Lesson = mongoose.model("Lesson", lessonSchema);
export default Lesson;
