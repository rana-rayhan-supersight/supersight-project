import { NextFunction, Request, Response } from "express";
import { successResponse } from "./responseController";
import AuthServices from "../services/authService";
import createError from "http-errors";
import {
  CustomRequest,
  LoginParams,
  SignUpParams,
  UpdatePasswordParams,
  UserUpdateByAdminParams,
  UserUpdateParams,
  userVerificationParams,
} from "../glogalTypes";
import { setAccessTokenCookie } from "../helpers/cookieHelper";
import AppDataSource from "../configs/data-source";
import { UserEntity } from "../entities/UserEntity";

// POST: http://localhost:4000/api/v1/auth/register
// Registers a new user in the system by accepting the user's sign-up data and calling the Cognito client.
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract sign-up data from the request body
    const signUpData = req.body as SignUpParams;

    // Execute the sign-up command using the AWS Cognito client
    const { data, savedUser } = await AuthServices.signUp(signUpData);

    // Send a successful response with the registered user's data
    return successResponse(res, {
      statusCode: 201,
      message: "User registered successfully!",
      payload: { data, savedUser },
    });
  } catch (error) {
    // Pass any errors to the next middleware for handling
    next(error);
  }
};
// POST: http://localhost:4000/api/v1/auth/login
// Authenticates a user and issues JWT tokens (access, ID, and refresh tokens) upon successful login.
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body as LoginParams;

    // Authenticate the user using the AuthServices and retrieve tokens
    const data = await AuthServices.login(res, email, password);

    // Send a successful response with the generated tokens
    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully!",
      payload: {
        accessToken: data.AuthenticationResult?.AccessToken,
        idToken: data.AuthenticationResult?.IdToken,
        refreshToken: data.AuthenticationResult?.RefreshToken,
      },
    });
  } catch (err) {
    // Pass any errors to the next middleware for handling
    next(err);
  }
};
// POST: http://localhost:4000/api/v1/auth/logout
// Logs out the user by clearing their access and refresh tokens from cookies.
const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear the access and refresh tokens from the user's cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Send a successful response indicating the user has logged out
    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully!",
    });
  } catch (err) {
    // Pass any errors to the next middleware for handling
    next(err);
  }
};
// POST: http://localhost:4000/api/v1/auth/verify
// Verifies a user's email address using the provided verification code.
const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract email and verification code from the request body
    const { email, code } = req.body as userVerificationParams;

    // Verify the user's email using the AuthServices
    const { data, savedUser } = await AuthServices.verifyUser(email, code);

    // Send a successful response confirming the email verification
    return successResponse(res, {
      statusCode: 200,
      message: "Email confirmed, please log in!",
      payload: { data, savedUser },
    });
  } catch (err) {
    // Pass any errors to the next middleware for handling
    next(err);
  }
};
// POST: http://localhost:4000/api/v1/auth/verify-by-admin
// Admin verifies a user's email address, activating the user's account.
const verifyUserByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the user's email from the request body
    const { email } = req.body;

    // Admin verifies the user's email using the AuthServices
    const { data, savedUser } = await AuthServices.activeUserByAdmin(email);

    // Send a successful response confirming the admin's verification
    return successResponse(res, {
      statusCode: 200,
      message: "Email confirmed by Admin!",
      payload: { data, savedUser },
    });
  } catch (err) {
    // Pass any errors to the next middleware for handling
    next(err);
  }
};
// POST: http://localhost:4000/api/v1/auth/verify
// Generates new access and ID tokens if the user provides a valid refresh token.
const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve the refresh token from cookies
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) throw createError(400, "Refresh token is required");

    // Use the Refresh Token to obtain new tokens
    const data = await AuthServices.refreshAuthToken(refreshToken);

    if (!data.AuthenticationResult?.AccessToken)
      throw createError(404, "Please log in again!");

    // Set the new access token in a cookie
    setAccessTokenCookie(res, data.AuthenticationResult?.AccessToken);

    // Send a successful response with the new tokens
    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully with refresh token!",
      payload: {
        accessToken: data.AuthenticationResult?.AccessToken,
        idToken: data.AuthenticationResult?.IdToken,
      },
    });
  } catch (err) {
    // Pass any errors to the next middleware for handling
    next(err);
  }
};
// PUT: http://localhost:4000/api/v1/auth/update
// Updates the authenticated user's profile information.
const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const accessToken: string = req.cookies.accessToken;
    if (!user || !accessToken)
      throw createError(403, "Please log in to update the entity!");

    // Extract update parameters from the request body
    const updateParams = req.body as UserUpdateParams;

    // Update the user's information in the database
    const updatedUser = await AuthServices.updateUser(user, updateParams);

    // Send a successful response with the updated user information
    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully!",
      payload: updatedUser,
    });
  } catch (error) {
    console.log(error);
    // Pass any errors to the next middleware for handling
    next(error);
  }
};
// PUT: http://localhost:4000/api/v1/auth/update-password
// Updates the authenticated user's password.
const updateUserPassword = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const accessToken: string = req.cookies.accessToken;
    if (!user || !accessToken)
      throw createError(403, "Please log in to update the entity!");

    // Extract update parameters from the request body
    const updateParams = req.body as UpdatePasswordParams;

    // Update the user's password in the database
    const updatedUser = await AuthServices.updateUserPassword(
      user,
      accessToken,
      updateParams
    );

    // Send a successful response confirming the password update
    return successResponse(res, {
      statusCode: 200,
      message: "User password updated successfully!",
      payload: updatedUser,
    });
  } catch (error) {
    console.log(error);
    // Pass any errors to the next middleware for handling
    next(error);
  }
};
// PUT: http://localhost:4000/api/v1/auth/update
// Updates a user's profile information by an admin using the user's email.
const updateUserByAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { email } = req.params;
    if (!user || !email)
      throw createError(403, "Please login to update the entity!");

    // Extract update parameters from the request body
    const updateParams = req.body as UserUpdateByAdminParams;

    // Update the user's information in the database
    const updatedUser = await AuthServices.updateUserByAdmin(
      user,
      email,
      updateParams
    );

    // Send a successful response with the updated user information
    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully!",
      payload: updatedUser,
    });
  } catch (error) {
    console.log(error);
    // Pass any errors to the next middleware for handling
    next(error);
  }
};
// GET: http://localhost:4000/api/v1/auth/reset-password/:email
// Initiates a password reset for the user by sending a reset link to the specified email.
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    // Trigger the password reset process for the specified user
    const resetResponse = await AuthServices.resetUserPassword(email);

    // Send a successful response confirming the reset initiation
    return successResponse(res, {
      statusCode: 200,
      message: "User password reset successfully. Please check your email!",
      payload: resetResponse,
    });
  } catch (error) {
    console.log(error);
    // Pass any errors to the next middleware for handling
    next(error);
  }
};
// PUT: http://localhost:4000/api/v1/auth/reset-password-code/:email
// Resets the user's password using a verification code.
const resetPasswordWIthCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const { code, newPassword } = req.body;

    // Confirm the password reset using the verification code and the new password
    const resetResponse = await AuthServices.confirmForgotPassword(
      email,
      code,
      newPassword
    );

    // Send a successful response confirming the password reset
    return successResponse(res, {
      statusCode: 200,
      message: "User password reset successfully!",
      payload: resetResponse,
    });
  } catch (error) {
    console.log(error);
    // Pass any errors to the next middleware for handling
    next(error);
  }
};
// DELETE: http://localhost:4000/api/v1/auth/delete/:email
// Deletes a user account by email, only accessible by authenticated users.
const deleteUserByEmail = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { email } = req.params;
    if (!user) throw createError(403, "Please login first!");

    // Delete the user from the database by email
    const deleteResponse = await AuthServices.deleteUserByEmail(user, email);

    // Send a successful response confirming the deletion
    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully!",
      payload: deleteResponse,
    });
  } catch (error) {
    console.log(error);
    // Pass any errors to the next middleware for handling
    next(error);
  }
};

// exporting controllers
export {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  refreshToken,
  updateUser,
  updateUserPassword,
  resetPassword,
  resetPasswordWIthCode,
  deleteUserByEmail,
  updateUserByAdmin,
  verifyUserByAdmin,
};
