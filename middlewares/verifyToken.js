import jwt from "jsonwebtoken";
import { ERROR } from "../utils/httpStatusText.js";
import appError from "../utils/appError.js";

export const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create("Token is required", 401, ERROR);
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser; // تقدر تستخدمها ف اي مكان
    next();
  } catch (err) {
    const error = appError.create("Invalid Token", 401, ERROR);
    return next(error);
  }
};
