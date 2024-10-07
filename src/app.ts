import "reflect-metadata";
import cors from "cors";
import morgan from "morgan";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import express, { NextFunction, Request, Response, urlencoded } from "express";

import apiRoutes from "./routes/apiRoutes";
import { errorResponse } from "./controllers/responseController";
const app = express();
//
//
// Requiest limiter module
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 10, // Limit each IP to 100 requests per `window`
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());
app.use(limiter);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
//
//
//  http://localhost:4000/api/v1 --- REST APIs routes
app.use("/api/v1", apiRoutes);
//
//
// Client error handle
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, "Invalid route !"));
});
//
// Server error handle -> handle all errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return errorResponse(res, { statusCode: err.status, message: err });
});
//
//
// Exporting app
export default app;
