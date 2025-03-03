import express from "express";
import { coursesRouter } from "./routes/courses.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import mongoose from "mongoose";
import { config } from "dotenv";
import { ERROR } from "./utils/httpStatusText.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Import for __dirname

config.apply();

const app = express();

const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
  console.log("mongodb server start");
});

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors()); // handle CORS error
app.use(express.json()); // parse incoming request bodies in MW
app.use("/api/courses", coursesRouter); // static URL (courses)
app.use("/api/users", usersRouter); // static URL (users)

// Global Middleware handler => if path not found
app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({ status: ERROR, message: "this resource isn't available" });
});

// Global Error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port: 3000");
});
