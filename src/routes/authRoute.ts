import { Router } from "express";
import {
  deleteUserByEmail,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
  resetPasswordWIthCode,
  updateUser,
  updateUserByAdmin,
  updateUserPassword,
  verifyUser,
  verifyUserByAdmin,
} from "../controllers/authControllers";
import {
  isAdmin,
  isLoggedIn,
  isLoggedOut,
} from "../middlewares/isAuthenticated";
import {
  validateUpdatePassword,
  validateUpdateUser,
  validateUserLogin,
  validateUserRegistration,
  validateUserVerify,
} from "../validators/authValidator";
import runValidation from "../validators";
const authRoute = Router();

// POST: http://localhost:4000/api/v1/auth/register
// Registers a new user with the provided credentials
authRoute.post(
  "/register",
  validateUserRegistration,
  runValidation,
  isLoggedOut,
  registerUser
);

// POST: http://localhost:4000/api/v1/auth/login
// Authenticates a user and issues a JWT token
authRoute.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggedOut,
  loginUser
);

// GET: http://localhost:4000/api/v1/auth/logout
// Logs out the currently authenticated user
authRoute.get("/logout", isLoggedIn, logoutUser);

// POST: http://localhost:4000/api/v1/auth/verify
// Verifies the user's email address
authRoute.post(
  "/verify",
  validateUserVerify,
  runValidation,
  isLoggedOut,
  verifyUser
);

// POST: http://localhost:4000/api/v1/auth/verify-by-admin
// Admin verifies a user account
authRoute.post("/verify-by-admin", isLoggedIn, isAdmin, verifyUserByAdmin);

// POST: http://localhost:4000/api/v1/auth/refresh-token
// Generates a new access token if a valid refresh token is provided
authRoute.post("/refresh-token", refreshToken);

// PUT: http://localhost:4000/api/v1/auth/update
// Updates the authenticated user's profile information
authRoute.put(
  "/update",
  validateUpdateUser,
  runValidation,
  isLoggedIn,
  updateUser
);

// PUT: http://localhost:4000/api/v1/auth/update-password
// Allows the authenticated user to update their password
authRoute.put(
  "/update-password",
  validateUpdatePassword,
  runValidation,
  isLoggedIn,
  updateUserPassword
);

// PUT: http://localhost:4000/api/v1/auth/admin-update/:email
// Admin updates a user's profile by email
authRoute.put("/admin-update/:email", isLoggedIn, isAdmin, updateUserByAdmin);

// GET: http://localhost:4000/api/v1/auth/reset-password/:email
// Initiates the password reset process for the specified email
authRoute.get("/reset-password/:email", isLoggedOut, resetPassword);

// PUT: http://localhost:4000/api/v1/auth/reset-password-code/:email
// Resets the user's password using a provided reset code
authRoute.put("/reset-password-code/:email", resetPasswordWIthCode);

// DELETE: http://localhost:4000/api/v1/auth/delete/:email
// Deletes a user account by email
authRoute.delete("/delete/:email", isLoggedIn, isAdmin, deleteUserByEmail);

// Exporting authentication routes
export default authRoute;
