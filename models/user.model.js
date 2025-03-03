import mongoose from "mongoose";
import validator from "validator";
import { userRoles } from "../utils/userRoles.js";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "must be a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: "uploads/avatar.png",
  },
});

export const User = mongoose.model("User", UserSchema);
