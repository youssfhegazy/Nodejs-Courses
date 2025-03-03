import express from "express";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  getSpecificCourse,
  updateCourse,
} from "../controllers/courses.controllers.js";
import { validationSchema } from "../middlewares/validationSchema.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { userRoles } from "../utils/userRoles.js";
import allowTo from "../middlewares/allowTo.js";

export const coursesRouter = express.Router();

coursesRouter
  .route("/")
  .get(getAllCourses)
  .post(
    verifyToken,
    allowTo(userRoles.ADMIN, userRoles.MANAGER),
    validationSchema(),
    addCourse
  );

coursesRouter
  .route("/:courseId")
  .get(getSpecificCourse)
  .patch(verifyToken, updateCourse)
  .delete(verifyToken, allowTo(userRoles.MANAGER), deleteCourse);
