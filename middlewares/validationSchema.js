import { body } from "express-validator";

export const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title is required")
      .isLength({ min: 2 })
      .withMessage("title is at least 2 digits"),
    body("price")
      .notEmpty()
      .withMessage("price is required")
      .isLength({ min: 3 })
      .withMessage("price is at least 3 digits"),
  ];
};
