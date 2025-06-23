import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["student", "teacher"] },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  enrollments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
