import express from "express";
import {
  getAllUsers,
  register,
  login,
} from "../controllers/users.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import multer from "multer";
import appError from "../utils/appError.js";

// handle image uploading using multer
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    const filename = `user-${Date.now()}.${extension}`;
    cb(null, filename);
  },
});
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false);
  }
};
const upload = multer({ storage: diskStorage, fileFilter });

export const usersRouter = express.Router();

usersRouter.route("/").get(verifyToken, getAllUsers);
usersRouter.route("/register").post(upload.single("avatar"), register);
usersRouter.route("/login").post(login);
