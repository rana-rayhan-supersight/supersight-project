import { NextFunction, Request, Response } from "express";
import { successResponse } from "./responseController";
import AuthServices from "../services/authService";
import createError from "http-errors";

// POST: http://localhost:4000/api/v1/auth/register --- Register user
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    // Execute the command using the AWS Cognito client
    const data = await AuthServices.signUp(email, password);

    // Send success response
    return successResponse(res, {
      statusCode: 201,
      message: "User registered successfully!",
      payload: data,
    });
  } catch (error) {
    next(error);
  }
};
// POST: http://localhost:4000/api/v1/auth/login --- login user
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const data = await AuthServices.login(res, email, password);

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
    next(err);
  }
};
// POST: http://localhost:4000/api/v1/auth/verify --- Register user
const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, code } = req.body;

  try {
    const data = await AuthServices.verifyUser(email, code);

    return successResponse(res, {
      statusCode: 200,
      message: "User confirmed successfully!",
      payload: data,
    });
  } catch (err) {
    next(err);
  }
};
// POST: http://localhost:4000/api/v1/auth/verify --- generate token if user have valid refresh token
const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) throw createError(400, "Refresh token is required");
    // Use the Refresh Token to get new tokens
    const data = await AuthServices.refreshAuthToken(refreshToken);

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully with refresh token!",
      payload: {
        accessToken: data.AuthenticationResult?.AccessToken,
        idToken: data.AuthenticationResult?.IdToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

// exporting controllers
export { registerUser, loginUser, verifyUser, refreshToken };
