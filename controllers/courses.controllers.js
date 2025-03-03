import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import { FAIL, SUCCESS } from "../utils/httpStatusText.js";
import asyncWrapper from "../middlewares/asyncWrapper.js"; // handle any error
import appError from "../utils/appError.js";

export const getAllCourses = asyncWrapper(async (req, res) => {
  // Pagination
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: SUCCESS, data: { courses } });
});

export const getSpecificCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create("not found course", 404, FAIL);
    return next(error);
  }
  return res.json({ status: SUCCESS, data: { course } });
});

export const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 404, FAIL);
    return next(error);
  }
  const createdCourse = new Course(req.body);
  await createdCourse.save();
  return res
    .status(201)
    .json({ status: SUCCESS, data: { course: createdCourse } });
});

export const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const updatedCourse = await Course.updateMany(
    { _id: courseId },
    {
      $set: { ...req.body },
    }
  );
  return res
    .status(200)
    .json({ status: SUCCESS, data: { course: updatedCourse } });
});

export const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  await Course.deleteOne({ _id: courseId });
  res.status(200).json({ status: SUCCESS, data: null });
});
