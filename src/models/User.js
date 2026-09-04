import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ["ADMIN", "ORGANIZER", "USER"], default: "USER" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
