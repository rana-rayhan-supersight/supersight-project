import { Router } from "express";

import {
  loginUser,
  refreshToken,
  registerUser,
  verifyUser,
} from "../controllers/authControllers";
import { isLoggedOut } from "../middlewares/isAuthenticated";
import { validateUserRegistration } from "../validators/authValidator";
import runValidation from "../validators";
const authRoute = Router();

// POST: http://localhost:4000/api/v1/auth/register --- Register user
authRoute.post(
  "/register",
  validateUserRegistration,
  runValidation,
  isLoggedOut,
  registerUser
);

// POST: http://localhost:4000/api/v1/auth/login --- Login user
authRoute.post("/login", isLoggedOut, loginUser);

// POST: http://localhost:4000/api/v1/auth/verify --- verify user by email
authRoute.post("/verify", verifyUser);

// POST: http://localhost:4000/api/v1/auth/refresh-token --- generate token if user have valid refresh token
authRoute.post("/refresh-token", refreshToken);

// exporting auth routes
export default authRoute;
