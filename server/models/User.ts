import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: false, default: "" },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

export const User: mongoose.Model<any> = mongoose.models.User || mongoose.model("User", userSchema);
