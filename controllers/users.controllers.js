import asyncWrapper from "../middlewares/asyncWrapper.js"; // handle any error
import { User } from "../models/user.model.js";
import { SUCCESS, FAIL, ERROR } from "../utils/httpStatusText.js";
import appError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import generateJWT from "../utils/generateJWT.js";

export const getAllUsers = asyncWrapper(async (req, res) => {
  // Pagination
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: SUCCESS, data: { users } });
});

export const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create("user already exists", 400, FAIL);
    return next(error);
  }
  // password hasshing
  const hashedPassword = await bcrypt.hash(password, 10);
  // create user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });
  // generate token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  // save all of those
  await newUser.save();
  res.status(201).json({ status: SUCCESS, data: { newUser } });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create("email and password are required", 400, FAIL);
    return next(error);
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user doesn't exist", 400, FAIL);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    return res.json({
      status: SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create(
      "Email or Password isn't corrected",
      500,
      ERROR
    );
    return next(error);
  }
});
